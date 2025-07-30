import { Map } from 'maplibre-gl'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFilterStore = defineStore('filter', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  // const filterIDs = ref([]);
  const filters = ref({ attributeFilter: {}, locationFilter: {} })
  const maxAttributeFilter = ref(10)
  const reachedLimit = ref(false)

  /**
   * @description returns a new filter object with default values.
   * @returns {Object} new value for filter object
   */
  function getNewFilterObject() {
    return {
      selectedProperty: null,
      selectedPropertyType: null,
      selectedValues: null,
      expression: null
    }
  }

  /**
   * @description adds a new filter to the filters object.
   * @param {String} filterId
   * @param {String} category - 'attributeFilter' or 'locationFilter'
   */
  function addFilter(filterId, category) {
    if (category == 'locationFilter') {
      filters.value[category][filterId] = getNewFilterObject()
      return
    }
    const nrAttributeFilter = Object.keys(filters.value[category]).length
    if (category == 'attributeFilter' && nrAttributeFilter < maxAttributeFilter.value) {
      filters.value[category][filterId] = getNewFilterObject()
      return
    } else {
      reachedLimit.value = true
      console.log('You reached the maximum number of attribute filters')
    }
  }

  /**
   * @description removes a filter element from the filters object.
   * @param {String} filterId
   * @param {String} category - 'attributeFilter' or 'locationFilter'
   */
  function removeFilterElement(filterId, category) {
    delete filters.value[category][filterId]
    reachedLimit.value = false
  }

  /**
   * @description combine multiple filter expressions to one. All filter expressions have to be true.
   * @returns {Array} containing filter expressions
   */
  function writeFilterExpression() {
    let expression = ['all']

    Object.entries(filters.value).forEach(([category]) => {
      Object.entries(filters.value[category]).forEach(([key]) => {
        if (filters.value[category][key].expression != null) {
          expression.push(filters.value[category][key].expression)
        } else {
          console.log('Empty filterExpression for filter with key: ' + key)
        }
      })
    })
    console.log(expression)

    return expression
  }

  /**
   * @description set Filter to map via internal maplibre function.
   * @param {Map} mapObject
   */
  function applyFilterToMap(mapObject) {
    const expression = writeFilterExpression()

    mapObject.setFilter('ghfdb', expression)
  }

  /**
   * @description Returns an array of unique features based on a comparator property.
   * @link https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
   * @param {Array} features
   * @param {String} comparatorProperty
   * @returns {Array} unique features
   */
  function getUniqueFeatures(features, comparatorProperty) {
    const uniqueIds = new Set()
    const uniqueFeatures = []
    for (const feature of features) {
      const id = feature.properties[comparatorProperty]
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id)
        uniqueFeatures.push(feature)
      }
    }
    return uniqueFeatures
  }

  /**
   * @description Returns an array of features filtered by the current filters.
   * @param {Map} mapObject
   * @returns {Array} filtered features
   */
  function getFilteredFeatures(mapObject) {
    let filterExpression = writeFilterExpression()
    let queriedFeatures = mapObject.querySourceFeatures('ghfdb', {
      sourceLayer: 'ghfdb',
      filter: filterExpression
    })
    const uniqueFeatures = getUniqueFeatures(queriedFeatures, 'ID')
    console.log('queried features')
    console.log(queriedFeatures)
    return uniqueFeatures
  }

  return {
    filters,
    maxAttributeFilter,
    reachedLimit,
    getNewFilterObject,
    addFilter,
    removeFilterElement,
    applyFilterToMap,
    getFilteredFeatures,
    writeFilterExpression
  }
})

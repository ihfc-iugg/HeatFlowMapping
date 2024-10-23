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
   *
   * @returns new value for filter object
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
   *
   * @param {*} filterId
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
   *
   * @param {*} id
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
   * @param {}
   * @description set Filter to map via internal maplibre function.
   */
  function applyFilterToMap(mapObject) {
    const expression = writeFilterExpression()

    mapObject.setFilter('sites', expression)
  }

  /**
   * method code from https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
   * @param {*} features
   * @param {*} comparatorProperty
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
   *
   * @param {Map} mapObject
   * @returns
   */
  function getFilteredFeatures(mapObject) {
    let filterExpression = writeFilterExpression()
    let queriedFeatures = mapObject.querySourceFeatures('sites', {
      sourceLayer: 'sites',
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

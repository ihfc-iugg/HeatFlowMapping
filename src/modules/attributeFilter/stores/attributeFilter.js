import { Map } from 'maplibre-gl'
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useProperties } from '@/core/composables/useProperties'
import { useApplicationStore } from '@/core/stores/app'

export const useFilterStore = defineStore('filter', () => {
  const { getRange, getNumberValues } = useProperties()
  const app = useApplicationStore()
  const limit = computed(() => {
    return Object.keys(app.attributeFilter).length < 10 ? false : true
  })

  /**
   * @description adds a new filter to the filters object.
   * @param {String} filterId
   * @param {String} category - 'attributeFilter' or 'locationFilter'
   */
  function addFilterObject() {
    const uuid = uuidv4()
    const values = getNumberValues(app.geojson, 'q')
    app.attributeFilter[uuid] = {
      property: 'q', // default value
      dataType: 'number', // default value
      values: getRange(values), // default value
      expression: null
    }
    return uuid
  }

  /**
   * @description removes a filter element from the filters object.
   * @param {String} filterId
   * @param {String} category - 'attributeFilter' or 'locationFilter'
   */
  function removeFilterObject(uuid) {
    delete app.attributeFilter[uuid]
  }

  /**
   * @description
   * @param {String} uuid
   */
  function resetFilterObject(uuid) {
    app.attributeFilter[uuid].values = null
    app.attributeFilter[uuid].expression = null
  }

  // /**
  //  * @description Generates filter expression for properties of type string with enum
  //  * @param {String} property
  //  * @param {Array} values
  //  * @returns {Array}
  //  */
  // function writeEnumFilter(property, values) {
  //   let filterExpression = ['any']

  //   values.forEach((value) => {
  //     filterExpression.push(['in', ['get', property], value])
  //   })

  //   return filterExpression
  // }

  // /**
  //  * @description Generates filter expression for properties of type number
  //  * @param {String} property
  //  * @param {Array} values
  //  * @returns {Array}
  //  */
  // function writeContinuousFilter(property, values) {
  //   const minValue = values[0]
  //   const maxValue = values[1]

  //   let filterExpression = [
  //     'all',
  //     ['>=', ['get', property], minValue],
  //     ['<=', ['get', property], maxValue]
  //   ]

  //   return filterExpression
  // }

  // /**
  //  * @description combine multiple filter expressions to one. All filter expressions have to be true.
  //  * @returns {Array} containing filter expressions
  //  */
  // function writeFilterExpression() {
  //   let expression = ['all']

  //   Object.entries(container.value).forEach(([key]) => {
  //     if (container.value[key].expression != null) {
  //       expression.push(container.value[key].expression)
  //     } else {
  //       console.log('Empty filterExpression for filter with key: ' + key)
  //     }
  //   })

  //   console.log(expression)

  //   return expression
  // }

  // /**
  //  * @description set Filter to map via internal maplibre function.
  //  * @param {Map} mapObject
  //  */
  // function applyFilterToMap(mapObject) {
  //   const expression = writeFilterExpression()

  //   mapObject.setFilter('ghfdb', expression)
  // }

  // /**
  //  * @description Returns an array of unique features based on a comparator property.
  //  * @link https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
  //  * @param {Array} features
  //  * @param {String} comparatorProperty
  //  * @returns {Array} unique features
  //  */
  // function getUniqueFeatures(features, comparatorProperty) {
  //   const uniqueIds = new Set()
  //   const uniqueFeatures = []
  //   for (const feature of features) {
  //     const id = feature.properties[comparatorProperty]
  //     if (!uniqueIds.has(id)) {
  //       uniqueIds.add(id)
  //       uniqueFeatures.push(feature)
  //     }
  //   }
  //   return uniqueFeatures
  // }

  // /**
  //  * @description Returns an array of features filtered by the current filters.
  //  * @param {Map} mapObject
  //  * @returns {Array} filtered features
  //  */
  // function getFilteredFeatures(mapObject) {
  //   let filterExpression = writeFilterExpression()
  //   let queriedFeatures = mapObject.querySourceFeatures('ghfdb', {
  //     sourceLayer: 'ghfdb',
  //     filter: filterExpression
  //   })
  //   const uniqueFeatures = getUniqueFeatures(queriedFeatures, 'ID')
  //   console.log('queried features')
  //   console.log(queriedFeatures)
  //   return uniqueFeatures
  // }

  return {
    limit,
    // createFilterObject,
    addFilterObject,
    removeFilterObject,
    resetFilterObject
    // applyFilterToMap,
    // getFilteredFeatures,
    // writeFilterExpression
  }
})

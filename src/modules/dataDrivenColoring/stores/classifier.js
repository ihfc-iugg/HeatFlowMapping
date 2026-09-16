import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useSchemaStore } from '@/core/stores/schema'
import { useProperties } from '@/core/composables/useProperties'

import geostats from 'geostats'
import { quantileSeq } from 'mathjs'

export const useClassifierStore = defineStore('Data classifier', () => {
  const methods = ref({
    quantil: {
      name: 'quantil',
      title: 'Quantil',
      desc: 'Each class contains an equal number of features',
      src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_1BDD383C17164B948BF546CEADDA70E9'
    },
    equal: {
      name: 'equal',
      title: 'Equal interval',
      desc: 'Each class has the same range of values',
      src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_B47C458CFF6A4EEC933A8C7612DA558B'
    },
    jenks: {
      name: 'jenks',
      title: 'Jenks',
      desc: 'Class breaks are created in a way that best groups similar values together and maximizes the differences between classes',
      src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_B47C458CFF6A4EEC933A8C7612DA558B'
    }
  })
  const nrOfClasses = ref(3)
  const selectedMethod = ref('quantil')
  const schema = useSchemaStore()
  const { getBooleanValues, getEnumValues } = useProperties()

  // /**
  //  * @description Collects all leagle enum classes from the data schema
  //  * @param {Object} enumProperty
  //  * @returns {Array}
  //  */
  // function getEnumClasses(property, dataSchema) {
  //   let classes = []

  //   dataSchema.properties[property].oneOf.forEach((enumSchema) => {
  //     enumSchema.enum.forEach((enumClass) => {
  //       if (enumClass) {
  //         classes.push(enumClass)
  //       }
  //     })
  //   })

  //   return classes
  // }

  // function getBooleanClasses(property, dataSchema) {
  //   let classes = []
  //   if (dataSchema.properties[property].type == 'boolean') {
  //     classes = ['true', 'false', 'undefined']

  //     return classes
  //   }
  // }

  /**
   *
   * @param {*} property
   * @param {*} dataType
   * @param {*} dataSchema
   */
  function setNrOfClasses(property, dataType, dataSchema) {
    if (dataType == 'boolean') {
      nrOfClasses.value = getBooleanValues(property, dataSchema).length
    } else if (dataType == 'enum') {
      nrOfClasses.value = getEnumValues(property, dataSchema).length
    }
  }

  /**
   * @description Helper function for Math.quantileSeq() to collect only the values of a single property within one array
   * @param {Object} featureCollection
   * @param {String} property
   * @returns {Array}
   */
  function propertyValuesToArray(featureCollection, property) {
    let values = []

    featureCollection.features.forEach((feature) => {
      let value = feature.properties[property]
      // to filter sting values, e.g. q_uncertainty contains a value of type string ([Unspecified])
      if (typeof value === 'number') {
        values.push(value)
      }
    })

    return values
  }

  /**
   * @description Calculate breaks for jenks classification
   * @param {Object} featureCollection
   * @param {String} property
   * @param {Number} nrOfClasses
   * @returns {Array} [minValue, break1, ..., breakN, maxValue]
   */
  function jenksNaturalBreaks(featureCollection, property, nrOfClasses) {
    const values = propertyValuesToArray(featureCollection, property).filter(Boolean)
    let classifier = new geostats(values)
    let breaks = classifier.getJenks(nrOfClasses)

    return breaks
  }

  /**
   * @description Calculate breaks for quantil classification (each class has the same amount of data points)
   * @param {Object} featureCollection
   * @param {String} property
   * @param {Number} nrOfClasses
   * @returns {Array}
   */
  function quantilBreaks(featureCollection, property, nrOfClasses) {
    const values = propertyValuesToArray(featureCollection, property).filter(Boolean)
    const breaks = quantileSeq(values, nrOfClasses - 1)

    // add min value to beginning of array
    breaks.unshift(Math.min.apply(null, values))

    // add max value to end of array
    breaks.push(Math.max.apply(null, values))

    return breaks
  }

  /**
   * @description Calculate breaks for equal interval classification (each class has the same range of values)
   * @param {Object} featureCollection
   * @param {String} property
   * @param {Number} nrOfClasses
   * @returns {Array}
   */
  function equalIntervalBreaks(featureCollection, property, nrOfClasses) {
    const values = propertyValuesToArray(featureCollection, property).filter(Boolean)
    const minValue = Math.min.apply(null, values)
    const maxValue = Math.max.apply(null, values)
    const stepSize = (maxValue - minValue) / nrOfClasses
    let breaks = []

    for (let i = 0; i <= nrOfClasses; i++) {
      breaks.push(minValue + i * stepSize)
    }

    return breaks
  }

  /**
   * @description
   * @param {Object} featureCollection
   * @param {Sting} property
   * @param {Number} nrOfClasses
   * @returns
   */
  function calculateClassBreaks(featureCollection, property, nrOfClasses) {
    if (!selectedMethod.value) {
      console.log('No classification method set')
    }

    if (selectedMethod.value == 'quantil') {
      return quantilBreaks(featureCollection, property, nrOfClasses)
    } else if (selectedMethod.value == 'equal') {
      return equalIntervalBreaks(featureCollection, property, nrOfClasses)
    } else if (selectedMethod.value == 'jenks') {
      return jenksNaturalBreaks(featureCollection, property, nrOfClasses)
    }
  }

  return {
    methods,
    selectedMethod,
    nrOfClasses,
    // getBooleanClasses,
    // getEnumClasses,
    setNrOfClasses,
    quantilBreaks,
    equalIntervalBreaks,
    jenksNaturalBreaks,
    calculateClassBreaks
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'

// External libraries
import geostats from 'geostats'
import { quantileSeq } from 'mathjs'

export const useDataDrivenColoringSequentialStore = defineStore(
  'Data driven coloring for sequential data',
  () => {
    /**
     * ref()s become state properties
     * computed()s become getters
     * function()s become actions
     */

    const classes = ref(null)

    const classificationTypes = ref([
      {
        name: 'quantil',
        title: 'Quantil',
        desc: 'Each class contains an equal number of features',
        src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_1BDD383C17164B948BF546CEADDA70E9'
      },
      {
        name: 'equal',
        title: 'Equal interval',
        desc: 'Each class has the same range of values',
        src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_B47C458CFF6A4EEC933A8C7612DA558B'
      },
      {
        name: 'jenks',
        title: 'Jenks',
        desc: 'Class breaks are created in a way that best groups similar values together and maximizes the differences between classes',
        src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_B47C458CFF6A4EEC933A8C7612DA558B'
      }
    ])

    const classification = ref(classificationTypes.value[0])

    /**
     * @description
     * @param {*} value
     * @returns
     */
    function isNumber(value) {
      return typeof value === 'number'
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
        if (isNumber(value)) {
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
    function calcJenksNaturalBreaks(featureCollection, property, nrOfClasses) {
      const values = propertyValuesToArray(featureCollection, property).filter(Boolean)
      let breaks = new geostats(values).getJenks(nrOfClasses)

      return breaks
    }

    /**
     * @description Calculate breaks for quantil classification (each class has the same amount of data points)
     * @param {Object} featureCollection
     * @param {String} property
     * @param {Number} nrOfClasses
     * @returns {Array}
     */
    function calcQuantilBreaks(featureCollection, property, nrOfClasses) {
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
    function calcEqualIntervalBreaks(featureCollection, property, nrOfClasses) {
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
     * @description Case differentiation for classification method. According to the method, calculates the breaks and returns them as array. Check the
     * following link for a explanation to qunatil, jenks, equal data classification. More classification methods can be added here.
     * @link https://gisgeography.com/choropleth-maps-data-classification/
     * @param {Object} featureCollection
     * @param {String} property
     * @returns {Array} [minValue, break1, ..., breakN, maxValue]
     */
    function setClassBreaks(featureCollection, property, nrOfClasses, classification) {
      if (classification == 'quantil') {
        classes.value = calcQuantilBreaks(featureCollection, property, nrOfClasses)
      } else if (classification == 'equal') {
        classes.value = calcEqualIntervalBreaks(featureCollection, property, nrOfClasses)
      } else if (classification == 'jenks') {
        classes.value = calcJenksNaturalBreaks(featureCollection, property, nrOfClasses)
      } else {
        classes.value = null
        console.error('Unknown classification method')
      }
    }

    /**
     * @description Returns the array of class breaks
     * @returns {Array} classes
     */
    function getClasses() {
      return classes.value
    }

    /**
     * @description write array containg maplibre conform expressions for properties with continous number values. Each class (start value - end value) one color value is assigned.
     * @param {String} property
     * @param {Array} classes
     * @param {Array} colorPalette
     * @returns {Array}
     * @example ["step", ["get", "property"], #color, NUMBER, #color, ...]
     */
    function generatePaintProperty(property, classes, colorPalette) {
      let paintProperty = []
      let k = 1

      paintProperty.push('step')
      paintProperty.push(['get', property])

      for (var i = 0; i < colorPalette.length; i++) {
        paintProperty.push(colorPalette[i])
        if (i < colorPalette.length - 1) {
          paintProperty.push(classes[k])
          k++
        }
      }

      return paintProperty
    }

    return {
      classificationTypes,
      classification,
      classes,
      isNumber,
      propertyValuesToArray,
      calcJenksNaturalBreaks,
      calcQuantilBreaks,
      calcEqualIntervalBreaks,
      setClassBreaks,
      getClasses,
      generatePaintProperty
    }
  }
)

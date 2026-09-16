import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { Map } from 'maplibre-gl'

import { useClassifierStore } from './classifier'
import { useColorPaletteStore } from './colorPalette'
import { useGHFDBStore } from '@/core/stores/ghfdb'
import { useApplicationStore } from '@/core/stores/app'
import { useSchemaStore } from '@/core/stores/schema'

export const useDataDrivenColoringStore = defineStore('Data driven coloring', () => {
  const classifier = useClassifierStore()
  const colorPalette = useColorPaletteStore()
  const ghfdb = useGHFDBStore()
  const app = useApplicationStore()
  const schema = useSchemaStore()

  const property = ref('p')
  const dataType = ref('number')
  const nrOfClasses = computed(() => classifier.nrOfClasses)
  const ghfdbName = computed(() => ghfdb.name)
  const dataSchema = computed(() => app.dataSchema)

  /**
   * @description write array containg maplibre conform expressions for properties with enum values. Legal values are according to predefined classes
   * @param {String} property
   * @param {Array} classes
   * @param {Array} colors
   * @returns {Array} ["match", ["get", "property"], class, #color, ..., #colorOthers] --> https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
   */
  function classifiedPaintProperty(property, classes, colorPalette) {
    let paintProperty = []

    paintProperty.push('match')
    paintProperty.push(['get', property])

    classes.forEach((value, index) => {
      paintProperty.push(value, colorPalette[index])
    })

    // others
    paintProperty.push('#ccc')

    return paintProperty
  }

  /**
   * @description write array containg maplibre conform expressions for properties with continous number values. Each class (start value - end value) one color value is assigned.
   * @param {String} property
   * @param {Array} classBreaks
   * @param {Array} colorPalette
   * @returns {Array}
   * @example ["step", ["get", "property"], #color, NUMBER, #color, ...]
   */
  function numericPaintProperty(property, classBreaks, colorPalette) {
    let paintProperty = []
    let k = 1

    paintProperty.push('step')
    paintProperty.push(['get', property])

    for (var i = 0; i < colorPalette.length; i++) {
      paintProperty.push(colorPalette[i])
      if (i < colorPalette.length - 1) {
        paintProperty.push(classBreaks[k])
        k++
      }
    }

    return paintProperty
  }

  /**
   * @description
   * @param {Object} featureCollection
   * @param {Map} map
   */
  function applyColoringLogic(featureCollection, map) {
    let paintProperty = null
    const colors = colorPalette.getSchemaColors(nrOfClasses.value)

    if (dataType.value == 'number') {
      const classBreaks = classifier.calculateClassBreaks(
        featureCollection,
        property.value,
        nrOfClasses.value
      )
      paintProperty = numericPaintProperty(property.value, classBreaks, colors)
    } else if (dataType.value == 'enum') {
      const classes = schema.getEnumClasses(property.value, dataSchema.value)
      paintProperty = classifiedPaintProperty(property.value, classes, colors)
    } else if (dataType.value == 'boolean') {
      const classes = schema.getBooleanClasses(property.value, dataSchema.value)
      paintProperty = classifiedPaintProperty(property.value, classes, colors)
    }

    map.setPaintProperty(ghfdbName.value, 'circle-color', paintProperty)
  }

  return {
    property,
    dataType,
    applyColoringLogic
  }
})

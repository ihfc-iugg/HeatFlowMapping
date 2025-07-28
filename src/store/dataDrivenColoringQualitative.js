import { defineStore } from 'pinia'
import { ref } from 'vue'

import { useDataSchemaStore } from '@/store/dataSchema.js'

export const useDataDrivenColoringQualitativeStore = defineStore(
  'Data driven coloring for qualitative data',
  () => {
    /**
     * ref()s become state properties
     * computed()s become getters
     * function()s become actions
     */

    const schemaStore = useDataSchemaStore()

    const classes = ref(null)

    /**
     * @description Collects all leagle enum classes from the data schema
     * @param {Object} enumProperty
     * @returns {Array}
     */
    function getClasses(property) {
      let classes = []

      schemaStore.dataSchema.properties[property].oneOf.forEach((enumSchema) => {
        enumSchema.enum.forEach((enumClass) => {
          if (enumClass) {
            classes.push(enumClass)
          }
        })
      })

      return classes
    }

    /**
     * @description write array containg maplibre conform expressions for properties with enum values. Legal values are according to predefined classes
     * @param {String} property
     * @param {Array} classes
     * @param {Array} colors
     * @returns {Array} ["match", ["get", "property"], class, #color, ..., #colorOthers] --> https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
     */
    function generatePaintProperty(property, classes, colorPalette) {
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

    return {
      classes,
      getClasses,
      generatePaintProperty
    }
  }
)

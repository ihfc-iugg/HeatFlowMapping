import { computed } from 'vue'
import { useSchemaStore } from '@/core/stores/schema'

/**
 * @description Reusable composable to extract enum/allowed values
 * from a JSON schema property
 */
export function useProperties() {
  const schema = useSchemaStore()

  /**
   * @description
   * @param {String} property
   * @returns
   */
  function getEnumValues(property) {
    let classes = []

    schema.data.properties[property].oneOf.forEach((enumSchema) => {
      enumSchema.enum.forEach((enumClass) => {
        if (enumClass) {
          classes.push(enumClass)
        }
      })
    })

    return classes
  }

  /**
   * @description
   * @param {String} property
   * @returns
   */
  function getBooleanValues(property) {
    let classes = []
    if (schema.data.properties[property].type == 'boolean') {
      classes = ['true', 'false', 'undefined']

      return classes
    }
  }

  /**
   * @description
   * @param {Array} values
   * @returns {Array}
   */
  function getRange(values) {
    const min = Math.floor(Math.min.apply(null, values))
    const max = Math.ceil(Math.max.apply(null, values))

    return [min, max]
  }

  /**
   * @description Helper function for Math.quantileSeq() to collect only the values of a single property within one array
   * @param {*} geoJson
   * @param {String} property
   * @returns {Array}
   */
  function getNumberValues(geoJson, property) {
    let values = []

    geoJson.features.forEach((feature) => {
      if (feature.properties[property]) {
        values.push(feature.properties[property])
      }
    })
    return values
  }

  return {
    getEnumValues,
    getBooleanValues,
    getRange,
    getNumberValues
  }
}

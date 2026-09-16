import { defineStore } from 'pinia'
import { ref } from 'vue'

export const usePropertiesColoringStore = defineStore('Property for data driven coloring', () => {
  const selectable = ref(null)
  const selected = ref('q')
  const dataType = ref('number') // hier speichern ob Number, String, Boolean

  /**
   * @description
   * @param {*} schema
   */
  function setSelectableProperties(schema) {
    let properties = []

    for (const [key, value] of Object.entries(schema.properties)) {
      if (value.oneOf) {
        properties.push(key)
      } else if (value.type == 'number' && value.minimum && value.maximum) {
        properties.push(key)
      } else if (value.type == 'boolean') {
        properties.push(key)
      }
    }
    selectable.value = properties
  }

  /**
   * @description
   * @param {String} property
   * @param {*} dataSchema
   */
  function setDataType(property, dataSchema) {
    if (dataSchema.properties[property].type) {
      dataType.value = dataSchema.properties[property].type
    } else {
      dataType.value = 'enum'
    }
  }

  return {
    selectable,
    selected,
    dataType,
    setSelectableProperties,
    setDataType
  }
})

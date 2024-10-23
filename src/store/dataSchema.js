import { defineStore } from 'pinia'
import { ref } from 'vue'

import $RefParser from '@apidevtools/json-schema-ref-parser'

export const useDataSchemaStore = defineStore('dataSchema', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const dataSchema = ref(null)
  const dataVersion = ref(null)
  const selectableProperties = ref([])
  const numberProperties = ref([])
  const isSchemaLoading = ref(null)

  /**
   * @description
   * @param {*} property
   * @returns {Boolean}
   */
  function _isPropertySelectable(schema, property) {
    let isSelectable = null

    if (schema.properties[property].type == 'string' && !schema.properties[property].enum) {
      console.log(property + ' is not suitable for data driven coloring')
      isSelectable = false
    } else if (
      schema.properties[property].type == 'integer' &&
      (!schema.properties[property].minimum || !schema.properties[property].maximum)
    ) {
      console.log(property + ' is not suitable for data driven coloring')
      isSelectable = false
    } else if (schema.properties[property].type == 'object') {
      console.log(property + ' is not suitable for data driven coloring')
      isSelectable = false
    } else {
      isSelectable = true
    }
    return isSelectable
  }

  /**
   * @description Takes property name and brings it to structure necessary for VueMultiselect component
   * @param {String} propertyName
   * @returns {Object}
   */
  function _createVueMultiselectOption(schema, propertyName) {
    const propertyObj = schema.properties[propertyName]
    let optionsObject = {}
    optionsObject['title'] = propertyObj.title
    optionsObject['key'] = propertyName

    return optionsObject
  }

  /**
   * @description Throw out all properties options which are not suitable for the data driven coloring e.g. name,
   * data points either be already classified (enum) or should be able to classify (continouse numerbs). The attribute builds also the link between schema and a selection of users.
   * They see the readable title and through the link of title corresponding key the selected attributes can easily be found in the schema like: dataSchema.properties[attributeKey]
   */
  function _setSelectableProperties(schema) {
    const propertyKeys = Object.keys(schema.properties)

    propertyKeys.forEach((propertyName) => {
      if (_isPropertySelectable(schema, propertyName)) {
        selectableProperties.value.push(_createVueMultiselectOption(schema, propertyName))
      }
    })
  }

  /**
   * @description
   * @param {Object} properties
   */
  function _setNumericProperties(properties) {
    for (var property in properties) {
      if ('type' in properties[property]) {
        if (properties[property].type == 'number') {
          numberProperties.value.push(_createVueMultiselectOption(dataSchema.value, property))
        }
      }
    }
  }

  /**
   * @description
   * @param {String} url
   */
  async function fetchAPIDataSchema(url) {
    isSchemaLoading.value = true
    console.log('API Data Schema')

    try {
      await $RefParser.dereference(url).then((apiSchema) => {
        dataSchema.value = apiSchema.components.schemas.Measurement
        dataVersion.value = 'ghfdb' + apiSchema.info.version //TODO: has to be adjusted with some real key describing the versioning
        console.log(dataVersion.value)
        _setSelectableProperties(dataSchema.value)
        _setNumericProperties(dataSchema.value.properties)
        isSchemaLoading.value = false
      })
    } catch (error) {
      console.log('Error in dereferencing api schema: ' + error)
    }
  }

  return {
    dataSchema,
    selectableProperties,
    numberProperties,
    isSchemaLoading,
    _createVueMultiselectOption,
    _isPropertySelectable,
    _setSelectableProperties,
    _setNumericProperties,
    fetchAPIDataSchema
  }
})

import { defineStore } from 'pinia'
import { ref } from 'vue'
import schemaURL from '@/shared/assets/data/Heatflow_worldAPI_Hardcoded.yaml'

import $RefParser from '@apidevtools/json-schema-ref-parser'

export const useSchemaStore = defineStore('dataSchema', () => {
  /**
   * Store für GHFDB und Schema
   *
   */

  const isSchemaLoading = ref(null)
  const version = ref(null)
  const data = ref(fetchDataSchema(schemaURL))
  // const selectableProperties = ref([])
  //   const numberProperties = ref([])

  // /**
  //  * @description Checks if the property is suitable for data driven coloring.
  //  * @param {Object} schema
  //  * @param {String} property
  //  * @returns {Boolean}
  //  */
  // function _isPropertySelectable(schema, propertyKey) {
  //   const property = schema.properties[propertyKey]
  //   const propertyType = property.type

  //   if (propertyType == 'string' && property.enum) {
  //     return true
  //   } else if (propertyType == 'integer' && property.minimum && property.maximum) {
  //     return true
  //   } else {
  //     return false
  //   }

  // if (proipertyType == 'string' && !property.enum) {
  //   console.log(property + ' is not suitable for data driven coloring')
  //   isSelectable = false
  // } else if (
  //   propertyType == 'integer' &&
  //   (!property.minimum || !property.maximum)
  // ) {
  //   console.log(property + ' is not suitable for data driven coloring')
  //   isSelectable = false
  // } else f (propertyType == 'object') {
  //   console.log(property + ' is not suitable for data driven coloring')
  //   isSelectable = false
  // } else {
  //   isSelectable = true
  // }
  // return isSelectable
  // }

  //   /**
  //    * @description Takes property name and brings it to structure necessary for VueMultiselect component
  //    * @param {Object} schema
  //    * @param {String} property
  //    * @returns {Object}
  //    */
  //   function _createVueMultiselectOption(schema, property) {
  //     const propertyObj = schema.properties[property]
  //     let optionsObject = {}
  //     optionsObject['title'] = propertyObj.title
  //     optionsObject['key'] = property

  //     return optionsObject
  //   }

  //   /**
  //    * @description Throw out all properties options which are not suitable for the data driven coloring e.g. name,
  //    * data points either be already classified (enum) or should be able to classify (continouse numerbs). The attribute builds also the link between schema and a selection of users.
  //    * They see the readable title and through the link of title corresponding key the selected attributes can easily be found in the schema like: dataSchema.properties[attributeKey]
  //    * @param {Object} schema
  //    */
  // function setSelectableProperties(schema) {
  //   const propertyKeys = Object.keys(schema.properties)

  //   propertyKeys.forEach((property) => {
  //     if (_isPropertySelectable(schema, property)) {
  //       selectableProperties.value.push(_createVueMultiselectOption(schema, property))
  //     }
  //   })
  // }

  //   /**
  //    * @description Collects all numeric properties from the schema and creates a VueMultiselect option for each of them.
  //    * @param {Object} properties
  //    */
  //   function _setNumericProperties(properties) {
  //     for (var property in properties) {
  //       if ('type' in properties[property]) {
  //         if (properties[property].type == 'number') {
  //           numberProperties.value.push(_createVueMultiselectOption(dataSchema.value, property))
  //         }
  //       }
  //     }
  //   }

  /**
   * @description Fetches the API data schema and sets the dataSchema, dataVersion, selectableProperties and numberProperties.
   * @param {String} url
   */
  async function fetchDataSchema(url) {
    isSchemaLoading.value = true
    // console.log('API Data Schema')

    try {
      await $RefParser.dereference(url).then((apiSchema) => {
        data.value = apiSchema.components.schemas.Measurement
        version.value = 'ghfdb' + apiSchema.info.version //TODO: has to be adjusted with some real key describing the versioning
        // console.log(apiSchema.components.schemas.Measurement)
        // _setSelectableProperties(dataSchema.value)
        // _setNumericProperties(dataSchema.value.properties)
        isSchemaLoading.value = false
        // return apiSchema.components.schemas.Measurement
      })
    } catch (error) {
      console.log('Error in dereferencing api schema: ' + error)
    }
  }

  return {
    data,
    version,
    // selectableProperties,
    // numberProperties,
    // isSchemaLoading,
    // _createVueMultiselectOption,
    // _isPropertySelectable,
    // _setSelectableProperties,
    // _setNumericProperties,
    fetchDataSchema
  }
})

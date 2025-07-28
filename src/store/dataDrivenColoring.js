import { defineStore } from 'pinia'
import { ref } from 'vue'

import colorbrewer from 'colorbrewer'

import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useMapStore } from '@/store/map'
import { useDataDrivenColoringSequentialStore } from '@/store/dataDrivenColoringSequential'
import { useDataDrivenColoringQualitativeStore } from './dataDrivenColoringQualitative'

export const useDataCrivenColoringStore = defineStore('Data driven coloring', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  /**
   * PSEUDO CODE
   * 1. Select proerty
   *    1.1 Get property data type
   *    1.2 Set nature of data (if number: sequential, if string/undefined: qualitative)
   *
   * For number properties:
   * 1. set classification method (jenks, quantil, equal)
   * 2. set number of classes (3-9)limited to 9 beacudse of colorbrewer
   * 3. set color palette (colorbrewer)
   *
   * For string/enum properties:
   * 1. get legal enum classes from data schema
   * 2. set color palette (colorbrewer)
   */

  const schemaStore = useDataSchemaStore()
  const mapStore = useMapStore()
  const sequentialStore = useDataDrivenColoringSequentialStore()
  const qualitativeStore = useDataDrivenColoringQualitativeStore()

  const selectedProperty = ref(null)
  const propertyDataType = ref(null)

  const natureOfData = ref(null)
  const numberOfClasses = ref(4)
  const classes = ref(null)
  const colorPaletteOptions = ref(null)
  const colorPalette = ref(null)
  const paintProperty = ref(null)

  /**
   * @description
   * @param {Object} property
   */
  function getPropertyDataType(property) {
    return schemaStore.dataSchema.properties[property].type
      ? schemaStore.dataSchema.properties[property].type
      : 'undefined'
  }

  /**
   *
   * @param {String} dataType
   * @returns
   */
  function setPropertyDataType(dataType) {
    if (!dataType) {
      console.error('No data type provided')
      return
    }
    propertyDataType.value = dataType
    console.log('Property data type set to: ' + propertyDataType.value)
  }

  /**
   *
   * @param {String} propertyDataType
   */
  function setNatureOfData(propertyDataType) {
    if (propertyDataType == 'number') {
      natureOfData.value = 'sequential'
    } else if (propertyDataType == 'undefined') {
      // right now attributes with enum values dont have a type key, so they are represented as undefined
      // TODO: add type key to enum properties in data schema
      natureOfData.value = 'qualitative'
    } else if (propertyDataType == 'boolean') {
      natureOfData.value = 'qualitative'
    }
  }

  /**
   * @description
   * @param {String} selectedProperty
   * @returns
   */
  function setNumberOfClasses(selectedProperty) {
    if (propertyDataType.value == 'number') {
      return
    } else if (propertyDataType.value == 'undefined') {
      numberOfClasses.value = qualitativeStore.getClasses(selectedProperty).length
    } else if (propertyDataType.value == 'boolean') {
      numberOfClasses.value = 3 // true/false/undefined
    }
  }

  /**
   *
   * @param {String} propertyDataType
   * @param {String} selectedProperty
   */
  function setClasses(propertyDataType, selectedProperty) {
    if (propertyDataType == 'number') {
      sequentialStore.setClassBreaks(
        mapStore.map.getSource('ghfdb')._data,
        selectedProperty,
        numberOfClasses.value
      )
      classes.value = sequentialStore.getClasses()
    } else if (propertyDataType == 'undefined') {
      classes.value = qualitativeStore.getClasses(selectedProperty)
    } else if (propertyDataType == 'boolean') {
      classes.value = ['[Yes]', '[No]', 'undefined']
    }
    console.log('classes')
    console.log(classes.value)
  }

  /**
   *
   * @returns
   */
  function getClasses() {
    return classes.value
  }

  /**
   * @description
   * @param {Number} classes
   */
  function setColorPaletteOptions(natureOfData, numberOfClasses) {
    let schemaGroup = []

    colorbrewer.schemeGroups[natureOfData].forEach((schema) => {
      if (colorbrewer[schema][numberOfClasses]) {
        schemaGroup.push({
          name: schema,
          colors: colorbrewer[schema][numberOfClasses]
        })
      }
    })

    colorPaletteOptions.value = schemaGroup
    colorPalette.value = schemaGroup[0]
  }

  /**
   * @description
   * @param {String} propertyDataType
   * @param {String} property
   * @param {Array} colorPalette
   * @returns
   */
  function generatePaintProperty(propertyDataType, property, colorPalette) {
    let paintProperty = null

    if (propertyDataType === 'number') {
      sequentialStore.setClassBreaks(
        mapStore.map.getSource('ghfdb')._data,
        property,
        numberOfClasses.value
      )
      paintProperty = sequentialStore.generatePaintProperty(
        property,
        sequentialStore.classes,
        colorPalette
      )
    } else if (propertyDataType === 'undefined') {
      paintProperty = qualitativeStore.generatePaintProperty(
        property,
        qualitativeStore.getClasses(property),
        colorPalette
      )
    } else if (propertyDataType === 'boolean') {
      paintProperty = qualitativeStore.generatePaintProperty(
        property,
        ['[Yes]', '[No]', 'undefined'],
        colorPalette
      )
    } else {
      console.error('Unsupported property data type: ' + propertyDataType)
      return []
    }
    return paintProperty
  }

  return {
    selectedProperty,
    propertyDataType,
    natureOfData,
    numberOfClasses,
    colorPaletteOptions,
    colorPalette,
    paintProperty,
    getPropertyDataType,
    setPropertyDataType,
    setNatureOfData,
    setNumberOfClasses,
    setClasses,
    getClasses,
    setColorPaletteOptions,
    generatePaintProperty
  }
})

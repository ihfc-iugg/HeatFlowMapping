import { defineStore } from 'pinia'
import { ref } from 'vue'

import $RefParser from '@apidevtools/json-schema-ref-parser'
import axios from 'axios'
import gjv from 'geojson-validation'

export const useMeasurementStore = defineStore('measurements', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const geojson = ref(null)
  const dataSchema = ref(null)
  const dataVersion = ref(null)
  const selectableProperties = ref([])
  const isDataLoading = ref(null)
  const isSchemaLoading = ref(null)

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
        isSchemaLoading.value = false
      })
    } catch (error) {
      console.log('Error in dereferencing api schema: ' + error)
    }
  }

  /**
   * @description recursiv function, navigation through paged api results. If no next page is linked, the collected results are retruned as array
   * @param {String} url
   * @param {Array} data
   * @returns {Array}
   */
  async function _fetchPagedAPIData(url, data) {
    data = data || []

    await axios
      .get(url)
      .then((response) => {
        response.data.results.forEach((entry) => {
          data.push(entry)
        })

        if (response.data.next != null) {
          return _fetchPagedAPIData(response.data.next, data)
        }
        return data
      })
      .catch((err) => {
        console.log('rejected', err)
      })

    return data
  }

  /**
   * @description Gather information of each site and write it to GeoJSON feature
   * @param {Object} siteObject
   */
  function _collectPntAttributes(siteObject) {
    const featKeys = Object.keys(siteObject)

    let id = null
    let geom = null
    let prop = {}

    featKeys.forEach((key) => {
      if (key == 'sample') {
        if (siteObject[key].location != null) {
          geom = siteObject[key].location.point
        }
      } else if (key == 'id') {
        id = siteObject[key]
      } else {
        prop[key] = siteObject[key]
      }
    })

    return { id: id, geometry: geom, properties: prop }
  }

  /**
   * @description Write GeoJSON point feature and validate it
   * @param {Object} pntAttributes
   */
  function _writePntFeature(pntAttributes) {
    // add geometry type of feature
    pntAttributes.geometry['type'] = 'Point'

    const feature = {
      id: pntAttributes.id,
      type: 'Feature',
      geometry: pntAttributes.geometry,
      properties: pntAttributes.properties
    }

    try {
      if (gjv.isFeature(feature)) {
        if (gjv.isPoint(feature.geometry)) {
          return feature
        }
      }
    } catch (error) {
      console.log(error)
    }
  }

  /** HIER ÄNDERUNGEN GEMACHT VOR URLAUB
   * @description fetch JSON from heat flow API and convert it to geojson
   * @param {String} url
   */
  function _collectFeatures(url) {
    return _fetchPagedAPIData(url).then((value) => {
      let features = []

      value.forEach((siteObject) => {
        // transform into GeoJSON Point Feature
        const pntAttributes = _collectPntAttributes(siteObject)
        features.push(_writePntFeature(pntAttributes))
      })
      return features
    })
  }

  /** HIER ÄNDERUNGEN GEMACHT VOR URLAUB
   * @description
   * @param {Array} features
   * @returns
   */
  function _writeFeatureCollection(features) {
    const featureCollection = {
      type: 'FeatureCollection',
      features: features
    }

    try {
      if (gjv.isFeatureCollection(featureCollection)) {
        return featureCollection
      }
    } catch (error) {
      console.log(error)
    }
  }

  /**
   *
   * @param {String} url
   */
  async function fetchAPIData(url) {
    isDataLoading.value = true
    try {
      if (!localStorage.getItem(dataVersion)) {
        const features = await _collectFeatures(url)
        geojson.value = _writeFeatureCollection(features)
        localStorage.setItem(dataVersion, geojson)
      } else {
        geojson.value = localStorage.getItem(dataVersion)
        console.log('Data release in localStorage is uptodate')
      }
    } catch (error) {
      console.log('Data fetching: ' + error)
    }
    isDataLoading.value = false
  }

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

  return {
    geojson,
    dataSchema,
    selectableProperties,
    isDataLoading,
    isSchemaLoading,
    _collectPntAttributes,
    _writePntFeature,
    _writeFeatureCollection,
    _setSelectableProperties,
    _isPropertySelectable,
    _createVueMultiselectOption,
    fetchAPIData,
    fetchAPIDataSchema
  }
})

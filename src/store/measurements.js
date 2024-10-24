import { defineStore } from 'pinia'
import { ref } from 'vue'

import axios from 'axios'
import gjv from 'geojson-validation'

export const useMeasurementStore = defineStore('measurements', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const geojson = ref(null)
  const isDataLoading = ref(null)

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

  return {
    geojson,
    isDataLoading,
    _collectPntAttributes,
    _writePntFeature,
    _writeFeatureCollection,
    fetchAPIData
  }
})

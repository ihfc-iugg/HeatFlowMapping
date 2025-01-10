import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import { featureCollection, point } from '@turf/turf'
import Papa from 'papaparse'

// import { writeFileSync } from 'fs'

export const useGHFDBStore = defineStore('global heat flow database', () => {
  const json = ref(null)
  const geojson = ref(null)
  const inProcess = ref(true)
  const hasCSV = ref(false)
  const successfulConvertion = ref(false)
  const parentProperties = [
    'q',
    'q_uncertainty',
    'name',
    // 'lat_NS',
    // 'long_EW',
    'elevation',
    'environment',
    'p_comment',
    'corr_HP_flag',
    'total_depth_MD',
    'total_depth_TVD',
    'explo_method',
    'explo_purpose',
    'ID',
    'ID_parent',
    'Quality_Code'
  ]

  function toggleInProcess() {
    inProcess.value = !inProcess.value
  }

  /**
   *
   * @param {*} url
   * @returns
   */
  async function getGhfdbFromAPI(url) {
    try {
      const response = await axios.get(url, { responseType: 'blob' })
      const file = response.data
      hasCSV.value = !hasCSV.value
      return file.text()
    } catch (error) {
      console.log('rejected', error)
    }
  }

  /**
   *
   * @param {*} csvStr
   * @returns
   */
  async function csv2JSON(csvStr) {
    try {
      return Papa.parse(csvStr, { header: true, dynamicTyping: true })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   *
   * @param {*} pnt
   * @returns
   */
  function getCoordinates(pnt) {
    return [pnt['long_EW'], pnt['lat_NS']]
  }

  /**
   *
   * @param {Array} data
   * @param {Array} properties2Keep
   * @returns Object GeoJSON FeatureCollection
   */
  async function json2GeoJSON(data, properties2Keep) {
    let features = []
    for (let i = 0; i < data.length; i++) {
      try {
        const coordinates = getCoordinates(data[i])
        const properties = {}
        for (let j = 0; j < properties2Keep.length; j++) {
          let prop = properties2Keep[j]
          properties[prop] = data[i][prop]
        }
        features.push(point(coordinates, properties, { id: data[i]['ID'] }))
      } catch (error) {
        console.log(error)
      }
    }
    successfulConvertion.value = !successfulConvertion.value
    return featureCollection(features)
  }

  return {
    json,
    geojson,
    inProcess,
    hasCSV,
    successfulConvertion,
    parentProperties,
    toggleInProcess,
    getGhfdbFromAPI,
    csv2JSON,
    json2GeoJSON
  }
})

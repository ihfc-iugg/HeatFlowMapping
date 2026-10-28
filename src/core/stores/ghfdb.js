import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import JSZip from 'jszip'
import { featureCollection, point } from '@turf/turf'
import Papa from 'papaparse'
import { Map } from 'maplibre-gl'
import { useIndexDB } from '@/shared/composables/useIndexDB'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase'

const { getData, saveData, removeData } = useIndexDB()

export const useGHFDBStore = defineStore('global heat flow database', () => {
  const inProcess = ref(true)
  const hasCSV = ref(false)
  const successfulConvertion = ref(false)

  /**
   * @description toggles the inProcess state.
   */
  function toggleInProcess() {
    inProcess.value = !inProcess.value
  }

  /**
   * @description Fetches the GHFDB data from the API.
   * @param {String} url
   * @returns {Promise<String>} CSV content
   */
  async function getGhfdbFromAPI(url) {
    try {
      const response = await axios.get(url, { responseType: 'blob' })
      const zip = await JSZip.loadAsync(response.data)

      const csvFileName = Object.keys(zip.files).find((fileName) => fileName.endsWith('.csv'))
      if (!csvFileName) {
        throw new Error('No CSV file found in the ZIP archive')
      }

      const csvContent = await zip.files[csvFileName].async('text')
      hasCSV.value = true

      return csvContent
    } catch (error) {
      console.log('rejected', error)
    }
  }

  /**
   * @description Converts CSV data to JSON and then to GeoJSON.
   * @param {String} csvStr
   * @returns {Promise<Object>} json
   */
  async function csv2JSON(csvStr) {
    try {
      return Papa.parse(csvStr, { header: true, dynamicTyping: true })
    } catch (error) {
      console.log(error)
    }
  }

  /**
   * @description Returns the coordinates from a point object.
   * @param {Object} pnt
   * @returns {Array} coordinates
   */
  function getCoordinates(pnt) {
    return [pnt['long_EW'], pnt['lat_NS']]
  }

  /**
   * @description Converts JSON data to GeoJSON format.
   * @param {Array} data
   * @param {Array} properties2Keep
   * @returns {Object} Object GeoJSON FeatureCollection
   */
  function json2GeoJSON(data, properties2Keep) {
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

  /***
   * @description: Handles the initial data fetching and processing for the GHFDB and the schema file
   */
  async function initData() {
    let geojson

    try {
      // indexDB.removeData('ghfdbDatabase', 'ghfdbStore', GHFDB.r2024.id)
      let storedData = await getData('ghfdbDatabase', 'ghfdbStore', GHFDB.r2024.id)
      console.log('storedData')
      console.log(storedData)

      if (!storedData) {
        // indexDB.hasGHFDB = false
        const strValues = await getGhfdbFromAPI(GHFDB.r2024.url)
        const json = await csv2JSON(strValues)
        geojson = json2GeoJSON(json.data, GHFDB.r2024.parentProperties)
        saveData('ghfdbDatabase', 'ghfdbStore', {
          id: GHFDB.r2024.id,
          release: GHFDB.r2024.release, // store version of release to query if data in DB is up to date
          data: geojson
        })

        console.log('GeoJSON data saved to IndexedDB')
      } else {
        // indexDB.hasGHFDB = true
        geojson = storedData.data
        console.log(storedData.data)
        console.log('GeoJSON data retrieved from IndexedDB')
      }

      toggleInProcess()
      return geojson
    } catch (error) {
      console.error('Error handling GeoJSON data:', error)
    }
  }

  /**
   * @description Adds the GHFDB data to the map as a source and layer.
   * @param {Map} map
   * @param {Object} ghfdb
   * @param {String} circleColor
   * @param {Number} circleRadius
   */
  async function addGhfdbToMap(map, ghfdb, circleColor, circleRadius) {
    map.addSource(GHFDB.r2024.id, {
      type: 'geojson',
      data: ghfdb
    })

    map.addLayer({
      id: GHFDB.r2024.id,
      type: 'circle',
      source: GHFDB.r2024.id,
      paint: {
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#ff0000',
          circleColor
        ],
        'circle-radius': circleRadius,
        'circle-stroke-width': 0.5,
        'circle-stroke-color': '#a1dab4'
      },
      layout: {
        visibility: 'visible'
      }
    })
  }

  return {
    inProcess,
    hasCSV,
    successfulConvertion,
    getGhfdbFromAPI,
    initData,
    addGhfdbToMap
  }
})

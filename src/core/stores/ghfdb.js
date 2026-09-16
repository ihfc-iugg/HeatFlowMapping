import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import JSZip from 'jszip'
import { featureCollection, point } from '@turf/turf'
import Papa from 'papaparse'
import { Map } from 'maplibre-gl'
import { useIndexDBStore } from './indexDBTools'
import { useApplicationStore } from './app'

export const useGHFDBStore = defineStore('global heat flow database', () => {
  const indexDB = useIndexDBStore()
  const app = useApplicationStore()

  const name = ref('ghfdb')
  const inProcess = ref(true)
  const hasCSV = ref(false)
  const successfulConvertion = ref(false)
  const parentProperties = ref([
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
  ])

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
    try {
      indexDB.removeData('ghfdbDatabase', 'ghfdbStore', 'ghfdb')
      let storedData = await indexDB.getData('ghfdbDatabase', 'ghfdbStore', 'ghfdb_release_2024')
      let geojson = null

      if (!storedData) {
        indexDB.hasGHFDB = false
        const strValues = await getGhfdbFromAPI(
          'https://raw.githubusercontent.com/ihfc-iugg/ghfdb-portal/refs/heads/main/assets/ghfdb/IHFC_2024_GHFDB.zip'
        )
        const json = await csv2JSON(strValues)
        geojson = json2GeoJSON(json.data, parentProperties.value)
        indexDB.saveData('ghfdbDatabase', 'ghfdbStore', {
          id: 'ghfdb_release_2024',
          release: 2024, // store version of release to query if data in DB is up to date
          data: geojson
          //   data: JSON.parse(JSON.stringify(geojson))
        })

        console.log('GeoJSON data saved to IndexedDB')
      } else {
        indexDB.hasGHFDB = true
        geojson = storedData.data
        console.log(storedData.data)
        console.log('GeoJSON data retrieved from IndexedDB')
      }

      toggleInProcess()
      return geojson
      //   addGhfdbToMap(app.map, geojson, settings.circleColor, settings.circleRadius)

      //   hfModels.addModelsToMap(mapStore.map)
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
    map.addSource(name.value, {
      type: 'geojson',
      data: ghfdb
    })

    map.addLayer({
      id: name.value,
      type: 'circle',
      source: name.value,
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

    map.addLayer({
      id: 'clickableLayer',
      type: 'circle',
      source: name.value,
      paint: {
        'circle-color': 'rgba(0,0,0,0)',
        'circle-radius': 15
      }
    })
  }

  return {
    name,
    inProcess,
    hasCSV,
    successfulConvertion,
    parentProperties,
    getGhfdbFromAPI,
    initData,
    addGhfdbToMap
  }
})

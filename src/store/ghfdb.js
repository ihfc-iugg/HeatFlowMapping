import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import JSZip from 'jszip'
import { featureCollection, point } from '@turf/turf'
import Papa from 'papaparse'
import { Map } from 'maplibre-gl'

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

  /**
   *
   * @param {Map} map
   * @param {Object} ghfdb
   * @param {String} circleColor
   * @param {Number} circleRadius
   */
  function addGhfdbToMap(map, ghfdb, circleColor, circleRadius) {
    map.addSource('ghfdb', {
      type: 'geojson',
      data: ghfdb
    })

    map.addLayer({
      id: 'ghfdb',
      type: 'circle',
      source: 'ghfdb',
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
      source: 'ghfdb',
      paint: {
        'circle-color': 'rgba(0,0,0,0)',
        'circle-radius': 15
      }
    })
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
    json2GeoJSON,
    addGhfdbToMap
  }
})

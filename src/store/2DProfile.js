import { defineStore } from 'pinia'
import { ref } from 'vue'
import { featureCollection, lineString, point, pointToLineDistance } from '@turf/turf'
import { Map } from 'maplibre-gl'
import { useSettingsStore } from './settings.js'

export const use2DProfileStore = defineStore('2DProfile', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const selectedProperty1 = ref(null)
  const selectedProperty2 = ref(null)
  const threshold = ref(null)
  const line = ref(null)
  const pointsWithinDistance = ref([])
  const settings = useSettingsStore()

  /**
   * @description
   * @param {Array} features
   * @param {Object} referenceLine
   * @param {Number} threshold
   */
  function setPointsWithinDistance(features, referenceLine, threshold) {
    const refLine = lineString(referenceLine.geometry.coordinates)
    pointsWithinDistance.value = features.filter((feature) => {
      const pnt = point(feature.geometry.coordinates)
      const pntToLineDistance = pointToLineDistance(
        pnt,
        refLine,
        { units: 'kilometers' },
        { method: 'planar' }
      )
      return pntToLineDistance <= threshold
    })
  }

  /**
   *
   * @param {Array} pntWithinDistance
   * @param {Map} mapObject
   */
  function highlightPointsWithinDistance(mapObject, pntWithinDistance) {
    const pntIds = pntWithinDistance.map((pnt) => pnt.properties.ID)
    const paintProperty = [
      'case',
      ['in', ['get', 'ID'], ['literal', pntIds]],
      '#FCC480',
      settings.circleColor
    ]
    mapObject.setPaintProperty('sites', 'circle-color', paintProperty)
  }

  /**
   *
   * @param {*} lat1
   * @param {*} lon1
   * @param {*} lat2
   * @param {*} lon2
   * @returns
   */
  function haversine(lat1, lon1, lat2, lon2) {
    if (lat1 == lat2 && lon1 == lon2) {
      return 0
    } else {
      var p1 = turf.point([lon1, lat1])
      var p2 = turf.point([lon2, lat2])
      var options = { units: 'kilometers' }
      var dist = turf.distance(p1, p2, options)
      return dist
    }
  }

  /**
   * @description
   * @param {Array} lineStringCoordinates
   * @returns {Object} GeoJSON FeatureCollection
   */
  function lineStringToPointFeatureCollection(lineStringCoordinates) {
    const pnt1 = point(lineStringCoordinates[0], { title: 'A' })
    const pnt2 = point(lineStringCoordinates.at(-1), { title: 'B' })
    return featureCollection([pnt1, pnt2])
  }

  /**
   * @description
   * @param {Map} mapObject
   * @param {Object} featureCollection
   */
  function addLineLabelToMap(mapObject, featureCollection) {
    mapObject.addSource('lineLable', {
      type: 'geojson',
      data: featureCollection
    })

    mapObject.addLayer({
      id: 'lineLable',
      type: 'symbol',
      source: 'lineLable',
      layout: {
        'text-field': ['get', 'title'],
        'text-offset': [0, 1.0]
      }
    })
  }

  return {
    selectedProperty1,
    selectedProperty2,
    threshold,
    line,
    pointsWithinDistance,
    setPointsWithinDistance,
    highlightPointsWithinDistance,
    lineStringToPointFeatureCollection,
    addLineLabelToMap
  }
})

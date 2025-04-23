import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  distance,
  featureCollection,
  lineString,
  point,
  pointToLineDistance,
  radiansToLength
} from '@turf/turf'
import { Map, Popup, Marker } from 'maplibre-gl'
import { useSettingsStore } from './settings.js'
import { useSphericalTrigonometry } from './sphericalTrigonometry.js'

export const use2DProfileStore = defineStore('2DProfile', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const selectedProperty1 = ref('q')
  const threshold = ref(25)
  const line = ref(null)
  const pointsWithinDistance = ref([])
  const settings = useSettingsStore()
  const calculationTools = useSphericalTrigonometry()
  const plot = ref(null)
  const popup = ref(null)
  const marker = ref(null)

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
  function generatePaintProperty(pntWithinDistance) {
    const pntIds = pntWithinDistance.map((pnt) => pnt.properties.ID)

    return ['case', ['in', ['get', 'ID'], ['literal', pntIds]], '#FCC480', settings.circleColor]
    // const pntIds = pntWithinDistance.map((pnt) => pnt.id)
    // return ['case', ['in', ['get', 'id'], ['literal', pntIds]], '#FCC480', settings.circleColor]
  }

  /**
   * @description
   * @param {Array} lineStringCoordinates
   * @returns {Object} GeoJSON FeatureCollection
   */
  function lineStringToPointFeatureCollection(lineStringCoordinates) {
    const pnt1 = point(lineStringCoordinates[0], { title: 'Start' })
    const pnt2 = point(lineStringCoordinates.at(-1), { title: 'End' })
    return featureCollection([pnt1, pnt2])
  }

  /**
   * @description
   * @param {Map} mapObject
   * @param {Object} featureCollection
   */
  function addLineLabelToMap(mapObject, featureCollection) {
    if (!mapObject.getSource('lineLable')) {
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

      mapObject.addLayer({
        id: 'startEndCircle',
        type: 'circle',
        source: 'lineLable',
        paint: {
          'circle-radius': 6, // Set the size of the circles
          'circle-color': '#FF5733' // Circle color
        }
      })
    }
  }

  /**
   *
   * @param {*} referenceLine
   * @param {*} pnts
   * @returns
   */
  function projectingDataOnLine(referenceLine, pnts) {
    let projectedPnts = []
    // A and C are start and end point of lineString
    const pntA = point(referenceLine.geometry.coordinates[0])
    const pntC = point(referenceLine.geometry.coordinates[1])
    // bT, T is shortcut for triangle
    const bT = distance(pntA, pntC, { units: 'radians' }) // length of drawn line
    pnts.forEach((pnt) => {
      console.log('pnt in profile store')
      console.log(pnt)
      // B is point within threshold
      const pntB = point(pnt.geometry.coordinates)
      const aT = distance(pntC, pntB, { units: 'radians' })
      const c = distance(pntB, pntA, { units: 'radians' })
      const alpha = calculationTools.calculateAlpha(aT, bT, c)
      // right triangle (RT)
      // aRT vertical distance to lineString
      const aRT = calculationTools.calculateA(alpha, c)
      // bRT distance along lineString where pntB is projected verticaly
      const bRT = calculationTools.calculateB(alpha, c)
      let pointData = {
        id: pnt.properties.ID,
        uncertainty: pnt.properties.q_uncertainty ? pnt.properties.q_uncertainty : null,
        b: radiansToLength(bRT),
        a: radiansToLength(aRT)
      }
      pointData[selectedProperty1.value] = pnt.properties[selectedProperty1.value]
      projectedPnts.push(pointData)
    })

    projectedPnts.sort((obj1, obj2) => {
      return obj1.b - obj2.b
    })

    return projectedPnts
  }

  return {
    selectedProperty1,
    threshold,
    line,
    pointsWithinDistance,
    plot,
    popup,
    marker,
    setPointsWithinDistance,
    generatePaintProperty,
    lineStringToPointFeatureCollection,
    addLineLabelToMap,
    projectingDataOnLine
  }
})

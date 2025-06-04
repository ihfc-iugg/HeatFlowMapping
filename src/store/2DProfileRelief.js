import { defineStore } from 'pinia'
import { ref } from 'vue'
import { along, featureCollection, length, point, distance } from '@turf/turf'

import { useOgcApiToolsStore } from './ogcApiTools'

export const use2DProfileReliefStore = defineStore('2DProfile helper logic', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const pointsAlongLine = ref(null)
  const reliefResolution = ref(1) // in degree
  const ogcApiTools = useOgcApiToolsStore()

  /**
   *
   * @param {Object} line
   * @param {Number} distance
   * @returns FeatureCollection with points with defined distance between each other along the input line
   */
  function calculatePointsAlongLineString(line, distance) {
    const lineLength = length(line, { units: 'degrees' })
    let pointsAlongLine = []

    if (lineLength <= distance) {
      console.log(
        'No additional points calculated along lineString. Length of lineString is less then '
      )
      return
    }

    let startPoint = point(line.geometry.coordinates[0], { id: 0 })
    startPoint.properties['distDegree'] = 0
    pointsAlongLine.push(startPoint)
    let distanceCounter = distance
    let idCounter = 1

    while (distanceCounter < lineLength) {
      let pointOnLine = along(line, distanceCounter, { units: 'degrees' })
      pointOnLine.id = pointOnLine.properties['distDegree'] = distanceCounter
      pointOnLine.properties['id'] = idCounter
      pointsAlongLine.push(pointOnLine)

      distanceCounter += distance
      idCounter++
    }

    let endPoint = point(line.geometry.coordinates[1])
    endPoint.properties['distDegree'] = lineLength
    endPoint.properties['id'] = idCounter
    pointsAlongLine.push(endPoint)

    return featureCollection(pointsAlongLine)
  }

  /**
   *
   * @param {*} mapObject
   * @param {*} pointsAlongLine
   */
  function addPointsAlongLineToMap(mapObject, pointsAlongLine) {
    mapObject.addSource('pointsAlongLine', {
      type: 'geojson',
      data: pointsAlongLine
    })

    mapObject.addLayer({
      id: 'pointsAlongLine',
      type: 'circle',
      source: 'pointsAlongLine',
      paint: {
        'circle-color': '#2F5597',
        'circle-radius': 3,
        'circle-stroke-width': 0.5,
        'circle-stroke-color': '#2F5597'
      },
      layout: {
        visibility: 'visible'
      }
    })

    if (!mapObject.getSource('lineLable')) {
      const startPnt = pointsAlongLine.features[0]
      startPnt.properties['title'] = 'start'
      const endPnt = pointsAlongLine.features[pointsAlongLine.features.length - 1]
      endPnt.properties['title'] = 'end'
      const lineLabel = featureCollection([startPnt, endPnt])

      mapObject.addSource('lineLable', {
        type: 'geojson',
        data: lineLabel
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
          'circle-radius': 3, // Set the size of the circles
          'circle-color': '#FF5733' // Circle color
        }
      })
    }
  }

  /**
   *
   * @param {Array} features
   */
  function setPntDistanceToStartPnt(features) {
    let startPnt = features[0]
    startPnt.properties['distKm'] = 0
    for (let i = 0; i < features.length; i++) {
      const dist = distance(startPnt.geometry.coordinates, features[i].geometry.coordinates, {
        units: 'kilometers'
      })
      features[i].properties['distKm'] = dist
    }
  }

  async function setPntReliefValue(features, collectionURL) {
    for (let i = 0; i < features.length; i++) {
      let pnt = features[i]
      let [lon, lat] = [pnt.geometry.coordinates[0], pnt.geometry.coordinates[1]]
      pnt.properties['elevation'] = await ogcApiTools.queryAtPosition(lon, lat, collectionURL, 'z')
    }
  }

  return {
    pointsAlongLine,
    reliefResolution,
    calculatePointsAlongLineString,
    addPointsAlongLineToMap,
    setPntDistanceToStartPnt,
    setPntReliefValue
  }
})

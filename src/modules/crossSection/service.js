import { featureCollection, booleanPointInPolygon, point } from '@turf/turf'
import { nearestPointOnLine } from '@turf/nearest-point-on-line'
import { Map } from 'maplibre-gl'

/**
 * @typedef {Object} OrderedPoint
 * @property {Object} point              Original GeoJSON Point feature
 * @property {Object} snapped            Snapped point on the line
 * @property {number} distanceAlongLine  Distance from `start` along the line
 * @property {number} distanceToLine     Distance from the point to the line
 */

/**
 * Order points by their distance along a line, measured from the line's
 * start to each point's nearest point on the line.
 *
 * @param {Object[]} allPoints  Array of GeoJSON Point features
 * @param {number[]} start      [lng, lat]
 * @param {number[]} end        [lng, lat]
 * @param {number}   bufferRadius
 * @param {{ units?: string }} [options]
 * @returns {OrderedPoint[]}
 */
export function orderPointsInBBox(allPoints, orientedBBox, lineString, options = {}) {
  const units = options.units ?? 'kilometers'

  if (!orientedBBox) return []

  return allPoints
    .filter((pt) => booleanPointInPolygon(pt, orientedBBox))
    .map((point) => {
      const snapped = nearestPointOnLine(lineString, point, { units })
      const props = snapped.properties ?? {}

      return {
        point,
        snapped,
        distanceAlongLine: props.location ?? props.lineDistance,
        distanceToLine: props.dist ?? props.pointDistance
      }
    })
    .sort(
      (a, b) => a.distanceAlongLine - b.distanceAlongLine || a.distanceToLine - b.distanceToLine
    )
}

/**
 * @description
 * @param {Object} feature
 * @returns {Object}
 */
export function restrictLineCoordinatesToTwoPoints(feature) {
  if (!feature) return
  const coords = feature.geometry.coordinates
  if (coords.length <= 2) {
    return { ...feature.geometry }
  } else {
    return {
      // copy of feature.geometry and mergenkey value in object
      ...feature.geometry,
      coordinates: [coords[0], coords[coords.length - 1]]
    }
  }
}

/**
 * @description
 * @param {String} id
 * @param {Array} features
 */
export function removePreviousLineStrings(id, features) {
  if (!Array.isArray(features)) {
    return
  }
  let idsToRemove = []
  for (const feature of features) {
    if ((feature.id != id) & (feature.geometry.type === 'LineString')) {
      idsToRemove.push(feature.id)
    }
  }

  return idsToRemove
}

/**
 *
 * @param {object} bbox
 * @param {String} orientedBBoxId
 * @param {Object} map
 * @returns
 */
export function addOrientedBBoxToMap(bbox, orientedBBoxId, map) {
  if (!bbox || !map) return

  if (map.getLayer(orientedBBoxId)) {
    map.removeLayer(orientedBBoxId)
  }

  if (map.getSource(orientedBBoxId)) {
    map.removeSource(orientedBBoxId)
  }

  map.addSource(orientedBBoxId, { type: 'geojson', data: bbox })
  map.addLayer({
    id: orientedBBoxId,
    source: orientedBBoxId,
    type: 'fill',
    paint: {
      'fill-color': '#088',
      'fill-opacity': 0.2
    }
  })
}

/**
 *
 * @param {String[]} layerIDs
 * @param {String} sourceID
 * @param {Object} map
 */
export function removeLayerAndSource(layerIDs, sourceID, map) {
  layerIDs.forEach((id) => {
    if (map.getLayer(id)) map.removeLayer(id)
  })

  if (map.getSource(sourceID)) map.removeSource(sourceID)
}

/**
 *
 * @param {Object} lineString
 * @param {String} orientedBBoxLabelId
 * @param {Object} map
 * @returns
 */
export function addLineStringLable(lineString, orientedBBoxLabelId, map) {
  if (!lineString || !map) return

  const start = point(lineString.geometry.coordinates[0], { title: 'Start' })
  const end = point(lineString.geometry.coordinates[1], { title: 'End' })

  const titleId = orientedBBoxLabelId + 'Title'
  const circleId = orientedBBoxLabelId + 'Circle'

  removeLayerAndSource([titleId, circleId], orientedBBoxLabelId, map)

  map.addSource(orientedBBoxLabelId, {
    type: 'geojson',
    data: featureCollection([start, end])
  })

  map.addLayer({
    id: titleId,
    type: 'symbol',
    source: orientedBBoxLabelId,
    layout: {
      'text-field': ['get', 'title'],
      'text-offset': [0, 1.0]
    }
  })

  map.addLayer({
    id: circleId,
    type: 'circle',
    source: orientedBBoxLabelId,
    paint: {
      'circle-radius': 6, // Set the size of the circles
      'circle-color': '#FF5733' // Circle color
    }
  })
}

export function adjustLayerOrdering(map) {
  if (!map) return

  const currentOrder = map.getLayersOrder()
}

/**
 *
 * @param {Map} map
 * @param {Object} lineString
 * @param {number} targetPixels
 * @returns
 */
export function calculateZoomDelta(map, lineString, targetPixels) {
  const [a, b] = [lineString.geometry.coordinates[0], lineString.geometry.coordinates[1]]

  const pA = map.project(a)
  const pB = map.project(b)
  const currentPixels = Math.hypot(pB.x - pA.x, pB.y - pA.y)

  if (!currentPixels) return

  // Each zoom level doubles pixel size
  return Math.log2(targetPixels / currentPixels)
}

import { nearestPoint as turfNearestPoint } from '@turf/turf'
import { CIRCLE } from '@/shared/constants/application'

/**
 * @description
 * @param {String} id
 * @param {Array} features
 */
export function removePreviousPoints(id, features) {
  if (!Array.isArray(features)) {
    return
  }
  let idsToRemove = []
  for (const feature of features) {
    if ((feature.id != id) & (feature.geometry.type === 'Point')) {
      idsToRemove.push(feature.id)
    }
  }
  return idsToRemove
}

/**
 *
 * @param point
 * @param data
 */
export function nearestPoint(point, data) {
  const coords = point.geometry.coordinates
  return turfNearestPoint(coords, data)
}

/**
 * @description colors nearest neighbor red
 * @param {String} pointID
 */
export function highlightNearestPoint(pointID) {
  return [
    'case',
    ['==', ['get', 'ID'], pointID],
    CIRCLE.styling.highlightColor,
    CIRCLE.styling.defaultColor
  ]
}

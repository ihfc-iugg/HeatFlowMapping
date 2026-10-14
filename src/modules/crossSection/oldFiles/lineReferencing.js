import { lineString, buffer, booleanPointInPolygon } from '@turf/turf'
import { nearestPointOnLine } from '@turf/nearest-point-on-line'

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
export function orderPointsInBuffer(allPoints, start, end, bufferRadius, options = {}) {
  const units = options.units ?? 'kilometers'

  const line = lineString([start, end])
  const corridor = buffer(line, bufferRadius, { units })
  if (!corridor) return []

  return allPoints
    .filter((pt) => booleanPointInPolygon(pt, corridor))
    .map((point) => {
      const snapped = nearestPointOnLine(line, point, { units })
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

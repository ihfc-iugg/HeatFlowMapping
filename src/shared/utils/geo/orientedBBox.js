import { bearing, destination, polygon } from '@turf/turf'

/**
 * Oriented bounding box of a 2-coordinate LineString, expanded to a
 * given half-width perpendicular to the line.
 *
 * @param {Object} start  GeoJSON Point feature
 * @param {Object} end    GeoJSON Point feature
 * @param {number} halfWidth
 * @param {{ units?: string, padEnds?: number }} [options]
 * @returns {Object} GeoJSON Polygon feature
 */
export function calculateOrientedBBox(start, end, halfWidth, options = {}) {
  if (!start || !end || !halfWidth) throw new Error('no arguments')

  const units = options.units ?? 'kilometers'
  const padEnds = options.padEnds ?? 0

  const brg = bearing(start, end)

  // Optionally extend past the endpoints (square caps)
  const a2 = padEnds ? destination(start, padEnds, brg + 180, { units }) : start
  const b2 = padEnds ? destination(end, padEnds, brg, { units }) : end

  const left = brg - 90
  const right = brg + 90

  const c1 = destination(a2, halfWidth, left, { units }).geometry.coordinates
  const c2 = destination(b2, halfWidth, left, { units }).geometry.coordinates
  const c3 = destination(b2, halfWidth, right, { units }).geometry.coordinates
  const c4 = destination(a2, halfWidth, right, { units }).geometry.coordinates

  return polygon([[c1, c2, c3, c4, c1]], {
    bearing: brg,
    halfWidth,
    units
  })
}

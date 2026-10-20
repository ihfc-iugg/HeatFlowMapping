import { Map, Popup } from 'maplibre-gl'
import { BASEMAPS } from '@/shared/constants/externalGeoData'

/**
 *
 * @param {string} mapID
 * @returns
 */
export function initeMap(mapID) {
  if (!mapID) throw new Error('no arguments')

  const osm = BASEMAPS.open_street_map
  let sources = {}
  sources[osm.id] = {
    type: 'raster',
    tiles: [osm.tiles],
    tileSize: 256,
    attribution: osm.attribution
  }

  return new Map({
    id: mapID,
    container: mapID,
    attributionControl: true,
    zoom: 3,
    style: {
      version: 8,
      sources,
      layers: [
        {
          id: osm.id,
          source: osm.id,
          type: 'raster'
        }
      ],
      glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf', // https://maplibre.org/maplibre-gl-js-docs/style-spec/glyphs/
      // projection: {},
      sky: {
        'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0]
      }
    }
  })
}

/**
 * @description
 * @param {Array} coordinates
 * @returns {Popup}
 */
export function generatePopup(coordinates) {
  if (!coordinates) throw new Error('no arguments')

  return new Popup({
    closeOnClick: true,
    closeButton: true,
    focusAfterOpen: true,
    maxWidth: 'none',
    anchor: 'bottom'
  })
    .setLngLat(coordinates)
    .setHTML('')
}

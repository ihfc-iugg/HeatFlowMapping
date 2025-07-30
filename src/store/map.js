import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Map } from 'maplibre-gl'
import { useBaseMapsStore } from './baseMaps'
import { useSettingsStore } from '@/store/settings'

export const useMapStore = defineStore('map', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const isInstantiated = ref(false)
  const bm = useBaseMapsStore()
  const settings = useSettingsStore()

  const map = ref(null)

  /**
   * @description sets up the map with the provided container element.
   * @param {HTMLElement} containerElem
   */
  function setMap(containerElem) {
    map.value = new Map({
      mapId: 'map_1',
      container: containerElem,
      attributionControl: true,
      zoom: 3,
      style: {
        version: 8,
        sources: setBaseMapsSource(bm),
        layers: setBaseMapsLayer(bm),
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf', // https://maplibre.org/maplibre-gl-js-docs/style-spec/glyphs/
        projection: {
          // type: 'globe'
        },
        sky: {
          'atmosphere-blend': ['interpolate', ['linear'], ['zoom'], 0, 1, 5, 1, 7, 0]
        }
      }
    })
    map.value.setRenderWorldCopies(false)
    isInstantiated.value = true
  }

  /**
   * @description create object for base map sources
   * @param {Object} bm - base maps store
   * @returns {Object} object with base map sources
   */
  function setBaseMapsSource(bm) {
    let bmSourceObject = {}

    bm.baseMaps.forEach((baseMapSource) => {
      bmSourceObject[baseMapSource.id] = {
        type: 'raster',
        tiles: [baseMapSource.tiles],
        tileSize: 256,
        attribution: baseMapSource.attribution,
        minzoom: 0,
        maxzoom: 22
      }
    })
    return bmSourceObject
  }

  /**
   * @description create object for base map layers
   * @param {Object} bm - base maps store
   * @returns {Array} array of layer objects
   */
  function setBaseMapsLayer(bm) {
    let layerObjects = []

    bm.baseMaps.forEach((baseMapLayer, ix) => {
      let layerObject = {
        id: baseMapLayer.id,
        type: 'raster',
        source: baseMapLayer.id
      }
      if (baseMapLayer.id === settings.activeBaseLayer) {
        layerObject.layout = {
          visibility: 'visible'
        }
      } else {
        layerObject.layout = {
          visibility: 'none'
        }
      }
      layerObjects.push(layerObject)
    })
    return layerObjects
  }

  return { map, isInstantiated, setMap }
})

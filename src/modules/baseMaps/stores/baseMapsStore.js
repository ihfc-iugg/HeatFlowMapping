import { Map } from 'maplibre-gl'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { BASEMAPS } from '@/core/constants/externalGeoData'

export const useBaseMapsStore = defineStore('baseMaps', () => {
  const selectedLayer = ref(BASEMAPS.bm_osm.id)

  /**
   * @description create object for base map sources
   * @param {Object} bm - base maps store
   * @returns {Object} object with base map sources
   */
  function createSource(source) {
    return {
      type: 'raster',
      tiles: [source.tiles],
      tileSize: 256,
      attribution: source.attribution,
      minzoom: 0,
      maxzoom: 22
    }
  }

  /**
   * @description create object for base map layers
   * @param {Object} bm - base maps store
   * @returns {Array} array of layer objects
   */
  function createLayer(layer) {
    let layerObject = {
      id: layer.id,
      type: 'raster',
      source: layer.id
    }
    if (layer.id === selectedLayer.value) {
      layerObject.layout = {
        visibility: 'visible'
      }
    } else {
      layerObject.layout = {
        visibility: 'none'
      }
    }

    return layerObject
  }

  /**
   *
   * @param {Map} map
   */
  function addBaseMaps(map) {
    for (const [key, value] of Object.entries(BASEMAPS)) {
      if (!map.getSource(key)) {
        map.addSource(key, createSource(value))
        map.addLayer(createLayer(value))
      }
    }
  }

  return { selectedLayer, addBaseMaps }
})

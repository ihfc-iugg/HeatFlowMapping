import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import colorbrewer from 'colorbrewer'
import { feature } from '@turf/turf'

export const useTemperatureProfileStore = defineStore('Temperature Profile store', () => {
  const activeTab = ref('calculationSetup') // default
  const geoPoint = ref(null)
  const layers = ref([])
  const nearestPoint = ref(null)
  const openPopup = ref(false)
  const popup = ref(null)
  const useCrust1 = ref(true)
  const useNOAA = ref(true)

  // Parameter for WMS GetFeatureInfo
  const screenPoint = ref({ x: null, y: null })
  // const mapBounds = ref(undefined)
  const mapBoundsSW = ref({ lng: null, lat: null })
  const mapBoundsNE = ref({ lng: null, lat: null })
  const mapCanvas = ref({ width: null, height: null })
  const wmsParameterLoaded = computed(() => {
    if (
      screenPoint.value.x &&
      screenPoint.value.y &&
      // mapBounds.value &&
      mapBoundsSW.value.lng &&
      mapBoundsSW.value.lat &&
      mapBoundsNE.value.lng &&
      mapBoundsNE.value.lat &&
      mapCanvas.value.width &&
      mapCanvas.value.height
      // mapCanvas.value.width &&
      // mapCanvas.value.height
    ) {
      return true
    } else {
      false
    }
  })

  /**
   *
   * @description adds an empty layer to the layers array
   */
  function addEmptyLayer() {
    layers.value.push({
      tTop: null,
      tBot: null,
      qTop: null,
      qBot: null,
      k: null,
      dZ: null,
      a: null,
      layerType: '', // just example of what this attribute could be used for
      color: null
    })
  }

  /**
   * @description sets the layer properties based on the provided parameters.
   * @param {number} tTop
   * @param {number} tBot
   * @param {number} qTop
   * @param {number} qBot
   * @param {number} k
   * @param {number} dz
   * @param {number} a
   * @param {string} layerType
   */
  function addLayer(tTop, tBot, qTop, qBot, k, dz, a, layerType, color) {
    // if condition because of class number limitation for colorbrewer qualitative
    if (layers.value.length < 9) {
      addEmptyLayer()
      let l = layers.value.at(-1)
      l.tTop = tTop ? tTop : null
      l.tBot = tBot ? tBot : null
      l.qTop = qTop ? qTop : null
      l.qBot = qBot ? qBot : null
      l.k = k ? k : null
      l.dZ = dz ? dz : null
      l.a = a ? a : null
      l.layerType = layerType ? layerType : null
      l.color = color ? color : null
      if (layers.value.length <= 3 && !l.color) {
        l.color = colorbrewer['Pastel1'][3][layers.value.length - 1]
      } else if (!l.color) {
        l.color = colorbrewer['Pastel1'][layers.value.length].at(-1)
      }
    } else {
      console.log('You reached the maximum number of layers. Only 12 layers are allowed')
    }
  }

  /**
   * @description Removes the last layer from the layers array if there is more than one layer.
   */
  function removeLayer() {
    if (layers.value.length > 0) {
      layers.value.pop()
    }
  }

  function toggleOpenPopup() {
    openPopup.value = false === openPopup.value ? true : false
  }

  return {
    activeTab,
    geoPoint,
    layers,
    nearestPoint,
    openPopup,
    popup,
    useCrust1,
    useNOAA,
    screenPoint,
    // mapBounds,
    mapBoundsSW,
    mapBoundsNE,
    mapCanvas,
    wmsParameterLoaded,
    addLayer,
    removeLayer,
    toggleOpenPopup
  }
})

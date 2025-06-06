import { defineStore } from 'pinia'
import { ref } from 'vue'
import { FeatureInfoControl } from '@/classes/FeatureInfoControl.js'

import { ScaleControl, FullscreenControl, NavigationControl } from 'maplibre-gl'

export const useMapControlsStore = defineStore('mapControls', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const scale = ref(new ScaleControl())
  const featureInfo = ref(new FeatureInfoControl({ layerID: 'clickableLayer' }))
  const fullscreen = ref(new FullscreenControl())
  const navigation = ref(new NavigationControl())

  return { scale, fullscreen, navigation, featureInfo }
})

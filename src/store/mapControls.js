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
  const fullscreen = ref(new FullscreenControl())
  const navigation = ref(new NavigationControl())
  const featureInfo = ref(new FeatureInfoControl())

  return { scale, fullscreen, navigation, featureInfo }
})

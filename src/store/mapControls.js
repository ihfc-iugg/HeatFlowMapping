import { defineStore } from 'pinia'
import { ref } from 'vue'

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

  return { scale, fullscreen, navigation }
})

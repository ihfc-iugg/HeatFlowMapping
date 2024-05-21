import { defineStore } from 'pinia'
import { ref } from 'vue'

import { ScaleControl, FullscreenControl, NavigationControl } from 'maplibre-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

export const useMapControlsStore = defineStore('mapControls', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const mapboxDraw = ref(
    new MapboxDraw({
      displayControlsDefault: false,
      controls: {}
    })
  )

  const scale = ref(new ScaleControl())
  const fullscreen = ref(new FullscreenControl())
  const navigation = ref(new NavigationControl())

  return { mapboxDraw, scale, fullscreen, navigation }
})

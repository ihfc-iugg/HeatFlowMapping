import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const activeBaseLayer = ref('bm_esri_world_physical')
  const circleRadius = ref(3)
  const circleColor = ref('#E31E24') // Red from IHFC logo

  return { activeBaseLayer, circleRadius, circleColor }
})

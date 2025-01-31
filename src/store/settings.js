import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const activeBaseLayer = ref('')
  const circleRadius = ref(4)
  const circleColor = ref('#304B9B')

  return { activeBaseLayer, circleRadius, circleColor }
})

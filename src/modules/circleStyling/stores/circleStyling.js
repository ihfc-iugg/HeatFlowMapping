import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCircleStylingStore = defineStore('Circle styling, color and radius', () => {
  const radius = ref(3)
  const color = ref('#E31E24') // Red from IHFC logo

  return {
    color,
    radius
  }
})

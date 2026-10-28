import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapStore = defineStore('map', () => {
  const map = ref(null)

  /**
   *
   */
  function removeMap() {
    if (map.value) {
      map.value.remove()
      map.value = null
    }
  }

  return { map, removeMap }
})

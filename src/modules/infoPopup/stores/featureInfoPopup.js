import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useFeatureInfoStore = defineStore('Feature Info Popup', () => {
  const selectedPoint = ref(null)
  const hasPopup = ref(false)

  return { selectedPoint, hasPopup }
})

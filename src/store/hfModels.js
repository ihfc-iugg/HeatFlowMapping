import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useHFModelsStore = defineStore('HF Models', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const models = ref({
    'hf-model': {
      id: 'hf-model',
      title: 'Global Heat Flow Model R2024',
      modelURL: '@/assets/img/HF_R2024_GRID_down_scaled_cropped.png',
      attribution: ''
    }
  })
  const selectedModel = ref(false)
  const opacity = ref(50)

  function setSelectedModel(modelID) {
    selectedModel.value = modelID
  }

  return { models, selectedModel, opacity, setSelectedModel }
})

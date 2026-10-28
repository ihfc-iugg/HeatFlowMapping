import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Map } from 'maplibre-gl'

import hf_rf2024GridURL from '@/shared/assets/img/HF_R2024_GRID_down_scaled_cropped_reprojected_3857.png'

export const useHFModelsStore = defineStore('HF Models', () => {
  const models = ref({
    'hf-model': {
      id: 'hf-model',
      title: 'Global Heat Flow Model R2024',
      // modelURL: '@/shared/assets/img/HF_R2024_GRID_down_scaled_cropped.png',
      modelURL: hf_rf2024GridURL,
      attribution:
        'Neumann, F., Norden, B., Balkan-Pazvantoğlu, E., Elbarbary, S., Petrunin, A.G., Elger, K., Jennings, S., Frenzel, S., Fuchs. S. (2025). Standardization and quality: the assessment of the global heat-flow data between 1954 and 2024. Earth System Science Data. (under review)',
      doi: '',
      extend: [
        [-180, 85.06],
        [180, 85.06],
        [180, -85.06],
        [-180, -85.06]
      ]
    }
  })
  const selectedModel = ref(null)
  const opacity = ref(50)

  /**
   * @description Adds the HF models to the map as sources and layers.
   * @param {Map} map
   */
  function addModelsToMap(map) {
    Object.values(models.value).forEach((model) => {
      map.addSource(model.id, {
        type: 'image',
        url: model.modelURL,
        coordinates: model.extend
      })
      map.addLayer({
        id: model.id,
        type: 'raster',
        source: model.id,
        paint: {
          'raster-opacity': opacity.value / 100
        },
        layout: {
          visibility: 'none'
        }
      })
    })
  }

  return { models, selectedModel, opacity, addModelsToMap }
})

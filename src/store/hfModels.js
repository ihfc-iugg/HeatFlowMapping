import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Map } from 'maplibre-gl'

import hf_rf2024GridURL from '@/assets/img/HF_R2024_GRID_down_scaled_cropped_reprojected_3857.png'

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
      // modelURL: '@/assets/img/HF_R2024_GRID_down_scaled_cropped.png',
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
    // 'sample-model1': {
    //   id: 'sample-model1',
    //   title: 'Some sample 1',
    //   // modelURL: '@/assets/img/HF_R2024_GRID_down_scaled_cropped.png',
    //   modelURL: '',
    //   attribution: 'This is a sample model for testing purposes.',
    //   doi: 'doi:10.1234/sample-model',
    //   extend: [
    //     [-180, 85.06],
    //     [180, 85.06],
    //     [180, -85.06],
    //     [-180, -85.06]
    //   ]
    // },
    // 'sample-model2': {
    //   id: 'sample-model2',
    //   title: 'Some sample 2',
    //   // modelURL: '@/assets/img/HF_R2024_GRID_down_scaled_cropped.png',
    //   modelURL: '',
    //   attribution: '',
    //   doi: 'doi:10.1234/sample-model',
    //   extend: [
    //     [-180, 85.06],
    //     [180, 85.06],
    //     [180, -85.06],
    //     [-180, -85.06]
    //   ]
    // }
  })
  const selectedModel = ref(null)
  const opacity = ref(50)

  /**
   *
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

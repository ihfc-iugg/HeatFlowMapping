import { defineStore } from 'pinia'
import { ref } from 'vue'

import colorbrewer from 'colorbrewer'

export const useColorPaletteStore = defineStore('Color palette for data driven coloring', () => {
  const selectedNatureOfData = ref('sequential')
  const selectedColorSchema = ref(colorbrewer.schemeGroups[selectedNatureOfData.value][0])
  const typesNatureOfData = ref([
    {
      id: 'sequential',
      title: 'Sequential'
    },
    {
      id: 'diverging',
      title: 'Diverging'
    },
    {
      id: 'qualitative',
      title: 'Qualitative'
    }
  ])

  /**
   * @description
   * @param {number} nrOfClasses
   * @returns
   */
  function getSchemaColors(nrOfClasses) {
    try {
      return colorbrewer[selectedColorSchema.value][nrOfClasses]
    } catch (error) {
      console.log(error)
    }
  }

  return {
    selectedColorSchema,
    typesNatureOfData,
    selectedNatureOfData,
    getSchemaColors
  }
})

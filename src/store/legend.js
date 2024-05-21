import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useLegendStore = defineStore('legend', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const legend = ref(null)

  /**
   * @description set up an object with relevant information for creating a legend
   * @param {Array} classes
   * @param {Array} colors
   */
  function setLegendObject(classes, colors) {
    let legendObj = {}
    for (var i = 0; i < colors.length; i++) {
      if (colors.length == classes.length) {
        legendObj[i] = {
          id: i,
          text: classes[i],
          colorHEX: colors[i]
        }
      } else if (colors.length < classes.length) {
        legendObj[i] = {
          id: i,
          text: classes[i].toFixed(2) + ' - ' + classes[i + 1].toFixed(2),
          colorHEX: colors[i]
        }
      }
    }

    legend.value = legendObj
  }

  /**
   * @description to reset legend
   */
  function setLegendToNull() {
    if (legend.value) {
      legend.value = null
    }
  }

  return { legend, setLegendObject, setLegendToNull }
})

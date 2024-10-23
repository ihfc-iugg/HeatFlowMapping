import { sqrt } from 'mathjs'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDigitalBoreholeStore = defineStore('digitalBorehole', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const layers = ref([])
  const t0 = ref(20)

  /**
   *
   * @description
   */
  function addEmptyLayer() {
    layers.value.push({
      tTop: null,
      tBot: null,
      qTop: null,
      qBot: null,
      k: null,
      dZ: null,
      a: null,
      layerType: 'granite' // just example of what this attribute could be used for
    })
  }

  function setLayer(tTop, tBot, qTop, qBot, k, dz, a, layerType) {
    addEmptyLayer()
    let l = layers.value.at(-1)
    l.tTop = tTop ? tTop : null
    l.tBot = tBot ? tBot : null
    l.qTop = qTop ? qTop : null
    l.qBot = qBot ? qBot : null
    l.k = k ? k : null
    l.dZ = dz ? dz : null
    l.a = a ? a : null
    l.layerType = layerType ? layerType : null
  }

  /**
   * @description calculates the temperature within a certain depth
   * @param {number} t0 ground surface temperature
   * @param {number} qTop
   * @param {number} dZi thickness of layer
   * @param {number} k thermal conductivity
   * @param {number} a heat production
   * @returns {number} temperature
   */
  function calculateTemperature(qTop, dZi, k, a) {
    return (qTop * dZi) / k - (a * (dZi * dZi)) / (2 * k)
  }

  /**
   *
   * @param {Array} layers
   * @param {number} t0
   * @param {number} q0
   */
  function bootstrapping(layers, t0, q0) {
    layers[0].tTop = t0
    layers[0].qTop = q0
    let temp = t0
    for (let ix = 0; ix < layers.length; ix++) {
      let l = layers[ix]
      l.qBot = l.qTop - l.a * l.dZ
      temp = temp + calculateTemperature(l.qTop, l.dZ, l.k, l.a)
      l.tBot = temp
      // console.log('akk temp: ' + temp)
      if (ix < layers.length - 1) {
        layers[ix + 1].tTop = l.tBot
        layers[ix + 1].qTop = l.qBot
      }
    }
  }

  return { layers, t0, addEmptyLayer, setLayer, calculateTemperature, bootstrapping }
})

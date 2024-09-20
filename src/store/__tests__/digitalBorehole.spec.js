import { describe, beforeEach, it, expect } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useDigitalBoreholeStore } from '../digitalBorehole'
import { exp } from 'mathjs'

describe('Legend Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('addEmptyLayer: check if layer objects are pushed to layers', () => {
    const dB = useDigitalBoreholeStore()
    dB.addEmptyLayer()
    expect(dB.layers.length).toBe(1)
  })

  it('setLayer: check if layer is set with custom values for attributes k, dZ, a, layerType', () => {
    const dB = useDigitalBoreholeStore()
    dB.setLayer(null, null, null, null, 10, 11, 12, 'sediment')
    expect(dB.layers.length).toBe(1)
    expect(dB.layers[0]).toStrictEqual({
      tTop: null,
      tBot: null,
      qTop: null,
      qBot: null,
      k: 10,
      dZ: 11,
      a: 12,
      layerType: 'sediment'
    })
  })

  it('calculateTemperature: check if equiation works as expected', () => {
    const dB = useDigitalBoreholeStore()
    const temperature = dB.calculateTemperature(10, 1, 500, 1000, 3)
    expect(temperature).toBe(-364.5)
  })

  it('bootstrapping: should iterate through the layers and add to each layer the temperature and q values', () => {
    const dB = useDigitalBoreholeStore()
    dB.setLayer(null, null, null, null, 1, 100, 1, 'sediment')
    dB.setLayer(null, null, null, null, 5.29, 200, 2, 'dolomite')
    dB.setLayer(null, null, null, null, 4.484, 300, 3, 'anhydrite')
    console.log(dB.layers)
    dB.bootstrapping(dB.layers, 10, 172)
    console.log(dB.layers)
    //TODO: add expected value
  })
})

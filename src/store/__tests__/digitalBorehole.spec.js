import { describe, beforeEach, it, expect } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useDigitalBoreholeStore } from '../digitalBorehole'
import { exp } from 'mathjs'
import { use } from 'chai'

describe('Legend Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('check inital state of store', () => {
    const dB = useDigitalBoreholeStore()

    expect(dB.layers).toEqual([])
    expect(dB.t0).toBe(20)
    expect(dB.pnt).toBeNull()
    expect(dB.closestPointfeatures).toBeNull()
    expect(dB.popup).toBeNull()
    expect(dB.marker).toBeNull()
    expect(dB.hasPopup).toBe(false)
    expect(dB.plot).toBeNull()
    expect(dB.uncertainty).toBe(5)
  })

  it('check if layer objects are pushed to layers', () => {
    const dB = useDigitalBoreholeStore()
    dB.addEmptyLayer()
    expect(dB.layers).toHaveLength(1)
  })

  it('check if layer is set with custom values for attributes k, dZ, a, layerType', () => {
    const dB = useDigitalBoreholeStore()
    dB.setLayer(null, null, null, null, 10, 11, 12, 'sediment')
    expect(dB.layers.length).toBe(1)
    expect(dB.layers[0]).toEqual({
      color: '#fbb4ae',
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

  it('check if layer object gets removed. Note, layer can only be removed if more than 1 exist', () => {
    const dB = useDigitalBoreholeStore()
    dB.addEmptyLayer()
    dB.addEmptyLayer()
    expect(dB.layers).toHaveLength(2)
    dB.removeLastLayer()
    expect(dB.layers).toHaveLength(1)
  })

  it('check if equiation for temperature works as expected', () => {
    const dB = useDigitalBoreholeStore()
    const temperature = dB.calculateTemperature(10 / 1000, 200, 500, 3)
    expect(temperature).toBe((0.01 * 200) / 500 - ((3 / 1000000) * (200 * 200)) / 1000)
  })

  it('check if q value at the bottom of a layer is calculated correclty', () => {
    const store = useDigitalBoreholeStore()
    const qBot = store.calculateHeatFlowAtBottom(10, 200, 5)
    expect(qBot).toEqual(10 - (5 / 1000000) * 200)
    expect(store.calculateHeatFlowAtBottom(0, 2, null)).toBeNull()
  })

  it('check if q values and temperture values of each layer is set correctly', () => {
    const store = useDigitalBoreholeStore()
    const t0 = 10 // °C
    const q0 = 1000 // mW/w^2 same as 1 W/m^2
    store.setLayer(null, null, null, null, 1, 100, 1, 'sediment')
    store.setLayer(null, null, null, null, 2, 200, 2, 'dolomite')
    store.setLayer(null, null, null, null, 3, 300, 3, 'anhydrite')
    store.bootstrapping(store.layers, t0, q0)

    const qBot0 = store.calculateHeatFlowAtBottom(1, 100, 1)
    const qBot1 = store.calculateHeatFlowAtBottom(qBot0, 100, 1)
    const qBot2 = store.calculateHeatFlowAtBottom(qBot1, 100, 1)
    const tBot0 = store.calculateTemperature(1, 100, 1, 1)
    const tBot1 = store.calculateTemperature(qBot0, 200, 2, 2)
    const tBot2 = store.calculateTemperature(qBot1, 300, 3, 3)

    expect(store.layers[0].tBot).toBeCloseTo(t0 + tBot0, 1)
    expect(store.layers[1].tBot).toBeCloseTo(t0 + tBot0 + tBot1, 1)
    expect(store.layers[2].tBot).toBeCloseTo(t0 + tBot0 + tBot1 + tBot2, 1)
  })

  it('check if paintProperty for nearest neighbor is set correctly', () => {
    const store = useDigitalBoreholeStore()
    const mockMap = {
      setPaintProperty: vi.fn()
    }
    const pointID = 'abc123'
    const circleColor = '#00ff00'

    store.highlightNearestNeighbor(pointID, mockMap, circleColor)

    expect(mockMap.setPaintProperty).toHaveBeenCalledWith('ghfdb', 'circle-color', [
      'case',
      ['==', ['get', 'ID'], pointID],
      'red',
      circleColor
    ])
  })

  it('check if min and max x values for uncertainty is calculatet corretly. The should mark the bounds of the x values with a given uncertainty before and after the actual x value', () => {
    const store = useDigitalBoreholeStore()
    const dummyXValues = [1, 2, 3, 4, 5]
    const xErrorValues = store.calcXValuesUncertainty(dummyXValues, 10)
    expect(xErrorValues).toEqual([0.9, 1.8, 2.7, 3.6, 4.5, 5.5, 4.4, 3.3, 2.2, 1.1])
  })

  it('check if the corret y values is asigned to a return array for the continooús error bars', () => {
    const store = useDigitalBoreholeStore()
    const dummyYValues = [1, 2, 3, 4]
    const yErrorValues = store.calcYValuesContinuousErrorBars(dummyYValues)
    expect(yErrorValues).toEqual([1, 2, 3, 4, 4, 3, 2, 1])
  })
})

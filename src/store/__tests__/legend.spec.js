import { describe, beforeEach, it, expect } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useLegendStore } from '@/store/legend'

describe('Legend Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('Set legend object to store information on classes and correlated colors', () => {
    const legend = useLegendStore()
    expect(legend.legend).toBeNull()
    const classes = [-10.0, 20.0, 30.5, 40.6]
    const colors = ['#a6611a', '#dfc27d', '#80cdc1']
    const expectedLegendObject = {
      0: {
        id: 0,
        text: '-10.00 - 20.00',
        colorHEX: '#a6611a'
      },
      1: {
        id: 1,
        text: '20.00 - 30.50',
        colorHEX: '#dfc27d'
      },
      2: {
        id: 2,
        text: '30.50 - 40.60',
        colorHEX: '#80cdc1'
      }
    }
    legend.setLegendObject(classes, colors)
    expect(legend.legend).toEqual(expectedLegendObject)
  })

  it('Reset legend object to null when single fill color is selected', () => {
    const legend = useLegendStore()
    const classes = [-10.0, 20.0, 30.5, 40.6]
    const colors = ['#a6611a', '#dfc27d', '#80cdc1']
    legend.setLegendObject(classes, colors)
    legend.setLegendToNull()
    expect(legend.legend).toBeNull()
  })
})

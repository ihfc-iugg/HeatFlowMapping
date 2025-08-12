import { describe, beforeEach, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { use2DProfileStore } from '../2DProfile.js'
import { exp } from 'mathjs'

// Mock settings, sphericalTigonometry, schema, relief stores
vi.mock('@/store/settings', () => ({
  useSettingsStore: () => ({
    activeBaseLayer: 'osm'
  })
}))
vi.mock('@/store/sphericalTrigonometry', () => ({
  useSphericalTrigonometry: () => ({})
}))
vi.mock('@/store/dataSchema', () => ({
  useDataSchemaStore: () => ({})
}))
vi.mock('@/store/2DProfileRelief', () => ({
  use2DProfileReliefStore: () => ({})
}))

describe('2d profile store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  // test initial state
  it('check initializes with correct state', () => {
    const store = use2DProfileStore()
    // attributes
    expect(store.selectedProperty1).toBe('q')
    expect(store.threshold).toBe(25)
    expect(store.line).toBeNull()
    expect(store.pointsWithinDistance).toHaveLength(0)
    expect(store.plot).toBeNull()
    expect(store.triggerPopup).toBeFalsy()
    expect(store.triggerDeletePopup).toBeFalsy()
    // methods
    expect(store.toggleTriggerPopup).toBeDefined()
    expect(store.setPointsWithinDistance).toBeDefined()
    expect(store.generatePaintProperty).toBeDefined()
    expect(store.lineStringToPointFeatureCollection).toBeDefined()
    expect(store.addLineLabelToMap).toBeDefined()
    expect(store.projectingDataOnLine).toBeDefined()
    expect(store.drawProfile).toBeDefined()
  })

  // test functions
  it('toggeling popup trigger', () => {
    const store = use2DProfileStore()
    expect(store.triggerPopup).toBeFalsy()
    store.toggleTriggerPopup()
    expect(store.triggerPopup).toBeTruthy()
    store.toggleTriggerPopup()
    expect(store.triggerPopup).toBeFalsy()
  })

  // setPointsWithinDistance(features, referenceLine, threshold)
  it('check if points with less distance than 25km are set to pointsWihinDistance', () => {
    const store = use2DProfileStore()

    const features = [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0, 0.2] }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [0.1, 0.5] }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [-0.1, 0.8] }
      }
    ]

    const referenceLine = {
      geometry: {
        coordinates: [
          [0, 0],
          [0, 1]
        ]
      }
    }

    store.setPointsWithinDistance(features, referenceLine, 25)
    expect(store.pointsWithinDistance).toHaveLength(3)
  })

  it('check if points with a distance higher than 25km are not set to pointsWihinDistance', () => {
    const store = use2DProfileStore()
    const features = [
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [1, 0.2] }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [1, 0.5] }
      },
      {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [1, 1] }
      }
    ]

    const referenceLine = {
      geometry: {
        coordinates: [
          [0, 0],
          [0, 1]
        ]
      }
    }
    store.setPointsWithinDistance(features, referenceLine, 25)
    expect(store.pointsWithinDistance).toHaveLength(0)
  })

  it('check if points ids are added correctly to maplibre paint property', () => {
    const store = use2DProfileStore()
    const features = [
      {
        type: 'Feature',
        properties: { ID: '1' }
      },
      {
        type: 'Feature',
        properties: { ID: '2' }
      },
      {
        type: 'Feature',
        properties: { ID: '3' }
      }
    ]

    const paintProperty = store.generatePaintProperty(features)
    expect(paintProperty).toHaveLength(4)
    expect(paintProperty[0]).toBe('case')
    expect(paintProperty[1]).toEqual(['in', ['get', 'ID'], ['literal', ['1', '2', '3']]])
    expect(paintProperty[2]).toBe('#FCC480')
  })

  it('set lineString as parameter and check if only the first and last point are selected', () => {
    const store = use2DProfileStore()
    const lineStringCoordinates = [
      [0, 0],
      [1, 1],
      [2, 2]
    ]
    const startEndPoints = store.lineStringToPointFeatureCollection(lineStringCoordinates)

    expect(startEndPoints.features).toHaveLength(2)
    expect(startEndPoints.features[0].geometry.coordinates).toEqual([0, 0])
    expect(startEndPoints.features[1].geometry.coordinates).toEqual([2, 2])
    expect(startEndPoints.features[0].properties.title).toEqual('Start')
    expect(startEndPoints.features[1].properties.title).toEqual('End')
  })

  it('set lineString as parameter and check if only the first and last point are selected', () => {
    const store = use2DProfileStore()
  })
})

import { describe, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDrawStore } from '../draw'
import { exp } from 'mathjs'

describe('draw tools store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('check initial state', () => {
    const store = useDrawStore()
    expect(store.tools).toBeNull()
    expect(store.selectedFeature).toBeNull()
    expect(store.pointMode).toBeDefined()
    expect(store.lineMode).toBeDefined()
    expect(store.polygonMode).toBeDefined()
    expect(store.selectMode).toBeDefined()
    expect(store.setDraw).toBeDefined()
    expect(store.setSelectedFeature).toBeDefined()
    expect(store.getFeatureIdsToRemove).toBeDefined()
    expect(store.lineCoordinatesConstrain).toBeDefined()
  })

  it('set a defined feature as selectedFeature', () => {
    const store = useDrawStore()
    const dummyFeature = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [0, 0] },
      id: '1'
    }
    store.setSelectedFeature(dummyFeature)
    expect(store.selectedFeature).toEqual(dummyFeature)
  })

  it('check if features to remove get detected. All features of same feature type but different id shall be returned', () => {
    const store = useDrawStore()
    const dummyFeature = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [0, 0] },
      id: '1'
    }

    const features = [
      { id: '1', geometry: { type: 'Point' } },
      { id: '2', geometry: { type: 'Point' } },
      { id: '3', geometry: { type: 'LineString' } }
    ]
    const featureIdsToRemove = store.getFeatureIdsToRemove(features, dummyFeature)
    expect(featureIdsToRemove).toEqual(['2'])
  })

  it('check if lineString with more than 2 coordinates get reduced to only start and end point', () => {
    const store = useDrawStore()
    const dummyLineFeature = {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [0, 0],
          [1, 1],
          [2, 2]
        ]
      },
      id: '1'
    }
    const mockTerraDraw = {
      getFeatureId: vi.fn(() => 0)
    }
    const constrainedFeature = store.lineCoordinatesConstrain(dummyLineFeature, mockTerraDraw)
    expect(constrainedFeature.geometry.coordinates).toEqual([
      [0, 0],
      [2, 2]
    ])
    expect(constrainedFeature.id).toBe(0)
  })
})

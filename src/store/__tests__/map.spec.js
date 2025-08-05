import { setActivePinia, createPinia } from 'pinia'
import { useMapStore } from '../map'
import { Map } from 'maplibre-gl'

vi.mock('maplibre-gl', () => ({
  Map: vi.fn().mockImplementation((opts) => ({
    ...opts,
    setRenderWorldCopies: vi.fn()
  }))
}))

// Mock baseMaps and settings stores
vi.mock('../baseMaps', () => ({
  useBaseMapsStore: () => ({
    baseMaps: [
      { id: 'osm', tiles: 'https://osm.org/{z}/{x}/{y}.png', attribution: 'OSM' },
      { id: 'sat', tiles: 'https://sat.org/{z}/{x}/{y}.png', attribution: 'SAT' }
    ]
  })
}))
vi.mock('@/store/settings', () => ({
  useSettingsStore: () => ({
    activeBaseLayer: 'osm'
  })
}))

describe('map store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('initializes with correct state', () => {
    const store = useMapStore()
    expect(store.map).toBeDefined()
    expect(store.isInstantiated).toBe(false)
  })

  it('setMap sets up the map and updates isInstantiated', () => {
    const store = useMapStore()
    const containerElem = document.createElement('div')
    store.setMap(containerElem)
    expect(Map).toHaveBeenCalled()
    expect(store.map).toBeDefined()
    expect(store.isInstantiated).toBe(true)
    expect(store.map.container).toBe(containerElem)
  })

  it('setBaseMapsSource returns correct sources object', () => {
    const store = useMapStore()
    const bm = {
      baseMaps: [
        { id: 'osm', tiles: 'https://osm.org/{z}/{x}/{y}.png', attribution: 'OSM' },
        { id: 'sat', tiles: 'https://sat.org/{z}/{x}/{y}.png', attribution: 'SAT' }
      ]
    }
    const sources = store.setBaseMapsSource(bm)
    expect(sources).toHaveProperty('osm')
    expect(sources).toHaveProperty('sat')
    expect(sources.osm.tiles[0]).toBe('https://osm.org/{z}/{x}/{y}.png')
    expect(sources.sat.attribution).toBe('SAT')
  })

  it('setBaseMapsLayer returns correct layers array with visibility', () => {
    const store = useMapStore()
    const bm = {
      baseMaps: [
        { id: 'osm', tiles: '', attribution: '' },
        { id: 'sat', tiles: '', attribution: '' }
      ]
    }
    // settings.activeBaseLayer is mocked as 'osm'
    const layers = store.setBaseMapsLayer(bm)
    expect(Array.isArray(layers)).toBe(true)
    expect(layers.length).toBe(2)
    expect(layers[0].id).toBe('osm')
    expect(layers[0].layout.visibility).toBe('visible')
    expect(layers[1].id).toBe('sat')
    expect(layers[1].layout.visibility).toBe('none')
  })
})

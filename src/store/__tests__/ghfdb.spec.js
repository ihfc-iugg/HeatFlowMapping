import { describe, beforeEach, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { use } from 'chai'

// Define mocks and test data at the top
const fakeBlob = new Blob(['fake zip data'])
const fakeCSV = 'col1,col2\nval1,val2'
const fakeZip = {
  files: {
    'test.csv': {
      async: vi.fn().mockImplementation((type) => {
        if (type === 'text') return fakeCSV
        throw new Error('unsupported type')
      })
    }
  }
}

// Mock modules BEFORE importing the store
vi.mock('axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: fakeBlob })
  }
}))
vi.mock('jszip', () => ({
  default: {
    loadAsync: vi.fn().mockResolvedValue(fakeZip)
  }
}))
const fakeJSON = { data: [{ a: 1, b: 2 }] }
vi.mock('papaparse', () => ({
  default: {
    parse: vi.fn().mockReturnValue(fakeJSON)
  }
}))

describe('Filter Store', () => {
  let useGHFDBStore, axios, JSZip, Papa

  beforeEach(async () => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
    const storeModule = await import('../ghfdb')
    useGHFDBStore = storeModule.useGHFDBStore
    axios = (await import('axios')).default
    JSZip = (await import('jszip')).default
    Papa = (await import('papaparse')).default
  })

  it('check initial state', () => {
    const store = useGHFDBStore()
    expect(store).toBeDefined()
    expect(store.json).toBeDefined()
    expect(store.geojson).toBeDefined()
    expect(store.inProcess).toBeDefined()
    expect(store.hasCSV).toBeDefined()
    expect(store.successfulConvertion).toBeDefined()
    expect(store.parentProperties).toBeDefined()
    expect(store.toggleInProcess).toBeDefined()
    expect(store.getGhfdbFromAPI).toBeDefined()
    expect(store.csv2JSON).toBeDefined()
    expect(store.json2GeoJSON).toBeDefined()
    expect(store.addGhfdbToMap).toBeDefined()
  })

  it('does toggle function work', () => {
    const store = useGHFDBStore()
    expect(store.inProcess).toBe(true)
    store.toggleInProcess()
    expect(store.inProcess).toBe(false)
  })

  it('fetches zip, extracts csv, and sets hasCSV', async () => {
    const store = useGHFDBStore()
    const csv = await store.getGhfdbFromAPI('http://dummy-url/file.zip')
    expect(csv).toBe(fakeCSV)
    expect(store.hasCSV).toBe(true)
    expect(JSZip.loadAsync).toHaveBeenCalledWith(fakeBlob)
    expect(axios.get).toHaveBeenCalledWith('http://dummy-url/file.zip', { responseType: 'blob' })
  })

  it('parses CSV string to JSON using Papa.parse', async () => {
    const store = useGHFDBStore()
    const csvStr = 'a,b\n1,2'
    const result = await store.csv2JSON(csvStr)
    expect(Papa.parse).toHaveBeenCalledWith(csvStr, { header: true, dynamicTyping: true })
    expect(result).toBe(fakeJSON)
  })

  it('logs error if parsing fails', async () => {
    const store = useGHFDBStore()
    const error = new Error('parse error')
    Papa.parse.mockImplementationOnce(() => {
      throw error
    })
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const result = await store.csv2JSON('bad csv')
    expect(consoleSpy).toHaveBeenCalledWith(error)
    expect(result).toBeUndefined()
    consoleSpy.mockRestore()
  })

  it('return of lon lat coordinates within one array', () => {
    const store = useGHFDBStore()
    const data = [{ long_EW: 1, lat_NS: 2 }]
    const coordinates = store.getCoordinates(data[0])
    expect(coordinates).toEqual([1, 2])
  })

  it('transform json to geojson', async () => {
    const store = useGHFDBStore()
    const properiesToKeep = ['col1', 'col2']
    const data = [
      { col1: 'val11', col2: 'val12', col3: 'val13', long_EW: 1, lat_NS: 1, ID: 1 },
      { col1: 'val21', col2: 'val22', col3: 'val23', long_EW: 2, lat_NS: 2, ID: 2 },
      { col1: 'val31', col2: 'val32', col3: 'va33', long_EW: 3, lat_NS: 3, ID: 3 }
    ]
    const featureCollection = await store.json2GeoJSON(data, properiesToKeep)
    expect(featureCollection).toBeDefined()
    expect(featureCollection.features).toHaveLength(3)
    expect(featureCollection.features[0].geometry.type).toBe('Point')
    expect(featureCollection.features[0].properties).toEqual({ col1: 'val11', col2: 'val12' })
    expect(featureCollection.features[0].geometry.coordinates).toEqual([1, 1])
    expect(featureCollection.features[1].properties).toEqual({ col1: 'val21', col2: 'val22' })
    expect(featureCollection.features[1].geometry.coordinates).toEqual([2, 2])
    expect(featureCollection.features[2].properties).toEqual({ col1: 'val31', col2: 'val32' })
    expect(featureCollection.features[2].geometry.coordinates).toEqual([3, 3])
  })
})

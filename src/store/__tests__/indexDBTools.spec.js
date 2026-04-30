import { describe, beforeEach, it, expect, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useIndexDBStore } from '../indexDBTools'

//TODO: Rewrite tests to properly mock IndexedDB interactions

// Mock IndexedDB
const indexedDB = {
  open: vi.fn(),
  deleteDatabase: vi.fn()
}

const mockDB = {
  createObjectStore: vi.fn(),
  transaction: vi.fn(),
  close: vi.fn(),
  objectStoreNames: {
    contains: vi.fn().mockReturnValue(false)
  }
}

const mockTransaction = {
  objectStore: vi.fn()
}

const mockObjectStore = {
  put: vi.fn(),
  get: vi.fn(),
  delete: vi.fn()
}

// Mock the global indexedDB
vi.stubGlobal('indexedDB', indexedDB)

describe('IndexDB store to handle local data storage', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    // Reset all mocks
    vi.clearAllMocks()

    // Setup default mock implementations
    mockTransaction.objectStore.mockReturnValue(mockObjectStore)
    mockDB.transaction.mockReturnValue(mockTransaction)
  })

  it('check initial state', () => {
    const store = useIndexDBStore()
    expect(store).toBeDefined()
    expect(store.hasGHFDB).toBeNull()
    expect(store.openDB).toBeDefined()
    expect(store.saveData).toBeDefined()
    expect(store.getData).toBeDefined()
    expect(store.removeData).toBeDefined()
  })

  it('successfully opens a database', async () => {
    const store = useIndexDBStore()
    const dbName = 'testDB'
    const storeName = 'testStore'

    // Mock successful database open
    const openRequest = {
      result: mockDB,
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null
    }
    indexedDB.open.mockReturnValue(openRequest)

    // Start the openDB operation
    const openPromise = store.openDB(dbName, storeName)

    // Simulate upgrade needed (this is where object store is created)
    openRequest.onupgradeneeded({
      target: {
        result: mockDB // Add the result property to match IndexedDB's event structure
      }
    })

    // Simulate successful open
    openRequest.onsuccess({ target: openRequest })

    await openPromise

    expect(indexedDB.open).toHaveBeenCalledWith(dbName, 1)
    expect(mockDB.objectStoreNames.contains).toHaveBeenCalledWith(storeName)
    expect(mockDB.createObjectStore).toHaveBeenCalledWith(storeName, {
      keyPath: 'id',
      autoIncrement: true
    })
  })

  // it('successfully saves data to IndexedDB', async () => {
  //   const store = useIndexDBStore()
  //   const dbName = 'testDB'
  //   const storeName = 'testStore'
  //   const testData = { id: 'test', value: 'data' }

  //   // First mock the database open
  //   const openRequest = {
  //     result: mockDB,
  //     onsuccess: null,
  //     onerror: null,
  //     onupgradeneeded: null
  //   }
  //   indexedDB.open.mockReturnValue(openRequest)

  //   // Mock successful put operation
  //   const putRequest = {
  //     onsuccess: null,
  //     onerror: null
  //   }
  //   mockObjectStore.put.mockReturnValue(putRequest)

  //   // Start the saveData operation
  //   const savePromise = store.saveData(dbName, storeName, testData)

  //   // Simulate successful database open
  //   openRequest.onsuccess({ target: openRequest })

  //   // Simulate successful save
  //   putRequest.onsuccess()

  //   // Wait for the promise to resolve
  //   await savePromise

  //   expect(mockObjectStore.put).toHaveBeenCalledWith(testData)
  // })

  // it('successfully retrieves data from IndexedDB', async () => {
  //   const indexDBStore = useIndexDBStore()
  //   const dbName = 'testDB'
  //   const storeName = 'testStore'
  //   const testId = 'test'
  //   const testData = { id: testId, value: 'data' }

  //   // Mock successful get operation
  //   const getRequest = {
  //     result: testData,
  //     onsuccess: null,
  //     onerror: null
  //   }
  //   mockObjectStore.get.mockReturnValue(getRequest)

  //   // Start the getData operation
  //   const getPromise = indexDBStore.getData(dbName, storeName, testId)

  //   // Simulate successful retrieval
  //   getRequest.onsuccess({ target: getRequest })

  //   const result = await getPromise

  //   expect(mockObjectStore.get).toHaveBeenCalledWith(testId)
  //   expect(result).toEqual(testData)
  // })

  // it('successfully removes data from IndexedDB', async () => {
  //   const indexDBStore = useIndexDBStore()
  //   const dbName = 'testDB'
  //   const storeName = 'testStore'
  //   const testId = 'test'

  //   // Mock successful delete operation
  //   const deleteRequest = {
  //     onsuccess: null,
  //     onerror: null
  //   }
  //   mockObjectStore.delete.mockReturnValue(deleteRequest)

  //   // Start the removeData operation
  //   const removePromise = indexDBStore.removeData(dbName, storeName, testId)

  //   // Simulate successful deletion
  //   deleteRequest.onsuccess()

  //   await removePromise

  //   expect(mockObjectStore.delete).toHaveBeenCalledWith(testId)
  // })

  // it('handles database open error', async () => {
  //   const indexDBStore = useIndexDBStore()
  //   const dbName = 'testDB'
  //   const storeName = 'testStore'

  //   // Mock failed database open
  //   const openRequest = {
  //     error: new Error('Failed to open DB'),
  //     onsuccess: null,
  //     onerror: null,
  //     onupgradeneeded: null
  //   }
  //   indexedDB.open.mockReturnValue(openRequest)

  //   // Start the openDB operation and expect it to reject
  //   await expect(indexDBStore.openDB(dbName, storeName)).rejects.toThrow('Failed to open DB')
  // })

  // it('handles save data error', async () => {
  //   const indexDBStore = useIndexDBStore()
  //   const dbName = 'testDB'
  //   const storeName = 'testStore'
  //   const testData = { id: 'test', value: 'data' }

  //   // Mock failed put operation
  //   const putRequest = {
  //     error: new Error('Failed to save data'),
  //     onsuccess: null,
  //     onerror: null
  //   }
  //   mockObjectStore.put.mockReturnValue(putRequest)

  //   // Start the saveData operation and expect it to reject
  //   await expect(indexDBStore.saveData(dbName, storeName, testData)).rejects.toThrow(
  //     'Failed to save data'
  //   )
  // })
})

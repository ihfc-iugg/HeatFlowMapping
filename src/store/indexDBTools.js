import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useIndexDBStore = defineStore('IndexDB', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const hasGHFDB = ref(null)

  /**
   * @description Opens an IndexedDB database and creates an object store if it doesn't exist.
   * @param {String} dbName
   * @param {String} storeName
   * @returns
   */
  function openDB(dbName, storeName) {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, 1)

      request.onupgradeneeded = (event) => {
        const db = event.target.result
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true })
        }
      }

      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * @description Saves data to the IndexedDB.
   * @param {String} dbName
   * @param {String} storeName
   * @param {Object} data
   * @returns {Promise<Boolean>} true if save was successful
   */
  async function saveData(dbName, storeName, data) {
    const db = await openDB(dbName, storeName)
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    store.put(data)

    return new Promise((resolve, reject) => {
      transaction.oncomplete = () => resolve(true)
      transaction.onerror = () => reject(transaction.error)
    })
  }

  /**
   * @description
   * @param {String} dbName
   * @param {String} storeName
   * @param {String} dataId
   * @returns {Promise<Object>} data from the IndexedDB
   */
  async function getData(dbName, storeName, dataId) {
    const db = await openDB(dbName, storeName)
    const transaction = db.transaction([storeName], 'readonly')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.get(dataId)
      request.onsuccess = () => resolve(request.result)
      request.onerror = () => reject(request.error)
    })
  }

  /**
   * @description Removes data from the IndexedDB.
   * @param {String} dbName
   * @param {String} storeName
   * @param {String} dataId
   * @returns {Promise<Boolean>} true if removal was successful
   */
  async function removeData(dbName, storeName, dataId) {
    const db = await openDB(dbName, storeName)
    const transaction = db.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)

    return new Promise((resolve, reject) => {
      const request = store.delete(dataId)
      request.onsuccess = () => resolve(true)
      request.onerror = () => reject(request.error)
    })
  }

  return { hasGHFDB, openDB, saveData, getData, removeData }
})

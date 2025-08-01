import { defineStore } from 'pinia'
import axios from 'axios'

export const useOgcApiToolsStore = defineStore('OGC API tools', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  /**
   * @description queries a value at a specific position using the OGC API.
   * @param {Number} lon
   * @param {Number} lat
   * @param {String} collectionURL
   * @param {String} queryParameter
   * @returns {Promise<Number>} value at the specified position
   */
  async function queryAtPosition(lon, lat, collectionURL, queryParameter) {
    const url = `${collectionURL}/position?f=json&coords=POINT(${lon + '%20' + lat})&parameter-name=${queryParameter}`
    try {
      const response = await axios.get(url)
      return response.data.ranges.z.values[0]
    } catch (error) {
      console.log('rejected', error)
      return
    }
  }

  return { queryAtPosition }
})

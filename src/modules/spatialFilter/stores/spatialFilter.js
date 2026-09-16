import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useApplicationStore } from '@/core/stores/app'
import { v4 as uuidv4 } from 'uuid'

export const useSpatialFilterStore = defineStore('Spatial filter', () => {
  const app = useApplicationStore()
  const activeTab = ref('toolbox') // defualt value
  // const polygon = ref(null)
  const uuid = ref(uuidv4())

  /**
   *
   */
  function addFilterObject() {
    if (app.spatialFilter[uuid.value]) {
      return
    }
    app.spatialFilter[uuid.value] = {
      drawId: null,
      feature: null, // default value
      expression: null
    }
  }

  /**
   *
   * @returns
   */
  function resetFilterObject() {
    app.spatialFilter[uuid.value].drawId = null
    app.spatialFilter[uuid.value].feature = null
    app.spatialFilter[uuid.value].expression = null
  }

  function setDrawID(id) {
    if (app.spatialFilter[uuid]) {
      return console.log('no spatial filter set')
    }
    app.spatialFilter[uuid.value].drawId = id
  }

  /**
   * @description Writes the location filter expression based on the provided GeoJSON object.
   * @param {Object} feature
   */
  function writeFilterExpression(feature) {
    let expression = []

    expression.push('within')
    expression.push(feature)

    return expression
  }

  // /**
  //  * @description adds a new filter to the filters object.
  //  * @param {String} filterId
  //  * @param {String} category - 'attributeFilter' or 'locationFilter'
  //  */
  // function addFilterObject() {
  //   if (!app.filter[uuid.value]) {
  //     app.filter[uuid.value] = {
  //       drawId: null,
  //       feature: null, // default value
  //       expression: null
  //     }
  //   } else {
  //     delete app.filter[uuid.value]
  //   }
  // }

  return {
    activeTab,
    uuid,
    addFilterObject,
    resetFilterObject,
    setDrawID,
    writeFilterExpression
  }
})

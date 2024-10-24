import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMapAppConfig = defineStore('mapAppConfig', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const el = ref(null)
  const dataUrl = ref(null)
  const schemaUrl = ref(null)

  /**
   *
   * @param {*} htmlElement
   */
  function setElement(htmlElement) {
    try {
      el.value = htmlElement
    } catch (error) {
      console.log('Error in setElement: ' + error)
    }
  }

  /**
   *
   * @param {*} attributeName
   * @returns
   */
  function getElementDataAttribut(attributeName) {
    try {
      return el.value.dataset[attributeName]
    } catch (error) {
      console.log('Attribute ' + attributeName + ' not found; ' + error)
    }
  }

  /**
   *
   * @param {*} attributeNAme
   */
  function setDataURL(attributeNAme) {
    dataUrl.value = getElementDataAttribut(attributeNAme)
  }

  /**
   *
   * @param {*} attributeNAme
   */
  function setSchemaURL(attributeNAme) {
    schemaUrl.value = getElementDataAttribut(attributeNAme)
  }

  /**
   *
   */


  return {
    el,
    dataUrl,
    schemaUrl,
    setElement,
    setDataURL,
    setSchemaURL,
  }
})

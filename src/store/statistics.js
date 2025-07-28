import { defineStore } from 'pinia'
import { ref } from 'vue'
import { mean, std, median } from 'mathjs'
import Statistics from 'statistics.js'

export const useStatisticsStore = defineStore('statistics', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const table = ref({
    min: null,
    max: null,
    mean: null,
    std: null,
    median: null,
    skewness: null,
    kurtosis: null
  })

  /**
   * @description Sets the minimum value from the provided values.
   * @param {Array} values
   */
  function setMin(values) {
    table.value.min = Math.min.apply(null, values).toFixed(2)
  }

  /**
   *
   * @param {Array} values
   */
  function setMax(values) {
    table.value.max = Math.max.apply(null, values).toFixed(2)
  }

  /**
   *
   * @param {Array} values
   */
  function setMean(values) {
    table.value.mean = mean(values.filter((n) => n)).toFixed(2)
  }

  /**
   *
   * @param {Array} values
   */
  function setStd(values) {
    table.value.std = std(values.filter((n) => n)).toFixed(2)
  }

  /**
   *
   * @param {Array} values
   */
  function setMedian(values) {
    table.value.median = median(values.filter((n) => n)).toFixed(2)
  }

  /**
   *
   * @param {Array} values
   */
  function setSkewness(values) {
    const stats = new Statistics([])
    table.value.skewness = stats.skewness(values.filter((n) => n)).toFixed(2)
  }

  /**
   *
   * @param {Array} values
   */
  function setKurtosis(values) {
    const stats = new Statistics([])
    table.value.kurtosis = stats.kurtosis(values.filter((n) => n)).toFixed(2)
    console.log('----kurtosis')
    console.log(table.value.kurtosis)
  }

  /**
   *
   * @param {Array} values
   */
  function setTableValues(values) {
    setMin(values)
    setMax(values)
    setMean(values)
    setStd(values)
    setMedian(values)
    setSkewness(values)
    setKurtosis(values)
  }

  return {
    table,
    setMin,
    setMax,
    setMean,
    setStd,
    setMedian,
    setSkewness,
    setKurtosis,
    setTableValues
  }
})

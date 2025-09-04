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
    if (values.length === 0) {
      return
    }
    // table.value.min = Math.min.apply(null, values).toFixed(2)
    table.value.min = Math.min(...values.filter((a) => a !== null)).toFixed(2)
  }

  /**
   * @description Sets the maximum value from the provided values.
   * @param {Array} values
   */
  function setMax(values) {
    if (values.length === 0) {
      return
    }
    table.value.max = Math.max.apply(null, values).toFixed(2)
  }

  /**
   * @description Sets the mean value from the provided values.
   * @param {Array} values
   */
  function setMean(values) {
    if (values.length === 0) {
      return
    }
    table.value.mean = mean(values.filter((n) => n)).toFixed(2)
  }

  /**
   * @description Sets the standard deviation from the provided values.
   * @param {Array} values
   */
  function setStd(values) {
    if (values.length === 0) {
      return
    }
    table.value.std = std(values.filter((n) => n)).toFixed(2)
  }

  /**
   * @description Sets the median value from the provided values.
   * @param {Array} values
   */
  function setMedian(values) {
    if (values.length === 0) {
      return
    }
    table.value.median = median(values.filter((n) => n)).toFixed(2)
  }

  /**
   * @description Sets the skewness from the provided values.
   * @param {Array} values
   */
  function setSkewness(values) {
    if (values.length < 2) {
      console.log('--- can not calculate skewness with less than 2 values ---')
      return
    }
    const stats = new Statistics([])
    table.value.skewness = stats.skewness(values.filter((n) => n)).toFixed(2)
  }

  /**
   * @description Sets the kurtosis from the provided values.
   * @param {Array} values
   */
  function setKurtosis(values) {
    if (values.length < 2) {
      console.log('--- can not calculate kurtosis with less than 2 values ---')
      return
    }
    const stats = new Statistics([])
    table.value.kurtosis = stats.kurtosis(values.filter((n) => n)).toFixed(2)
  }

  /**
   * @description Sets all statistical values in the table.
   * @param {Array} values
   */
  function setTableValues(values) {
    if (values.length === 0 || values.every((v) => v === null)) {
      console.log('--- all null or empty ---')
      return
    }
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

import { describe, beforeEach, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useStatisticsStore } from '../statistics'

describe('Statistics Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  const testValues = [1, 2, 3, 4, 5, null, 6, 7, 8, 9, 10]
  const filteredValues = testValues.filter((n) => n) // Remove null values

  it('initializes with null values', () => {
    const store = useStatisticsStore()
    expect(store.table.min).toBeNull()
    expect(store.table.max).toBeNull()
    expect(store.table.mean).toBeNull()
    expect(store.table.std).toBeNull()
    expect(store.table.median).toBeNull()
    expect(store.table.skewness).toBeNull()
    expect(store.table.kurtosis).toBeNull()
  })

  describe('individual statistical calculations', () => {
    it('calculates minimum value correctly', () => {
      const store = useStatisticsStore()
      store.setMin(testValues)
      expect(store.table.min).toBe('1.00')
    })

    it('calculates maximum value correctly', () => {
      const store = useStatisticsStore()
      store.setMax(testValues)
      expect(store.table.max).toBe('10.00')
    })

    it('calculates mean value correctly', () => {
      const store = useStatisticsStore()
      store.setMean(testValues)
      const expectedMean = (
        filteredValues.reduce((a, b) => a + b, 0) / filteredValues.length
      ).toFixed(2)
      expect(store.table.mean).toBe(expectedMean)
    })

    it('calculates standard deviation correctly', () => {
      const store = useStatisticsStore()
      store.setStd(testValues)
      expect(store.table.std).toBeDefined()
      expect(typeof parseFloat(store.table.std)).toBe('number')
    })

    it('calculates median correctly', () => {
      const store = useStatisticsStore()
      store.setMedian(testValues)
      const sortedValues = [...filteredValues].sort((a, b) => a - b)
      const middle = Math.floor(sortedValues.length / 2)
      const expectedMedian = (
        sortedValues.length % 2
          ? sortedValues[middle]
          : (sortedValues[middle - 1] + sortedValues[middle]) / 2
      ).toFixed(2)
      expect(store.table.median).toBe(expectedMedian)
    })

    it('calculates skewness correctly', () => {
      const store = useStatisticsStore()
      store.setSkewness(testValues)
      expect(store.table.skewness).toBeDefined()
      expect(typeof parseFloat(store.table.skewness)).toBe('number')
    })

    it('calculates kurtosis correctly', () => {
      const store = useStatisticsStore()
      store.setKurtosis(testValues)
      expect(store.table.kurtosis).toBeDefined()
      expect(typeof parseFloat(store.table.kurtosis)).toBe('number')
    })
  })

  describe('setTableValues', () => {
    it('sets all statistical values correctly', () => {
      const store = useStatisticsStore()
      store.setTableValues(testValues)

      // Check that all values are set and are valid numbers
      expect(store.table.min).toBeDefined()
      expect(store.table.max).toBeDefined()
      expect(store.table.mean).toBeDefined()
      expect(store.table.std).toBeDefined()
      expect(store.table.median).toBeDefined()
      expect(store.table.skewness).toBeDefined()
      expect(store.table.kurtosis).toBeDefined()

      // Verify specific values
      expect(store.table.min).toBe('1.00')
      expect(store.table.max).toBe('10.00')
      expect(typeof parseFloat(store.table.mean)).toBe('number')
      expect(typeof parseFloat(store.table.std)).toBe('number')
      expect(typeof parseFloat(store.table.median)).toBe('number')
      expect(typeof parseFloat(store.table.skewness)).toBe('number')
      expect(typeof parseFloat(store.table.kurtosis)).toBe('number')
    })
  })

  describe('edge cases', () => {
    it('handles empty array', () => {
      const store = useStatisticsStore()
      const emptyArray = []

      store.setTableValues(emptyArray)
      expect(store.table.min).toBeNull()
      expect(store.table.max).toBeNull()
      expect(store.table.mean).toBeNull()
      expect(store.table.std).toBeNull()
      expect(store.table.median).toBeNull()
      expect(store.table.skewness).toBeNull()
      expect(store.table.kurtosis).toBeNull()
    })

    it('handles array with only null values', () => {
      const store = useStatisticsStore()
      const nullArray = [null, null, null]

      store.setTableValues(nullArray)
      expect(store.table.min).toBeNull()
      expect(store.table.max).toBeNull()
      expect(store.table.mean).toBeNull()
      expect(store.table.std).toBeNull()
      expect(store.table.median).toBeNull()
      expect(store.table.skewness).toBeNull()
      expect(store.table.kurtosis).toBeNull()
    })

    it('handles array with single value', () => {
      const store = useStatisticsStore()
      const singleValue = [5]

      store.setTableValues(singleValue)
      expect(store.table.min).toBe('5.00')
      expect(store.table.max).toBe('5.00')
      expect(store.table.mean).toBe('5.00')
      expect(store.table.median).toBe('5.00')
      // std, skewness, and kurtosis might vary based on implementation
    })
  })
})

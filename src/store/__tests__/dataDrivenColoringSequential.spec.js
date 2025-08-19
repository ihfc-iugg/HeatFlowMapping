import { describe, beforeEach, it, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataDrivenColoringSequentialStore } from '@/store/dataDrivenColoringSequential'
import * as classificationFn from '@/store/dataDrivenColoringSequential'
import { useDataSchemaStore } from '../dataSchema'

describe('data driven coloring store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    global.classes = { value: null }
  })
  it('check inital state of store', () => {
    const store = useDataDrivenColoringSequentialStore()
    expect(store).toBeDefined()
    expect(store.classes).toBeDefined()
    expect(store.classificationTypes).toBeDefined()
    expect(store.classification).toBeDefined()
    expect(store.classification).toEqual(store.classificationTypes[0])
    expect(store.isNumber).toBeDefined()
    expect(store.propertyValuesToArray).toBeDefined()
    expect(store.calcJenksNaturalBreaks).toBeDefined()
    expect(store.calcQuantilBreaks).toBeDefined()
    expect(store.calcEqualIntervalBreaks).toBeDefined()
    expect(store.setClassBreaks).toBeDefined()
    expect(store.getClasses).toBeDefined()
    expect(store.generatePaintProperty).toBeDefined()
  })

  it('check if helper functin if numbers are recognised corretly', () => {
    const store = useDataDrivenColoringSequentialStore()
    expect(store.isNumber(1)).toBe(true)
    expect(store.isNumber(1.0)).toBe(true)
    expect(store.isNumber('1,0')).toBe(false)
    expect(store.isNumber('a')).toBe(false)
    expect(store.isNumber('1a')).toBe(false)
  })

  it('check if property values from a array of object are collected and retued corretly as array', () => {
    const store = useDataDrivenColoringSequentialStore()
    const featureCollection = {
      features: [
        { type: 'Feature', properties: { firstProperty: 1, secondProperty: 11 } },
        { type: 'Feature', properties: { firstProperty: 2, secondProperty: '' } },
        { type: 'Feature', properties: { firstProperty: 3, secondProperty: 33 } }
      ]
    }
    expect(store.propertyValuesToArray(featureCollection, 'firstProperty')).toEqual([1, 2, 3])
    expect(store.propertyValuesToArray(featureCollection, 'secondProperty')).toEqual([11, 33])
  })

  it('Check if length of jenks breaks array is correct. Jenks function is from  third party lib', () => {
    const store = useDataDrivenColoringSequentialStore()
    const featureCollection = {
      features: [
        { type: 'Feature', properties: { firstProperty: 1 } },
        { type: 'Feature', properties: { firstProperty: 2 } },
        { type: 'Feature', properties: { firstProperty: 3 } },
        { type: 'Feature', properties: { firstProperty: 4 } }
      ]
    }
    expect(store.calcJenksNaturalBreaks(featureCollection, 'firstProperty', 3)).toHaveLength(4)
    expect(store.calcJenksNaturalBreaks(featureCollection, 'firstProperty', 3)[0]).toBe(1)
    expect(store.calcJenksNaturalBreaks(featureCollection, 'firstProperty', 3).at(-1)).toBe(4)
  })

  it('Check if length of quantil breaks array is correct. Quantil function is from  third party lib', () => {
    const store = useDataDrivenColoringSequentialStore()
    const featureCollection = {
      features: [
        { type: 'Feature', properties: { firstProperty: 1 } },
        { type: 'Feature', properties: { firstProperty: 2 } },
        { type: 'Feature', properties: { firstProperty: 3 } },
        { type: 'Feature', properties: { firstProperty: 4 } }
      ]
    }
    expect(store.calcQuantilBreaks(featureCollection, 'firstProperty', 3)).toHaveLength(4)
    expect(store.calcQuantilBreaks(featureCollection, 'firstProperty', 3)[0]).toBe(1)
    expect(store.calcQuantilBreaks(featureCollection, 'firstProperty', 3).at(-1)).toBe(4)
  })

  it('Check if equal breaks array is correct and if steps between breaks are equal.', () => {
    const store = useDataDrivenColoringSequentialStore()
    const featureCollection = {
      features: [
        { type: 'Feature', properties: { firstProperty: 10 } },
        { type: 'Feature', properties: { firstProperty: 20 } },
        { type: 'Feature', properties: { firstProperty: 30 } },
        { type: 'Feature', properties: { firstProperty: 40 } }
      ]
    }

    const quantilBrekas = store.calcQuantilBreaks(featureCollection, 'firstProperty', 3)
    expect(quantilBrekas).toHaveLength(4)
    expect(quantilBrekas[1] - quantilBrekas[0]).toBe(10)
    expect(quantilBrekas[2] - quantilBrekas[1]).toBe(10)
    expect(quantilBrekas[3] - quantilBrekas[2]).toBe(10)
    expect(quantilBrekas[0]).toBe(10)
    expect(quantilBrekas.at(-1)).toBe(40)
  })

  it('check if expected paintProperty is generated for data coloring', () => {
    const store = useDataDrivenColoringSequentialStore()
    const paintProperty = store.generatePaintProperty(
      'firstProperty',
      [1, 2, 3, 4],
      ['#ff0000', '#00ff00', '#0000ff']
    )
    expect(paintProperty).toEqual([
      'step',
      ['get', 'firstProperty'],
      '#ff0000',
      2,
      '#00ff00',
      3,
      '#0000ff'
    ])
  })
})

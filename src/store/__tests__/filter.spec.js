import { describe, beforeEach, it, expect } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useFilterStore } from '@/store/filter'

describe('Filter Store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('get new empty filter object value', () => {
    const filter = useFilterStore()
    const testObject = filter.getNewFilterObject()
    expect(testObject).toStrictEqual({
      selectedProperty: null,
      selectedPropertyType: null,
      selectedValues: null,
      expression: null
    })
  })

  it('add and remove filter object to attribute filter', () => {
    const filter = useFilterStore()
    expect(Object.keys(filter.filters.attributeFilter).length).toBe(0)
    filter.addFilter('1', 'attributeFilter')
    expect(Object.keys(filter.filters.attributeFilter).length).toBe(1)
    expect(filter.filters.attributeFilter).toStrictEqual({
      1: {
        selectedProperty: null,
        selectedPropertyType: null,
        selectedValues: null,
        expression: null
      }
    })
    filter.removeFilterElement('1', 'attributeFilter')
    expect(Object.keys(filter.filters.attributeFilter).length).toBe(0)
    expect(filter.reachedLimit).toBe(false)
    for (let ix = 0; ix < 12; ix++) {
      filter.addFilter(ix, 'attributeFilter')
    }
    expect(Object.keys(filter.filters.attributeFilter).length).toBe(10)
    expect(filter.reachedLimit).toBe(true)
  })

  it('add and remove filter object to location filter', () => {
    const filter = useFilterStore()
    expect(Object.keys(filter.filters.locationFilter).length).toBe(0)
    filter.addFilter('1', 'locationFilter')
    expect(Object.keys(filter.filters.locationFilter).length).toBe(1)
    expect(filter.filters.locationFilter).toStrictEqual({
      1: {
        selectedProperty: null,
        selectedPropertyType: null,
        selectedValues: null,
        expression: null
      }
    })
    filter.removeFilterElement('1', 'locationFilter')
    expect(Object.keys(filter.filters.locationFilter).length).toBe(0)
  })

  it('sum up filter expressions of single filters to joint MapLibre filter expression', () => {
    const filter = useFilterStore()
    filter.addFilter('test1', 'attributeFilter')
    filter.filters.attributeFilter['test1'].expression = [
      'all',
      ['>=', ['get', 'q'], -3.85],
      ['<=', ['get', 'q'], 136.01]
    ]
    const expression = filter.writeFilterExpression()
    expect(expression).toEqual(
      expect.arrayContaining(
        ['all'],
        ['all', ['>=', ['get', 'q'], -3.85], ['<=', ['get', 'q'], 136.01]]
      )
    )
  })
})

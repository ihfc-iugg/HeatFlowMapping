import { describe, beforeEach, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataDrivenColoringQualitativeStore } from '@/store/dataDrivenColoringQualitative.js'
import { useDataSchemaStore } from '../dataSchema'

describe('data driven coloring store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })
  it('check inital state of store', () => {
    const store = useDataDrivenColoringQualitativeStore()

    expect(store).toBeDefined()
    expect(store.classes).toBeDefined()
    expect(store.getClassesFromSchema).toBeDefined()
    expect(store.generatePaintProperty).toBeDefined()
  })

  it('check if legal values are collected from schema for a specified property', () => {
    const store = useDataDrivenColoringQualitativeStore()
    const schemaStore = useDataSchemaStore()

    const mockSchema = {
      properties: {
        testProperty: { oneOf: [{ enum: ['class1', 'class2', 'class3'] }] }
      }
    }
    schemaStore.dataSchema = mockSchema
    expect(store.getClassesFromSchema('testProperty')).toEqual(['class1', 'class2', 'class3'])
  })

  it('check if a valid maplibre paintProperty is generated', () => {
    const store = useDataDrivenColoringQualitativeStore()
    const property = 'testProperty'
    const classes = ['class1', 'class2', 'class3']
    const colors = ['#ff0000', '#00ff00', '#0000ff']

    const paintProperty = store.generatePaintProperty(property, classes, colors)
    expect(paintProperty).toEqual([
      'match',
      ['get', 'testProperty'],
      'class1',
      '#ff0000',
      'class2',
      '#00ff00',
      'class3',
      '#0000ff',
      '#ccc'
    ])
  })
})

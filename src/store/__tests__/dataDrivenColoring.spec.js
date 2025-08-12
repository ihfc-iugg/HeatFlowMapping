import { describe, beforeEach, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

import { useDataCrivenColoringStore } from '@/store/dataDrivenColoring.js'
import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useMapStore } from '@/store/map'
import { useDataDrivenColoringSequentialStore } from '@/store/dataDrivenColoringSequential'
import { useDataDrivenColoringQualitativeStore } from '@/store/dataDrivenColoringQualitative'
import { useGHFDBStore } from '@/store/ghfdb'

describe('data driven coloring store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('check initializes with correct state for attributes', () => {
    const store = useDataCrivenColoringStore()
    // attributes
    expect(store.selectedProperty).toBeNull()
    expect(store.propertyDataType).toBeNull()
    expect(store.natureOfData).toBeNull()
    expect(store.numberOfClasses).toEqual(4)
    expect(store.classes).toBeNull()
    expect(store.colorPaletteOptions).toBeNull()
    expect(store.colorPalette).toBeNull()
    expect(store.paintProperty).toBeNull()
    // methods
    expect(store.getPropertyDataType).toBeDefined()
    expect(store.setPropertyDataType).toBeDefined()
    expect(store.setNatureOfData).toBeDefined()
    expect(store.setNumberOfClasses).toBeDefined()
    expect(store.setClasses).toBeDefined()
    expect(store.setColorPaletteOptions).toBeDefined()
    expect(store.generatePaintProperty).toBeDefined()
  })

  it('check if data type of property is detected correctly', () => {
    const store = useDataCrivenColoringStore()
    // Mock data schema
    let mockSchema = {
      properties: {
        testProperty: { type: 'number' }
      }
    }
    const schemaStore = useDataSchemaStore()
    schemaStore.dataSchema = mockSchema
    const typeNumber = store.getPropertyDataType('testProperty')
    expect(typeNumber).toBe('number')

    mockSchema = {
      properties: {
        testProperty: {}
      }
    }

    schemaStore.dataSchema = mockSchema
    const typeUndefined = store.getPropertyDataType('testProperty')
    expect(typeUndefined).toBe('undefined')
  })

  it('check if nature of data is selected correctly according to data type', () => {
    const store = useDataCrivenColoringStore()
    store.setNatureOfData('number')
    expect(store.natureOfData).toBe('sequential')
    store.setNatureOfData('undefined')
    expect(store.natureOfData).toBe('qualitative')
    store.setNatureOfData('boolean')
    expect(store.natureOfData).toBe('qualitative')
  })

  it('check if number of classes is set correctly', () => {
    const store = useDataCrivenColoringStore()
    const qualitativeDataStore = useDataDrivenColoringQualitativeStore()
    qualitativeDataStore.classes = ['class1', 'class2', 'class3']

    store.setPropertyDataType('number')
    store.setNumberOfClasses(store.propertyDataType, '')
    expect(store.numberOfClasses).toEqual(4)

    store.setPropertyDataType('boolean')
    store.setNumberOfClasses(store.propertyDataType, '')
    expect(store.numberOfClasses).toEqual(3)

    store.setPropertyDataType('undefined')
    const mockSchema = {
      properties: {
        testProperty: { oneOf: [{ enum: ['class1', 'class2', 'class3'] }] }
      }
    }
    const schemaStore = useDataSchemaStore()
    schemaStore.dataSchema = mockSchema
    store.setNumberOfClasses(store.propertyDataType, 'testProperty')
    expect(store.numberOfClasses).toEqual(3)
  })

  it('check if classes for legend and classification are set correctly', () => {
    const store = useDataCrivenColoringStore()
    const qualitativeStore = useDataDrivenColoringQualitativeStore()
    const sequentialStore = useDataDrivenColoringSequentialStore()
    const ghfdbStore = useGHFDBStore()

    store.setPropertyDataType('number')
    store.selectedProperty = 'q'
    ghfdbStore.geojson = {
      features: [
        { properties: { q: 1 } },
        { properties: { q: 2 } },
        { properties: { q: 3 } },
        { properties: { q: 4 } },
        { properties: { q: 5 } }
      ]
    }
    console.log(ghfdbStore.geojson)
    store.setClasses(store.propertyDataType, store.selectedProperty)
    expect(store.classes).toEqual([1, 2, 3, 4, 5])

    store.setPropertyDataType('undefined')
    const mockSchema = {
      properties: {
        testProperty: { oneOf: [{ enum: ['class1', 'class2', 'class3'] }] }
      }
    }
    const schemaStore = useDataSchemaStore()
    schemaStore.dataSchema = mockSchema
    store.setClasses(store.propertyDataType, 'testProperty')
    expect(store.classes).toEqual(qualitativeStore.getClassesFromSchema('testProperty'))

    store.setPropertyDataType('boolean')
    store.setClasses(store.propertyDataType, '')
    expect(store.classes).toEqual(['[Yes]', '[No]', 'undefined'])
  })

  it('check if classes are returned', () => {
    const store = useDataCrivenColoringStore()
    store.classes = [1, 2, 3, 4]

    expect(store.getClasses()).toEqual([1, 2, 3, 4])
  })

  it('check if correct color palette from color brewer is set', () => {
    const store = useDataCrivenColoringStore()
    store.setColorPaletteOptions('sequential', 3)
    let nameOfColorSchemas = store.colorPaletteOptions.map((option) => option.name)

    // results according to https://colorbrewer2.org/#type=sequential&scheme=OrRd&n=3
    expect(nameOfColorSchemas).toEqual([
      'BuGn',
      'BuPu',
      'GnBu',
      'OrRd',
      'PuBu',
      'PuBuGn',
      'PuRd',
      'RdPu',
      'YlGn',
      'YlGnBu',
      'YlOrBr',
      'YlOrRd'
    ])

    // max number of classes for nature of data "sequentional" is 12
    expect(store.setColorPaletteOptions('sequential', 12)).toThrowError

    store.setColorPaletteOptions('qualitative', 3)
    nameOfColorSchemas = store.colorPaletteOptions.map((option) => option.name)
    expect(nameOfColorSchemas).toEqual([
      'Accent',
      'Dark2',
      'Paired',
      'Pastel1',
      'Pastel2',
      'Set1',
      'Set2',
      'Set3'
    ])
  })
})

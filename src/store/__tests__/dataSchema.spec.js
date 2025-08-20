import { describe, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useDataSchemaStore } from '@/store/dataSchema'

describe('data driven coloring store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('check initial state of store', () => {
    const store = useDataSchemaStore()

    expect(store).toBeDefined()
    expect(store.dataSchema).toBeDefined()
    expect(store.dataVersion).toBeDefined()
    expect(store.selectableProperties).toBeDefined()
    expect(store.numberProperties).toBeDefined()
    expect(store.isSchemaLoading).toBeDefined()

    expect(store.createVueMultiselectOption).toBeDefined()
    expect(store.isPropertySelectable).toBeDefined()
    expect(store.setSelectableProperties).toBeDefined()
    expect(store.setNumericProperties).toBeDefined()
    expect(store.fetchAPIDataSchema).toBeDefined()
  })

  it('check all conditions which should lead to false', () => {
    const store = useDataSchemaStore()
    const schemaDummy = {
      properties: {
        uniqueStringValues: { type: 'string' },
        sequentialValues: { type: 'integer', minimum: 10 },
        details: { type: 'object' }
      }
    }

    expect(store.isPropertySelectable(schemaDummy, 'uniqueStringValues')).toBeFalsy()
    expect(store.isPropertySelectable(schemaDummy, 'sequentialValues')).toBeFalsy()
    expect(store.isPropertySelectable(schemaDummy, 'details')).toBeFalsy()
  })

  it('check if expacted values result in true', () => {
    const store = useDataSchemaStore()
    const schemaDummy = {
      properties: {
        qualitativeData1: { type: 'string', enum: ['A', 'B', 'C'] },
        qualitativeData2: { type: 'boolean' },
        sequentialValues: { type: 'integer', minimum: 10, maximum: 100 }
      }
    }

    expect(store.isPropertySelectable(schemaDummy, 'qualitativeData1')).toBeTruthy()
    expect(store.isPropertySelectable(schemaDummy, 'qualitativeData2')).toBeTruthy()
    expect(store.isPropertySelectable(schemaDummy, 'sequentialValues')).toBeTruthy()
  })

  it('check if the correct information of properties are gathered to make them suitable for the VueMultiselection Component', () => {
    const store = useDataSchemaStore()
    const schemaDummy = {
      properties: {
        qualitativeData1: { type: 'string', title: 'Qualitative Data 1' },
        qualitativeData2: { type: 'string' }
      }
    }

    expect(store.createVueMultiselectOption(schemaDummy, 'qualitativeData1')).toEqual({
      title: 'Qualitative Data 1',
      key: 'qualitativeData1'
    })
    expect(() => store.createVueMultiselectOption(schemaDummy, 'qualitativeData2')).toThrowError(
      new Error('No title found for property: qualitativeData2')
    )
  })

  it('check if only number properties are set', () => {
    const store = useDataSchemaStore()
    const schemaDummy = {
      properties: {
        numberData1: { type: 'number', title: 'Qualitative Data 1' },
        numberData2: { type: 'string' },
        numberData2: {}
      }
    }
    store.dataSchema = schemaDummy
    store.setNumericProperties(schemaDummy.properties)
    expect(store.numberProperties).toEqual([{ title: 'Qualitative Data 1', key: 'numberData1' }])
  })

  it('fetches and sets schema, version, selectable and numeric properties', async () => {
    const store = useDataSchemaStore()

    // Mock $RefParser.dereference
    const mockApiSchema = {
      components: {
        schemas: {
          Measurement: {
            properties: {
              temp: { type: 'number', title: 'Temperature', minimum: 0, maximum: 100 },
              name: { type: 'string', title: 'Name' },
              value: { type: 'number', title: 'Value', minimum: 0, maximum: 100 }
            }
          }
        }
      },
      info: { version: '1.2.3' }
    }
    vi.stubGlobal('$RefParser', {
      dereference: vi.fn().mockResolvedValue(mockApiSchema)
    })

    // Clear any previous state
    store.dataSchema = null
    store.dataVersion = null
    store.selectableProperties = []
    store.numberProperties = []
    store.isSchemaLoading = null

    await store.fetchAPIDataSchema('http://dummy-url/schema.json')

    expect(store.dataSchema).toEqual(mockApiSchema.components.schemas.Measurement)
    expect(store.dataVersion).toBe('ghfdb1.2.3')
    // Only temp and value are selectable (name is string without enum)
    expect(store.selectableProperties).toEqual([
      { title: 'Temperature', key: 'temp' },
      { title: 'Value', key: 'value' }
    ])

    expect(store.numberProperties).toEqual([
      { title: 'Temperature', key: 'temp' },
      { title: 'Value', key: 'value' }
    ])
    expect(store.isSchemaLoading).toBe(false)
  })

  it('logs error if dereferencing fails', async () => {
    const store = useDataSchemaStore()
    const errorSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.stubGlobal('$RefParser', {
      dereference: vi.fn().mockRejectedValue(new Error('fail'))
    })

    await store.fetchAPIDataSchema('http://fake-url/schema.json')
    expect(errorSpy).toHaveBeenCalledWith(
      expect.stringContaining('Error in dereferencing api schema:')
    )
    errorSpy.mockRestore()
  })
})

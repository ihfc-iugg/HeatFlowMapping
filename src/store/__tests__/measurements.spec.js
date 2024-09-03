import { describe, beforeEach, vi } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useMeasurementStore } from '../measurements'
import { data } from 'jquery'

describe('Measurements (for data and schema) store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('_collectPntAttributes: collect necessary information of each heat flow point to transfer into GeoJSON point feature', () => {
    const measurements = useMeasurementStore()
    const siteObject = {
      sample: { location: { point: { coordinates: [51.2, 1.02] } } },
      id: '1',
      total_depth_MD: 10,
      q: 10,
      q_uncertainty: 10
    }
    const collectedAttributes = measurements._collectPntAttributes(siteObject)
    expect(collectedAttributes).toStrictEqual({
      id: '1',
      geometry: { coordinates: [51.2, 1.02] },
      properties: { total_depth_MD: 10, q: 10, q_uncertainty: 10 }
    })
  })

  it('_writePntFeature: bring collected point attributes into valid geojson format', () => {
    const measurements = useMeasurementStore()
    const pointAttributes = {
      id: '1',
      geometry: { coordinates: [51.2, 1.02] },
      properties: { total_depth_MD: 10, q: 10, q_uncertainty: 10 }
    }
    const pointFeature = measurements._writePntFeature(pointAttributes)
    expect(pointFeature).toStrictEqual({
      id: '1',
      type: 'Feature',
      geometry: { coordinates: [51.2, 1.02], type: 'Point' },
      properties: { total_depth_MD: 10, q: 10, q_uncertainty: 10 }
    })
  })

  it('_writePntFeature: invalid geojson point feature (too much coordinates), get error in console', () => {
    const measurements = useMeasurementStore()
    const pointAttributes = {
      id: '1',
      geometry: { coordinates: [1, 1, 1, 1] },
      properties: { total_depth_MD: 10, q: 10, q_uncertainty: 10 }
    }
    expect(() => measurements._writePntFeature(pointAttributes).toThrowError())
  })

  it('_writeFeatureCollection: bring collected features into validated GeoJSON FeatureCollection', () => {
    const measurements = useMeasurementStore()
    const featuresArray = [
      {
        id: '1',
        type: 'Feature',
        geometry: { coordinates: [1, 1], type: 'Point' },
        properties: { q: 10 }
      },
      {
        id: '2',
        type: 'Feature',
        geometry: { coordinates: [1, 1], type: 'Point' },
        properties: { q: 10 }
      }
    ]
    const featureCollection = measurements._writeFeatureCollection(featuresArray)
    expect(featureCollection).toStrictEqual({
      type: 'FeatureCollection',
      features: [
        {
          id: '1',
          type: 'Feature',
          geometry: { coordinates: [1, 1], type: 'Point' },
          properties: { q: 10 }
        },
        {
          id: '2',
          type: 'Feature',
          geometry: { coordinates: [1, 1], type: 'Point' },
          properties: { q: 10 }
        }
      ]
    })
  })

  it('_writeFeatureCollection: invalid geojson featurecollection should throw error. Features are object not array', () => {
    const measurements = useMeasurementStore()
    const featuresObject = {
      pnt1: {
        id: '1',
        type: 'Feature',
        geometry: { coordinates: [1, 1], type: 'Point' },
        properties: { q: 10 }
      },
      pnt2: {
        id: '2',
        type: 'Feature',
        geometry: { coordinates: [1, 1], type: 'Point' },
        properties: { q: 10 }
      }
    }
    expect(() => measurements._writeFeatureCollection(featuresArray).toThrowError())
  })

  it('_isPropertySelectable: should return false because type equals String and has no additional attribute for enum and is not suitable for selection like multiselect', () => {
    const measurements = useMeasurementStore()
    // relevant parts for testing from schema file
    const dataSchema = {
      properties: {
        modified: {
          type: 'string',
          format: 'date-time',
          readOnly: true,
          description: 'When this record was last modified.'
        }
      }
    }
    const value = measurements._isPropertySelectable(dataSchema, 'modified')
    expect(value).toBeFalsy()
  })

  it('_isPropertySelectable: should return false because type equals Integer and has no limits (min, max) and is not suitable for selection like multiselect', () => {
    const measurements = useMeasurementStore()
    // relevant parts for testing from schema file
    const dataSchema = {
      properties: {
        id: {
          type: 'integer',
          readOnly: true
        }
      }
    }
    console.log(dataSchema)
    const value = measurements._isPropertySelectable(dataSchema, 'id')
    console.log(value)
    expect(value).toBeFalsy()
  })

  it('_isPropertySelectable: should return false because type equals Object and is not suitable for selection like multiselect', () => {
    const measurements = useMeasurementStore()
    // relevant parts for testing from schema file
    const dataSchema = {
      properties: {
        sample: {
          type: 'object'
        }
      }
    }
    const value = measurements._isPropertySelectable(dataSchema, 'sample')
    expect(value).toBeFalsy()
  })

  it('_isPropertySelectable: should return true. Which means it is suitable for filtering ', () => {
    const measurements = useMeasurementStore()
    // relevant parts for testing from schema file
    const dataSchema = {
      properties: {
        environment: {
          oneOf: [
            {
              enum: [
                'Onshore (continental)',
                'Onshore (lake, river, etc.)',
                'Offshore (continental)',
                'Offshore (marine)',
                'unspecified'
              ],
              type: 'string'
            },
            {
              enum: ['']
            },
            {
              enum: [null]
            }
          ]
        }
      }
    }
    const value = measurements._isPropertySelectable(dataSchema, 'environment')
    expect(value).toBeTruthy()
  })

  it('_isPropertySelectable: should return true', () => {
    const measurements = useMeasurementStore()
    // relevant parts for testing from schema file
    const dataSchema = {
      properties: {
        q: {
          type: 'number',
          format: 'double',
          maximum: 1000000,
          minimum: -1000000,
          title: 'Heat flow',
          description:
            'Heat-flow density for the location after all corrections for instrumental and environmental effects.',
          units: 'mW / m^2'
        }
      }
    }
    const value = measurements._isPropertySelectable(dataSchema, 'q')
    expect(value).toBeTruthy()
  })

  it('_createVueMultiselectOption: should return object of attribute containing the title and key of attribute', () => {
    const measurements = useMeasurementStore()
    // relevant parts for testing from schema file
    const dataSchema = {
      properties: {
        q: {
          type: 'number',
          format: 'double',
          maximum: 1000000,
          minimum: -1000000,
          title: 'Heat flow',
          description:
            'Heat-flow density for the location after all corrections for instrumental and environmental effects.',
          units: 'mW / m^2'
        }
      }
    }
    const vueMultiselectOptionsObject = measurements._createVueMultiselectOption(dataSchema, 'q')
    expect(vueMultiselectOptionsObject).toStrictEqual({ title: 'Heat flow', key: 'q' })
  })

  it('_setSelectableProperties: should set the value for the attribute selectableProperties. An array containing objects with the title and key of all selectable attributes', () => {
    const measurements = useMeasurementStore()
    // relevant parts for testing from schema file
    const dataSchema = {
      properties: {
        q: {
          type: 'number',
          format: 'double',
          maximum: 1000000,
          minimum: -1000000,
          title: 'Heat flow'
        },
        environment: {
          title: 'Basic geographical environment',
          oneOf: [
            {
              enum: ['Onshore (continental)'],
              type: 'string'
            }
          ]
        }
      }
    }
    measurements._setSelectableProperties(dataSchema)
    expect(measurements.selectableProperties).toStrictEqual([
      { key: 'q', title: 'Heat flow' },
      { key: 'environment', title: 'Basic geographical environment' }
    ])
  })
})

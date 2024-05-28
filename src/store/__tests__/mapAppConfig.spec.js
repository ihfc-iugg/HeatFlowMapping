import { describe, beforeEach, it, expect } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useMapAppConfig } from '@/store/mapAppConfig'

describe('Map App Configuration store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('Check if value for data of data attribute get set correct', () => {
    // set up test document with data attributes
    let doc = document.implementation.createHTMLDocument('New Document')
    let div = doc.createElement('div')
    div.setAttribute(
      'data-data-url',
      'https://demo.heatflow.world/api/v1/measurements/heat-flow/?format=json'
    )
    const mapAppConfig = useMapAppConfig()
    mapAppConfig.setElement(div)
    mapAppConfig.setDataURL('dataUrl')
    expect(mapAppConfig.dataUrl).toEqual(
      'https://demo.heatflow.world/api/v1/measurements/heat-flow/?format=json'
    )
  })

  it('Check if value for schema of data attribute get set correct', () => {
    // set up test document with data attributes
    let doc = document.implementation.createHTMLDocument('New Document')
    let div = doc.createElement('div')
    div.setAttribute('data-schema-url', 'https://demo.heatflow.world/api/v1/schema/')
    const mapAppConfig = useMapAppConfig()
    mapAppConfig.setElement(div)
    mapAppConfig.setSchemaURL('schemaUrl')
    expect(mapAppConfig.schemaUrl).toEqual('https://demo.heatflow.world/api/v1/schema/')
  })
})

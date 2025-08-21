import { describe, beforeEach, it, expect } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useHFModelsStore } from '../hfModels'

describe('Heat Flow models store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('check initial state', () => {
    const store = useHFModelsStore()
    expect(store).toBeDefined()
    expect(store.selectedModel).toBeDefined()
    expect(store.opacity).toBeDefined()
    expect(store.models).toBeDefined()
    expect(store.models['hf-model']).toBeDefined()
    expect(store.models['hf-model'].id).toBe('hf-model')
    expect(store.models['hf-model'].title).toBe('Global Heat Flow Model R2024')
  })
})

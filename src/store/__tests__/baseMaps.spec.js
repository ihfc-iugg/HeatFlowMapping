import { describe, beforeEach, it, expect } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useBaseMapsStore } from '@/store/baseMaps'

describe('Base map store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('Is the arry, containg base map objects of length three (default, set by the developers)', () => {
    const baseMaps = useBaseMapsStore()
    expect(baseMaps.baseMaps.length).toBe(3)
  })
})

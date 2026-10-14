import { describe, beforeEach, it } from 'vitest'
import { point, distance, radiansToLength } from '@turf/turf'

import { setActivePinia, createPinia } from 'pinia'
import { use2DProfileStore } from '../2DProfile'

describe('2D profile store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('', () => {})
})

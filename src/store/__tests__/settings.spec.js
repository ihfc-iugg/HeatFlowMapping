import { describe, beforeEach, it } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '../settings'

describe('Map settings store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('Check initial state', () => {
    const settings = useSettingsStore()
    expect(settings.activeBaseLayer).toBeDefined()
    expect(settings.circleRadius).toBeDefined()
    expect(settings.circleColor).toBeDefined()
  })

  it('Check initial values', () => {
    const settings = useSettingsStore()
    expect(settings.activeBaseLayer).toBe('bm_esri_world_physical')
    expect(settings.circleRadius).toBe(3)
    expect(settings.circleColor).toBe('#E31E24')
  })
})

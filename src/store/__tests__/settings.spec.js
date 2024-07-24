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

  it('Check initial state of activeBaseLayer', () => {
    const settings = useSettingsStore()
    expect(settings.activeBaseLayer).toEqual('')
  })

  it('Check initial state of circleRadius', () => {
    const settings = useSettingsStore()
    expect(settings.circleRadius).toEqual(4)
  })

  it('Check initial state of circleColor', () => {
    const settings = useSettingsStore()
    expect(settings.circleColor).toEqual('#41b6c4')
  })
})

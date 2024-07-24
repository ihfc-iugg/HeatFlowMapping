import { describe, beforeEach, it, expectTypeOf } from 'vitest'
import { FullscreenControl, ScaleControl, NavigationControl } from 'maplibre-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'

import { setActivePinia, createPinia } from 'pinia'
import { useMapControlsStore } from '../mapControls'

describe('Map controls store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('Check for MapboxDraw initialisations', () => {
    const mapControls = useMapControlsStore()
    expectTypeOf(mapControls.mapboxDraw).toEqualTypeOf(MapboxDraw)
  })

  it('Check for ScaleControl initialisations', () => {
    const mapControls = useMapControlsStore()
    expectTypeOf(mapControls.scale).toEqualTypeOf(ScaleControl)
  })

  it('Check for FullscreenControl initialisations', () => {
    const mapControls = useMapControlsStore()
    expectTypeOf(mapControls.fullscreen).toEqualTypeOf(FullscreenControl)
  })

  it('Check for NavigationControl initialisations', () => {
    const mapControls = useMapControlsStore()
    expectTypeOf(mapControls.navigation).toEqualTypeOf(NavigationControl)
  })
})

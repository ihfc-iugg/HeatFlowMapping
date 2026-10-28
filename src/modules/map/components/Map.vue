<script setup>
import { ScaleControl, FullscreenControl, NavigationControl, GlobeControl } from 'maplibre-gl'
import { FeatureInfoControl } from '@/shared/utils/map/controls/FeatureInfoControl.js'
import { LegendControl } from '@/shared/utils/map/controls/LegendControl.js'

import { onMounted, onUnmounted, ref } from 'vue'
import { useMapStore } from '../stores/map.js'
import { useApplicationStore } from '@/core/stores/app.js'
import { initeMap } from '@/shared/utils/map/maplibregl.js'
import { createControlRegistry } from '@/shared/utils/map/controls/controlsRegistry.js'
import { LayerControl } from 'maplibre-gl-layer-control'
import 'maplibre-gl-layer-control/style.css'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase.js'

const mapID = ref('map1')
const mapStore = useMapStore()
const app = useApplicationStore()

onMounted(() => {
  mapStore.map = initeMap(mapID.value)

  app.controls = createControlRegistry(mapStore.map)
  app.controls.add('scale', new ScaleControl())
  app.controls.add('fullScreen', new FullscreenControl())
  app.controls.add('navigation', new NavigationControl())
  app.controls.add('globe', new GlobeControl())
  app.controls.add('featureInfo', new FeatureInfoControl({ layer: GHFDB.r2024.id }))
  app.controls.add('legend', new LegendControl({ layer: GHFDB.r2024.id }), 'bottom-right')
  app.controls.add(
    'layerControl',
    new LayerControl({
      collapsed: false,
      panelWidth: 340,
      panelMinWidth: 240,
      panelMaxWidth: 960,
      enableContextMenu: false,
      showStyleEditor: false, // set to false to unable removal of layers
      excludeLayers: [
        // exclude all terraDraw layers
        'td-polygon',
        'td-polygon-outline',
        'td-linestring',
        'td-point',
        'td-point-marker'
      ]
    })
  )

  const legend = app.controls.get('legend')
  legend.onOpen((isOpen) => {
    console.log(isOpen)
  })
})

onUnmounted(() => {
  mapStore.removeMap()
  app.map = null
})
</script>

<template>
  <div
    :id="mapID"
    class="column map flex-grow-1"
    style="background-color: black"
    ref="mapDivID"
  ></div>
</template>

<style scoped>
@media all and (min-width: 500px) {
  .map {
    display: flex;
  }
}
</style>

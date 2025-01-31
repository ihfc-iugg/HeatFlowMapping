<!-- Show popup containing infos of point (on click) -->
<script setup>
import { defineProps, ref, watch, onMounted, onUnmounted } from 'vue'
import { Map, Popup, Marker } from 'maplibre-gl'
import { newPlot, relayout } from 'plotly.js-dist'

import { useDigitalBoreholeStore } from '@/store/digitalBorehole.js'
import { useDataSchemaStore } from '@/store/dataSchema.js'

const dB = useDigitalBoreholeStore()

const props = defineProps({ map: Map, hasPopup: Boolean })

// TODO: when firt pnt is drawn popup does not toggle
watch(
  () => dB.pnt,
  () => {
    dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
    setUpPopup(dB.pnt, props.map)
    dB.drawChart(dB.layers, dB.t0)
  }
)

/**
 *
 */
function setUpPopup() {
  if (dB.popup && dB.marker) {
    dB.popup.remove()
    dB.popup = null
    dB.marker.remove()
    dB.marker = null
  }

  const elPopup = document.createElement('div')
  elPopup.id = 'popupBoreholeChart'
  elPopup.classList.add('mh-100')
  dB.popup = ref(new Popup().setDOMContent(elPopup).setMaxWidth('100%'))

  const elMarker = document.createElement('div')
  elMarker.id = 'markerBoreholeChart'
  elMarker.classList.add('fs-2')
  elMarker.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-move" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"></path></svg>'
  dB.marker = ref(
    new Marker({ draggable: true, element: elMarker, offset: [0, -10] }).setPopup(dB.popup)
  )
  // dB.marker.togglePopup()

  dB.marker.setLngLat(dB.pnt.geometry.coordinates)
  dB.marker.addTo(props.map)
  dB.marker.togglePopup()
}
</script>

<template></template>

<style>
#markerBoreholeChart {
  display: inline-block;
  text-align: center;
  line-height: 0; /* Remove any spacing around the SVG */
  background: transparent;
}
</style>

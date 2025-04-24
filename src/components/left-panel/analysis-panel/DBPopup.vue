<!-- Show popup containing infos of point (on click) -->
<script setup>
import { defineProps, h, onMounted, ref, render, watch } from 'vue'
import { Map, Popup, Marker } from 'maplibre-gl'
import { newPlot } from 'plotly.js-dist'

import DBAddLayerBtn from './DBAddLayerBtn.vue'
import DBRemoveLastLayerBtn from './DBRemoveLastLayerBtn.vue'

import { useDigitalBoreholeStore } from '@/store/digitalBorehole.js'

const dB = useDigitalBoreholeStore()

const props = defineProps({ map: Map, hasPopup: Boolean })

watch(
  () => dB.pnt,
  () => {
    if (dB.pnt) {
      setUpPopup(dB.pnt, props.map)
      dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
      dB.drawChart(dB.layers, dB.t0)
      appendLayerHandlingBtnToPopup(document.getElementById('popupBoreholeChart'))
    }
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

  let elPopup = document.createElement('div')
  elPopup.id = 'popupBoreholeChart'
  elPopup.classList.add('mh-100')
  dB.popup = ref(new Popup().setDOMContent(elPopup).setMaxWidth('100%'))

  let elMarker = document.createElement('div')
  elMarker.id = 'markerBoreholeChart'

  dB.marker = ref(new Marker({ draggable: false, offset: [0, -10] }).setPopup(dB.popup))
  dB.marker.setLngLat(dB.pnt.geometry.coordinates)
  dB.marker.addTo(props.map)
  dB.marker.togglePopup()

  // Popup did not open even the popup.on('open') event gets fired. Only solution I could find to fix
  // https://stackoverflow.com/questions/73392796/mapbox-custom-marker-popup-not-showing
  setTimeout(() => dB.marker.togglePopup(), 1)
}

/**
 *
 * @param parentElement
 */
function appendLayerHandlingBtnToPopup(parentElement) {
  if (parentElement) {
    const col1 = h('div', { id: 'btn-col1', class: 'col-md-auto' }, [h(DBAddLayerBtn)])
    const col2 = h('div', { id: 'btn-col2', class: 'col-md-auto' }, [h(DBRemoveLastLayerBtn)])
    const row = h('div', { id: 'btn-row', class: 'row justify-content-md-center' }, [col1, col2])
    const container = h('div', { id: 'db-layer-handling', class: 'container' }, [row])

    render(container, parentElement)
  }
}
</script>

<template></template>

<style></style>

<!-- Show popup containing infos of point (on click) -->
<script setup>
import { h, ref, render, watch } from 'vue'
import { Popup, Marker } from 'maplibre-gl'

import DBAddLayerBtn from './DBAddLayerBtn.vue'
import DBRemoveLastLayerBtn from './DBRemoveLastLayerBtn.vue'

import { useDigitalBoreholeStore } from '@/store/digitalBorehole.js'
import { useMapStore } from '@/store/map'

const dB = useDigitalBoreholeStore()
const mapStore = useMapStore()

watch(
  () => dB.pnt,
  () => {
    if (dB.pnt) {
      setUpPopup(dB.pnt, mapStore.map)
      dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
      dB.drawChart(dB.layers, dB.t0, dB.uncertainty)
      appendLayerHandlingBtnToPopup(document.getElementById('popupBoreholeChart'))
    }
  }
)

/**
 *
 */
function setUpPopup(pnt, map) {
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
  dB.marker = ref(new Marker({ draggable: false, offset: [0, -10] }).setPopup(dB.popup))
  console.log('dB.marker')
  console.log(dB.marker)
  dB.marker.setLngLat(pnt.geometry.coordinates)
  dB.marker.addTo(map)
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

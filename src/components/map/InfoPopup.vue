<!-- Show popup containing infos of point (on click) -->
<script setup>
import { defineProps, onMounted, ref, watch } from 'vue'
import { Map, Popup } from 'maplibre-gl'

import {
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell
} from '@coreui/bootstrap-vue'

const props = defineProps({ map: Map })
const map = ref(props.map)
const selectedPnt = ref(null)

const popupInfoContent = ref(null)
const hasInfoPopup = ref(false)

/**
 * @description
 */
function togglehasInfoPopup() {
  hasInfoPopup.value = !hasInfoPopup.value
}

onMounted(() => {
  popupInfoContent.value = document.getElementById('infoPopup')
})

watch(props, (newProps) => {
  map.value = newProps.map

  // source: https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-click/
  map.value.on('click', 'sites', (e) => {
    console.log('infopopup')
    console.log(e.features)
    selectedPnt.value = e.features[0]
    const coordinates = e.features[0].geometry.coordinates.slice()

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
    }

    const popup = new Popup().setLngLat(coordinates).setDOMContent(popupInfoContent.value)
    popup.addTo(map.value)
    togglehasInfoPopup()

    popup.on('close', () => {
      togglehasInfoPopup()
    })
  })

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.value.on('mouseenter', 'sites', () => {
    map.value.getCanvas().style.cursor = 'pointer'
  })

  // Change it back to a pointer when it leaves.
  map.value.on('mouseleave', 'sites', () => {
    map.value.getCanvas().style.cursor = ''
  })
})
</script>

<template>
  <KeepAlive>
    <div class="infoPopup" id="infoPopup">
      <div v-if="hasInfoPopup">
        <h2>{{ selectedPnt.properties.ID }}</h2>
        <CTable>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell scope="col">Property</CTableHeaderCell>
              <CTableHeaderCell scope="col">Value</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="key in Object.keys(selectedPnt.properties)" :key="key">
              <CTableHeaderCell scope="row">{{ key }}</CTableHeaderCell>
              <CTableDataCell>{{ selectedPnt.properties[key] }}</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
      </div>
    </div>
  </KeepAlive>
</template>

<style scoped></style>

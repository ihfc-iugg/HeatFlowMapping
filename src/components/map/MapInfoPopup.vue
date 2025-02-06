<!-- Show popup containing infos of point (on click) -->
<script setup>
import { onMounted, ref, watch } from 'vue'
import { useMapStore } from '@/store/map.js'
import { useMapControlsStore } from '@/store/mapControls'

import {
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell
} from '@coreui/bootstrap-vue'

const mapStore = useMapStore()
const mapControls = useMapControlsStore()

const popupInfoContent = ref(null)
const hasPopup = ref(false)
const selectedPnt = ref(null)

onMounted(() => {
  popupInfoContent.value = document.getElementById('infoPopup')

  // Listen for changes to the hasPopup state in the JS class
  mapControls.featureInfo.onHasPopupChanged((newHasPopup) => {
    hasPopup.value = newHasPopup // Update the Vue ref
  })
  mapControls.featureInfo.onSelectedPointChanged((newPoint) => {
    selectedPnt.value = newPoint // Update the Vue ref
  })
})

watch(hasPopup, (newValue) => {
  if (newValue) {
    mapControls.featureInfo.getPopup().setDOMContent(popupInfoContent.value)
  } else {
  }
})
</script>

<template>
  <div class="infoPopup" id="infoPopup">
    <div v-if="selectedPnt">
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
</template>

<style scoped></style>

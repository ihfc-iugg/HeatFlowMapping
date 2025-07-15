<script setup>
import { CFormInput, CTableRow, CTableDataCell } from '@coreui/bootstrap-vue'

import { useSettingsStore } from '@/store/settings'
import { useMapStore } from '@/store/map'

import AccordionItem from '../AccordionItem.vue'

const settings = useSettingsStore()
const mapStore = useMapStore()

/**
 * @description set Circle color
 * @param {String} colorHEX
 * @returns {Void}
 */
function setCircleColor(colorHEX) {
  if (mapStore.map.getPaintProperty('ghfdb', 'circle-color') == colorHEX) {
    return
  } else {
    mapStore.map.setPaintProperty('ghfdb', 'circle-color', colorHEX)
  }
}
</script>

<template>
  <!-- Circle color -->
  <AccordionItem title="Circle Color" :id="'circleFillColor'">
    <CTableRow>
      <CTableDataCell>
        <CFormInput
          v-model="settings.circleColor"
          type="color"
          id="exampleColorInput"
          :value="settings.circleColor"
          title="Choose your color"
          @input="setCircleColor(settings.circleColor)"
        />
      </CTableDataCell>
      <CTableDataCell>{{ settings.circleColor }}</CTableDataCell>
    </CTableRow>
  </AccordionItem>
</template>

<style></style>

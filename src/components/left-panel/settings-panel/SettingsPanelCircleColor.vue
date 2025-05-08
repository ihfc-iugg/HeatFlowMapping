<script setup>
import { CFormInput, CTableRow, CTableDataCell } from '@coreui/bootstrap-vue'

import { useSettingsStore } from '@/store/settings'
import { useMapStore } from '@/store/map'

const settings = useSettingsStore()
const mapStore = useMapStore()

/**
 * @description set Circle color
 * @param {String} colorHEX
 * @returns {Void}
 */
function setCircleColor(colorHEX) {
  if (mapStore.map.getPaintProperty('sites', 'circle-color') == colorHEX) {
    return
  } else {
    mapStore.map.setPaintProperty('sites', 'circle-color', colorHEX)
  }
}
</script>

<template>
  <!-- Circle color -->
  <div style="border-bottom: 2px solid #00c9a7">
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn text-start text-light dropdown-toggle"
        type="button"
        style="background-color: #4366a1"
        data-bs-toggle="collapse"
        data-bs-target="#circleFillColor"
        aria-expanded="false"
        aria-controls="circleFillColor"
      >
        Circle Color
      </button>
    </p>
    <div class="collapse p-1" id="circleFillColor">
      <div class="card card-body">
        <!-- <div class="btn-group" role="group" aria-label="Color Selection">
        <button
          type="button"
          class="btn btn-secondary"
          v-for="colorHEX in colorbrewer['Paired'][12]"
          :key="colorHEX"
          :style="{ 'background-color': colorHEX }"
          @click="setCircleColor(colorHEX), legend.setLegendToNull()"
        ></button>
      </div> -->
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
      </div>
    </div>
  </div>
</template>

<style></style>

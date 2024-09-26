<script setup>
import { defineProps } from 'vue'
import { Map } from 'maplibre-gl'
import { useSettingsStore } from '@/store/settings'

import { CFormInput, CTableRow, CTableDataCell } from '@coreui/bootstrap-vue'

const settings = useSettingsStore()

const props = defineProps({ map: Map })

/**
 * @description set Circle color
 * @param {String} colorHEX
 * @returns {Void}
 */
function setCircleColor(colorHEX) {
  if (props.map.getPaintProperty('sites', 'circle-color') == colorHEX) {
    return
  } else {
    props.map.setPaintProperty('sites', 'circle-color', colorHEX)
  }
}
</script>

<template>
  <!-- Circle color -->
  <p class="mt-1 d-grid gap-2">
    <button
      class="btn btn-primary text-start dropdown-toggle"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#circleFillColor"
      aria-expanded="false"
      aria-controls="circleFillColor"
    >
      Circle Color
    </button>
  </p>
  <div class="collapse" id="circleFillColor">
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
</template>

<style></style>

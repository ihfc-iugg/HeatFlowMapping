<script setup>
import { defineProps } from 'vue'
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
      class="btn btn-primary text-start"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#circleFillColor"
      aria-expanded="false"
      aria-controls="circleFillColor"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrows-expand"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2M8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
        />
      </svg>
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

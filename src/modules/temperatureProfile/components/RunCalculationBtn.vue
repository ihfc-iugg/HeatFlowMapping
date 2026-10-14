<script setup>
import { watch, useTemplateRef, defineEmits } from 'vue'
import { useTemperatureProfileStore } from '../stores/temperatureProfile.js'
import InfoSVG from '@/shared/assets/icons/info-circle-bootstrap.svg'

const tempProfile = useTemperatureProfileStore()
const runBtnEl = useTemplateRef('runBtn')
const emit = defineEmits(['runCalculation'])

function disableRunBtn() {
  if (tempProfile.nearestPoint) {
    runBtnEl.value.disabled = false
  } else {
    runBtnEl.value.disabled = true
  }
}

/**
 * @description
 * @param {String} property
 * @param {String} dataType
 */
function runCalculation() {
  emit('runCalculation')
}

watch(
  () => tempProfile.nearestPoint,
  () => {
    disableRunBtn()
  }
)
</script>
<template>
  <div class="position-sticky bottom-0 py-3 bg-white">
    <div class="d-grid justify-content-md-center pt-1">
      <button
        ref="runBtn"
        type="button"
        class="btn btn-success rounded-pill btn-lg"
        disabled
        @click="runCalculation()"
      >
        <small>Run Calculation</small>
      </button>
      <p v-if="!tempProfile.nearestPoint" class="text-danger text-center">
        <small> Please draw a point</small>
      </p>
    </div>
  </div>
</template>
<style></style>

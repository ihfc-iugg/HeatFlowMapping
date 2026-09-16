<script setup>
import { watch, useTemplateRef, defineEmits } from 'vue'
import { useTemperatureProfileStore } from '../stores/temperatureProfile.js'

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
    console.log('wann trigger')
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
      <p v-if="!tempProfile.nearestPoint" class="text-danger">
        <small
          ><svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-info-circle"
            viewBox="0 0 16 16"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path
              d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
            />
          </svg>
          Please draw a point</small
        >
      </p>
    </div>
  </div>
</template>
<style></style>

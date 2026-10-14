<script setup>
import { watch, useTemplateRef, defineEmits } from 'vue'
import { useCrossSectionStore } from '../stores/crossSection'

const crossSection = useCrossSectionStore()
const runBtnEl = useTemplateRef('runBtnCrossSection')
const emit = defineEmits(['runCalculation'])

function disableRunBtn() {
  if (crossSection.hasValidinputs) {
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
  () => crossSection.hasValidinputs,
  () => {
    disableRunBtn()
  }
)
</script>
<template>
  <div class="position-sticky bottom-0 py-3 bg-white">
    <div class="d-grid justify-content-md-center pt-1">
      <button
        ref="runBtnCrossSection"
        type="button"
        class="btn btn-success rounded-pill btn-lg"
        disabled
        @click="runCalculation()"
      >
        <small>Run Calculation</small>
      </button>
      <p v-if="!crossSection.lineString" class="text-danger text-center">
        <small> Please draw a line</small>
      </p>
      <p
        v-if="
          !crossSection.lineOffset || crossSection.lineOffset < 0 || crossSection.lineOffset > 500
        "
        class="text-danger text-center"
      >
        <small> Please enter a valid offset</small>
      </p>
    </div>
  </div>
</template>
<style></style>

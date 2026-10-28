<script setup>
import { useApplicationStore } from '@/core/stores/app'
import { useLayerColoring } from '../composables/useLayerColoring.js'
// import paintPropertyObserver from '@/shared/utils/observer/paintPropertyObserver'

const app = useApplicationStore()
const { applyColoringLogic } = useLayerColoring()

/**
 * @description
 */
function onCLick() {
  applyColoringLogic(app.map)
}
</script>

<template>
  <div class="d-grid justify-content-md-center pt-2">
    <button type="button" class="btn rounded-pill btn-outline-success" @click="onCLick()">
      <small> Apply </small>
    </button>
  </div>
</template>

<style></style>

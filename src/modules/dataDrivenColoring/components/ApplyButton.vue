<script setup>
import { useDataDrivenColoringStore } from '../stores/dataDrivenColoring'
import { useApplicationStore } from '@/core/stores/app'

const dataDrivenColoring = useDataDrivenColoringStore()
const app = useApplicationStore()
</script>

<template>
  <div class="d-grid justify-content-md-center pt-2">
    <button
      type="button"
      class="btn rounded-pill btn-outline-success"
      @click="dataDrivenColoring.applyColoringLogic(app.geojson, app.map)"
    >
      <small> Apply </small>
    </button>
  </div>
</template>

<style></style>

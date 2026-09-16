<script setup>
import { useTemperatureProfileStore } from '../stores/temperatureProfile'

const tempProfile = useTemperatureProfileStore()
// import { watch } from 'vue'
// import { useDigitalBoreholeStore } from '@/modules/profileAlongDepth/stores/digitalBorehole'

// const dB = useDigitalBoreholeStore()

// /**
//  * @description if layers change (because of addition or removal of layers), the bootstrapping method is called to recalculate the T value and the chart is redrawn.
//  */
// watch(dB.layers, () => {
//   dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
//   dB.drawChart(dB.layers, dB.t0, dB.uncertainty)
// })
</script>

<template>
  <div class="d-grid justify-content-md-center">
    <button
      type="button"
      class="btn rounded-pill btn-outline-success"
      @click="tempProfile.removeLayer()"
    >
      <small>- Remove Layer</small>
    </button>
  </div>
</template>

<style></style>

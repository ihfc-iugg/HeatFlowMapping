<script setup>
// import { watch } from 'vue'
// import { useDigitalBoreholeStore } from '@/modules/profileAlongDepth/stores/digitalBorehole'

import ParameterTable from './ParameterTable.vue'
import AddLayerBtn from './AddLayerBtn.vue'
import RemoveLastLayerBtn from './RemoveLastLayerBtn.vue'
import { useTemperatureProfileStore } from '../../stores/temperatureProfile.js'
import { onMounted } from 'vue'

const tempProfile = useTemperatureProfileStore()

// const dB = useDigitalBoreholeStore()

// /**
//  * @description if layers change (because of addition or removal of layers), the bootstrapping method is called to recalculate the T value and the chart is redrawn.
//  */
// watch(dB.layers, () => {
//   dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
//   dB.drawChart(dB.layers, dB.t0)
// })

onMounted(() => {
  // if (!tempProfile.layers.length) {
  tempProfile.addLayer(null, null, null, null, null, 3000, null, 'Bathymetry')
  tempProfile.addLayer(null, null, null, null, 5, 200, 3, 'Sediments')
  tempProfile.addLayer(null, null, null, null, 1.4, 300, 1.3, 'Upper Crust')
  tempProfile.addLayer(null, null, null, null, 1.5, 200, 0.8, 'Middle Crust')
  tempProfile.addLayer(null, null, null, null, 1.5, 200, 0.8, 'Lower Crust')
  // }
})
</script>

<template>
  <!-- <p v-if="!tempProfile.nearestPoint">
    This panel will be enabled once you place a point where the temperature profile should be
    calculated.
  </p> -->
  <div class="mt-1 mb-3 border rounded-bottom bg-success-subtle">
    <span>Use global data sets</span>
    <div class="form-check form-switch mx-1">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="switchCheckDefault"
        checked
      />
      <label class="form-check-label" for="switchCheckDefault">
        <span class="fw-bold">CRUST1.0</span>
        for
        <math display="">
          <msub>
            <mi>&Delta;</mi>
            <mn>Zi</mn>
          </msub>
          <mo>Layer Thickness</mo>
        </math>
      </label>
    </div>

    <div class="form-check form-switch mx-1">
      <input
        class="form-check-input"
        type="checkbox"
        role="switch"
        id="switchCheckChecked"
        checked
      />
      <label class="form-check-label" for="switchCheckChecked">
        <span class="fw-bold">NOAA</span> for
        <math display="">
          <msub>
            <mi>T</mi>
            <mn>0</mn>
          </msub>
          <mo>Ground Surface Temperature</mo>
        </math>
      </label>
    </div>
  </div>

  <!-- <div id="customize-parameter-enabled" v-if="tempProfile.nearestPoint"> -->
  <ParameterTable />
  <div class="container text-center">
    <div class="row justify-content-md-center">
      <div class="col-md-auto"><AddLayerBtn /></div>
      <div class="col-md-auto"><RemoveLastLayerBtn /></div>
    </div>
  </div>
  <!-- </div> -->
</template>

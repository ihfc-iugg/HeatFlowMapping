<script setup>
import { useTemperatureProfileStore } from '../stores/temperatureProfile.js'
import { onMounted, watch, useTemplateRef } from 'vue'
import AddLayerBtn from './AddLayerBtn.vue'
import RemoveLastLayerBtn from './RemoveLastLayerBtn.vue'

const tempProfile = useTemperatureProfileStore()
const dzLayersInput = useTemplateRef('dzLayersInput')

// const dB = useDigitalBoreholeStore()

// /**
//  * @description if layers change (because of addition or removal of layers), the bootstrapping method is called to recalculate the T value and the chart is redrawn.
//  */
// watch(dB.layers, () => {
//   dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
//   dB.drawChart(dB.layers, dB.t0)
// })

watch(
  () => tempProfile.useCrust1,
  () => {
    console.log(dzLayersInput.value)
    dzLayersInput.value.forEach((layer) => {
      console.log(layer)
      if (tempProfile.useCrust1) {
        layer.disabled = true
      } else {
        layer.disabled = false
      }
    })
  }
)
</script>

<template>
  <!-- <div id="customize-parameter-enabled" v-if="tempProfile.nearestPoint"> -->
  <table class="table table-borderless">
    <thead scope="col">
      <tr>
        <th class="p align-top text-center" scope="col">
          Layer Thickness
          <math display="block">
            <mo>[</mo>
            <mi>m</mi>
            <mo>]</mo>
          </math>
        </th>
        <th class="p align-top text-center" scope="col">
          Heat Production
          <math display="block">
            <mrow>
              <mo>[</mo>
              <mfrac>
                <mrow>
                  <mrow>
                    <mo>&#x03BC;</mo>
                    <mi>W</mi>
                  </mrow>
                </mrow>
                <mrow>
                  <msup>
                    <mi>m</mi>
                    <mn>3</mn>
                  </msup>
                </mrow>
              </mfrac>
              <mo>]</mo>
            </mrow>
          </math>
        </th>
        <th class="p align-top text-center" scope="col">
          Thermal Conductivity
          <math display="block">
            <mrow>
              <mo> [</mo>
              <mfrac>
                <mrow>
                  <mi>W</mi>
                </mrow>
                <mrow>
                  <mrow>
                    <mo>(</mo>
                    <mfrac>
                      <mrow><mi>m</mi></mrow>
                      <mrow><mi>k</mi></mrow>
                      <!-- <mi>m</mi> -->
                      <!-- <msup>
                        <mi>k</mi>
                      </msup> -->
                    </mfrac>
                    <mo>)</mo>
                  </mrow>
                </mrow>
              </mfrac>
              <mo>] </mo>
            </mrow>
          </math>
        </th>
      </tr>
    </thead>
    <tbody
      v-for="layer in tempProfile.layers"
      :key="tempProfile.layers.indexOf(layer)"
      :style="{ backgroundColor: layer.color }"
    >
      <!-- <div class="container"> -->
      <tr>
        <!-- <CTableHeaderCell scope="row">{{ dB.layers.indexOf(layer) + 1 }}</CTableHeaderCell> -->
        <td scope="col" :style="{ backgroundColor: layer.color }">
          <div class="input-group">
            <input
              ref="dzLayersInput"
              :id="tempProfile.layers.indexOf(layer)"
              class="form-control"
              v-model.number="layer.dZ"
              type="number"
              step="1"
              disabled
            />
          </div>
        </td>
        <td scope="col" :style="{ backgroundColor: layer.color }">
          <div class="input-group">
            <input
              :id="tempProfile.layers.indexOf(layer)"
              class="form-control"
              v-model.number="layer.a"
              type="number"
              inputmode="decimal"
              step="0.01"
            />
          </div>
        </td>
        <td scope="col" :style="{ backgroundColor: layer.color }">
          <div class="input-group">
            <input
              :id="tempProfile.layers.indexOf(layer)"
              class="form-control"
              v-model.number="layer.k"
              type="number"
              step="0.01"
            />
          </div>
        </td>
      </tr>
      <tr class="w-100" :style="{ backgroundColor: layer.color }">
        <td class="text-end p-0" colspan="3" :style="{ backgroundColor: layer.color }">
          {{ layer.layerType }}
        </td>
      </tr>
      <!-- </div> -->
    </tbody>
  </table>
  <div v-if="!tempProfile.useCrust1" class="row justify-content-md-center">
    <div class="col">
      <AddLayerBtn />
    </div>
    <div class="col">
      <RemoveLastLayerBtn />
    </div>
  </div>
  <!-- </div> -->
</template>

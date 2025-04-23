<script setup>
import { watch } from 'vue'
import { useDigitalBoreholeStore } from '@/store/digitalBorehole'

import DBAddLayerBtn from './DBAddLayerBtn.vue'
import DBRemoveLastLayerBtn from './DBRemoveLastLayerBtn.vue'
import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell
} from '@coreui/bootstrap-vue'

const dB = useDigitalBoreholeStore()

watch(dB.layers, () => {
  dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
  dB.drawChart(dB.layers, dB.t0)
})
</script>

<template>
  <div class="card-body" id="db-customize-parameter">
    <h6>Customize Parameter</h6>
    <div id="customize-parameter-disabled" v-if="!dB.closestPointfeatures">
      <p>
        This panel will be enabled once you place a point where the digital borehole should be
        calculated.
      </p>
    </div>
    <div id="customize-parameter-enabled" v-if="dB.closestPointfeatures">
      <CTable>
        <CTableHead>
          <CTableRow>
            <!-- <CTableHeaderCell scope="col"></CTableHeaderCell> -->
            <CTableHeaderCell class="p align-top text-center" scope="col"
              >Layer Thickness
              <math display="block">
                <mo>[</mo>
                <mfrac>
                  <mi>m</mi>
                </mfrac>
                <mo>]</mo>
              </math>
            </CTableHeaderCell>
            <CTableHeaderCell class="p align-top text-center" scope="col"
              >Heat Production
              <math display="block">
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
              </math>
            </CTableHeaderCell>
            <CTableHeaderCell class="p align-top text-center" scope="col"
              >Thermal Conductivity
              <math display="block">
                <mo>[</mo>
                <mfrac>
                  <mrow>
                    <mrow>
                      <mi>W</mi>
                    </mrow>
                  </mrow>
                  <mrow>
                    <msup>
                      <mo>(</mo>
                      <mfrac>
                        <mi>m</mi>
                        <msup>
                          <mi>k</mi>
                        </msup>
                      </mfrac>
                      <mo>)</mo>
                    </msup>
                  </mrow>
                </mfrac>
                <mo>]</mo>
              </math>
            </CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow v-for="layer in dB.layers" :key="dB.layers.indexOf(layer)">
            <!-- <CTableHeaderCell scope="row">{{ dB.layers.indexOf(layer) + 1 }}</CTableHeaderCell> -->
            <CTableDataCell :style="{ backgroundColor: layer.color }">
              <div class="input-group mb-3">
                <input
                  :id="dB.layers.indexOf(layer)"
                  class="form-control"
                  v-model.number="layer.dZ"
                  type="number"
                  step="1"
                />
              </div>
            </CTableDataCell>
            <CTableDataCell :style="{ backgroundColor: layer.color }">
              <!-- TODO: Change values to more reabable -->
              <div class="input-group mb-3">
                <input
                  :id="dB.layers.indexOf(layer)"
                  class="form-control"
                  v-model.number="layer.a"
                  type="number"
                  inputmode="decimal"
                  step="0.01"
                />
              </div>
            </CTableDataCell>
            <CTableDataCell :style="{ backgroundColor: layer.color }">
              <!-- TODO: Change values to more reabable -->
              <div class="input-group mb-3">
                <input
                  :id="dB.layers.indexOf(layer)"
                  class="form-control"
                  v-model.number="layer.k"
                  type="number"
                  step="0.01"
                />
              </div>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <div class="container text-center">
        <div class="row justify-content-md-center">
          <div class="col-md-auto"><DBAddLayerBtn /></div>
          <div class="col-md-auto"><DBRemoveLastLayerBtn /></div>
        </div>
      </div>
    </div>
  </div>
</template>

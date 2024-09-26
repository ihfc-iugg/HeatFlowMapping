<script setup>
import { useDigitalBoreholeStore } from '@/store/digitalBorehole'

import {
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell
} from '@coreui/bootstrap-vue'

const dB = useDigitalBoreholeStore()
</script>

<template>
  <CTable>
    <CTableHead>
      <CTableRow>
        <CTableHeaderCell scope="col">Layer</CTableHeaderCell>
        <CTableHeaderCell scope="col">Thickness (dZ)</CTableHeaderCell>
        <CTableHeaderCell scope="col">Heat Production (A)</CTableHeaderCell>
        <CTableHeaderCell scope="col">Thermal Conductivity (K)</CTableHeaderCell>
      </CTableRow>
    </CTableHead>
    <CTableBody>
      <CTableRow v-for="layer in dB.layers" :key="dB.layers.indexOf(layer)">
        <CTableHeaderCell scope="row">{{ dB.layers.indexOf(layer) + 1 }}</CTableHeaderCell>
        <CTableDataCell>
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
        <CTableDataCell>
          <div class="input-group mb-3">
            <input
              :id="dB.layers.indexOf(layer)"
              class="form-control"
              v-model.number="layer.a"
              type="number"
              step="0.01"
            />
          </div>
        </CTableDataCell>
        <CTableDataCell>
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
</template>

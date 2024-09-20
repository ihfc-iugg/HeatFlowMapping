<script setup>
import { useDigitalBoreholeStore } from '@/store/digitalBorehole'

import {
  CFormInput,
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
        <CTableDataCell
          ><CFormInput
            :id="dB.layers.indexOf(layer)"
            placeholder="Thickness"
            aria-label="Thickness"
            aria-describedby="basic-addon1"
            v-model.number="layer.dZ"
            type="number"
            @input="console.log('layer ' + dB.layers.indexOf(layer) + '; dZ: ' + layer.dZ)"
          />
        </CTableDataCell>
        <CTableDataCell
          ><CFormInput
            :id="dB.layers.indexOf(layer)"
            placeholder="Heat Production"
            aria-label="Heat Production"
            aria-describedby="basic-addon1"
            v-model.number="layer.a"
            type="number"
            @input="console.log('layer ' + dB.layers.indexOf(layer) + '; a: ' + layer.a)"
        /></CTableDataCell>
        <CTableDataCell
          ><CFormInput
            :id="dB.layers.indexOf(layer)"
            placeholder="Thermal Conductivity"
            aria-label="Thermal Conductivity"
            aria-describedby="basic-addon1"
            v-model.number="layer.k"
            type="number"
            @input="console.log('layer ' + dB.layers.indexOf(layer) + '; k: ' + layer.k)"
        /></CTableDataCell>
      </CTableRow>
    </CTableBody>
  </CTable>
</template>

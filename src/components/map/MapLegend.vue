<!-- Map Legend -->
<script setup>
import { ref, watch } from 'vue'
import { useLegendStore } from '@/store/legend'
import { useDataSchemaStore } from '@/store/dataSchema.js'

import {
  CButton,
  CCollapse,
  CCard,
  CCardBody,
  CContainer,
  CRow,
  CCol,
  CCardTitle,
  CCardSubtitle
} from '@coreui/bootstrap-vue'

const legend = useLegendStore()
const schema = useDataSchemaStore()

const property = ref(null)

watch(legend.selectedProperty, (newProperty) => {
  console.log(newProperty)
  property.value = schema.dataSchema.properties[newProperty]
})

const visible = ref(false)
</script>

<template>
  <div class="dropup legend-container" v-if="legend.legend">
    <CContainer>
      <CButton
        class="position-absolute top-0 end-0 translate-middle btn btn-sm btn-primary dropdown-toggle"
        color="primary"
        @click="visible = !visible"
        >Legend</CButton
      >
      <CCollapse :visible="visible">
        <CCard class="mt-3">
          <CCardBody>
            <CCardTitle>{{
              schema.dataSchema.properties[legend.selectedProperty].title
            }}</CCardTitle>
            <CCardSubtitle
              class="mb-2 text-muted"
              v-if="schema.dataSchema.properties[legend.selectedProperty].units"
              >[{{ schema.dataSchema.properties[legend.selectedProperty].units }}]</CCardSubtitle
            >
            <CRow class="align-items-start" v-for="entry in legend.legend" :key="entry.id">
              <CCol class="align-self-start" xs="2">
                <CButton
                  :style="{
                    'background-color': entry.colorHEX
                  }"
                ></CButton>
              </CCol>

              <CCol class="d-flex align-self-end" xs="10">
                {{ entry.text }}
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CCollapse>
    </CContainer>
  </div>
</template>

<style scoped>
.legend-container {
  position: absolute;
  bottom: 4rem;
  right: 0.5rem;
  z-index: 1;
}
</style>

<script setup>
import { CButton, CModal, CModalBody, CRow, CSpinner, CCol } from '@coreui/bootstrap-vue'
import { ref } from 'vue'
import { useMeasurementStore } from '@/store/measurements'

// can be adjusted when data gets fetched from api
// :visible="measurements.isDataLoading" keeps the modal visibile as long as the data is loading
const measurements = useMeasurementStore()
</script>

<template>
  <!-- 
    :visible="measurments.isDataLoading" 
    shows Modal while data is loading
  -->
  <CModal
    class="show d-block align-middle"
    :backdrop="true"
    :transition="true"
    alignment="center"
    :visible="false"
  >
    <CModalBody>
      <CRow class="d-flex justify-content-center">
        <CCol class="col-auto">
          <CSpinner component="span" size="sm" aria-hidden="true" />
        </CCol>
        <CCol class="col-auto"><p class="h6 my-auto">Loading Data ...</p></CCol>
      </CRow>
      <CRow>
        <CCol class="d-flex justify-content-center">
          <p class="mx-auto my-auto">The initial loading might take a few seconds</p>
        </CCol>
      </CRow>
    </CModalBody>
  </CModal>
</template>

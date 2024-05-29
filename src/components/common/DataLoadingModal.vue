<script setup>
import {
  CButton,
  CModal,
  CModalBody,
  CRow,
  CSpinner,
  CModalHeader,
  CModalTitle,
  CModalFooter
} from '@coreui/bootstrap-vue'
import { ref } from 'vue'
import { useMeasurementStore } from '@/store/measurements'

// can be adjusted when data gets fetched from api
// :visible="measurements.isDataLoading" keeps the modal visibile as long as the data is loading
const measurements = useMeasurementStore()
</script>

<template>
  <CModal
    class="show d-block align-middle"
    :backdrop="static"
    transition="true"
    :alignment="center"
    :visible="false"
  >
    <CModalBody>
      <CRow class="align-items-center">
        <CButton>
          <CSpinner component="span" size="sm" aria-hidden="true" />
          Loading Data ...
        </CButton>
      </CRow>
    </CModalBody>
  </CModal>
</template>

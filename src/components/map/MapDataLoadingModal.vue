<script setup>
import { CModal, CModalBody, CRow, CSpinner, CCol } from '@coreui/bootstrap-vue'
import { useGHFDBStore } from '@/store/ghfdb'
import { useIndexDBStore } from '@/store/indexDBTools'

const ghfdb = useGHFDBStore()
const indexDB = useIndexDBStore()
</script>

<template>
  <CModal
    class="show d-block align-middle"
    :backdrop="ghfdb.inProcess"
    :transition="true"
    alignment="center"
    :visible="ghfdb.inProcess"
  >
    <CModalBody>
      <CRow class="d-flex justify-content-center">
        <CCol class="col-auto">
          <CSpinner component="span" size="sm" aria-hidden="true" />
        </CCol>
        <CCol class="col-auto"><p class="h6 my-auto">Loading GHFDB</p></CCol>
      </CRow>
      <div v-if="indexDB.hasGHFDB">
        <CRow class="d-flex justify-content-center">
          <CCol v-if="ghfdb.hasCSV" class="col-auto"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-check"
              viewBox="0 0 16 16"
            >
              <path
                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"
              />
            </svg>
          </CCol>
          <CCol class="col-auto"><p class="p my-auto">Fetch GHFDB</p></CCol>
        </CRow>
        <CRow class="d-flex justify-content-center">
          <CCol v-if="ghfdb.successfulConvertion" class="col-auto"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-check"
              viewBox="0 0 16 16"
            >
              <path
                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"
              />
            </svg>
          </CCol>
          <CCol class="col-auto">
            <p class="p my-auto">Convert CSV to GeoJSON</p>
          </CCol>
        </CRow>
        <CRow class="d-flex justify-content-center">
          <CCol v-if="ghfdb.successfulConvertion" class="col-auto"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-check"
              viewBox="0 0 16 16"
            >
              <path
                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"
              />
            </svg>
          </CCol>
          <CCol class="col-auto">
            <p class="p my-auto">Store GeoJSON in IndexDB</p>
          </CCol>
        </CRow>
      </div>
      <div v-if="indexDB.hasGHFDB">
        <CRow class="d-flex justify-content-center">
          <CCol v-if="ghfdb.successfulConvertion" class="col-auto"
            ><svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-check"
              viewBox="0 0 16 16"
            >
              <path
                d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z"
              />
            </svg>
          </CCol>
          <CCol class="col-auto">
            <p class="p my-auto">Get GHFDB from IndexDB</p>
          </CCol>
        </CRow>
      </div>
    </CModalBody>
  </CModal>
</template>

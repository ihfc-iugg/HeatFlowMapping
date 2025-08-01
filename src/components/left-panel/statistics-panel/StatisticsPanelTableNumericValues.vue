<script setup>
import { ref, defineProps, onMounted } from 'vue'
import { mean, std, median } from 'mathjs'
import Statistics from 'statistics.js'

import {
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
  CTooltip
} from '@coreui/bootstrap-vue'

import { useStatisticsStore } from '@/store/statistics'

const statisticsStore = useStatisticsStore()

const props = defineProps({ attributeValues: Array })

onMounted(() => {
  statisticsStore.setTableValues(props.attributeValues)
})
</script>

<template>
  <div>
    <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Measure</CTableHeaderCell>
          <CTableHeaderCell scope="col">Values</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow>
          <CTableHeaderCell scope="row">Min</CTableHeaderCell>
          <CTableDataCell>{{ statisticsStore.table.min }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Max</CTableHeaderCell>
          <CTableDataCell>{{ statisticsStore.table.max }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Mean</CTableHeaderCell>
          <CTableDataCell>{{ statisticsStore.table.mean }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Median</CTableHeaderCell>
          <CTableDataCell>{{ statisticsStore.table.median }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Std</CTableHeaderCell>
          <CTableDataCell>{{ statisticsStore.table.std }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Skewness</CTableHeaderCell>
          <CTableDataCell>{{ statisticsStore.table.skewness }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Kurtosis</CTableHeaderCell>
          <CTableDataCell>{{ statisticsStore.table.kurtosis }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row"
            >Count total
            <CTooltip content="Number of features" placement="right">
              <template #toggler="{ on }">
                <CButton color="secondary" v-on="on">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-info-circle"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path
                      d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
                    />
                  </svg>
                </CButton>
              </template>
            </CTooltip>
          </CTableHeaderCell>
          <CTableDataCell>{{ attributeValues.length }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row"
            >Count null
            <CTooltip content="Number of features with no value" placement="right">
              <template #toggler="{ on }">
                <CButton color="secondary" v-on="on">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    class="bi bi-info-circle"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                    <path
                      d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
                    />
                  </svg>
                </CButton>
              </template>
            </CTooltip>
          </CTableHeaderCell>
          <CTableDataCell>{{
            attributeValues.length - attributeValues.filter((n) => n).length
          }}</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </div>
</template>

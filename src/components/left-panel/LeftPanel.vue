<script setup>
import {
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
  CRow,
  CCol
} from '@coreui/bootstrap-vue'

import SettingsPanel from './settings-panel/SettingsPanel.vue'
import FilterPanal from './filter-panel/FilterPanal.vue'
import StatisticsPanal from './statistics-panel/StatisticsPanal.vue'
import AnalysisPanal from './analysis-panel/AnalysisPanal.vue'

import { useNavigationBarStore } from '@/store/navigationBar'

const navBar = useNavigationBarStore()
</script>

<template>
  <COffcanvasHeader class="" style="background-color: #2f5597; border-bottom: 5px solid #00c9a7">
    <CRow>
      <CCol><div class="col-md-auto text-light" v-html="navBar.panelIcon"></div></CCol>
      <CCol class="col-md-auto"
        ><COffcanvasTitle class="text-light">
          {{ navBar.panelTitle }}
        </COffcanvasTitle></CCol
      >
    </CRow>
    <CCloseButton
      class="text-reset btn-close-white"
      @click="(navBar.setIsCollapsed(), navBar.toggleVisibleScrolling())"
    />
  </COffcanvasHeader>
  <COffcanvasBody>
    <KeepAlive>
      <SettingsPanel v-if="navBar.panelTitle === 'Settings'" />
    </KeepAlive>
    <KeepAlive>
      <FilterPanal v-if="navBar.panelTitle === 'Filter'" />
    </KeepAlive>
    <KeepAlive>
      <StatisticsPanal v-if="navBar.panelTitle === 'Statistics'" />
    </KeepAlive>
    <KeepAlive>
      <AnalysisPanal v-if="navBar.panelTitle === 'Analysis'" />
    </KeepAlive>
  </COffcanvasBody>
</template>

<style scoped></style>

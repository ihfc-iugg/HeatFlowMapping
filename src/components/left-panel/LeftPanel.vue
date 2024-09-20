<script setup>
// import simplebar from "simplebar-vue";

import { defineEmits, defineProps } from 'vue'

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

import { Map } from 'maplibre-gl'

const props = defineProps({
  title: String,
  icon: String,
  map: Map
})

const emit = defineEmits(['collapse-event', 'toggle-event'])
</script>

<template>
  <COffcanvasHeader class="bg-primary">
    <CRow>
      <CCol><div class="text-white col-md-auto" v-html="props.icon"></div></CCol>
      <CCol class="col-md-auto"
        ><COffcanvasTitle class="text-white">
          {{ props.title }}
        </COffcanvasTitle></CCol
      >
    </CRow>
    <CCloseButton white class="text-reset" @click="emit('collapse-event'), emit('toggle-event')" />
  </COffcanvasHeader>
  <COffcanvasBody>
    <KeepAlive>
      <SettingsPanel v-if="props.title === 'Settings'" :map="props.map" />
    </KeepAlive>
    <KeepAlive>
      <FilterPanal v-if="props.title === 'Filter'" :map="props.map" />
    </KeepAlive>
    <KeepAlive>
      <StatisticsPanal v-if="props.title === 'Statistics'" :map="props.map" />
    </KeepAlive>
    <KeepAlive>
      <AnalysisPanal v-if="props.title === 'Analysis'" :map="props.map" />
    </KeepAlive>
  </COffcanvasBody>
</template>

<style scoped></style>

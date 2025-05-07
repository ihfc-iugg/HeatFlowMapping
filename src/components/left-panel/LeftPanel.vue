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
  <COffcanvasHeader class="" style="background-color: #2f5597; border-bottom: 5px solid #00c9a7">
    <CRow>
      <CCol><div class="col-md-auto text-light" v-html="props.icon"></div></CCol>
      <CCol class="col-md-auto"
        ><COffcanvasTitle class="text-light">
          {{ props.title }}
        </COffcanvasTitle></CCol
      >
    </CRow>
    <CCloseButton
      class="text-reset btn-close-white"
      @click="(emit('collapse-event'), emit('toggle-event'))"
    />
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

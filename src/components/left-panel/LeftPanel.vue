<script setup>
// import simplebar from "simplebar-vue";

import { defineEmits, defineProps } from "vue";

import {
  COffcanvasHeader,
  COffcanvasTitle,
  CCloseButton,
  COffcanvasBody,
} from "@coreui/bootstrap-vue";

import SettingsPanel from "./settings-panel/SettingsPanel.vue";
import FilterPanal from "./filter-panel/FilterPanal.vue";
import StatisticsPanal from "./statistics-panel/StatisticsPanal.vue";
import AnalysisPanal from "./analysis-panel/AnalysisPanal.vue";

import { Map } from "maplibre-gl";

const props = defineProps({
  title: String,
  map: Map,
  activeBaseLayer: String,
});

const emit = defineEmits(["collapse-event", "toggle-event"]);
</script>

<template>
  <COffcanvasHeader class="bg-primary">
    <COffcanvasTitle class="text-white">{{ props.title }}</COffcanvasTitle>
    <CCloseButton
      class="text-reset text-primary"
      @click="emit('collapse-event'), emit('toggle-event')"
    />
  </COffcanvasHeader>
  <COffcanvasBody>
    <SettingsPanel
      v-if="props.title === 'Settings'"
      :map="props.map"
      :activeBaseLayer="props.activeBaseLayer"
    />
    <FilterPanal v-if="props.title === 'Filter'" :map="props.map" />
    <StatisticsPanal v-if="props.title === 'Statistics'" />
    <AnalysisPanal v-if="props.title === 'Analysis'" />
  </COffcanvasBody>
</template>

<style scoped></style>

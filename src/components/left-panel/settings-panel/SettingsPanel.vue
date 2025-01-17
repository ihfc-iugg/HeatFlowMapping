<script setup>
import { defineProps, ref, watch } from 'vue'
import { Map } from 'maplibre-gl'

import SettingsPanelBaseMaps from './SettingsPanelBaseMaps.vue'
import SettingsPanelCircleRadius from './SettingsPanelCircleRadius.vue'
import SettingsPanelCircleColor from './SettingsPanelCircleColor.vue'
import SettingsPanelDataDrivenColoring from './SettingsPanelDataDrivenColoring.vue'

const props = defineProps({
  map: Map
})
</script>

<template>
  <BaseMaps :map="props.map" />

  <SettingsPanelCircleRadius :map="props.map" />

  <SettingsPanelCircleColor :map="props.map" />

  <SettingsPanelDataDrivenColoring :map="props.map" />
</template>

<style scoped></style>

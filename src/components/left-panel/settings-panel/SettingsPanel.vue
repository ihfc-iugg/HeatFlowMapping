<script setup>
import SettingsPanelBaseMaps from './SettingsPanelBaseMaps.vue'
import SettingsPanelCircleRadius from './SettingsPanelCircleRadius.vue'
import SettingsPanelCircleColor from './SettingsPanelCircleColor.vue'
import SettingsPanelDataDrivenColoring from './SettingsPanelDataDrivenColoring.vue'
import SettingsPanelDataModels from './SettingsPanelDataModels.vue'
import Accordion from '../Accordion.vue'
</script>

<template>
  <Accordion accordionId="settings-panel-accordion">
    <SettingsPanelBaseMaps />
    <SettingsPanelDataModels />
    <SettingsPanelDataDrivenColoring />
    <SettingsPanelCircleRadius />
    <SettingsPanelCircleColor />
  </Accordion>
</template>

<style scoped></style>

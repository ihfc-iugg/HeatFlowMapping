<script setup>
import { onMounted } from 'vue'

import Map from '@/modules/map/components/Map.vue'
import PanelSwitcherButtonGroup from '@/modules/panelSwitcher/components/PanelSwitcherButtonGroup.vue'
import Offcanvase from '@/modules/offcanvase/components/Offcanvase.vue'
import LayerPanelLayout from './LayerPanelLayout.vue'
import FilterPanelLayout from './FilterPanelLayout.vue'
import StatisticsPanelLayout from './StatisticsPanelLayout.vue'
import AnalysisPanelLayout from './AnalysisPanelLayout.vue'
import CursorLocation from '@/modules/cursorLocation/components/CursorLocation.vue'
import PointAttributeTablePopup from '@/modules/infoPopup/components/PointAttributeTablePopup.vue'

import { useSchemaStore } from '../stores/schema'
import { useApplicationStore } from '../stores/app'
import { useGHFDBStore } from '../stores/ghfdb.js'
import { useCircleStylingStore } from '@/modules/circleStyling/stores/circleStyling.js'
import { useDrawStore } from '../stores/draw.js'

import schemaURL from '@/shared/assets/data/Heatflow_worldAPI_Hardcoded.yaml'

const schema = useSchemaStore()
const app = useApplicationStore()
const ghfdb = useGHFDBStore()
const circle = useCircleStylingStore()
const draw = useDrawStore()

onMounted(async () => {
  app.geojson = await ghfdb.initData()
  ghfdb.addGhfdbToMap(app.map, app.geojson, circle.color, circle.radius)
  draw.setDraw(app.map)

  await schema.fetchDataSchema(schemaURL)
})
</script>

<template>
  <div class="wrapper vstack w-100 vh-100">
    <Map />
    <CursorLocation />
    <PointAttributeTablePopup />
    <PanelSwitcherButtonGroup />
    <Offcanvase v-if="app.selectedPanel">
      <LayerPanelLayout v-if="app.selectedPanel.id == 'layers'" />
      <FilterPanelLayout v-if="app.selectedPanel.id == 'filter'" />
      <StatisticsPanelLayout v-if="app.selectedPanel.id == 'statistics'" />
      <AnalysisPanelLayout v-if="app.selectedPanel.id == 'analysis'" />
    </Offcanvase>
  </div>
</template>

<style></style>

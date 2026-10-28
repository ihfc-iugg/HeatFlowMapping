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
import LegendControlPanel from '@/modules/legend/components/LegendControlPanel.vue'

import { useSchemaStore } from '../stores/schema'
import { useApplicationStore } from '../stores/app'
import { useGHFDBStore } from '../stores/ghfdb.js'
import { useDrawStore } from '../stores/draw.js'

import { CIRCLE } from '@/shared/constants/application.js'
import { SCHEMA } from '@/shared/constants/globalHeatFlowDatabase.js'

const schema = useSchemaStore()
const app = useApplicationStore()
const ghfdb = useGHFDBStore()
const draw = useDrawStore()

onMounted(async () => {
  app.geojson = await ghfdb.initData()
  ghfdb.addGhfdbToMap(
    app.map,
    app.geojson,
    CIRCLE.styling.defaultColor,
    CIRCLE.styling.defaultRadius
  )
  draw.setDraw(app.map)

  await schema.fetchDataSchema(SCHEMA.r2024.url)
})
</script>

<template>
  <div class="wrapper vstack w-100 vh-100">
    <Map />
    <CursorLocation />
    <PointAttributeTablePopup />
    <PanelSwitcherButtonGroup />
    <LegendControlPanel />
    <Offcanvase v-if="app.selectedPanel">
      <LayerPanelLayout v-if="app.selectedPanel.id == 'layers'" />
      <FilterPanelLayout v-if="app.selectedPanel.id == 'filter'" />
      <StatisticsPanelLayout v-if="app.selectedPanel.id == 'statistics'" />
      <AnalysisPanelLayout v-if="app.selectedPanel.id == 'analysis'" />
    </Offcanvase>
  </div>
</template>

<style></style>

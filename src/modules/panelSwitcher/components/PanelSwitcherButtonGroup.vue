<script setup>
import PanelSwitcherButton from './PanelSwitcherButton.vue'
import { usePanelSwitcherStore } from '../stores/panelSwitcher.js'
import { PANEL_THEMES } from '@/shared/constants/panelThemes.js'

const panelSwitcher = usePanelSwitcherStore()
</script>

<template>
  <div
    id="map-navbar"
    class="btn-group position-absolute bottom-0 start-50 translate-middle-x mb-3 bg-primary collapse show"
    role="group"
  >
    <!-- <div v-for="(value, key) in PANEL_THEMES" :key="key"> -->
    <PanelSwitcherButton
      v-for="(value, key) in PANEL_THEMES"
      :id="value.id"
      :title="value.title"
      :svg="value.svg"
      :panel="value"
      :key="key"
    />
  </div>
</template>

<style scoped></style>

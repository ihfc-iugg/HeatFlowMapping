<script setup>
import { useSettingsStore } from '@/store/settings'
import { useMapStore } from '@/store/map'

import AccordionItem from '../AccordionItem.vue'

const settings = useSettingsStore()
const mapStore = useMapStore()

/**
 * @description If user changes size of circles, the watch method keeps track of it and adjust it synchron
 * @param {number} circleRadius
 */
function setCircleRadius(circleRadius) {
  mapStore.map.setPaintProperty('ghfdb', 'circle-radius', parseInt(circleRadius))
}
</script>

<template>
  <AccordionItem title="Circle Radius" id="circleRadius">
    <input
      type="range"
      class="form-range"
      id="customRange1"
      min="0"
      step="1"
      max="10"
      v-model="settings.circleRadius"
      @input="setCircleRadius(settings.circleRadius)"
    />
    <span class="text-muted text-center">{{ settings.circleRadius }} px</span>
  </AccordionItem>
</template>

<style></style>

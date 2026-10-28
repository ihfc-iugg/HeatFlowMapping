<script setup>
import { useApplicationStore } from '@/core/stores/app'
import { useCircleStylingStore } from '../stores/circleStyling'
import CircleStylingContainer from './CircleStylingContainer.vue'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase'

import AccordionItem from '@/shared/components/AccordionItem.vue'

const app = useApplicationStore()
const circleStyling = useCircleStylingStore()

/**
 * @description If user changes size of circles, the watch method keeps track of it and adjust it synchron
 * @param {number} circleRadius
 */
function setCircleRadius(circleRadius) {
  app.map.setPaintProperty(GHFDB.r2024.id, 'circle-radius', parseInt(circleRadius))
}

/**
 * @description set Circle color
 * @param {String} colorHEX
 * @returns {Void}
 */
function setCircleColor(colorHEX) {
  if (app.map.getPaintProperty(GHFDB.r2024.id, 'circle-color') == colorHEX) {
    return
  } else {
    app.map.setPaintProperty(GHFDB.r2024.id, 'circle-color', colorHEX)
  }
}
</script>

<template>
  <AccordionItem title="Circle Styling" id="circleStyling">
    <CircleStylingContainer :id="radius" :title="'Radius'" :value="circleStyling.radius + 'px'">
      <input
        type="range"
        class="form-range"
        id="circleRadiusInput"
        min="0"
        step="1"
        max="10"
        v-model="circleStyling.radius"
        @input="setCircleRadius(circleStyling.radius)"
      />
    </CircleStylingContainer>

    <CircleStylingContainer :id="color" :title="'Color'" :value="circleStyling.color">
      <input
        type="color"
        class="form-control form-control-color"
        id="circleColorInput"
        v-model="circleStyling.color"
        title="Choose your color"
        @input="setCircleColor(circleStyling.color)"
      />
    </CircleStylingContainer>
  </AccordionItem>
</template>

<style></style>

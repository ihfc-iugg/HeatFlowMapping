<script setup>
import SelectProperty from '@/shared/components/SelectProperty.vue'
import { useCrossSectionStore } from '../stores/crossSection'
import { removeLayerAndSource, addOrientedBBoxToMap } from '../service'
import { useApplicationStore } from '@/core/stores/app'
import { buildCasePaintProperty } from '@/shared/utils/map/styling/buildPaintProerty'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase'
import { CIRCLE } from '@/shared/constants/application'

const crossSection = useCrossSectionStore()
const app = useApplicationStore()

/**
 * @description
 * @param {String} property
 * @param {String} dataType
 */
function handleSelection(property) {
  crossSection.property = property
}

function onInput() {
  removeLayerAndSource([crossSection.orientedBBoxId], crossSection.orientedBBoxId, app.map)
  addOrientedBBoxToMap(crossSection.orientedBBox, crossSection.orientedBBoxId, app.map)
  const expression = buildCasePaintProperty(
    crossSection.idsOfPntWithin,
    CIRCLE.styling.defaultColor,
    CIRCLE.styling.highlightColor
  )
  app.map.setPaintProperty(GHFDB.r2024.id, 'circle-color', expression)
}
</script>

<template>
  <form class="was-validated">
    <div id="" class="form-text">Select a property to plot on the Y-axis</div>
    <SelectProperty @select="handleSelection" :of-type="'number'" />

    <div id="" class="form-text">Radius for the buffer around the line [1 - 500 km]</div>
    <input
      v-model="crossSection.lineOffset"
      type="number"
      class="form-control"
      id="radius"
      required
      min="1"
      max="500"
      @keydown.enter.prevent
      @input="onInput()"
    />
    <div class="invalid-feedback">Please enter a buffer radius within 1-500 km</div>
  </form>
</template>

<style></style>

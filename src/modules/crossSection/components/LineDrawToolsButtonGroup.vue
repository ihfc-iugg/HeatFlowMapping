<script setup>
import { defineEmits } from 'vue'
import { restrictLineCoordinatesToTwoPoints, removePreviousLineStrings } from '../service'

import SlashSVG from '@/shared/assets/icons/slash-lg-bootstrap.svg'
import HandIndexSVG from '@/shared/assets/icons/hand-index-bootstrap.svg'
import TrashSVG from '@/shared/assets/icons/trash-bootstrap.svg'

import { useCrossSectionStore } from '../stores/crossSection'
import { useApplicationStore } from '@/core/stores/app'
import { removeLayerAndSource, addLineStringLable, addOrientedBBoxToMap } from '../service'
import { buildCasePaintProperty } from '@/shared/utils/map/styling/buildPaintProerty'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase'
import { COLORS } from '@/shared/constants/temperatureProfile'
import { CIRCLE } from '@/shared/constants/application'

const crossSection = useCrossSectionStore()
const app = useApplicationStore()
const featureInfoControl = app.controls.get('featureInfo')

const emit = defineEmits(['lineStringDeleted'])

/**
 * @description
 * @param {String} property
 * @param {String} dataType
 */
function deleteLineString() {
  emit('lineStringDeleted')
}

/**
 * @description
 */
function onDelete() {
  if (!crossSection.lineString) return
  // remove corridor polygon
  removeLayerAndSource([crossSection.orientedBBoxId], crossSection.orientedBBoxId, app.map)

  // remove labels
  const layers = [
    crossSection.orientedBBoxLabelId + 'Title',
    crossSection.orientedBBoxLabelId + 'Circle'
  ]
  removeLayerAndSource(layers, crossSection.orientedBBoxLabelId, app.map)

  // remove lineString from terradraw
  const lineStringID = crossSection.lineString.id
  app.draw.deselectFeature(lineStringID)
  app.draw.removeFeatures([lineStringID])
  crossSection.lineString = null
  app.map.setBearing(0)
  app.map.setPaintProperty(GHFDB.r2024.id, 'circle-color', CIRCLE.styling.defaultColor)
}

/**
 * @description
 * @param {Object} feature
 */
function onFinish(feature) {
  crossSection.lineString = feature
  addLineStringLable(feature, crossSection.orientedBBoxLabelId, app.map)
  addOrientedBBoxToMap(crossSection.orientedBBox, crossSection.orientedBBoxId, app.map)
  /**
   * array of ids of points within polygon
   * buldCasePaintProperty
   */
  const expression = buildCasePaintProperty(
    crossSection.idsOfPntWithin,
    CIRCLE.styling.defaultColor,
    CIRCLE.styling.highlightColor
  )
  app.map.setPaintProperty(GHFDB.r2024.id, 'circle-color', expression)
}

/**
 * @description Logic for drawing polygons.
 *
 */
app.draw.on('finish', (id, context) => {
  const features = app.draw.getSnapshot()
  const feature = features.filter((feature) => feature.id === id)[0]

  if (feature.geometry.type === 'LineString') {
    if (context.action === 'draw') {
      const featuresToRemove = removePreviousLineStrings(feature.id, features)
      app.draw.removeFeatures(featuresToRemove)
      let restrictedGeometry = restrictLineCoordinatesToTwoPoints(feature)
      app.draw.updateFeatureGeometry(feature.id, restrictedGeometry)
      onFinish(feature)
      app.draw.setMode('select')
    } else if (context.action === 'dragFeature') {
      onFinish(feature)
    } else if (context.action === 'dragCoordinate') {
      onFinish(feature)
    } else if (context.action === 'dragCoordinateResize') {
      onFinish(feature)
    }
  }
})
</script>

<template>
  <div class="d-flex align-items-center">
    <p class="flex-grow-1 mb-0">
      Draw a line onto which the selected data points are projected. A line is restricted to two
      coordintes to avoid complexity
    </p>

    <div
      class="btn-group-vertical"
      role="group"
      aria-label="Basic radio toggle button group"
      @click="featureInfoControl._disableFeatureInfo()"
    >
      <input
        type="radio"
        class="btn-check"
        name="btn-radio-cross-section-draw-toolbox"
        id="btnRadioCrossSectionLine"
        autocomplete="off"
      />
      <label
        class="btn btn-outline-success"
        for="btnRadioCrossSectionLine"
        title="Draw Line"
        @click="app.draw.setMode('linestring')"
      >
        <SlashSVG />
      </label>

      <input
        type="radio"
        class="btn-check"
        name="btn-radio-cross-section-draw-toolbox"
        id="btnRadioCrossSectionSelect"
        autocomplete="off"
      />
      <label
        class="btn btn-outline-success"
        for="btnRadioCrossSectionSelect"
        title="Select Line"
        @click="app.draw.setMode('select')"
      >
        <HandIndexSVG />
      </label>

      <input
        type="radio"
        class="btn-check"
        name="btn-radio-cross-section-draw-toolbox"
        id="btnRadioCrossSectionDelete"
        autocomplete="off"
      />
      <label
        class="btn btn-outline-success"
        for="btnRadioCrossSectionDelete"
        title="Delete Line"
        @click="(onDelete(), deleteLineString())"
      >
        <TrashSVG />
      </label>
    </div>
  </div>
</template>

<style></style>

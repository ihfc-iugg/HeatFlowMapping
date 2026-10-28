<script setup>
import { defineEmits } from 'vue'
import { useApplicationStore } from '@/core/stores/app'
import { useTemperatureProfileStore } from '../stores/temperatureProfile'
import { removePreviousPoints, highlightNearestPoint, nearestPoint } from '../service'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase'
import { CIRCLE } from '@/shared/constants/application'

import GeoAltSVG from '@/shared/assets/icons/geo-alt-bootstrap.svg'
import HandIndexSVG from '@/shared/assets/icons/hand-index-bootstrap.svg'
import TrashSVG from '@/shared/assets/icons/trash-bootstrap.svg'

const app = useApplicationStore()
const tempProfile = useTemperatureProfileStore()
const featureInfoControl = app.controls.get('featureInfo')

const emit = defineEmits(['pointDeleted'])

/**
 * @description
 */
function deletePoint() {
  emit('pointDeleted')
}

/**
 * @description
 */
function onDelete() {
  if (tempProfile.geoPoint) {
    const pointID = tempProfile.geoPoint.id
    app.draw.deselectFeature(pointID)
    app.draw.removeFeatures([pointID])
    tempProfile.layers = []
    tempProfile.geoPoint = null
    tempProfile.nearestPoint = null
    tempProfile.screenPoint = { x: null, y: null }
    tempProfile.mapBoundsSW = { lng: null, lat: null }
    tempProfile.mapBoundsNE = { lng: null, lat: null }
    tempProfile.mapCanvas = { width: null, height: null }
    app.map.setPaintProperty(GHFDB.r2024.id, 'circle-color', CIRCLE.styling.defaultColor)
  }
}

/**
 * @description Logic for drawing polygons.
 */
app.draw.on('finish', async (id, context) => {
  const features = app.draw.getSnapshot()
  const feature = features.filter((feature) => feature.id === id)[0]
  if (feature.geometry.type === 'Point') {
    if (context.action === 'draw') {
      const pointsToRemove = removePreviousPoints(feature.id, features)
      app.draw.removeFeatures(pointsToRemove)
      tempProfile.geoPoint = feature
      tempProfile.nearestPoint = nearestPoint(tempProfile.geoPoint, app.geojson)
      const highlightNearesPoint = highlightNearestPoint(tempProfile.nearestPoint.id)
      app.map.setPaintProperty(GHFDB.r2024.id, 'circle-color', highlightNearesPoint)
      app.draw.setMode('select')
    } else if (context.action === 'dragFeature') {
      tempProfile.geoPoint = feature
      tempProfile.nearestPoint = nearestPoint(tempProfile.geoPoint, app.geojson)
      const highlightNearesPoint = highlightNearestPoint(tempProfile.nearestPoint.id)
      app.map.setPaintProperty(GHFDB.r2024.id, 'circle-color', highlightNearesPoint)
    } else if (context.action === 'dragCoordinate') {
      tempProfile.geoPoint = feature
      tempProfile.nearestPoint = nearestPoint(tempProfile.geoPoint, app.geojson)
      const highlightNearesPoint = highlightNearestPoint(tempProfile.nearestPoint.id)
      app.map.setPaintProperty(GHFDB.r2024.id, 'circle-color', highlightNearesPoint)
    } else if (context.action === 'dragCoordinateResize') {
      tempProfile.geoPoint = feature
    }
  }
})

/**
 * @description
 */
app.map.on('click', async function (e) {
  if (app.selectedPanel.id == 'analysis') {
    tempProfile.screenPoint = e.point
    tempProfile.mapBoundsSW = app.map.getBounds()._sw
    tempProfile.mapBoundsNE = app.map.getBounds()._ne
    tempProfile.mapCanvas = app.map.getCanvas()
  }
})
</script>

<template>
  <div class="d-flex align-items-center">
    <p class="flex-grow-1 mb-0">Draw a point where your digital borehole should be calculated</p>
    <div
      class="btn-group-vertical"
      role="group"
      aria-label="Basic radio toggle button group"
      @click="featureInfoControl._disableFeatureInfo()"
    >
      <input
        type="radio"
        class="btn-check"
        name="btn-radio-temp-profile-draw-toolbox"
        id="btnRadioTempPoint"
        autocomplete="off"
      />
      <label
        class="btn btn-outline-success"
        for="btnRadioTempPoint"
        title="Draw Point"
        @click="app.draw.setMode('point')"
      >
        <GeoAltSVG />
      </label>

      <input
        type="radio"
        class="btn-check"
        name="btn-radio-temp-profile-draw-toolbox"
        id="btnRadioTempSelect"
        autocomplete="off"
      />
      <label
        class="btn btn-outline-success"
        for="btnRadioTempSelect"
        title="Select Point"
        @click="app.draw.setMode('select')"
      >
        <HandIndexSVG />
      </label>

      <input
        type="radio"
        class="btn-check"
        name="btn-radio-temp-profile-draw-toolbox"
        id="btnRadioTempDelete"
        autocomplete="off"
      />
      <label
        class="btn btn-outline-success"
        for="btnRadioTempDelete"
        title="Delete Point"
        @click="(onDelete(), deletePoint())"
      >
        <TrashSVG />
      </label>
    </div>
  </div>
</template>

<style></style>

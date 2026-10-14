<script setup>
import { useSpatialFilterStore } from '../stores/spatialFilter'
import { useApplicationStore } from '@/core/stores/app'
import BoundingBoxSVG from '@/shared/assets/icons/bounding-box-circles-bootstrap.svg'
import HandIndexSVG from '@/shared/assets/icons/hand-index-bootstrap.svg'
import TrashSVG from '@/shared/assets/icons/trash-bootstrap.svg'

const spatialFilter = useSpatialFilterStore()
const app = useApplicationStore()
const featureInfoControl = app.controls.get('featureInfo')

/**
 * @description
 */
function onDelete() {
  const polygonID = app.spatialFilter[spatialFilter.uuid].drawId
  app.draw.deselectFeature(polygonID)
  app.draw.removeFeatures([polygonID])
  spatialFilter.resetFilterObject()
}

/**
 * @description
 * @param id
 * @param features
 */
function onFinish(id, features) {
  app.spatialFilter[spatialFilter.uuid].feature = getFeature(id, features)
  app.spatialFilter[spatialFilter.uuid].expression = spatialFilter.writeFilterExpression(
    app.spatialFilter[spatialFilter.uuid].feature
  )
}

/**
 * @description
 * @param {String} id
 * @param {Array} features
 */
function removePrevious(id, features) {
  if (!Array.isArray(features)) {
    return
  }
  let idsToRemove = []
  for (const feature of features) {
    if ((feature.id != id) & (feature.geometry.type === 'Polygon')) {
      console.log(feature.geometry.type)
      idsToRemove.push(feature.id)
    }
  }
  app.draw.removeFeatures(idsToRemove)
}

/**
 * @description
 * @param {String} id
 * @param {Array} features
 */
function getFeature(id, features) {
  if (!Array.isArray(features)) {
    return
  }
  for (const feature of features) {
    const type = feature.geometry.type
    if (feature.id == id && type == 'Polygon') {
      return feature
    }
  }
}

/**
 * @description Logic for drawing polygons.
 *
 */
app.draw.on('finish', (id, context) => {
  const features = app.draw.getSnapshot()
  const feature = features.filter((feature) => feature.id === id)[0]
  if (feature.geometry.type === 'Polygon') {
    if (context.action === 'draw') {
      removePrevious(id, features)
      spatialFilter.setDrawID(id)
      onFinish(id, features)
      app.draw.setMode('select')
    } else if (context.action === 'dragFeature') {
      onFinish(id, features)
    } else if (context.action === 'dragCoordinate') {
      onFinish(id, features)
    } else if (context.action === 'dragCoordinateResize') {
      onFinish(id, features)
    }
  }
})
</script>

<template>
  <div
    class="btn-group-vertical"
    role="group"
    aria-label="Basic radio toggle button group"
    @click="featureInfoControl._disableFeatureInfo()"
  >
    <input
      type="radio"
      class="btn-check"
      name="btn-radio-filter-draw-toolbox"
      id="btnFilterradio1"
      autocomplete="off"
    />
    <label
      class="btn btn-outline-success"
      for="btnFilterradio1"
      title="Draw Polygon"
      @click="(spatialFilter.addFilterObject(), app.draw.setMode('polygon'))"
    >
      <BoundingBoxSVG />
    </label>

    <input
      type="radio"
      class="btn-check"
      name="btn-radio-filter-draw-toolbox"
      id="btnFilterradio2"
      autocomplete="off"
    />
    <label
      class="btn btn-outline-success"
      for="btnFilterradio2"
      title="Select Polygon"
      @click="app.draw.setMode('select')"
    >
      <HandIndexSVG />
    </label>

    <input
      type="radio"
      class="btn-check"
      name="btn-radio-filter-draw-toolbox"
      id="btnFilterradio3"
      autocomplete="off"
    />
    <label
      class="btn btn-outline-success"
      for="btnFilterradio3"
      title="Delete Selected Polygon"
      @click="onDelete()"
    >
      <TrashSVG />
    </label>
  </div>
</template>

<style></style>

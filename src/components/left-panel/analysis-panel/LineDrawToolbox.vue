<script setup>
import { Map } from 'maplibre-gl'
import { CTooltip } from '@coreui/bootstrap-vue'
// import { useDataSchemaStore } from '@/store/dataSchema'
import { use2DProfileStore } from '@/store/2DProfile'
import { useMapControlsStore } from '@/store/mapControls.js'

const profile = use2DProfileStore()
const mapControls = useMapControlsStore()

const props = defineProps({ map: Map })

/**
 * @description change mode to draw points
 */
function drawPoint() {
  mapControls.mapboxDraw.changeMode('draw_line_string')
  console.log('mode: ' + mapControls.mapboxDraw.getMode())
}

/**
 * @description trash selected point feature
 */
function deletePoint() {
  console.log(mapControls.mapboxDraw)
  mapControls.mapboxDraw.trash()
}

/**
 * @description deletes other drawn point features, so only one is allowed
 * @param {String} pointToKeepID
 */
function deletePreviosDrawnPoints(lineToKeepID) {
  const features = mapControls.mapboxDraw.getAll().features

  features.forEach((feature) => {
    if (feature.geometry.type == 'LineString' && feature.id != lineToKeepID) {
      console.log('id ' + lineToKeepID)
      mapControls.mapboxDraw.delete(feature.id)
    }
  })
}

/**
 * @description
 */
props.map.on('draw.create', (e) => {
  if (e.features[0].geometry.type == 'LineString') {
    profile.line = e.features[0]
    const collection = profile.lineStringToPointFeatureCollection(
      e.features[0].geometry.coordinates
    )
    profile.addLineLabelToMap(props.map, collection)
    deletePreviosDrawnPoints(profile.line.id)
  }
})

/**
 * @description
 */
props.map.on('draw.update', (e) => {
  if (e.features[0].geometry.type == 'LineString') {
    profile.line = e.features[0]
    if (props.map.getSource('lineLable')) {
      props.map.removeLayer('lineLable')
      props.map.removeSource('lineLable')
    }
    const collection = profile.lineStringToPointFeatureCollection(
      e.features[0].geometry.coordinates
    )
    profile.addLineLabelToMap(props.map, collection)
    deletePreviosDrawnPoints(profile.line.id)
  }
})

/**
 * @description
 */
props.map.on('draw.delete', (e) => {
  if (e.features[0].geometry.type == 'LineString') {
    profile.line = null
    profile.pointsWithinDistance = []
    props.map.removeLayer('lineLable')
    props.map.removeSource('lineLable')
  }
})
</script>

<template>
  <div class="card-body">
    <h6>Toolbox</h6>
    <p>Draw a line onto which the selected data points are projected</p>
    <CTooltip content="Draw line" placement="bottom">
      <template #toggler="{ on }">
        <button id="draw-point-btn" class="btn btn-primary mx-1" v-on="on" @click="drawPoint()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-slash-lg"
            viewBox="0 0 16 16"
          >
            <path
              fill-rule="evenodd"
              d="M13.854 2.146a.5.5 0 0 1 0 .708l-11 11a.5.5 0 0 1-.708-.708l11-11a.5.5 0 0 1 .708 0"
            />
          </svg>
        </button>
      </template>
    </CTooltip>

    <CTooltip content="Delete selected line" placement="bottom">
      <template #toggler="{ on }">
        <button id="delete-point-btn" class="btn btn-primary mx-1" v-on="on" @click="deletePoint()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"
            />
            <path
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"
            />
          </svg>
        </button>
      </template>
    </CTooltip>
    <p>Threshold: {{ profile.threshold ? profile.threshold : '-' }}</p>
  </div>
</template>

<style></style>

<script setup>
import { ref } from 'vue'
import { Map } from 'maplibre-gl'
import { CTooltip } from '@coreui/bootstrap-vue'
// import { useDataSchemaStore } from '@/store/dataSchema'
import { use2DProfileStore } from '@/store/2DProfile'
import { useMapControlsStore } from '@/store/mapControls.js'
import { useSettingsStore } from '@/store/settings.js'

const profile = use2DProfileStore()
const mapControls = useMapControlsStore()
const settings = useSettingsStore()

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

function allowOnlyTwoPoints(feature, originalFeature) {
  if (feature.geometry.coordinates.length > 2) {
    // If there are more than 2 coordinates, slice the coordinates array to keep only the first 2
    feature.geometry.coordinates = feature.geometry.coordinates.slice(0, 2)

    // Remove the original feature and add the modified one with only 2 coordinates
    mapControls.mapboxDraw.delete(originalFeature.id) // Delete the original feature
    mapControls.mapboxDraw.add(feature) // Add the modified feature with only 2 coordinates

    try {
      // Remove the original feature and add the modified one with only 2 coordinates
      mapControls.mapboxDraw.delete(originalFeature.id) // Delete the original feature
      mapControls.mapboxDraw.add(feature) // Add the modified feature with only 2 coordinates
    } catch (error) {
      console.log(error)
    }

    // Optionally, you can alert or notify the user that only 2 points are allowed
    alert('You can only draw a LineString with 2 points.')
  } else {
    return
  }
}

/**
 * @description
 */
props.map.on('draw.create', (e) => {
  const feature = e.features[0]
  if (feature.geometry.type == 'LineString') {
    allowOnlyTwoPoints(feature, e.features[0])
    profile.line = feature
    const collection = profile.lineStringToPointFeatureCollection(feature.geometry.coordinates)
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
    console.log('läuft')
    profile.line = null
    profile.pointsWithinDistance = []
    // profile.popup.remove()
    // profile.marker.remove()
    profile.plot = ref(null)
    props.map.removeLayer('lineLable')
    props.map.removeSource('lineLable')
    props.map.setPaintProperty('sites', 'circle-color', settings.circleColor)
  }
})

// TODO: add something like this to code to avoid lineSTrings with more than two coordinates
// map.on('draw.create', function (e) {
//   const feature = e.features[0] // The newly created feature
//   if (feature.geometry.type === 'LineString' && feature.geometry.coordinates.length !== 2) {
//     // If it's a LineString but not exactly two coordinates
//     // Remove the last created feature
//     draw.delete(feature.id)
//     alert('You can only create a LineString with exactly two coordinates!')
//   }
// })

// // Optionally, listen for the draw.update event if you want to restrict updates
// map.on('draw.update', function (e) {
//   const feature = e.features[0]
//   if (feature.geometry.type === 'LineString' && feature.geometry.coordinates.length !== 2) {
//     // If the updated LineString doesn't have exactly two coordinates, reset it
//     draw.delete(feature.id)
//     alert('A LineString must always have exactly two coordinates!')
//   }
// })
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

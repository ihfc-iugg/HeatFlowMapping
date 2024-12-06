<script setup>
import { ref, defineProps, onMounted } from 'vue'
import { Map } from 'maplibre-gl'
import { CTooltip } from '@coreui/bootstrap-vue'
import { useDigitalBoreholeStore } from '@/store/digitalBorehole'
import { useMapControlsStore } from '@/store/mapControls.js'
import { useMeasurementStore } from '@/store/measurements.js'
import { useSettingsStore } from '@/store/settings.js'

const dB = useDigitalBoreholeStore()
const mapControls = useMapControlsStore()
const measurements = useMeasurementStore()
const dataPoints = ref(measurements.geojson)
const settings = useSettingsStore()

const props = defineProps({ map: Map })

/**
 * @description change mode to draw points
 */
function drawPoint() {
  mapControls.mapboxDraw.changeMode('draw_point')
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
 * @description sequence of functions when new point gets drawn
 */
props.map.on('draw.create', (e) => {
  if (e.features[0].geometry.type == 'Point') {
    dB.pnt = e.features[0]
    dB.deletePreviosDrawnPoints(dB.pnt.id)
    dB.closestPointfeatures = dB.getNearestNeighbor(
      dB.pnt.geometry.coordinates,
      dataPoints.value.features
    )
    dB.highlightNearestNeighbor(
      dB.closestPointfeatures.properties.ID,
      props.map,
      settings.circleColor
    )
    console.log(dB.hasPopup)
    console.log(dB.hasPopup)
    // dB.setUpPopup(dB.pnt, props.map)
    // dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
    // dB.drawChart(dB.layers, dB.t0)
  }
})

/**
 * @description sequence of functions when point gets deleted
 */
props.map.on('draw.delete', (e) => {
  if (e.features[0] == dB.pnt) {
    dB.closestPointfeatures = null
    dB.pnt = null
  }
  dB.popup.remove()
  dB.popup = null
  dB.marker.remove()
  dB.marker = null
  props.map.setPaintProperty('sites', 'circle-color', settings.circleColor)
})

/**
 * @description sequence of functions when existing point gets moved
 */
props.map.on('draw.update', (e) => {
  if (e.features[0].geometry.type == 'Point') {
    dB.pnt = e.features[0]
    dB.closestPointfeatures = dB.getNearestNeighbor(
      dB.pnt.geometry.coordinates,
      dataPoints.value.features
    )
    dB.highlightNearestNeighbor(
      dB.closestPointfeatures.properties.ID,
      props.map,
      settings.circleColor
    )
    // dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
    // dB.setUpPopup(dB.pnt, props.map)
    // dB.drawChart(dB.layers, dB.t0)
  }
})
</script>

<template>
  <div class="card-body">
    <h6>Toolbox</h6>
    <p>Draw a point where your digital borehole should be calculated</p>
    <CTooltip content="Draw Point" placement="bottom">
      <template #toggler="{ on }">
        <button id="draw-point-btn" class="btn btn-primary mx-1" v-on="on" @click="drawPoint()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-geo-alt"
            viewBox="0 0 16 16"
          >
            <path
              d="M12.166 8.94c-.524 1.062-1.234 2.12-1.96 3.07A32 32 0 0 1 8 14.58a32 32 0 0 1-2.206-2.57c-.726-.95-1.436-2.008-1.96-3.07C3.304 7.867 3 6.862 3 6a5 5 0 0 1 10 0c0 .862-.305 1.867-.834 2.94M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10"
            />
            <path d="M8 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4m0 1a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
          </svg>
        </button>
      </template>
    </CTooltip>

    <CTooltip content="Delete selected Point" placement="bottom">
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
  </div>
</template>

<style></style>

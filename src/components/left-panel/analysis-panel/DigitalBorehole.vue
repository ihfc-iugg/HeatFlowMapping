<script setup>
import { ref, defineProps, watch } from 'vue'
import { Map } from 'maplibre-gl'
import * as turf from '@turf/turf'
import { newPlot } from 'plotly.js-dist'
import { useMapControlsStore } from '@/store/mapControls.js'
import { useDigitalBoreholeStore } from '@/store/digitalBorehole'
import { useMeasurementStore } from '@/store/measurements.js'
import { useSettingsStore } from '@/store/settings.js'
import { CTooltip } from '@coreui/bootstrap-vue'
import CustomParameters from '@/components/left-panel/analysis-panel/CustomParameters.vue'
import AboutBootstrapping from '@/components/left-panel/analysis-panel/AboutBootstrapping.vue'

const props = defineProps({ map: Map })
const mapControls = useMapControlsStore()
const dB = useDigitalBoreholeStore()
const measurements = useMeasurementStore()
const dataPoints = ref(measurements.geojson)
const settings = useSettingsStore()

const drawnReferencePnt = ref(null)
const closestPointfeatures = ref(null)

dB.setLayer(null, null, null, null, 2.3, 100, 0.029, 'sediment')
dB.setLayer(null, null, null, null, 5, 200, 0.2, 'dolomite')
dB.setLayer(null, null, null, null, 1.4, 300, 0.003, 'anhydrite')
dB.setLayer(null, null, null, null, 1.5, 200, 0.23, 'sample')

/**
 * triggers recalculation when users change parameters of layers
 */
watch(dB.layers, () => {
  dB.bootstrapping(dB.layers, 20, 10)
  drawChart(dB.layers, dB.t0)
})

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
 * @description deletes other drawn point features, so only one is allowed
 * @param {String} pointToKeepID
 */
function deletePreviosDrawnPoints(pointToKeepID) {
  const features = mapControls.mapboxDraw.getAll().features

  features.forEach((feature) => {
    if (feature.geometry.type == 'Point' && feature.id != pointToKeepID) {
      console.log('id ' + pointToKeepID)
      mapControls.mapboxDraw.delete(feature.id)
    }
  })
}

/**
 * @description returns nearest point feature respectively to reference point
 * @param {Array} referencePointCoordinates
 * @param {Array} dataPoints
 * @returns {Object} GeoJSON Point Feature
 */
function getNearestNeighbor(referencePointCoordinates, dataPoints) {
  let minDistance = Infinity
  let closestPoint = null

  dataPoints.forEach((feature) => {
    const pointCoordinates = feature.geometry.coordinates
    const distance = turf.distance(referencePointCoordinates, pointCoordinates)
    if (distance < minDistance) {
      minDistance = distance
      closestPoint = feature
    }
  })
  return closestPoint
}

/**
 * @description colors nearest neighbor red
 * @param {String} pointID
 */
function highlightNearestNeighbor(pointID) {
  const paintProperty = [
    'case',
    ['==', ['get', 'ID'], closestPointfeatures.value.properties.ID],
    'red',
    settings.circleColor
  ]

  props.map.setPaintProperty('sites', 'circle-color', paintProperty)
}

/**
 * @description sequence of functions when new point gets drawn
 */
props.map.on('draw.create', (e) => {
  if (e.features[0].geometry.type == 'Point') {
    drawnReferencePnt.value = e.features[0]
    deletePreviosDrawnPoints(drawnReferencePnt.value.id)
    closestPointfeatures.value = getNearestNeighbor(
      drawnReferencePnt.value.geometry.coordinates,
      dataPoints.value.features
    )
    highlightNearestNeighbor(closestPointfeatures.value.properties.ID)
    dB.bootstrapping(dB.layers, dB.t0, closestPointfeatures.value.properties.q)
    drawChart(dB.layers, dB.t0)
  }
})

/**
 * @description sequence of functions when point gets deleted
 */
props.map.on('draw.delete', (e) => {
  if (e.features[0] == drawnReferencePnt.value) {
    closestPointfeatures.value = null
    drawnReferencePnt.value = null
  }
  props.map.setPaintProperty('sites', 'circle-color', settings.circleColor)
})

/**
 * @description sequence of functions when existing point gets moved
 */
props.map.on('draw.update', (e) => {
  if (e.features[0].geometry.type == 'Point') {
    drawnReferencePnt.value = e.features[0]
    closestPointfeatures.value = getNearestNeighbor(
      drawnReferencePnt.value.geometry.coordinates,
      dataPoints.value.features
    )
    highlightNearestNeighbor(closestPointfeatures.value.properties.ID)
    dB.bootstrapping(dB.layers, dB.t0, closestPointfeatures.value.properties.q)
    drawChart(dB.layers, dB.t0)
  }
})

/**
 * @description logic for drawing graph of temperature as function of depth
 * @param {Array} layers
 * @param {number} t0
 */
function drawChart(layers, t0) {
  const temperature = layers.map((layer) => layer.tBot)
  temperature.unshift(t0)
  const depth = layers
    .map((layer) => layer.dZ)
    .map(
      (
        (sum) => (value) =>
          (sum += value)
      )(0)
    )
  depth.unshift(0)

  // Data
  const plotData = {
    x: temperature,
    y: depth,
    type: 'scatter',
    mode: 'lines+markers',
    marker: { color: 'blue' },
    textposition: 'top center',
    hoverinfo: 'text+x+y'
  }

  // Annotation of layer within graph
  const annotations = depth.map((d) => {
    if (depth.indexOf(d) != 0) {
      return {
        showarrow: false,
        text: 'layer ' + depth.indexOf(d) + '<br>' + dB.layers[depth.indexOf(d) - 1].layerType,
        align: 'right',
        x: 0,
        xanchor: 'right',
        y: d,
        yanchor: 'bottom'
      }
    }
  })

  // Boundary of layer within graph
  const shapes = depth.map((d) => ({
    type: 'line',
    xref: 'paper',
    x0: 0,
    y0: d,
    x1: 1,
    y1: d,
    line: {
      color: 'brown',
      width: 2,
      dash: 'dot'
    }
  }))

  // styling
  const layout = {
    title: '',
    xaxis: {
      title: 'Temperature (°C)',
      side: 'top',
      autorange: true
    },
    yaxis: {
      title: 'Depth (m)',
      // autorange: true
      range: [Math.max(...depth) + 10, 0]
    },
    shapes: shapes,
    annotations: annotations
  }

  newPlot('lineChart', [plotData], layout)
}
</script>

<template>
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

  <AboutBootstrapping />

  <!-- <div v-if="closestPointfeatures">
    <h3>Nearest-Neighbor</h3>
    <CTable>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Propertie</CTableHeaderCell>
          <CTableHeaderCell scope="col">Value</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="propertie in Object.keys(closestPointfeatures.properties)">
          <CTableHeaderCell scope="row">{{
            dataSchema.properties[propertie].title
          }}</CTableHeaderCell>
          <CTableDataCell>{{ closestPointfeatures.properties[propertie] }}</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </div> -->

  <div id="lineChart" sclass="w-100 h-100 d-inline-block"></div>

  <CustomParameters v-if="closestPointfeatures" />
</template>

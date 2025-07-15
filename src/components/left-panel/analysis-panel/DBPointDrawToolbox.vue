<script setup>
import { defineProps } from 'vue'
import { Map } from 'maplibre-gl'
import { CTooltip } from '@coreui/bootstrap-vue'
import { useDigitalBoreholeStore } from '@/store/digitalBorehole'

import { useGHFDBStore } from '@/store/ghfdb'
import { useSettingsStore } from '@/store/settings.js'
import { useDrawStore } from '@/store/draw'
import { useMapStore } from '@/store/map'

const dB = useDigitalBoreholeStore()
const ghfdb = useGHFDBStore()
const settings = useSettingsStore()
const draw = useDrawStore()
const mapStore = useMapStore()

const props = defineProps({ map: Map })

/**
 * @description trash selected point feature
 * @param {Object} selectedFeature
 */
function deletePoint(selectedFeature) {
  if (selectedFeature && selectedFeature.geometry.type === 'Point') {
    draw.tools.deselectFeature(selectedFeature.id)
    draw.tools.removeFeatures([selectedFeature.id])
    draw.selectedFeature = null
    dB.closestPointfeatures = null
    dB.pnt = null
    dB.popup.remove()
    dB.popup = null
    dB.marker.remove()
    dB.marker = null
    mapStore.map.setPaintProperty('ghfdb', 'circle-color', settings.circleColor)
  }
}

/**
 * @description
 */
draw.tools.on('finish', (id, context) => {
  let feature = draw.tools.getSnapshot().filter((feature) => feature.id === id)[0]
  console.log(id)
  console.log(context)
  if (!(feature.geometry.type === 'Point')) {
    return
  } else {
    if (context.action === 'draw') {
      draw.selectedFeature = feature
      const featuresToRemove = draw.getFeatureIdsToRemove(draw.tools.getSnapshot(), feature)
      draw.tools.removeFeatures(featuresToRemove)
      dB.pnt = feature
      dB.closestPointfeatures = dB.getNearestNeighbor(
        dB.pnt.geometry.coordinates,
        ghfdb.geojson.features
      )
      dB.highlightNearestNeighbor(
        dB.closestPointfeatures.properties.ID,
        mapStore.map,
        settings.circleColor
      )
      draw.tools.setMode('select')
    } else if (context.action === 'dragFeature') {
      draw.selectedFeature = feature
      const featuresToRemove = draw.getFeatureIdsToRemove(draw.tools.getSnapshot(), feature)
      draw.tools.removeFeatures(featuresToRemove)
      dB.pnt = feature
      dB.closestPointfeatures = dB.getNearestNeighbor(
        dB.pnt.geometry.coordinates,
        ghfdb.geojson.features
      )
      dB.highlightNearestNeighbor(
        dB.closestPointfeatures.properties.ID,
        mapStore.map,
        settings.circleColor
      )
    }
  }
})

/**
 * @description
 */
draw.tools.on('select', (id) => {
  draw.selectedFeature = draw.tools.getSnapshot().filter((feature) => feature.id === id)[0]
})
</script>

<template>
  <div class="card-body">
    <h6>Toolbox</h6>
    <p>Draw a point where your digital borehole should be calculated</p>
    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
      <input
        type="radio"
        class="btn-check"
        name="btn-radio-draw-toolbox"
        id="btnradio1"
        autocomplete="off"
      />
      <label
        class="btn btn-outline-secondary"
        for="btnradio1"
        title="Draw Point"
        @click="draw.tools.setMode('point')"
        ><svg
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
      </label>

      <input
        type="radio"
        class="btn-check"
        name="btn-radio-draw-toolbox"
        id="btnradio2"
        autocomplete="off"
      />
      <label
        class="btn btn-outline-secondary"
        for="btnradio2"
        title="Select Point"
        @click="draw.tools.setMode('select')"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-hand-index"
          viewBox="0 0 16 16"
        >
          <path
            d="M6.75 1a.75.75 0 0 1 .75.75V8a.5.5 0 0 0 1 0V5.467l.086-.004c.317-.012.637-.008.816.027.134.027.294.096.448.182.077.042.15.147.15.314V8a.5.5 0 1 0 1 0V6.435l.106-.01c.316-.024.584-.01.708.04.118.046.3.207.486.43.081.096.15.19.2.259V8.5a.5.5 0 0 0 1 0v-1h.342a1 1 0 0 1 .995 1.1l-.271 2.715a2.5 2.5 0 0 1-.317.991l-1.395 2.442a.5.5 0 0 1-.434.252H6.035a.5.5 0 0 1-.416-.223l-1.433-2.15a1.5 1.5 0 0 1-.243-.666l-.345-3.105a.5.5 0 0 1 .399-.546L5 8.11V9a.5.5 0 0 0 1 0V1.75A.75.75 0 0 1 6.75 1M8.5 4.466V1.75a1.75 1.75 0 1 0-3.5 0v5.34l-1.2.24a1.5 1.5 0 0 0-1.196 1.636l.345 3.106a2.5 2.5 0 0 0 .405 1.11l1.433 2.15A1.5 1.5 0 0 0 6.035 16h6.385a1.5 1.5 0 0 0 1.302-.756l1.395-2.441a3.5 3.5 0 0 0 .444-1.389l.271-2.715a2 2 0 0 0-1.99-2.199h-.581a5 5 0 0 0-.195-.248c-.191-.229-.51-.568-.88-.716-.364-.146-.846-.132-1.158-.108l-.132.012a1.26 1.26 0 0 0-.56-.642 2.6 2.6 0 0 0-.738-.288c-.31-.062-.739-.058-1.05-.046zm2.094 2.025"
          />
        </svg>
      </label>

      <input
        type="radio"
        class="btn-check"
        name="btn-radio-draw-toolbox"
        id="btnradio3"
        autocomplete="off"
      />
      <label
        class="btn btn-outline-secondary"
        for="btnradio3"
        title="Delete Point"
        @click="deletePoint(draw.selectedFeature)"
        ><svg
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
      </label>
    </div>
  </div>
</template>

<style></style>

<script setup>
import { ref } from 'vue'
import { useApplicationStore } from '@/core/stores/app'
import { useTemperatureProfileStore } from '../stores/temperatureProfile'
import { useWMS } from '@/core/composables/useWMS'
import { nearestPoint as turfNearestPoint } from '@turf/turf'
import { feature } from '@turf/turf'
import axios from 'axios'
import { event } from 'jquery'
// import { defineProps } from 'vue'
// import { Map } from 'maplibre-gl'
// import { useDigitalBoreholeStore } from '@/modules/profileAlongDepth/stores/digitalBorehole'

// import { useGHFDBStore } from '@/modules/shared/stores/ghfdb'
// import { useSettingsStore } from '@/modules/shared/stores/settings.js'
// import { useDrawStore } from '@/modules/shared/stores/draw'
// import { useMapStore } from '@/store/map'

// const dB = useDigitalBoreholeStore()
// const ghfdb = useGHFDBStore()
// const settings = useSettingsStore()
// const draw = useDrawStore()
// const mapStore = useMapStore()

// const props = defineProps({ map: Map })

const app = useApplicationStore()
const tempProfile = useTemperatureProfileStore()
const { getFeatureInfo } = useWMS()

// /**
//  * @description trash selected point feature
//  * @param {Object} selectedFeature
//  */
// function deletePoint(selectedFeature) {
//   if (selectedFeature && selectedFeature.geometry.type === 'Point') {
//     draw.tools.deselectFeature(selectedFeature.id)
//     draw.tools.removeFeatures([selectedFeature.id])
//     draw.selectedFeature = null
//     dB.closestPointfeatures = null
//     dB.pnt = null
//     dB.popup.remove()
//     dB.popup = null
//     dB.marker.remove()
//     dB.marker = null
//     mapStore.map.setPaintProperty('ghfdb', 'circle-color', settings.circleColor)
//   }
// }

// /**
//  * @description Handles the finish event of the draw tool. It checks if the drawn feature is a point and updates the digital borehole store accordingly.
//  */
// draw.tools.on('finish', (id, context) => {
//   let feature = draw.tools.getSnapshot().filter((feature) => feature.id === id)[0]
//   console.log(id)
//   console.log(context)
//   if (!(feature.geometry.type === 'Point')) {
//     return
//   } else {
//     if (context.action === 'draw') {
//       draw.selectedFeature = feature
//       const featuresToRemove = draw.getFeatureIdsToRemove(draw.tools.getSnapshot(), feature)
//       draw.tools.removeFeatures(featuresToRemove)
//       dB.pnt = feature
//       dB.closestPointfeatures = dB.getNearestNeighbor(
//         dB.pnt.geometry.coordinates,
//         ghfdb.geojson.features
//       )
//       dB.highlightNearestNeighbor(
//         dB.closestPointfeatures.properties.ID,
//         mapStore.map,
//         settings.circleColor
//       )
//       draw.tools.setMode('select')
//     } else if (context.action === 'dragFeature') {
//       draw.selectedFeature = feature
//       const featuresToRemove = draw.getFeatureIdsToRemove(draw.tools.getSnapshot(), feature)
//       draw.tools.removeFeatures(featuresToRemove)
//       dB.pnt = feature
//       dB.closestPointfeatures = dB.getNearestNeighbor(
//         dB.pnt.geometry.coordinates,
//         ghfdb.geojson.features
//       )
//       dB.highlightNearestNeighbor(
//         dB.closestPointfeatures.properties.ID,
//         mapStore.map,
//         settings.circleColor
//       )
//     }
//   }
// })

// /**
//  * @description Sets the selected feature to keep track of the currently selected point feature.
//  */
// draw.tools.on('select', (id) => {
//   draw.selectedFeature = draw.tools.getSnapshot().filter((feature) => feature.id === id)[0]
// })

// /**
//  * @description
//  * @param id
//  * @param features
//  */
// function onFinish(id, features) {
//   app.spatialFilter[spatialFilter.uuid].feature = getFeature(id, features)
//   app.spatialFilter[spatialFilter.uuid].expression = spatialFilter.writeFilterExpression(
//     app.spatialFilter[spatialFilter.uuid].feature
//   )
// }

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
    if ((feature.id != id) & (feature.geometry.type === 'Point')) {
      idsToRemove.push(feature.id)
    }
  }
  app.draw.removeFeatures(idsToRemove)
}

/**
 *
 * @param point
 * @param data
 */
function nearestPoint(point, data) {
  const coords = point.geometry.coordinates
  return turfNearestPoint(coords, data)
}

/**
 * @description colors nearest neighbor red
 * @param {String} pointID
 */
function highlightNearestPoint(pointID, mapObject, circleColor) {
  const paintProperty = ['case', ['==', ['get', 'ID'], pointID], 'red', circleColor]

  mapObject.setPaintProperty('ghfdb', 'circle-color', paintProperty)
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
    app.map.setPaintProperty('ghfdb', 'circle-color', '#000000')
  }
}

/**
 * @description Logic for drawing polygons.
 *
 */
app.draw.on('finish', async (id, context) => {
  const features = app.draw.getSnapshot()
  const feature = features.filter((feature) => feature.id === id)[0]
  if (feature.geometry.type === 'Point') {
    if (context.action === 'draw') {
      removePrevious(feature.id, features)
      tempProfile.geoPoint = feature
      tempProfile.nearestPoint = nearestPoint(tempProfile.geoPoint, app.geojson)
      highlightNearestPoint(tempProfile.nearestPoint.id, app.map, '#000000')
      app.draw.setMode('select')
    } else if (context.action === 'dragFeature') {
      tempProfile.geoPoint = feature
      tempProfile.nearestPoint = nearestPoint(tempProfile.geoPoint, app.geojson)
      highlightNearestPoint(tempProfile.nearestPoint.id, app.map, '#000000')
    } else if (context.action === 'dragCoordinate') {
      tempProfile.geoPoint = feature
      tempProfile.nearestPoint = nearestPoint(tempProfile.geoPoint, app.geojson)
      highlightNearestPoint(tempProfile.nearestPoint.id, app.map, '#000000')
    } else if (context.action === 'dragCoordinateResize') {
      tempProfile.geoPoint = feature
    }
  }
})

app.map.on('click', async function (e) {
  if (app.selectedPanel.id == 'analysis') {
    // console.log('wann hier?')
    tempProfile.screenPoint = e.point
    tempProfile.mapBoundsSW = app.map.getBounds()._sw
    tempProfile.mapBoundsNE = app.map.getBounds()._ne
    tempProfile.mapCanvas = app.map.getCanvas()
    // tempProfile.mapCanvas.width = app.map.getCanvas().width
    // tempProfile.mapCanvas.height = app.map.getCanvas().height
    console.log(tempProfile.screenPoint)
    console.log(tempProfile.mapBoundsSW)
    console.log(tempProfile.mapBoundsNE)
    console.log(tempProfile.mapCanvas)
    // tempProfile.bounds = app.map.getBounds()

    // const params = new URLSearchParams({
    //   SERVICE: 'WMS',
    //   VERSION: '1.1.1',
    //   REQUEST: 'GetFeatureInfo',
    //   LAYERS: 'geonode:crust1_rho_r01_ice_thickness_epsg3857',
    //   QUERY_LAYERS: 'geonode:crust1_rho_r01_ice_thickness_epsg3857',
    //   STYLES: '',
    //   BBOX: bbox,
    //   WIDTH: canvas.clientWidth,
    //   HEIGHT: canvas.clientHeight,
    //   SRS: 'EPSG:4326',
    //   FORMAT: 'image/png',
    //   INFO_FORMAT: 'application/json',
    //   X: Math.round(e.point.x),
    //   Y: Math.round(e.point.y),
    //   FEATURE_COUNT: 1
    // })

    // const res = await fetch(`${'https://sdi.gfz.de/geoserver/ows'}?${params}`)
    // const data = await res.json()
    // console.log(data)
  }
})
</script>

<template>
  <div class="btn-group-vertical" role="group" aria-label="Basic radio toggle button group">
    <input
      type="radio"
      class="btn-check"
      name="btn-radio-draw-toolbox"
      id="btnradio1"
      autocomplete="off"
    />
    <label
      class="btn btn-outline-success"
      for="btnradio1"
      title="Draw Point"
      @click="app.draw.setMode('point')"
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
      class="btn btn-outline-success"
      for="btnradio2"
      title="Select Point"
      @click="app.draw.setMode('select')"
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
    <label class="btn btn-outline-success" for="btnradio3" title="Delete Point" @click="onDelete()"
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
</template>

<style></style>

<script setup>
import PointDrawToolsButtonGroup from './PointDrawToolsButtonGroup.vue'
import { useTemperatureProfileStore } from '../stores/temperatureProfile.js'

const tempProfile = useTemperatureProfileStore()
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
</script>

<template>
  <div class="d-flex align-items-center">
    <p class="flex-grow-1 mb-0">Draw a point where your digital borehole should be calculated</p>

    <PointDrawToolsButtonGroup />
  </div>
</template>

<style></style>

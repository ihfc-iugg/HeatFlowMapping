<script setup>
import { defineProps, watch } from 'vue'
import { Map } from 'maplibre-gl'
import PolygonDrawToolsButtonGroup from './PolygonDrawToolsButtonGroup.vue'

// import { useFilterStore } from '@/modules/filters/stores/filter'
// import { useDrawStore } from '@/modules/map/stores/draw'

// const props = defineProps({ map: Map })

// const filter = useFilterStore()
// const draw = useDrawStore()

// /**
//  * @description Writes the location filter expression based on the provided GeoJSON object.
//  * @param {Object} geoJSONObj
//  */
// function writeLocationFilterExpression(geoJSONObj) {
//   let expression = []

//   expression.push('within')
//   expression.push(geoJSONObj)

//   return expression
// }

// /**
//  * @description Deletes the selected location filter feature.
//  * @param {Object} selectedFeature
//  */
// function deleteLocationFilter(selectedFeature) {
//   if (selectedFeature && selectedFeature.geometry.type === 'Polygon') {
//     draw.tools.deselectFeature(selectedFeature.id)
//     draw.tools.removeFeatures([selectedFeature.id])
//     draw.selectedFeature = null
//     filter.removeFilterElement(selectedFeature.id, 'locationFilter')
//   }
// }

// /**
//  * @description Logic for drawing polygons.
//  *
//  */
// draw.tools.on('finish', (id, context) => {
//   let feature = draw.tools.getSnapshot().filter((feature) => feature.id === id)[0]
//   console.log(id)
//   console.log(context)
//   if (feature.geometry.type === 'Polygon') {
//     if (context.action === 'draw') {
//       draw.selectedFeature = feature
//       const featuresToRemove = draw.getFeatureIdsToRemove(draw.tools.getSnapshot(), feature)
//       draw.tools.removeFeatures(featuresToRemove)
//       featuresToRemove.forEach((featureId) => {
//         filter.removeFilterElement(featureId, 'locationFilter')
//       })
//       filter.addFilter(id, 'locationFilter')
//       filter.filters.locationFilter[id].expression = writeLocationFilterExpression(feature.geometry)
//     } else if (context.action === 'dragFeature') {
//       draw.selectedFeature = feature
//       filter.addFilter(id, 'locationFilter')
//       filter.filters.locationFilter[id].expression = writeLocationFilterExpression(feature.geometry)
//     } else if (context.action === 'dragCoordinate') {
//       draw.selectedFeature = feature
//       filter.addFilter(id, 'locationFilter')
//       filter.filters.locationFilter[id].expression = writeLocationFilterExpression(feature.geometry)
//     } else if (context.action === 'dragCoordinateResize') {
//       draw.selectedFeature = feature
//       filter.addFilter(id, 'locationFilter')
//       filter.filters.locationFilter[id].expression = writeLocationFilterExpression(feature.geometry)
//     }
//   }
// })

// /**
//  * @description Handles the selection of features.
//  */
// draw.tools.on('select', (id) => {
//   draw.selectedFeature = draw.tools.getSnapshot().filter((feature) => feature.id === id)[0]
// })
</script>

<template>
  <div class="d-flex align-items-center">
    <p class="flex-grow-1 mb-0">Filter points within a user-defined polygon</p>
    <PolygonDrawToolsButtonGroup />
  </div>
</template>

<style></style>

<!-- Show popup containing infos of point (on click) -->
<script setup>
import { defineProps, ref, watch, onMounted, onUnmounted } from 'vue'

import { Map, Popup, Marker } from 'maplibre-gl'
import { point, midpoint } from '@turf/turf'

import { use2DProfileStore } from '@/store/2DProfile'
import { useMapStore } from '@/store/map'
import { use2DProfileReliefStore } from '@/store/2DProfileRelief'

const profile = use2DProfileStore()
const mapStore = useMapStore()
const relief = use2DProfileReliefStore()

const props = defineProps({ map: Map, hasPopup: Boolean })

let elPopup = document.createElement('div')
elPopup.id = 'popupProfileChart'
elPopup.classList.add('mh-100')
let popup = ref(new Popup().setDOMContent(elPopup).setMaxWidth('100%'))

// div containing marker
let elMarker = document.createElement('div')
elMarker.id = 'markerLineChart'
let marker = ref(new Marker({ draggable: true }).setPopup(popup.value))

watch(
  () => props.hasPopup,
  async () => {
    setUpPopup(profile.line)
    // relief.pointsAlongLine = relief.calculatePointsAlongLineString(
    //   profile.line,
    //   relief.reliefResolution
    // )
    // relief.setPntDistanceToStartPnt(relief.pointsAlongLine.features)
    // await relief.setPntReliefValue(
    //   relief.pointsAlongLine.features,
    //   'http://localhost:5000/collections/ETOPO_1_Bedrock'
    // )
    // relief.addPointsAlongLineToMap(mapStore.map, relief.pointsAlongLine)
    profile.drawProfile(profile.line, profile.pointsWithinDistance, profile.selectedProperty1)
    appendCountPointsInfos('popupProfileChart', profile.pointsWithinDistance)
  }
)

/**
 *
 * @param {Object} line
 */
function setUpPopup(line) {
  const pnt1 = point(line.geometry.coordinates[0])
  const pnt2 = point(line.geometry.coordinates[1])
  const coordinates = midpoint(pnt1, pnt2).geometry.coordinates

  marker.value.setLngLat(coordinates)
  marker.value.addTo(mapStore.map)
  // default open popup
  marker.value.togglePopup()
}

/**
 * @description
 * @param {string} elementIdBefore
 * @param {Array} pointsWithinDistance
 */
function appendCountPointsInfos(elementIdBefore, pointsWithinDistance) {
  if (document.getElementById('popup-info-counter')) {
    document.getElementById('popup-info-counter').remove()
  }
  const p = document.createElement('p')
  p.id = 'popup-info-counter'
  p.classList.add('text-center')
  p.innerHTML =
    'Points within threshold ' +
    '(' +
    profile.threshold +
    'km) ' +
    '<b>' +
    pointsWithinDistance.length +
    '</b>'
  document.getElementById(elementIdBefore).after(p)
}

/**
 *
 * @param {Array} pntWithinDistance
 * @param {Map} mapObject
 */
function highlightHoveredPoint(mapObject, pntId, pntsWithinThresholdPaintProperty) {
  let hoverPaintProperty = [
    'case',
    ['==', ['get', 'ID'], pntId],
    'red',
    pntsWithinThresholdPaintProperty
  ]
  mapObject.setPaintProperty('sites', 'circle-color', hoverPaintProperty)
}

let observer = null

onMounted(() => {
  observer = new MutationObserver((mutationRecords) => {
    mutationRecords.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target == elPopup) {
        elPopup
          .on('plotly_hover', function (data) {
            console.log(data.points[0].text)
            highlightHoveredPoint(
              mapStore.map,
              data.points[0].text,
              profile.generatePaintProperty(profile.pointsWithinDistance)
            )
          })
          .on('plotly_unhover', function (data) {
            mapStore.map.setPaintProperty(
              'sites',
              'circle-color',
              profile.generatePaintProperty(profile.pointsWithinDistance)
            )
          })
      }
    })
  })
  observer.observe(elPopup, {
    childList: true, // observe direct children
    subtree: true, // and lower descendants too
    characterDataOldValue: true // pass old data to callback
  })
})

onUnmounted(() => observer && observer.disconnect())
</script>

<template></template>

<style>
#markerLineChart {
  display: inline-block;
  text-align: center;
  line-height: 0; /* Remove any spacing around the SVG */
  background: transparent;
}
</style>

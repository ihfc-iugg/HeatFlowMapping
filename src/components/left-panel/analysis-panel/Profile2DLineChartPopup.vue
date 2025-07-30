<!-- Show popup containing infos of point (on click) -->
<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'

import { Map, Popup, Marker } from 'maplibre-gl'
import { point, midpoint } from '@turf/turf'

import { use2DProfileStore } from '@/store/2DProfile'
import { useMapStore } from '@/store/map'
import { use2DProfileReliefStore } from '@/store/2DProfileRelief'

const profile = use2DProfileStore()
const mapStore = useMapStore()
const relief = use2DProfileReliefStore()

const popup = generatePopup()
const marker = generateMarker(popup.value)

/**
 * @description Sets the popup and marker for the 2D profile line.
 */
watch(
  () => profile.triggerPopup,
  async () => {
    setUpPopup(profile.line, marker.value, mapStore.map)
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
 * @description: Handles the deletion of the popup and marker when the delete trigger is set to true.
 */
watch(
  () => profile.triggerDeletePopup,
  async () => {
    console.log('waaaazuuuup delete popuuuuup')
    if (profile.triggerDeletePopup) {
      popup.value.remove()
      marker.value.remove()
      profile.triggerDeletePopup = false
      console.log('triggerDeletePopup set to true' + profile.triggerDeletePopup)
    }
  }
)

/**
 * @description Sets up the popup and marker for the 2D profile line.
 * @param {Object} line
 * @param {Marker} marker
 * @param {Map} map
 */
function setUpPopup(line, marker, map) {
  const pnt1 = point(line.geometry.coordinates[0])
  const pnt2 = point(line.geometry.coordinates[1])
  const coordinates = midpoint(pnt1, pnt2).geometry.coordinates

  marker.setLngLat(coordinates)
  marker.addTo(map)
  // default open popup
  marker.togglePopup()
}

/**
 * @description Generates a popup element for the 2D profile chart.
 * @returns {Popup}
 */
function generatePopup() {
  let elPopup = document.createElement('div')
  elPopup.id = 'popupProfileChart'
  elPopup.classList.add('mh-100')
  return ref(new Popup().setDOMContent(elPopup).setMaxWidth('100%'))
}

/**
 * @description Generates a marker element for the 2D profile line chart.
 * @param {Popup} popup
 */
function generateMarker(popup) {
  let elMarker = document.createElement('div')
  elMarker.id = 'markerLineChart'
  return ref(new Marker({ draggable: true }).setPopup(popup))
}

/**
 * @description Appends a paragraph element to the popup with the count of points within the specified distance.
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
 * @description Highlights the hovered point on the map by changing its color.
 * @param {string} pntId
 * @param {Array} pntsWithinThresholdPaintProperty
 * @param {Map} mapObject
 */
function highlightHoveredPoint(mapObject, pntId, pntsWithinThresholdPaintProperty) {
  let hoverPaintProperty = [
    'case',
    ['==', ['get', 'ID'], pntId],
    'red',
    pntsWithinThresholdPaintProperty
  ]
  mapObject.setPaintProperty('ghfdb', 'circle-color', hoverPaintProperty)
}

//TODO: Not Working
let observer = null

/***
 * @description: Sets up a MutationObserver to listen for changes in the popup element and adjust the hover functionality accordingly.
 * TODO: Fix, not working right now
 */
function setupMutationObserver() {
  const el = popup.value.getElement()
  if (!el || !(el instanceof Node)) {
    // Try again on next tick if not available yet
    setTimeout(setupMutationObserver, 50)
    return
  }
  observer = new MutationObserver((mutationRecords) => {
    mutationRecords.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target === el) {
        el.on('plotly_hover', function (data) {
          highlightHoveredPoint(
            mapStore.map,
            data.points[0].text,
            profile.generatePaintProperty(profile.pointsWithinDistance)
          )
        }).on('plotly_unhover', function () {
          mapStore.map.setPaintProperty(
            'ghfdb',
            'circle-color',
            profile.generatePaintProperty(profile.pointsWithinDistance)
          )
        })
      }
    })
  })
  observer.observe(el, {
    childList: true,
    subtree: true,
    characterDataOldValue: true
  })
}

onMounted(() => {
  setupMutationObserver()
  // observer = new MutationObserver((mutationRecords) => {
  //   mutationRecords.forEach((mutation) => {
  //     // adjust elPopup to generate
  //     if (mutation.type === 'childList' && mutation.target == popup.value.getElement()) {
  //       popup.value
  //         .getElement()
  //         .on('plotly_hover', function (data) {
  //           console.log(data.points[0].text)
  //           highlightHoveredPoint(
  //             mapStore.map,
  //             data.points[0].text,
  //             profile.generatePaintProperty(profile.pointsWithinDistance)
  //           )
  //         })
  //         .on('plotly_unhover', function (data) {
  //           mapStore.map.setPaintProperty(
  //             'sites',
  //             'circle-color',
  //             profile.generatePaintProperty(profile.pointsWithinDistance)
  //           )
  //         })
  //     }
  //   })
  // })
  // observer.observe(popup.value.getElement(), {
  //   childList: true, // observe direct children
  //   subtree: true, // and lower descendants too
  //   characterDataOldValue: true // pass old data to callback
  // })
})

onUnmounted(() => observer && observer.disconnect())
</script>

<template></template>

<style></style>

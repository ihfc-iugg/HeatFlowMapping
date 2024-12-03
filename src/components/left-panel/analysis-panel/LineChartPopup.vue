<!-- Show popup containing infos of point (on click) -->
<script setup>
import { defineProps, ref, watch, onMounted, onUnmounted } from 'vue'

import { Map, Popup, Marker } from 'maplibre-gl'
import { point, midpoint } from '@turf/turf'
import { newPlot, relayout } from 'plotly.js-dist'

import { use2DProfileStore } from '@/store/2DProfile'
import { useDataSchemaStore } from '@/store/dataSchema'

const profile = use2DProfileStore()
const schema = useDataSchemaStore()

const props = defineProps({ map: Map, hasPopup: Boolean })
const profilePlot = ref(null)

// div for popup
const elPopup = document.createElement('div')
elPopup.id = 'popupProfileChart'
elPopup.classList.add('mh-100')
const popup = ref(new Popup().setDOMContent(elPopup).setMaxWidth('100%'))

// div containing marker
const elMarker = document.createElement('div')
elMarker.id = 'markerLineChart'
elMarker.classList.add('fs-2')
elMarker.innerHTML =
  '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrows-move" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10M.146 8.354a.5.5 0 0 1 0-.708l2-2a.5.5 0 1 1 .708.708L1.707 7.5H5.5a.5.5 0 0 1 0 1H1.707l1.147 1.146a.5.5 0 0 1-.708.708zM10 8a.5.5 0 0 1 .5-.5h3.793l-1.147-1.146a.5.5 0 0 1 .708-.708l2 2a.5.5 0 0 1 0 .708l-2 2a.5.5 0 0 1-.708-.708L14.293 8.5H10.5A.5.5 0 0 1 10 8"></path></svg>'
const marker = ref(new Marker({ draggable: true, element: elMarker }).setPopup(popup.value))

watch(
  () => props.hasPopup,
  () => {
    console.log('1 inside watch linechartpopup')
    setUpPopup()
    drawProfile()
  }
)

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
let hoveredStateId = null

onMounted(() => {
  observer = new MutationObserver((mutationRecords) => {
    mutationRecords.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.target == elPopup) {
        elPopup
          .on('plotly_hover', function (data) {
            console.log(data.points[0].text)
            highlightHoveredPoint(
              props.map,
              data.points[0].text,
              profile.generatePaintProperty(profile.pointsWithinDistance)
            )
          })
          .on('plotly_unhover', function (data) {
            props.map.setPaintProperty(
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

/**
 * @description
 */
function drawProfile() {
  const projectedPoinsts = profile.projectingDataOnLine(profile.line, profile.pointsWithinDistance)

  const alongLineDdistance = projectedPoinsts.map((pnt) => pnt.b)
  const verticalDistance = projectedPoinsts.map((pnt) => pnt.a)
  const propertyValues = projectedPoinsts.map((pnt) => pnt[profile.selectedProperty1])
  const pntIds = projectedPoinsts.map((pnt) => pnt.id)
  console.log(pntIds)

  // Data property values
  const trace1 = {
    x: alongLineDdistance,
    y: propertyValues,
    name: profile.selectedProperty1,
    type: 'scatter',
    mode: 'lines+markers',
    textposition: 'bottom',
    hovertemplate: '<b>%{text}</b>' + '<br><b>x</b>: %{x}' + '<br><b>y</b>: %{y}',
    text: pntIds,
    marker: {
      size: new Array(alongLineDdistance.length).fill(10), // Initialize all points with size 10
      color: new Array(alongLineDdistance.length).fill('blue') // Initialize all points with color blue
    }
  }

  // Data vertical distance of point to line
  const trace2 = {
    x: alongLineDdistance,
    y: verticalDistance,
    name: 'Vertical distance',
    type: 'bar',
    hovertemplate: '<b>%{text}</b>' + '<br><b>x</b>: %{x}' + '<br><b>y</b>: %{y}',
    text: pntIds,
    yaxis: 'y2'
  }

  // styling
  const layout = {
    title: { text: '2D Profile' },
    xaxis: {
      title: 'Distance along line [km]',
      side: 'bottom',
      range: [Math.max(alongLineDdistance) + 10, Math.min(alongLineDdistance) - 10]
    },
    yaxis: {
      title: {
        text:
          schema.dataSchema.properties[profile.selectedProperty1].title +
          ' [' +
          schema.dataSchema.properties[profile.selectedProperty1].units +
          ']'
      }
    },
    yaxis2: {
      title: {
        text: 'Vertical distance [km]'
      },
      overlaying: 'y',
      side: 'right'
    },
    legend: { x: 1.2, y: 1 },
    hovermode: 'closest'
  }
  profilePlot.value = newPlot('popupProfileChart', [trace1, trace2], layout)
  console.log(profilePlot.value)

  // profilePlot.value.
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
  p.innerHTML = 'Points within threshold ' + '<b>' + pointsWithinDistance.length + '</b>'
  document.getElementById(elementIdBefore).after(p)
}

/**
 *
 */
function setUpPopup() {
  const pnt1 = point(profile.line.geometry.coordinates[0])
  const pnt2 = point(profile.line.geometry.coordinates[1])
  const coordinates = midpoint(pnt1, pnt2).geometry.coordinates

  marker.value.setLngLat(coordinates)
  marker.value.addTo(props.map)
  // default open popup
  marker.value.togglePopup()

  // generate new plotly plot
  drawProfile()
  // append number of points
  appendCountPointsInfos('popupProfileChart', profile.pointsWithinDistance)
}
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

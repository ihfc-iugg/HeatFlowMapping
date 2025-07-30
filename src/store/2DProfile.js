import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  distance,
  featureCollection,
  lineString,
  point,
  pointToLineDistance,
  radiansToLength
} from '@turf/turf'
import { Map } from 'maplibre-gl'
import { useSettingsStore } from './settings.js'
import { useSphericalTrigonometry } from './sphericalTrigonometry.js'
import { newPlot } from 'plotly.js-dist'

import { useDataSchemaStore } from './dataSchema.js'
import { use2DProfileReliefStore } from './2DProfileRelief.js'

export const use2DProfileStore = defineStore('2DProfile', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const selectedProperty1 = ref('q')
  const threshold = ref(25)
  const line = ref(null)
  const pointsWithinDistance = ref([])
  const plot = ref(null)
  const triggerPopup = ref(false)
  const triggerDeletePopup = ref(false)

  const settings = useSettingsStore()
  const calculationTools = useSphericalTrigonometry()
  const schema = useDataSchemaStore()
  const relief = use2DProfileReliefStore()

  /**
   * @description Toggles the visibility of the trigger popup.
   */
  function toggleTriggerPopup() {
    triggerPopup.value = !triggerPopup.value
  }

  /**
   * @description Sets the points within a specified distance from a reference line.
   * @param {Array} features
   * @param {Object} referenceLine
   * @param {Number} threshold
   */
  function setPointsWithinDistance(features, referenceLine, threshold) {
    const refLine = lineString(referenceLine.geometry.coordinates)
    pointsWithinDistance.value = features.filter((feature) => {
      const pnt = point(feature.geometry.coordinates)
      const pntToLineDistance = pointToLineDistance(
        pnt,
        refLine,
        { units: 'kilometers' },
        { method: 'planar' }
      )
      return pntToLineDistance <= threshold
    })
  }

  /**
   * @description Generates a paint property for points within a specified distance.
   * @param {Array} pntWithinDistance
   * @param {Map} mapObject
   */
  function generatePaintProperty(pntWithinDistance) {
    const pntIds = pntWithinDistance.map((pnt) => pnt.properties.ID)

    return ['case', ['in', ['get', 'ID'], ['literal', pntIds]], '#FCC480', settings.circleColor]
  }

  /**
   * @description Converts a line string's coordinates into a GeoJSON FeatureCollection of points.
   * @param {Array} lineStringCoordinates
   * @returns {Object} GeoJSON FeatureCollection
   */
  function lineStringToPointFeatureCollection(lineStringCoordinates) {
    const pnt1 = point(lineStringCoordinates[0], { title: 'Start' })
    const pnt2 = point(lineStringCoordinates.at(-1), { title: 'End' })
    return featureCollection([pnt1, pnt2])
  }

  /**
   * @description Adds model sources and layers to the map as line lable
   * @param {Map} mapObject
   * @param {Object} featureCollection
   */
  function addLineLabelToMap(mapObject, featureCollection) {
    if (!mapObject.getSource('lineLable')) {
      mapObject.addSource('lineLable', {
        type: 'geojson',
        data: featureCollection
      })

      mapObject.addLayer({
        id: 'lineLable',
        type: 'symbol',
        source: 'lineLable',
        layout: {
          'text-field': ['get', 'title'],
          'text-offset': [0, 1.0]
        }
      })

      mapObject.addLayer({
        id: 'startEndCircle',
        type: 'circle',
        source: 'lineLable',
        paint: {
          'circle-radius': 6, // Set the size of the circles
          'circle-color': '#FF5733' // Circle color
        }
      })
    }
  }

  /**
   * @description Projects data points onto a reference line and calculates their distance and offset.
   * @param {Object} referenceLine
   * @param {Array} pnts
   * @returns {Array} projectedPnts
   */
  function projectingDataOnLine(referenceLine, pnts) {
    let projectedPnts = []
    // A and C are start and end point of lineString
    const pntA = point(referenceLine.geometry.coordinates[0])
    const pntC = point(referenceLine.geometry.coordinates[1])
    // bT, T is shortcut for triangle
    const bT = distance(pntA, pntC, { units: 'radians' }) // length of drawn line
    pnts.forEach((pnt) => {
      console.log('pnt in profile store')
      console.log(pnt)
      // B is point within threshold
      const pntB = point(pnt.geometry.coordinates)
      const aT = distance(pntC, pntB, { units: 'radians' })
      const c = distance(pntB, pntA, { units: 'radians' })
      const alpha = calculationTools.calculateAlpha(aT, bT, c)
      // right triangle (RT)
      // aRT vertical distance to lineString
      const aRT = calculationTools.calculateA(alpha, c)
      // bRT distance along lineString where pntB is projected verticaly
      const bRT = calculationTools.calculateB(alpha, c)
      let pointData = {
        id: pnt.properties.ID,
        uncertainty: pnt.properties.q_uncertainty ? pnt.properties.q_uncertainty : null,
        b: radiansToLength(bRT),
        a: radiansToLength(aRT)
      }
      pointData[selectedProperty1.value] = pnt.properties[selectedProperty1.value]
      projectedPnts.push(pointData)
    })

    projectedPnts.sort((obj1, obj2) => {
      return obj1.b - obj2.b
    })

    return projectedPnts
  }

  /**
   * @description Draws a 2D profile chart based on the provided line and selected points.
   * @param {Object} line - The line object representing the profile.
   * @param {Array} selectedPnts - The points selected for the profile.
   * @param {String} selectedProperty - The property to be displayed in the profile chart
   */
  function drawProfile(line, selectedPnts, selectedProperty) {
    const projectedPoinsts = projectingDataOnLine(line, selectedPnts)

    const alongLineDdistance = projectedPoinsts.map((pnt) => pnt.b)
    const offset = projectedPoinsts.map((pnt) => pnt.a)
    const uncertainty = projectedPoinsts.map((pnt) => pnt.uncertainty)
    const propertyValues = projectedPoinsts.map((pnt) => pnt[selectedProperty])
    const pntIds = projectedPoinsts.map((pnt) => pnt.id)
    // const reliefValues = relief.pointsAlongLine.features.map((pnt) => pnt.properties.elevation)
    // const reliefDistance = relief.pointsAlongLine.features.map((pnt) => pnt.properties.distKm)

    // Data property values
    const propertyValuesTrace = {
      x: alongLineDdistance,
      y: propertyValues,
      error_y: {
        type: 'data',
        array: uncertainty,
        visible: true
      },
      name: selectedProperty,
      type: 'scatter',
      mode: 'markers',
      textposition: 'bottom',
      hovertemplate: '<b>%{text}</b>' + '<br><b>x</b>: %{x}' + '<br><b>y</b>: %{y}',
      text: pntIds,
      marker: {
        size: new Array(alongLineDdistance.length).fill(10), // Initialize all points with size 10
        color: new Array(alongLineDdistance.length).fill(settings.circleColor) // Initialize all points with the default color
      },
      xaxis: 'x',
      yaxis: 'y1'
    }

    // const reliefTrace = {
    //   x: reliefDistance,
    //   y: reliefValues, // Replace with the desired property
    //   name: 'Relief',
    //   type: 'scatter',
    //   mode: 'lines+markers',
    //   xaxis: 'x',
    //   yaxis: 'y3', // Link this trace to the second y-axis
    //   line: {
    //     color: '#AAAAAA',
    //     width: 2
    //   },
    //   marker: {
    //     color: '#AAAAAA',
    //     width: 3
    //   }
    // }

    // Data vertical distance of point to line
    const offsetTrace = {
      x: alongLineDdistance,
      y: offset,
      name: 'Offset',
      type: 'bar',
      hovertemplate: '<b>%{text}</b>' + '<br><b>x</b>: %{x}' + '<br><b>y</b>: %{y}',
      text: pntIds,
      xaxis: 'x',
      yaxis: 'y2',
      width: 10
    }

    // styling
    const layout = {
      title: { text: '2D Profile' },
      xaxis: {
        anchor: 'free',
        title: {
          text: 'Segment length [km]'
        },
        showgrid: true,
        zeroline: false
      },
      yaxis: {
        anchor: 'x',
        title: {
          text:
            schema.dataSchema.properties[selectedProperty].title +
            ' [' +
            schema.dataSchema.properties[selectedProperty].units +
            ']'
        },
        domain: [0.3, 1], // Increase gap between plots
        position: 0.05,
        showgrid: true,
        zeroline: false
      },
      yaxis2: {
        anchor: 'x',
        title: {
          text: 'Offset [km]'
        },
        domain: [0, 0.22], // Increase gap between plots
        position: 0.95,
        showgrid: true,
        zeroline: false
      },
      yaxis3: {
        overlaying: 'y1',
        side: 'right',
        title: {
          text: 'Relief [m]'
        }
      },
      hovermode: 'closest',
      grid: {
        rows: 2,
        columns: 1,
        roworder: 'bottom to top'
      },
      // Add a visible separator line between the two plots using shapes
      shapes: [
        {
          type: 'line',
          xref: 'paper',
          yref: 'paper',
          x0: 0,
          x1: 1,
          y0: 0.25,
          y1: 0.25,
          line: {
            color: 'rgba(150,150,150,0.5)',
            width: 2,
            dash: 'dot'
          }
        }
      ]
    }

    let data = [propertyValuesTrace, offsetTrace]

    plot.value = newPlot('popupProfileChart', data, layout)
    console.log(plot.value)
  }

  return {
    selectedProperty1,
    threshold,
    line,
    pointsWithinDistance,
    plot,
    triggerPopup,
    triggerDeletePopup,
    toggleTriggerPopup,
    setPointsWithinDistance,
    generatePaintProperty,
    lineStringToPointFeatureCollection,
    addLineLabelToMap,
    projectingDataOnLine,
    drawProfile
  }
})

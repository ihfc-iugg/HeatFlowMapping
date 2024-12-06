import { defineStore } from 'pinia'
import { ref } from 'vue'
import { newPlot } from 'plotly.js-dist'
import { distance } from '@turf/turf'

import { useMapControlsStore } from './mapControls.js'

export const useDigitalBoreholeStore = defineStore('digitalBorehole', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const layers = ref([])
  const t0 = ref(20)
  const pnt = ref(null)
  const closestPointfeatures = ref(null)
  const popup = ref(null)
  const marker = ref(null)
  const hasPopup = ref(false)
  const plot = ref(null)
  const controls = useMapControlsStore()

  /**
   *
   * @description
   */
  function addEmptyLayer() {
    layers.value.push({
      tTop: null,
      tBot: null,
      qTop: null,
      qBot: null,
      k: null,
      dZ: null,
      a: null,
      layerType: 'granite' // just example of what this attribute could be used for
    })
  }

  function setLayer(tTop, tBot, qTop, qBot, k, dz, a, layerType) {
    addEmptyLayer()
    let l = layers.value.at(-1)
    l.tTop = tTop ? tTop : null
    l.tBot = tBot ? tBot : null
    l.qTop = qTop ? qTop : null
    l.qBot = qBot ? qBot : null
    l.k = k ? k : null
    l.dZ = dz ? dz : null
    l.a = a ? a : null
    l.layerType = layerType ? layerType : null
  }

  /**
   * @description calculates the temperature within a certain depth
   * @param {number} t0 ground surface temperature
   * @param {number} qTop
   * @param {number} dZi thickness of layer
   * @param {number} k thermal conductivity
   * @param {number} a heat production
   * @returns {number} temperature
   */
  function calculateTemperature(qTop, dZi, k, a) {
    return (qTop * dZi) / k - (a * (dZi * dZi)) / (2 * k)
  }

  /**
   *
   * @param {Array} layers
   * @param {number} t0 °C
   * @param {number} q0 mW/m^2 10^-3
   */
  function bootstrapping(layers, t0, q0) {
    // q0 mW 10^-3
    // ground surface temperature == top temperature of the first layer
    layers[0].tTop = t0
    // q at surface from mW to W
    layers[0].qTop = q0 / 1000
    // initial value for temperature
    let temp = structuredClone(t0)
    for (let ix = 0; ix < layers.length; ix++) {
      let l = layers[ix]
      // calc q at the bottom if the ix layer
      l.qBot = l.qTop - l.a * l.dZ
      // sum temperature
      temp = temp + calculateTemperature(l.qTop, l.dZ, l.k, l.a)
      l.tBot = structuredClone(temp)
      // console.log('akk temp: ' + temp)
      if (ix < layers.length - 1) {
        layers[ix + 1].tTop = l.tBot
        layers[ix + 1].qTop = l.qBot
      }
    }
  }

  /**
   * @description deletes other drawn point features, so only one is allowed
   * @param {String} pointToKeepID
   */
  function deletePreviosDrawnPoints(pointToKeepID) {
    const features = controls.mapboxDraw.getAll().features
    features.forEach((feature) => {
      if (feature.geometry.type == 'Point' && feature.id != pointToKeepID) {
        console.log('id ' + pointToKeepID)
        controls.mapboxDraw.delete(feature.id)
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
      const dist = distance(referencePointCoordinates, pointCoordinates)
      if (dist < minDistance) {
        minDistance = dist
        closestPoint = feature
      }
    })
    return closestPoint
  }

  /**
   * @description colors nearest neighbor red
   * @param {String} pointID
   */
  function highlightNearestNeighbor(pointID, mapObject, circleColor) {
    const paintProperty = ['case', ['==', ['get', 'ID'], pointID], 'red', circleColor]

    mapObject.setPaintProperty('sites', 'circle-color', paintProperty)
  }

  /**
   * @description logic for drawing graph of temperature as function of depth
   * @param {Array} layers
   * @param {number} t0
   */
  function drawChart(layers, t0) {
    if (plot.value) {
      plot.value = null
    }
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
          text: 'layer ' + depth.indexOf(d) + '<br>' + layers[depth.indexOf(d) - 1].layerType,
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
    newPlot('popupBoreholeChart', [plotData], layout)
  }

  return {
    layers,
    t0,
    pnt,
    closestPointfeatures,
    marker,
    popup,
    hasPopup,
    plot,
    addEmptyLayer,
    setLayer,
    calculateTemperature,
    bootstrapping,
    deletePreviosDrawnPoints,
    getNearestNeighbor,
    highlightNearestNeighbor,
    drawChart
  }
})

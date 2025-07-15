import { defineStore } from 'pinia'
import { ref } from 'vue'
import { newPlot } from 'plotly.js-dist'
import { distance } from '@turf/turf'
import colorbrewer from 'colorbrewer'

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
  const uncertainty = ref(5)

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
      layerType: '', // just example of what this attribute could be used for
      color: null
    })
  }

  /**
   *
   * @param {number} tTop
   * @param {number} tBot
   * @param {number} qTop
   * @param {number} qBot
   * @param {number} k
   * @param {number} dz
   * @param {number} a
   * @param {string} layerType
   * @param {string} layerType
   */
  function setLayer(tTop, tBot, qTop, qBot, k, dz, a, layerType) {
    // if condition because of class number limitation for colorbrewer qualitative
    if (layers.value.length < 9) {
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
      if (layers.value.length <= 3) {
        l.color = colorbrewer['Pastel1'][3][layers.value.length - 1]
      } else {
        l.color = colorbrewer['Pastel1'][layers.value.length].at(-1)
      }
    } else {
      console.log('You reached the maximum number of layers. Only 12 layers are allowed')
    }
    console.log('colorbrewer')
    console.log(colorbrewer)
  }

  /**
   *
   */
  function removeLastLayer(layers) {
    if (layers.length > 1) {
      layers.pop()
    }
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
    return (qTop * dZi) / k - ((a / 1000000) * (dZi * dZi)) / (2 * k)
  }

  /**
   *
   * @param {Array} layers
   * @param {number} t0 °C
   * @param {number} q0 mW/m^2 10^-3
   */
  function bootstrapping(layers, t0, q0) {
    // q0 mW 10^-3 (Milliwatt)
    // ground surface temperature = top temperature of the first layer
    layers[0].tTop = t0
    // q at surface from mW to W
    layers[0].qTop = q0 / 1000
    // initial value for temperature
    let temp = structuredClone(t0)
    for (let ix = 0; ix < layers.length; ix++) {
      let l = layers[ix]
      // calc q at the bottom if the ix layer
      l.qBot = l.qTop - (l.a / 1000000) * l.dZ
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

    mapObject.setPaintProperty('ghfdb', 'circle-color', paintProperty)
  }

  /**
   *
   * @param {Array} origXValues
   * @param {Number} uncertainty in percent
   * @returns
   */
  function calcXValuesUncertainty(origXValues, uncertainty) {
    let xErrorBars = []
    origXValues.slice().forEach((x) => xErrorBars.push(x - x * (uncertainty / 100)))
    origXValues
      .slice()
      .reverse()
      .forEach((x) => xErrorBars.push(x + x * (uncertainty / 100)))
    return xErrorBars
  }

  /**
   *
   * @param {Array} origYValues
   * @returns
   */
  function calcYValuesContinuousErrorBars(origYValues) {
    let yErrorBars = origYValues.map((y) => y)
    origYValues
      .slice()
      .reverse()
      .forEach((y) => yErrorBars.push(y))
    return yErrorBars
  }

  /**
   * @description logic for drawing graph of temperature as function of depth
   * @param {Array} layers
   * @param {number} t0
   */
  function drawChart(layers, t0, uncertainty) {
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
      hoverinfo: 'text+x+y',
      name: 'Temperature',
      showlegend: true
    }

    const temperatureUncertainty = {
      x: calcXValuesUncertainty(temperature, uncertainty),
      y: calcYValuesContinuousErrorBars(depth),
      fill: 'tozerox',
      fillcolor: 'rgba(0,100,80,0.2)',
      line: { color: 'transparent' },
      name: uncertainty + '% uncertainty',
      showlegend: true,
      type: 'scatter'
    }

    // Annotation of layer within graph
    const annotations = depth.map((d) => {
      if (depth.indexOf(d) != 0) {
        return {
          showarrow: false,
          text: layers[depth.indexOf(d) - 1].layerType.toUpperCase(),
          align: 'right',
          x: 0,
          xanchor: 'right',
          y: d,
          yanchor: 'bottom'
        }
      }
    })

    const layerRectangles = function (layers) {
      let rectangles = []
      let yMinLayer = 0
      let yMaxLayer = 0
      for (let ix = 0; ix < layers.length; ix++) {
        yMaxLayer += layers[ix].dZ
        let rectangle = {
          type: 'rect',
          // x-reference is assigned to the x-values
          xref: 'paper',
          // y-reference is assigned to the plot paper [0,1]
          yref: 'y',
          x0: 0,
          y0: yMinLayer,
          x1: 1,
          y1: yMaxLayer,
          fillcolor: layers[ix].color,
          opacity: 1,
          layer: 'below',
          line: {
            // color: 'brown',
            width: 0
            // dash: 'dot'
          }
        }
        yMinLayer += layers[ix].dZ

        rectangles.push(rectangle)
      }
      return rectangles
    }

    // styling
    const layout = {
      title: { text: 'Digital Borehole', xref: 'paper', x: 0.05 },
      autosize: false,
      margin: {
        l: 50,
        r: 50,
        b: 10,
        t: 100,
        pad: 2
      },
      xaxis: {
        title: 'Temperature [°C]',
        side: 'top',
        autorange: true
      },
      yaxis: {
        title: 'Depth [m]',
        // autorange: true,
        range: [Math.max(...depth) + 10, 0],
        automargin: true
      },
      shapes: layerRectangles(layers),
      annotations: annotations
    }
    newPlot('popupBoreholeChart', [plotData, temperatureUncertainty], layout)
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
    uncertainty,
    addEmptyLayer,
    setLayer,
    removeLastLayer,
    calculateTemperature,
    bootstrapping,
    getNearestNeighbor,
    highlightNearestNeighbor,
    drawChart
  }
})

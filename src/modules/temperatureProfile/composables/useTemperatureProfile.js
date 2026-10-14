export function useTemperatureProfile() {
  /**
   * @description calculates the x values for the error bars
   * @param {Array} origXValues
   * @param {Number} uncertainty in percent
   * @returns {Array} xErrorBars
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
   * @description calculates the y values for the error bars
   * @param {Array} origYValues
   * @returns {Array} yErrorBars
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
  async function generatePlotPamareter(layers, t0, uncertainty) {
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
      // title: { text: 'Digital Borehole', xref: 'paper', x: 0.05 },
      autosize: false,
      margin: {
        l: 50,
        r: 50,
        b: 10,
        t: 70,
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
      legend: { x: 0.75, y: 0.95 },
      shapes: layerRectangles(layers),
      annotations: annotations
    }
    return [plotData, temperatureUncertainty, layout]
  }

  return {
    generatePlotPamareter
  }
}

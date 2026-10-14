import { useApplicationStore } from '@/core/stores/app'

export function useCrossSection() {
  const app = useApplicationStore()

  async function generatePlotPamareter(pointsWithinBBox, property) {
    //   /**
    //    * @description Draws a 2D profile chart based on the provided line and selected points.
    //    * @param {Object} line - The line object representing the profile.
    //    * @param {Array} selectedPnts - The points selected for the profile.
    //    * @param {String} selectedProperty - The property to be displayed in the profile chart
    //    */
    //   function drawProfile(line, selectedPnts, selectedProperty) {
    /**
     * Pseudo Code
     *
     */

    // const projectedPoinsts = projectingDataOnLine(line, selectedPnts)
    const alongLineDistance = pointsWithinBBox.map((pnt) => pnt.distanceAlongLine)
    const offset = pointsWithinBBox.map((pnt) => pnt.distanceToLine)
    const uncertainty = pointsWithinBBox.map((pnt) => pnt.point.properties.q_uncertainty)
    const propertyValues = pointsWithinBBox.map((pnt) => pnt.point.properties[property])
    const pntIds = pointsWithinBBox.map((pnt) => pnt.point.id)
    // const reliefValues = relief.pointsAlongLine.features.map((pnt) => pnt.properties.elevation)
    // const reliefDistance = relief.pointsAlongLine.features.map((pnt) => pnt.properties.distKm)
    // Data property values
    const plotData = {
      x: alongLineDistance,
      y: propertyValues,
      error_y: {
        type: 'data',
        array: uncertainty,
        visible: true
      },
      name: property,
      type: 'scatter',
      mode: 'markers',
      textposition: 'bottom',
      hovertemplate: '<b>%{text}</b>' + '<br><b>x</b>: %{x}' + '<br><b>y</b>: %{y}',
      text: pntIds,
      marker: {
        size: new Array(alongLineDistance.length).fill(10), // Initialize all points with size 10
        color: new Array(alongLineDistance.length).fill('#ff0000') // Initialize all points with the default color
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
      x: alongLineDistance,
      y: offset,
      name: 'Offset',
      type: 'bar',
      hovertemplate: '<b>%{text}</b>' + '<br><b>x</b>: %{x}' + '<br><b>y</b>: %{y}',
      text: pntIds,
      xaxis: 'x',
      yaxis: 'y2',
      width: 3
    }

    // styling
    const layout = {
      autosize: false,
      margin: {
        l: 50,
        r: 50,
        b: 70,
        t: 10,
        pad: 2
      },
      legend: { x: 0.85, y: 0.95 },
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
            app.dataSchema.properties[property].title +
            ' [' +
            app.dataSchema.properties[property].units +
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
    // let data = [plotData, offsetTrace]
    // plot.value = newPlot('popupProfileChart', data, layout)
    // console.log(plot.value)
    return [plotData, offsetTrace, layout]
  }

  return {
    generatePlotPamareter
  }
}

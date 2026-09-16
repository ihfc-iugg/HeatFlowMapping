<script setup>
import { onMounted, ref, watch, defineProps } from 'vue'
import { newPlot } from 'plotly.js-dist'
import { useApplicationStore } from '@/core/stores/app.js'

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  property: {
    type: String,
    required: true
  },
  dataType: {
    type: String,
    required: true
  }
})

const app = useApplicationStore()
const domId = ref('histogramPlot')

/**
 * @description Plots a histogram of the selected property values.
 * @param {Array} propertValues - The values of the selected property.
 * @param {String} property
 * @param {String} dataType
 */
function plotHistogram(data, property, dataType) {
  const trace = {
    x: data,
    type: 'histogram',
    marker: {
      color: 'rgba(227,30,36,1.0)'
    }
  }

  let xText = app.dataSchema.properties[property].title
  if (dataType === 'number') {
    xText = xText + ' [' + app.dataSchema.properties[property].units + ']'
  }

  const layout = {
    margin: { l: 30, r: 0, t: 10, b: 35 },
    xaxis: {
      title: {
        text: xText,
        standoff: 15
      },
      automargin: true
    },
    yaxis: {
      anchor: 'free',
      title: {
        text: 'Number of values'
      },
      domain: [0, 0],
      position: 0.05
    }
  }

  const plotData = [trace]
  newPlot(domId.value, plotData, layout)
}

onMounted(() => {
  console.log(props)
  plotHistogram(props.data, props.property, props.dataType)
})
</script>

<template>
  <div class="w-100 h-100 d-inline-block" :id="domId"></div>
</template>

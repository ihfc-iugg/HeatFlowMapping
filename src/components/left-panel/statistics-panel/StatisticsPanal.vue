<script setup>
import { ref } from 'vue'
import { newPlot } from 'plotly.js-dist'

import VueMultiselect from 'vue-multiselect'
import StatisticsPanelTableNumericValues from './StatisticsPanelTableNumericValues.vue'
import StatisticsPanelTableEnumValues from './StatisticsPanelTableEnumValues.vue'

import { useGHFDBStore } from '@/store/ghfdb'
import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useFilterStore } from '@/store/filter'
import { useMapStore } from '@/store/map'

const ghfdb = useGHFDBStore()
const schema = useDataSchemaStore()
const filter = useFilterStore()
const mapStore = useMapStore()

const options = ref(['GHFDB', 'Filtered GHFDB'])
const selectedSourceTitle = ref(null)
const selectedSource = ref(ghfdb.geojson)
const selectedProperty = ref(null)
const selectedPropertyDataType = ref(null)
const propertyValues = ref(null)

/**
 *
 */
function setDataSource() {
  if (selectedSourceTitle.value == 'GHFDB') {
    selectedSource.value = ghfdb.geojson
  } else if (selectedSourceTitle.value == 'Filtered GHFDB') {
    selectedSource.value = {
      type: 'FeatureCollection',
      features: filter.getFilteredFeatures(mapStore.map)
    }
  }
}

/**
 * @param {String} property
 */
function plotGraph(propertValues, propertyKey, dataType) {
  const trace = {
    x: propertValues,
    type: 'histogram'
  }

  // Boundary of layer within graph
  // const min = {
  //   type: 'line',
  //   xref: 'paper',
  //   x0: 0,
  //   y0: ,
  //   line: {
  //     color: 'red',
  //     width: 2,
  //     dash: 'dot'
  //   }
  // }

  let xText = schema.dataSchema.properties[propertyKey].title
  if (dataType === 'number') {
    xText = xText + ' [' + schema.dataSchema.properties[propertyKey].units + ']'
  }

  const layout = {
    title: { text: 'Histogram' },
    xaxis: {
      anchor: 'free',
      title: {
        text: xText
      }
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

  const data = [trace]
  newPlot('statisticGraph', data, layout)
}

/**
 *
 * @param {Sting} property
 */
function setPropertyValues(property) {
  propertyValues.value = selectedSource.value.features.map(
    (feature) => feature.properties[property]
  )
}

/**
 * @description
 * @param {Object} property
 */
function setPropertyDataType(property) {
  selectedPropertyDataType.value = schema.dataSchema.properties[property].type
}
</script>

<template>
  <div style="border-bottom: 2px solid #00c9a7">
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn text-start text-light dropdown-toggle"
        type="button"
        style="background-color: #4366a1"
        data-bs-toggle="collapse"
        data-bs-target="#descriptivStatistics"
      >
        Descriptive Statistics
      </button>
    </p>
    <div class="collapse" id="descriptivStatistics">
      <VueMultiselect
        class="py-1"
        v-model="selectedSourceTitle"
        :options="options"
        :allow-empty="false"
        placeholder="Select Dataset"
        preselectFirst="{{ options[0] }}"
        @select="setDataSource()"
      >
      </VueMultiselect>

      <VueMultiselect
        class="py-1"
        v-model="selectedProperty"
        :options="schema.selectableProperties"
        label="title"
        :allow-empty="false"
        placeholder="Select Property"
        @select="
          (setPropertyValues(selectedProperty.key),
          setPropertyDataType(selectedProperty.key),
          plotGraph(propertyValues, selectedProperty.key, selectedPropertyDataType))
        "
      >
      </VueMultiselect>

      <div class="w-100 h-100 d-inline-block" id="statisticGraph"></div>
      <StatisticsPanelTableNumericValues
        v-if="selectedProperty && selectedPropertyDataType == 'number'"
        :attributeValues="propertyValues"
      />

      <StatisticsPanelTableEnumValues
        v-if="selectedProperty && selectedPropertyDataType == undefined"
        :attributeValues="propertyValues"
      />
    </div>
  </div>
</template>

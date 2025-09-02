<script setup>
import { ref } from 'vue'
import { newPlot } from 'plotly.js-dist'

import VueMultiselect from 'vue-multiselect'
import StatisticsPanelTableNumericValues from './StatisticsPanelTableNumericValues.vue'
import StatisticsPanelTableEnumValues from './StatisticsPanelTableEnumValues.vue'
import AccordionItem from '../AccordionItem.vue'

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
 * @description handles the selection of the data source which builds the data for the statistics panel.
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
 * @description Plots a histogram of the selected property values.
 * @param {Array} propertValues - The values of the selected property.
 * @param {String} property
 * @param {String} dataType
 */
function plotGraph(propertValues, property, dataType) {
  const trace = {
    x: propertValues,
    type: 'histogram'
  }

  let xText = schema.dataSchema.properties[property].title
  if (dataType === 'number') {
    xText = xText + ' [' + schema.dataSchema.properties[property].units + ']'
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
 * @description Sets the property values for the selected property.
 * @param {Sting} property
 */
function setPropertyValues(property) {
  propertyValues.value = selectedSource.value.features.map(
    (feature) => feature.properties[property]
  )
}

/**
 * @description Sets the data type of the selected property.
 * @param {Object} property
 */
function setPropertyDataType(property) {
  selectedPropertyDataType.value = schema.dataSchema.properties[property].type
}
</script>

<template>
  <AccordionItem title="Descriptive Statistics" id="descriptivStatistics"
    ><VueMultiselect
      class="py-1"
      id="statisticsDataSourceSelect"
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
      id="statisticsPropertySelect"
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
  </AccordionItem>
</template>

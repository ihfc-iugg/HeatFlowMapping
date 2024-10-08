<script setup>
import { ref, defineProps } from 'vue'
import { newPlot } from 'plotly.js-dist'
import { Map } from 'maplibre-gl'

import VueMultiselect from 'vue-multiselect'
import TableNumericValues from './TableNumericValues.vue'
import TableEnumValues from './TableEnumValues.vue'

import { useMeasurementStore } from '@/store/measurements'
import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useFilterStore } from '@/store/filter'

const props = defineProps({ map: Map })

const measurements = useMeasurementStore()
const dataSchema = useDataSchemaStore()
const filter = useFilterStore()

const options = ref(['GHFDB', 'Filtered GHFDB'])
const selectedSourceTitle = ref(null)
const selectedSource = ref(measurements.geojson)
const selectedProperty = ref(null)
const selectedPropertyDataType = ref(null)
const values = ref(null)

/**
 *
 */
function setDataSource() {
  if (selectedSourceTitle.value == 'GHFDB') {
    selectedSource.value = measurements.geojson
  } else if (selectedSourceTitle.value == 'Filtered GHFDB') {
    selectedSource.value = {
      type: 'FeatureCollection',
      features: filter.getFilteredFeatures(props.map)
    }
  }
}

/**
 * @param {String} property
 */
function plotGraph(property) {
  const trace = {
    x: values.value,
    type: 'histogram'
  }
  const data = [trace]
  newPlot('statisticGraph', data)
}

/**
 *
 * @param {Sting} property
 */
function setPropertyValues(property) {
  values.value = selectedSource.value.features.map((feature) => feature.properties[property])
}

/**
 * @description
 * @param {Object} property
 */
function setPropertyDataType(property) {
  selectedPropertyDataType.value = dataSchema.dataSchema.properties[property].type
}
</script>

<template>
  <div>
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn btn-primary text-start dropdown-toggle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#datasetSelection"
        aria-expanded="false"
        aria-controls="datasetSelection"
      >
        Dataset
      </button>
    </p>
    <div class="collapse" id="datasetSelection">
      <VueMultiselect
        v-model="selectedSourceTitle"
        :options="options"
        :allow-empty="false"
        placeholder="Select Dataset"
        @select="setDataSource()"
      >
      </VueMultiselect>
    </div>

    <p class="mt-1 d-grid gap-2">
      <button
        class="btn btn-primary text-start dropdown-toggle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#propertySelection"
        aria-expanded="false"
        aria-controls="propertySelection"
      >
        Property
      </button>
    </p>
    <div class="collapse" id="propertySelection">
      <VueMultiselect
        v-model="selectedProperty"
        :options="dataSchema.selectableProperties"
        label="title"
        :allow-empty="false"
        placeholder="Select Property"
        @select="
          setPropertyValues(selectedProperty.key),
            setPropertyDataType(selectedProperty.key),
            plotGraph(selectedProperty.key)
        "
      >
      </VueMultiselect>
    </div>

    <div class="w-100 h-100 d-inline-block" id="statisticGraph"></div>

    <TableNumericValues
      v-if="selectedProperty && selectedPropertyDataType == 'number'"
      :attributeValues="values"
    />

    <TableEnumValues
      v-if="selectedProperty && selectedPropertyDataType == undefined"
      :attributeValues="values"
    />
  </div>
</template>

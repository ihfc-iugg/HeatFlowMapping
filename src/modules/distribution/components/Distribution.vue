<script setup>
import SelectProperty from '@/shared/components/SelectProperty.vue'
import HistogramPlot from './HistogramPlot.vue'
import TableBodyNumericValues from './TableBodyNumericValues.vue'
import TableBodyCountValues from './TableBodyCountValues.vue'
import { useApplicationStore } from '@/core/stores/app'
import { onMounted, watch, ref } from 'vue'

const app = useApplicationStore()
const histogramPlot = ref(0)
const selectedProperty = ref('q')
const propertyDataType = ref('number')
const data = ref(null)

/**
 * @description
 * @param {String} property
 * @param {String} dataType
 */
function handleSelection(property, dataType) {
  selectedProperty.value = property
  propertyDataType.value = dataType
  setData(app.geojson, selectedProperty.value)
}

/**
 *
 */
function setData(geojson, property) {
  data.value = geojson.features.map((feature) => feature.properties[property])
}

//TODO: onMounted ändern, weil sonst lange Ladezeit
onMounted(() => {
  setData(app.geojson, selectedProperty.value)
})

watch(
  () => selectedProperty.value,
  () => {
    histogramPlot.value++
  }
)
</script>

<template>
  <SelectProperty @select="handleSelection" />
  <HistogramPlot
    v-if="data"
    :key="histogramPlot"
    :data="data"
    :property="selectedProperty"
    :data-type="propertyDataType"
  />
  <table class="table">
    <thead>
      <tr>
        <th scope="col">Measure</th>
        <th scope="col">Values</th>
      </tr>
    </thead>
    <TableBodyNumericValues v-if="data && propertyDataType === 'number'" :data="data" />
    <TableBodyCountValues v-if="data" :data="data" />
  </table>
</template>

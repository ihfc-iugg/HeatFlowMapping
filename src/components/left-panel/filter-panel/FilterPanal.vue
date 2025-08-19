<script setup>
import { watch } from 'vue'

import FilterPanelAttributeFilter from './FilterPanelAttributeFilter.vue'
import FilterPanelFilterByLocation from './FilterPanelFilterByLocation.vue'
import FilterPanelDownloadData from './FilterPanelDownloadData.vue'
import Accordion from '../Accordion.vue'

import { useFilterStore } from '@/store/filter'
import { useMapStore } from '@/store/map'

const filter = useFilterStore()
const mapStore = useMapStore()

/**
 * @description Watches changes in filterExpressions object and set the filter to map.
 */
watch(filter.filters, () => {
  filter.applyFilterToMap(mapStore.map)
})
</script>

<template>
  <!-- Attribute Filter -->
  <Accordion id="filter-accordion">
    <FilterPanelAttributeFilter />
    <FilterPanelFilterByLocation />
  </Accordion>
  <!-- <FilterPanelDownloadData :map="map"></FilterPanelDownloadData> -->
</template>

<style scoped></style>

<script setup>
import { defineProps, watch } from 'vue'
import { Map } from 'maplibre-gl'

import { useFilterStore } from '@/store/filter'

import FilterElement from './FilterElement.vue'
import FilterByLocation from './FilterByLocation.vue'
import DownloadData from './DownloadData.vue'

const props = defineProps({ map: Map })

const filter = useFilterStore()

/**
 * @description Watches changes in filterExpressions object and set the filter to map.
 */
watch(filter.filters, () => {
  filter.applyFilterToMap(props.map)
})

/**
 * @description Is called when btn gets clicked. New entry added to array with the current date when btn gets clicked (as id for filterElement).
 */
function addFilterElement() {
  if (Object.keys(filter.filters['attributeFilter']).length <= filter.maxAttributeFilter) {
    const filterID = 'attrFilter' + Date.now()
    filter.addFilter(filterID, 'attributeFilter')
  } else {
    filter.reachedLimit = true
    console.log('You reached the maximum number of filters')
  }
}
</script>

<template>
  <!-- Attribute Filter -->
  <p class="mt-1 d-grid gap-2">
    <button
      class="btn btn-primary text-start dropdown-toggle"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#attributeFilter"
      aria-expanded="false"
      aria-controls="attributeFilter"
    >
      Attribute Filter
    </button>
  </p>
  <div class="collapse" id="attributeFilter">
    <FilterElement v-for="id in Object.keys(filter.filters.attributeFilter)" :key="id" :id="id">
    </FilterElement>

    <div class="filter-managing-tools">
      <label for="add-filter-btn" v-if="filter.reachedLimit"
        >You reached the max number of filters</label
      >
      <button
        id="add-filter-btn"
        class="btn btn-primary"
        v-if="!filter.reachedLimit"
        @click="addFilterElement()"
      >
        + Add Filter
      </button>
    </div>
  </div>

  <!-- Location Filter -->
  <p class="mt-1 d-grid gap-2">
    <button
      class="btn btn-primary text-start dropdown-toggle"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#locationFilter"
      aria-expanded="false"
      aria-controls="locationFilter"
    >
      Location Filter
    </button>
  </p>
  <FilterByLocation :map="map" />

  <DownloadData :map="map"></DownloadData>
</template>

<style scoped></style>

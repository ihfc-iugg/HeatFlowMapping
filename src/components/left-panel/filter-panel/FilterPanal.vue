<script setup>
import { watch } from 'vue'

import FilterPanelFilterElement from './FilterPanelFilterElement.vue'
import FilterPanelFilterByLocation from './FilterPanelFilterByLocation.vue'
import FilterPanelDownloadData from './FilterPanelDownloadData.vue'

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
  <div style="border-bottom: 2px solid #00c9a7">
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn text-start text-light dropdown-toggle"
        type="button"
        style="background-color: #4366a1"
        data-bs-toggle="collapse"
        data-bs-target="#attributeFilter"
        aria-expanded="false"
        aria-controls="attributeFilter"
      >
        Attribute Filter
      </button>
    </p>
    <div class="collapse p-1" id="attributeFilter">
      <FilterPanelFilterElement
        v-for="id in Object.keys(filter.filters.attributeFilter)"
        class="mb-1"
        :key="id"
        :id="id"
      >
      </FilterPanelFilterElement>

      <div class="filter-managing-tools d-grid justify-content-md-center">
        <label for="add-filter-btn" v-if="filter.reachedLimit"
          >You reached the max number of filters</label
        >
        <button
          id="add-filter-btn"
          class="btn rounded-pill"
          style="color: #4366a1; border: 1px solid #4366a1"
          v-if="!filter.reachedLimit"
          @click="addFilterElement()"
        >
          + Add Filter
        </button>
      </div>
    </div>
  </div>

  <!-- Location Filter -->
  <div style="border-bottom: 2px solid #00c9a7">
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn text-start text-light dropdown-toggle"
        type="button"
        style="background-color: #4366a1"
        data-bs-toggle="collapse"
        data-bs-target="#locationFilter"
        aria-expanded="false"
        aria-controls="locationFilter"
      >
        Location Filter
      </button>
    </p>
    <FilterPanelFilterByLocation :map="map" />
  </div>
  <FilterPanelDownloadData :map="map"></FilterPanelDownloadData>
</template>

<style scoped></style>

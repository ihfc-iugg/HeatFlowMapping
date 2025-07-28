<script setup>
import { defineProps } from 'vue'
import 'vue-multiselect/dist/vue-multiselect.css'
import AccordionItem from '../AccordionItem.vue'
import FilterPanelFilterElement from './FilterPanelFilterElement.vue'

import { useFilterStore } from '@/store/filter'

const props = defineProps({ id: String })

const filter = useFilterStore()

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
  <AccordionItem title="Attribute Filter" id="attribute-filter">
    <FilterPanelFilterElement
      v-for="id in Object.keys(filter.filters.attributeFilter)"
      class="mb-1"
      :key="id"
      :id="id"
    ></FilterPanelFilterElement>
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
  </AccordionItem>
</template>

<style scoped></style>

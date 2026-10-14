<script setup>
import AccordionItem from '@/shared/components/AccordionItem.vue'
import ButtonAddFilter from './ButtonAddFilter.vue'
import FilterElement from './FilterElement.vue'

import { useApplicationStore } from '@/core/stores/app.js'

const app = useApplicationStore()
</script>

<template>
  <AccordionItem title="Attribute Filter" id="attribute-filter">
    <FilterElement
      class="mb-1"
      v-for="(value, key) in app.attributeFilter"
      :key="key"
      :uuid="key"
      :filter-obj="value"
    ></FilterElement>

    <ButtonAddFilter />
  </AccordionItem>
</template>

<style scoped></style>

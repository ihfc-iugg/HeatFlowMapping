<script setup>
import Accordion from '../components/Accordion.vue'
import AttributeFilterContainer from '@/modules/attributeFilter/components/AttributeFilterContainer.vue'
import SpatialFilter from '@/modules/spatialFilter/components/SpatialFilter.vue'
</script>

<template>
  <Accordion accordionId="attribute-filter-accordion">
    <AttributeFilterContainer />
  </Accordion>
  <Accordion accordionId="spatial-filter-accordion">
    <SpatialFilter />
  </Accordion>
</template>

<style scoped></style>

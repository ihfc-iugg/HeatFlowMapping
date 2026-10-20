<script setup>
import Accordion from '@/shared/components/Accordion.vue'
import AttributeFilter from '@/modules/attributeFilter/components/AttributeFilter.vue'
import SpatialFilter from '@/modules/spatialFilter/components/SpatialFilter.vue'
</script>

<template>
  <Accordion accordionId="attribute-filter-accordion">
    <AttributeFilter />
  </Accordion>
  <Accordion accordionId="spatial-filter-accordion">
    <SpatialFilter />
  </Accordion>
</template>

<style scoped></style>

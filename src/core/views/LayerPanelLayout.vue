<script setup>
import Accordion from '@/shared/components/Accordion.vue'
import BaseMaps from '@/modules/baseMaps/components/BaseMaps.vue'
import CircleStyling from '@/modules/circleStyling/components/CircleStyling.vue'
import DataDrivenColoring from '@/modules/dataDrivenColoring/components/DataDrivenColoring.vue'
import LayerTree from '@/modules/layerTree/components/LayerTree.vue'
</script>

<template>
  <Accordion accordionId="layer-accordion">
    <DataDrivenColoring />
    <!-- <LayerTree /> -->
    <!-- <BaseMaps /> -->
    <!-- <CircleStyling /> -->
  </Accordion>
</template>

<style scoped></style>

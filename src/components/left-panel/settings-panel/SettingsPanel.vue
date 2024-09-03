<script setup>
import { defineProps, ref, watch } from 'vue'
import { Map } from 'maplibre-gl'

import BaseMaps from './BaseMaps.vue'
import CircleRadius from './CircleRadius.vue'
import CircleColor from './CircleColor.vue'
import DataDrivenColoring from './DataDrivenColoring.vue'

const props = defineProps({
  map: Map
})
</script>

<template>
  <BaseMaps :map="props.map" />

  <CircleRadius :map="props.map" />

  <CircleColor :map="props.map" />

  <DataDrivenColoring :map="props.map" />
</template>

<style scoped></style>

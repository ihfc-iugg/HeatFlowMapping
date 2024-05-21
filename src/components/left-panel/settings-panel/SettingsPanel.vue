<script setup>
import { defineProps, ref, watch } from 'vue'

import BaseMapSettings from './BaseMapSettings.vue'
// import ClusterSettings from "./content/ClusterSettings.vue";
import CircleStylingSettings from './CircleStylingSettings.vue'
import { Map } from 'maplibre-gl'
// import GraticuleSettings from "./content/GraticuleSettings.vue";

const props = defineProps({
  map: Map,
  activeBaseLayer: String,
  heatFlowSchema: Object
})
const heatFlowSchema = ref(props.heatFlowSchema)

watch(props, (newProps) => {
  heatFlowSchema.value = newProps.heatFlowSchema

  console.log('--------Settings')
  console.log(heatFlowSchema.value)
})
</script>

<template>
  <BaseMapSettings :map="props.map" :activeBaseLayer="props.activeBaseLayer" />

  <!-- <ClusterSettings /> -->

  <CircleStylingSettings :map="props.map" />

  <!-- <GraticuleSettings /> -->
</template>

<style scoped></style>

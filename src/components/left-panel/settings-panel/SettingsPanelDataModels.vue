<script setup>
import { ref, watch } from 'vue'

import AccordionItem from '../AccordionItem.vue'

import { useSettingsStore } from '@/store/settings'
import { useMapStore } from '@/store/map'
import { useHFModelsStore } from '@/store/hfModels'

const settings = useSettingsStore()
const mapStore = useMapStore()
const hfModels = useHFModelsStore()

watch(
  () => hfModels.selectedModel,
  () => {
    if (hfModels.selectedModel) {
      mapStore.map.setLayoutProperty('hf_r2024_grid', 'visibility', 'visible')
    } else {
      mapStore.map.setLayoutProperty('hf_r2024_grid', 'visibility', 'none')
    }
  }
)
</script>

<template>
  <!-- Circle Size  -->
  <AccordionItem title="Heat Flow Models" id="heaFlowModels">
    <div v-for="model in hfModels.models" class="form-check">
      <input
        class="form-check-input"
        type="checkbox"
        name="exampleRadios"
        id="exampleRadios1"
        value="option1"
        v-model="hfModels.selectedModel"
      />
      <label class="form-check-label" for="exampleRadios1"> {{ model.title }} </label>
    </div>
  </AccordionItem>
</template>

<style></style>

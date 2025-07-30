<script setup>
import { watch } from 'vue'

import AccordionItem from '../AccordionItem.vue'
import ModelAttrbution from './ModelAttrbution.vue'

import { useMapStore } from '@/store/map'
import { useHFModelsStore } from '@/store/hfModels'

const mapStore = useMapStore()
const hfModels = useHFModelsStore()

/**
 * @description Watche for changes in the selected model and updates the map layer visibility accordingly.
 */
watch(
  () => hfModels.selectedModel,
  () => {
    console.log(hfModels.selectedModel)
    if (hfModels.selectedModel === 'none') {
      Object.values(hfModels.models).forEach((model) => {
        mapStore.map.setLayoutProperty(model.id, 'visibility', 'none')
      })
      mapStore.map.setLayoutProperty('hf_r2024_grid', 'visibility', 'none')
      return
    }

    if (hfModels.selectedModel) {
      mapStore.map.setLayoutProperty(hfModels.selectedModel, 'visibility', 'visible')
    } else {
      mapStore.map.setLayoutProperty(hfModels.selectedModel, 'visibility', 'none')
    }
  }
)
</script>

<template>
  <!-- Circle Size  -->
  <AccordionItem title="Heat Flow Models" id="heaFlowModels">
    <div class="form-check">
      <input
        class="form-check-input"
        type="radio"
        name="modelRadio"
        id="none"
        value="none"
        v-model="hfModels.selectedModel"
      />
      <label class="form-check-label">none</label>
      <div v-for="model in hfModels.models" :key="model.id">
        <input
          class="form-check-input"
          type="radio"
          name="modelRadio"
          :id="model.id"
          :value="model.id"
          v-model="hfModels.selectedModel"
        />
        <label class="form-check-label" for="{{ model.id }}">
          {{ model.title }}
        </label>
        <ModelAttrbution
          :id="'model-attribution-' + model.title"
          :attribution="model.attribution"
          :doi="model.doi"
        />
      </div>
    </div>

    <div v-if="hfModels.selectedModel && hfModels.selectedModel !== 'none'" class="form-check">
      <input
        type="range"
        class="form-range"
        id="customRange1"
        min="0"
        step="1"
        max="100"
        v-model="hfModels.opacity"
        @input="
          mapStore.map.setPaintProperty(
            hfModels.selectedModel,
            'raster-opacity',
            hfModels.opacity / 100
          )
        "
      />
      <span class="text-muted text-center">{{ hfModels.opacity }} % Layer Opacity</span>
    </div>
  </AccordionItem>
</template>

<style></style>

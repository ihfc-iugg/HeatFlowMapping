<script setup>
import ColorSchema from './ColorSchema.vue'
import { useDataDrivenColoringStore } from '../stores/dataDrivenColoring.js'
import { NATUREOFDATA } from '@/shared/constants/colorBrewer.js'

const dataDriven = useDataDrivenColoringStore()
</script>

<template>
  <div class="row pt-2 pb-1">
    <span>Nature of your data</span>
  </div>
  <div class="row">
    <div class="col-md-auto">
      <div v-for="type in NATUREOFDATA" class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="exampleRadios"
          :id="type.id"
          :value="type.id"
          v-model="dataDriven.selectedNatureOfData"
        />
        <label class="form-check-label" :for="type.id"> {{ type.title }} </label>
      </div>
    </div>
  </div>

  <ColorSchema
    id="colorSchemas"
    :classes="dataDriven.nrOfClasses"
    :nature-of-data="dataDriven.selectedNatureOfData"
  />
</template>

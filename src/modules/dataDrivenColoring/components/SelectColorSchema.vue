<script setup>
import ColorSchema from './ColorSchema.vue'
import { useColorPaletteStore } from '../stores/colorPalette'
import { useClassifierStore } from '../stores/classifier.js'

const colorPalette = useColorPaletteStore()
const classifier = useClassifierStore()
</script>

<template>
  <div class="row pt-2 pb-1">
    <span>Nature of your data</span>
  </div>
  <div class="row">
    <div class="col-md-auto">
      <div v-for="type in colorPalette.typesNatureOfData" class="form-check form-check-inline">
        <input
          class="form-check-input"
          type="radio"
          name="exampleRadios"
          :id="type.id"
          :value="type.id"
          v-model="colorPalette.selectedNatureOfData"
        />
        <label class="form-check-label" :for="type.id"> {{ type.title }} </label>
      </div>
    </div>
  </div>

  <ColorSchema
    id="colorSchemas"
    :classes="classifier.nrOfClasses"
    :nature-of-data="colorPalette.selectedNatureOfData"
  />
</template>

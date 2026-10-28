<script setup>
import { useDataDrivenColoringStore } from '../stores/dataDrivenColoring'

const dataDriven = useDataDrivenColoringStore()
</script>

<template>
  <select
    class="form-select form-select-sm"
    aria-label=".form-select-sm example"
    v-model="dataDriven.nrOfClasses"
  >
    <option disabled>Select number of classes</option>
    <option v-for="nr in [3, 4, 5, 6, 7, 8, 9]" :value="nr">{{ nr }}</option>
  </select>
</template>

<style></style>

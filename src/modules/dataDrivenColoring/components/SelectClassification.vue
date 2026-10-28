<script setup>
import { CLASSIFIER } from '@/shared/constants/classificationMethods'
import { useDataDrivenColoringStore } from '../stores/dataDrivenColoring'

const dataDriven = useDataDrivenColoringStore()
</script>

<template>
  <select
    class="form-select form-select-sm"
    aria-label=".form-select-sm example"
    v-model="dataDriven.selectedMethod"
  >
    <option disabled>Select a classification method</option>
    <option v-for="method in CLASSIFIER" :value="method">
      {{ method.title }}
    </option>
  </select>
</template>

<style></style>

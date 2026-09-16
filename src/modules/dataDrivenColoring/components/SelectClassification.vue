<script setup>
import { useClassifierStore } from '../stores/classifier'

const classifier = useClassifierStore()
</script>

<template>
  <select
    class="form-select form-select-sm"
    aria-label=".form-select-sm example"
    v-model="classifier.selectedMethod"
  >
    <option disabled>Select a classification method</option>
    <option v-for="method in classifier.methods" :value="method.name">
      {{ method.title }}
    </option>
  </select>
</template>

<style></style>

<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  value: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="row">
    <span class="text-muted text-start">{{ props.title }}</span>
  </div>
  <div class="row">
    <div class="col">
      <slot></slot>
    </div>
    <div class="col">
      <span class="text-muted text-center">{{ props.value }}</span>
    </div>
  </div>
</template>

<style></style>

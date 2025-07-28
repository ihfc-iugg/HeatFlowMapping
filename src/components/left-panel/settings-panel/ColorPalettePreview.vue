<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  colors: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="btn-group">
    <button
      v-for="color in colors"
      :key="color"
      type="button"
      class="btn btn-secondary"
      :style="{ backgroundColor: color }"
    ></button>
  </div>
</template>

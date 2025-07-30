<script setup>
import { defineProps } from 'vue'
defineProps({
  accordionId: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div class="accordion accordion-flush" :id="accordionId">
    <slot />
  </div>
</template>

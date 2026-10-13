<script setup>
import { defineProps } from 'vue'
const props = defineProps({
  accordionId: {
    type: String,
    required: true
  }
})
</script>
<template>
  <div class="accordion accordion-flush" :id="props.accordionId">
    <slot />
  </div>
</template>

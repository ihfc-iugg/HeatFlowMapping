<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  id: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="accordion-item">
    <h2 class="accordion-header">
      <button
        class="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#${props.id}`"
        aria-expanded="false"
        :aria-controls="props.id"
      >
        {{ props.title }}
      </button>
    </h2>
    <div :id="props.id" class="accordion-collapse collapse show" :data-bs-parent="`#${parentId}`">
      <div class="accordion-body">
        <slot />
      </div>
    </div>
  </div>
</template>

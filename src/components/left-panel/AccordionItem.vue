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
  <div class="accordion-item" :id="id + '-accordion-item'">
    <h2 class="accordion-header">
      <button
        class="accordion-button"
        type="button"
        data-bs-toggle="collapse"
        :data-bs-target="`#${id}`"
        aria-expanded="false"
        :aria-controls="id"
      >
        {{ title }}
      </button>
    </h2>
    <div :id="id" class="accordion-collapse collapse show" :data-bs-parent="`#${parentId}`">
      <div class="accordion-body">
        <slot />
      </div>
    </div>
  </div>
</template>

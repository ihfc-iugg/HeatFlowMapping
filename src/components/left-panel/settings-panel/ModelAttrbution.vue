<script setup>
import { defineProps, ref } from 'vue'

const isToggled = ref(false)

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  attribution: {
    type: String,
    required: true
  },
  doi: {
    type: String,
    default: '',
    required: false
  }
})

/**
 * @description Sets the cursor to pointer when hovering over the info icon.
 * @param event
 */
function setCursorToPointer(event) {
  event.target.style.cursor = 'pointer'
}
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    fill="currentColor"
    class="bi bi-info-circle m-1"
    viewBox="0 0 16 16"
    title="Model Attribution"
    @click="isToggled = !isToggled"
    @mouseover="setCursorToPointer($event)"
  >
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
    <path
      d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
    />
  </svg>

  <div v-if="isToggled">
    <p class="fst-italic">{{ attribution }}</p>
    <a v-if="doi.length > 0" :href="doi">doi</a>
  </div>
</template>

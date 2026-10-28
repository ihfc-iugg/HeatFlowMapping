<script setup>
import { defineProps } from 'vue'
import InfoSVG from '@/shared/assets/icons/info-circle-bootstrap.svg'

const props = defineProps({
  id: {
    type: String,
    required: true
  }
})
</script>
<template>
  <button
    class="btn btn-sm"
    type="button"
    data-bs-toggle="collapse"
    :data-bs-target="'#' + props.id"
    aria-expanded="false"
    :aria-controls="props.id"
  >
    <InfoSVG />
  </button>
</template>

<style></style>

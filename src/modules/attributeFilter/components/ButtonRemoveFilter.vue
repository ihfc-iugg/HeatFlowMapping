<script setup>
import { defineProps } from 'vue'
import { useFilterStore } from '../stores/attributeFilter'
import TrashSVG from '@/shared/assets/icons/trash-bootstrap.svg'

const props = defineProps({
  uuid: { type: String, required: true }
})

const filter = useFilterStore()
</script>

<template>
  <div class="pt-0" :id="props.id + '-remove'">
    <button
      class="btn rounded-pill btn-outline-success"
      @click="filter.removeFilterObject(props.uuid)"
    >
      <TrashSVG />
    </button>
  </div>
</template>

<style scoped></style>

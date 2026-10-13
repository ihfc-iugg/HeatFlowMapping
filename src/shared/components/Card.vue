<script setup>
import { boolean } from 'mathjs'
import { defineProps } from 'vue'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div class="card mt-1" :id="props.id">
    <div class="card-header" v-if="props.title">{{ props.title }}</div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<style></style>

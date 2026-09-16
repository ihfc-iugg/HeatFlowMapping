<script setup>
import { useFilterStore } from '../stores/attributeFilter'

const filter = useFilterStore()

// function onCLick() {
//   const uuid, filterObject = filter.createFilterObject()
// }
</script>

<template>
  <label for="add-filter-btn" v-if="filter.limit">You reached the max number of filters</label>
  <div class="d-grid justify-content-md-center" v-if="!filter.limit">
    <button
      type="button"
      class="btn rounded-pill btn-outline-success"
      @click="filter.addFilterObject()"
    >
      <small>+ Add Filter</small>
    </button>
  </div>
</template>
<style scoped></style>

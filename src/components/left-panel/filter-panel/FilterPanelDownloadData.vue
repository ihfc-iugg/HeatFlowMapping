<script setup>
import { useFilterStore } from '@/store/filter'
import { useMapStore } from '@/store/map'

const filter = useFilterStore()
const mapStore = useMapStore()

/**
 * @description
 */
function downloadFeatures(data, filename) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.geojson`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <!-- Download Features -->
  <button
    class="btn rounded-pill bg-white fw-bold position-absolute bottom-0 start-0 mx-2 my-2"
    style="color: #4366a1; border: 1px solid #4366a1"
    @click="
      (filter.getFilteredFeatures(mapStore.map),
      downloadFeatures(filter.getFilteredFeatures(mapStore.map), 'test'))
    "
  >
    <button
      class="btn rounded-circle"
      type="button"
      style="color: #4366a1; border: 1px solid #4366a1"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-download"
        viewBox="0 0 16 16"
      >
        <path
          d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"
        />
        <path
          d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"
        />
      </svg>
    </button>
    Download
  </button>
</template>

<style></style>

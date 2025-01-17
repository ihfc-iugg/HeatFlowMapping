<script setup>
import { defineProps } from 'vue'
import { useFilterStore } from '@/store/filter'
import { Map } from 'maplibre-gl'

const props = defineProps({ map: Map })

const filter = useFilterStore()

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
    class="btn btn-primary rounded-pill bg-white text-primary position-absolute bottom-0 start-0 mx-2 my-2"
    @click="
      filter.getFilteredFeatures(props.map),
        downloadFeatures(filter.getFilteredFeatures(props.map), 'test')
    "
  >
    <button class="btn btn-primary rounded-circle" type="button">
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

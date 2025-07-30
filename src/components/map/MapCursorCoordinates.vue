<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

import { useMapStore } from '@/store/map'

const mapStore = useMapStore()
const { isInstantiated } = storeToRefs(mapStore)

const lat = ref()
const lng = ref()

/**
 * @description Watches the map instantiation state and updates the cursor coordinates accordingly.
 */
watch(isInstantiated, () => {
  mapStore.map.on('mousemove', function (e) {
    lat.value = e.lngLat.wrap().lat.toFixed(5)
    lng.value = e.lngLat.wrap().lng.toFixed(5)
  })
})
</script>

<template>
  <div
    class="badge rounded-pill text-bg-light position-absolute start-0 bottom-0 m-2 fs-6 z-2 bg-opacity-50 d-none d-md-block mb-0 mb-md-3"
  >
    Lat: {{ lat }}, Lon: {{ lng }}
  </div>
</template>

<style scoped></style>

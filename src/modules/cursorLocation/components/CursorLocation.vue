<script setup>
import { onMounted, ref } from 'vue'
import { useApplicationStore } from '@/core/stores/app'

const app = useApplicationStore()

const lat = ref(null)
const lng = ref(null)

onMounted(() => {
  app.map.on('mousemove', function (e) {
    lat.value = e.lngLat.wrap().lat.toFixed(5)
    lng.value = e.lngLat.wrap().lng.toFixed(5)
  })
})
</script>

<template>
  <div
    class="position-absolute top-0 start-50 translate-middle badge rounded-pill text-bg-light m-3 fs-6 z-2 bg-opacity-50 d-none d-md-block mb-0 mb-md-3"
  >
    Lat: {{ lat }}, Lon: {{ lng }}
  </div>
</template>

<style scoped></style>

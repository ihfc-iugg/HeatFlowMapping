<script setup>
import { onMounted, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'

// import { useMapStore } from '@/store/map'
import { useApplicationStore } from '@/core/stores/app'

// const mapStore = useMapStore()
const app = useApplicationStore()
// const { isInstantiated } = storeToRefs(app)

const lat = ref(null)
const lng = ref(null)

// /**
//  * @description Watches the map instantiation state and updates the cursor coordinates accordingly.
//  */
// watch(isInstantiated, () => {
//   app.map.on('mousemove', function (e) {
//     lat.value = e.lngLat.wrap().lat.toFixed(5)
//     lng.value = e.lngLat.wrap().lng.toFixed(5)
//   })
// })

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

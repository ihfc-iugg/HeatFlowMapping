<script setup>
import { ref } from 'vue'

import { useMapStore } from '@/store/map'

const mapStore = useMapStore()

const lat = ref()
const lng = ref()

mapStore.map.on('mousemove', function (e) {
  lat.value = e.lngLat.wrap().lat.toFixed(5)
  lng.value = e.lngLat.wrap().lng.toFixed(5)
})
</script>

<template>
  <div class="cursor-coordinates">Lat: {{ lat }}, Lon: {{ lng }}</div>
</template>

<style scoped>
.cursor-coordinates {
  display: block;
  position: relative;
  margin: 0px auto;
  width: fit-content;
  padding: 10px;
  border: none;
  border-radius: 3px;
  font-size: 10px;
  text-align: left;
  color: black;
  background: rgba(255, 255, 255, 0.5);
  z-index: 100;
}
</style>

<script setup>
import { useSettingsStore } from '@/store/settings'
import { useMapStore } from '@/store/map'

const settings = useSettingsStore()
const mapStore = useMapStore()

/**
 *
 * @param {*} circleRadius
 * @description If user changes size of circles, the watch method keeps track of it and adjust it synchron
 */
function setCircleRadius(circleRadius) {
  mapStore.map.setPaintProperty('sites', 'circle-radius', parseInt(circleRadius))
}
</script>

<template>
  <!-- Circle Size  -->
  <div style="border-bottom: 2px solid #00c9a7">
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn text-start text-light dropdown-toggle"
        type="button"
        style="background-color: #4366a1"
        data-bs-toggle="collapse"
        data-bs-target="#circleSize"
        aria-expanded="false"
        aria-controls="circleSize"
      >
        Circle Radius
      </button>
    </p>
    <div class="collapse p-1" id="circleSize">
      <div class="card card-body">
        <input
          type="range"
          class="form-range"
          id="customRange1"
          min="0"
          step="1"
          max="10"
          v-model="settings.circleRadius"
          @input="setCircleRadius(settings.circleRadius)"
        />
        <span class="text-muted text-center">{{ settings.circleRadius }} px</span>
      </div>
    </div>
  </div>
</template>

<style></style>

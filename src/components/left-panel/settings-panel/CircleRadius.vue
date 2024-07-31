<script setup>
import { defineProps, ref, watch } from 'vue'
import { useSettingsStore } from '@/store/settings'

const settings = useSettingsStore()

const props = defineProps({ map: Map })
/**
 *
 * @param {*} circleRadius
 * @description If user changes size of circles, the watch method keeps track of it and adjust it synchron
 */
function setCircleRadius(circleRadius) {
  props.map.setPaintProperty('sites', 'circle-radius', parseInt(circleRadius))
}
</script>

<template>
  <!-- Circle Size  -->
  <p class="mt-1 d-grid gap-2">
    <button
      class="btn btn-primary text-start"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#circleSize"
      aria-expanded="false"
      aria-controls="circleSize"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrows-expand"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2M8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
        />
      </svg>
      Circle Radius
    </button>
  </p>
  <div class="collapse" id="circleSize">
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
</template>

<style></style>

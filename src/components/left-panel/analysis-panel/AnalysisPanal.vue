<script setup>
import { defineProps } from 'vue'
import { Map } from 'maplibre-gl'
import DigitalBorehole from '@/components/left-panel/analysis-panel/DigitalBorehole.vue'
import LineProfile from '@/components/left-panel/analysis-panel/LineProfile.vue'

const props = defineProps({ map: Map })
</script>

<template>
  <div>
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn btn-primary text-start dropdown-toggle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#digitalBorehole"
        aria-expanded="false"
        aria-controls="digitalBorehole"
      >
        Digital Borehole
      </button>
    </p>
    <div class="collapse" id="digitalBorehole">
      <DigitalBorehole :map="map" />
    </div>

    <p class="mt-1 d-grid gap-2">
      <button
        class="btn btn-primary text-start dropdown-toggle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#profile"
        aria-expanded="false"
        aria-controls="profile"
      >
        2D Profile
      </button>
    </p>
    <div class="collapse" id="profile">
      <LineProfile :map="map" />
    </div>
  </div>
</template>

<style></style>

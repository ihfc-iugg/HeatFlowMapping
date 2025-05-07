<script setup>
import { defineProps } from 'vue'
import { Map } from 'maplibre-gl'
import DBDigitalBorehole from '@/components/left-panel/analysis-panel/DBDigitalBorehole.vue'
import Profile2D from '@/components/left-panel/analysis-panel/Profile2D.vue'

const props = defineProps({ map: Map })
</script>

<template>
  <div>
    <div style="border-bottom: 2px solid #00c9a7">
      <p class="mt-1 d-grid gap-2">
        <button
          class="btn text-start text-light dropdown-toggle"
          type="button"
          style="background-color: #4366a1"
          data-bs-toggle="collapse"
          data-bs-target="#digitalBorehole"
          aria-expanded="false"
          aria-controls="digitalBorehole"
        >
          Digital Borehole
        </button>
      </p>
      <div class="collapse" id="digitalBorehole">
        <DBDigitalBorehole :map="map" />
      </div>
    </div>

    <div style="border-bottom: 2px solid #00c9a7">
      <p class="mt-1 d-grid gap-2" style="border-bottom: 2px solid #00c9a7">
        <button
          class="btn text-start text-light dropdown-toggle"
          type="button"
          style="background-color: #4366a1; color: #f9f871"
          data-bs-toggle="collapse"
          data-bs-target="#profile"
          aria-expanded="false"
          aria-controls="profile"
        >
          2D Profile
        </button>
      </p>
      <div class="collapse" id="profile">
        <Profile2D :map="map" />
      </div>
    </div>
  </div>
</template>

<style></style>

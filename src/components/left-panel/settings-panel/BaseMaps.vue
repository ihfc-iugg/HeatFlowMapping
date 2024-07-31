<script setup>
import { defineProps } from 'vue'

import { Map } from 'maplibre-gl'

import { useSettingsStore } from '@/store/settings'
import { useBaseMapsStore } from '@/store/baseMaps'

const settings = useSettingsStore()
const bm = useBaseMapsStore()

const props = defineProps({ map: Map })

function changeBaseLayer(oldBaseLayer, newBaseLayer) {
  // change base map on click
  if (newBaseLayer == oldBaseLayer) {
    return
  } else {
    props.map.setLayoutProperty(oldBaseLayer, 'visibility', 'none')
    props.map.setLayoutProperty(newBaseLayer, 'visibility', 'visible')
    settings.activeBaseLayer = newBaseLayer
  }
}
</script>

<template>
  <div class="base-map-settings">
    <p class="d-grid gap-2">
      <button
        class="btn btn-primary text-start dropdown-toggle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#baseMaps"
        aria-expanded="false"
        aria-controls="baseMaps"
      >
        Base Maps
      </button>
    </p>
    <div class="collapse" id="baseMaps">
      <div class="maps-content d-flex">
        <div
          class="card mx-1"
          style="width: 9rem"
          role="button"
          v-for="baseMap in bm.baseMaps"
          :key="baseMap.id"
          @click="changeBaseLayer(settings.activeBaseLayer, baseMap.id)"
        >
          <img class="card-img-top" :src="baseMap.cardImage" alt="Card image cap" />
          <p class="text-center">{{ baseMap.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

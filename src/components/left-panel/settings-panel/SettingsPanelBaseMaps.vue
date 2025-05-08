<script setup>
import { useSettingsStore } from '@/store/settings'
import { useBaseMapsStore } from '@/store/baseMaps'
import { useMapStore } from '@/store/map'

const settings = useSettingsStore()
const bm = useBaseMapsStore()
const mapStore = useMapStore()

function changeBaseLayer(oldBaseLayer, newBaseLayer) {
  // change base map on click
  if (newBaseLayer == oldBaseLayer) {
    return
  } else {
    mapStore.map.setLayoutProperty(oldBaseLayer, 'visibility', 'none')
    mapStore.map.setLayoutProperty(newBaseLayer, 'visibility', 'visible')
    settings.activeBaseLayer = newBaseLayer
  }
}
</script>

<template>
  <div class="base-map-settings" style="border-bottom: 2px solid #00c9a7">
    <p class="d-grid gap-1">
      <button
        class="btn text-start text-light dropdown-toggle"
        type="button"
        style="background-color: #4366a1"
        data-bs-toggle="collapse"
        data-bs-target="#baseMaps"
        aria-expanded="false"
        aria-controls="baseMaps"
      >
        Base Maps
      </button>
    </p>
    <div class="collapse p-1" id="baseMaps">
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
          <p class="fs-7 text-center">{{ baseMap.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

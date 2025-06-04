<script setup>
import { useSettingsStore } from '@/store/settings'
import { useBaseMapsStore } from '@/store/baseMaps'
import { useMapStore } from '@/store/map'

import AccordionItem from '../AccordionItem.vue'

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
  <AccordionItem title="Base Maps" id="base-maps-accordion">
    <div class="maps-content row row-cols-2 row-cols-md-3 g-1">
      <div v-for="baseMap in bm.baseMaps" class="col">
        <div
          class="card h-100"
          role="button"
          :key="baseMap.id"
          @click="changeBaseLayer(settings.activeBaseLayer, baseMap.id)"
        >
          <img class="card-img-top" :src="baseMap.cardImage" alt="Card image cap" />
          <p class="fs-7 text-center">{{ baseMap.title }}</p>
        </div>
      </div>
    </div>
  </AccordionItem>
</template>

<style></style>

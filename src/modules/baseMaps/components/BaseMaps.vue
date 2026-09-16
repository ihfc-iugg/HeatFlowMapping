<script setup>
import { useBaseMapsStore } from '@/modules/baseMaps/stores/baseMapsStore.js'
import { useApplicationStore } from '@/core/stores/app'
import { BASEMAPS } from '@/core/constants/externalGeoData'

import AccordionItem from '@/core/components/AccordionItem.vue'
import { onMounted, watch } from 'vue'

const baseMaps = useBaseMapsStore()
const app = useApplicationStore()

onMounted(() => {
  app.map.once('load', () => {
    baseMaps.addBaseMaps(app.map)
  })
})

watch(
  () => baseMaps.selectedLayer,
  (newSelectedLayer, oldSelectedLayer) => {
    if (oldSelectedLayer) {
      document.getElementById(oldSelectedLayer).style.backgroundColor = ''
    }
    document.getElementById(newSelectedLayer).style.backgroundColor = 'rgba(227,30,36,0.4)'
    app.map.setLayoutProperty(oldSelectedLayer, 'visibility', 'none')
    app.map.setLayoutProperty(newSelectedLayer, 'visibility', 'visible')
  }
)
</script>

<template>
  <AccordionItem title="Base Maps" id="base-maps-accordion">
    <div class="maps-content row row-cols-2 row-cols-md-3 g-1">
      <div
        v-for="(value, key) in BASEMAPS"
        class="col"
        :id="key"
        @click="baseMaps.selectedLayer = key"
        @mousemove="$event.currentTarget.style.border = '2px solid rgba(227,30,36,0.6)'"
        @mouseleave="$event.currentTarget.style.border = ''"
      >
        <div class="card m-1" role="button" :key="key">
          <img class="card-img-top" :src="value.cardImage" alt="Card image cap" />
          <p class="fs-7 text-center">{{ value.title }}</p>
        </div>
      </div>
    </div>
  </AccordionItem>
</template>

<style></style>

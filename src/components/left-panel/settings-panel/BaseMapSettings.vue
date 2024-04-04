<script setup>
import { defineProps } from "vue";

import { Map } from "maplibre-gl";

import { useSettingsStore } from "@/store/settings";
import { useBaseMapsStore } from "@/store/baseMaps";

const settings = useSettingsStore();
const bm = useBaseMapsStore();

const props = defineProps({ map: Map });

function changeBaseLayer(oldBaseLayer, newBaseLayer) {
  // change base map on click
  if (newBaseLayer == oldBaseLayer) {
    return;
  } else {
    props.map.setLayoutProperty(oldBaseLayer, "visibility", "none");
    props.map.setLayoutProperty(newBaseLayer, "visibility", "visible");
    settings.activeBaseLayer = newBaseLayer;
  }
}
</script>

<template>
  <div class="base-map-settings">
    <p class="d-grid gap-2">
      <button
        class="btn btn-primary text-start"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#baseMaps"
        aria-expanded="false"
        aria-controls="baseMaps"
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
          <img
            class="card-img-top"
            :src="baseMap.cardImage"
            alt="Card image cap"
          />
          <p class="text-center">{{ baseMap.title }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

<!-- Show popup containing infos of point (on click) -->
<script setup>
import { defineProps, ref, watch } from "vue";

import { Map, Popup } from "maplibre-gl";

const props = defineProps({ map: Map });
const map = ref(props.map);

watch(props, (newProps) => {
  map.value = newProps.map;

  // source: https://maplibre.org/maplibre-gl-js/docs/examples/popup-on-click/
  map.value.on("click", "sites", (e) => {
    const coordinates = e.features[0].geometry.coordinates.slice();
    // const description = e.features[0].properties;
    const description = "Here selection of attributes";

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }

    new Popup().setLngLat(coordinates).setHTML(description).addTo(map.value);
  });

  // use selected point coord as center
  // map.value.on("click", "sites", (e) => {
  //   map.value.flyTo({
  //     center: e.features[0].geometry.coordinates,
  //   });
  // });

  // Change the cursor to a pointer when the mouse is over the places layer.
  map.value.on("mouseenter", "sites", () => {
    map.value.getCanvas().style.cursor = "pointer";
  });

  // Change it back to a pointer when it leaves.
  map.value.on("mouseleave", "sites", () => {
    map.value.getCanvas().style.cursor = "";
  });
});
</script>

<template>
  <div class=""></div>
</template>

<style scoped>
.maplibregl-popup {
  max-width: 400px;
  font: 12px/20px "Helvetica Neue", Arial, Helvetica, sans-serif;
}
</style>

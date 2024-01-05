<!-- Dealing with map controls provided as third-party plugins  -->
<script setup>
import { Map } from "maplibre-gl";
import { defineProps, ref, watch } from "vue";

import {
  ScaleControl,
  FullscreenControl,
  NavigationControl,
} from "maplibre-gl";

const props = defineProps({ map: Map });
const map = ref(props.map);

watch(props, (newProps) => {
  map.value = newProps.map;

  // add controls included in maplibre
  map.value.addControl(new ScaleControl(), "bottom-right");
  map.value.addControl(new FullscreenControl(), "top-right");
  map.value.addControl(new NavigationControl(), "top-right");
});
</script>

<template>
  <div class=""></div>
</template>

<style scoped></style>

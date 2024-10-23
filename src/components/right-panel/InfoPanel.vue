<!-- <script setup>
import { ref, defineProps, defineExpose } from "vue";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardText,
} from "@coreui/bootstrap-vue";

defineExpose({
  aboutSelectedData,
  showText,
  hideText,
});

const props = defineProps({
  currentPage: Number,
});

const id = ref("");
const lat = ref("");
const lon = ref("");
const env = ref("");
const method = ref("");
const purpose = ref("");
const show = ref(false);

// functions
function showText() {
  if (show.value === false) {
    show.value = !show.value;
  }
}
function hideText() {
  if (show.value === true) {
    show.value = !show.value;
  }
}

// InfoContainer
const showAboutSelectedData = ref(false);

function aboutSelectedData(val, chartContext, config) {
  const { seriesIndex, dataPointIndex, w } = config;
  id.value = w.config.series[seriesIndex].data[dataPointIndex].id;
  lat.value = w.config.series[seriesIndex].data[dataPointIndex].lat;
  lon.value = w.config.series[seriesIndex].data[dataPointIndex].lon;
  env.value =
    w.config.series[seriesIndex].data[dataPointIndex].properties.environment;
  method.value =
    w.config.series[seriesIndex].data[dataPointIndex].properties.explo_method;
  purpose.value =
    w.config.series[seriesIndex].data[dataPointIndex].properties.explo_purpose;
  console.log(
    "Selected Data",
    "ID:" + id.value,
    "coordinates:" + lat.value,
    lon.value,
    "env:" + env.value,
    "method:" + method.value,
    "purpose:" + purpose.value
  );
  if (showAboutSelectedData.value === false) {
    showAboutSelectedData.value = !showAboutSelectedData.value;
  }
}
</script>

<template>
  <div class="infoContainer" v-if="props.currentPage === 0">
    <CCard class="mt-2" style="height: 90%">
      <CCardHeader>
        <strong>About Selected Point-Data</strong>
      </CCardHeader>
      <CCardBody v-show="!show" class="overflow-auto"></CCardBody>
      <CCardBody v-show="show" class="overflow-auto">
        <div v-show="!showAboutSelectedData">
          <CCardText>Click on any point data for details.</CCardText>
        </div>
        <div v-show="showAboutSelectedData">
          <p>ID: {{ id }}</p>
          <p>Lat: {{ lat }}, Lon: {{ lon }}</p>
          <p>Basic geographical environment: {{ env }}</p>
          <p>Type of exploration method: {{ method }}</p>
          <p>Original exploration purpose: {{ purpose }}</p>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<style scoped>
.infoContainer {
  overflow: auto;
  position: absolute;
  width: 100%;
  height: 30%;
  bottom: 0;
  padding-right: 12px;
}
</style> -->

<script setup>
import { watch } from 'vue'
import { useDigitalBoreholeStore } from '@/store/digitalBorehole'

const dB = useDigitalBoreholeStore()

watch(dB.layers, () => {
  dB.bootstrapping(dB.layers, dB.t0, dB.closestPointfeatures.properties.q)
  dB.drawChart(dB.layers, dB.t0)
})
</script>

<template>
  <!-- <button
    class="btn btn-primary rounded-pill bg-white text-primary align-bottom"
    @click="dB.setLayer(null, null, null, null, 2.3, 100, 2, 'sample')"
  >
    <button class="btn btn-primary rounded-circle btn-sm" type="button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-plus"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
        />
      </svg>
    </button>
    Add Layer
  </button> -->
  <a
    href="#"
    class="button btn-sm bg-primary text-white"
    @click="dB.setLayer(null, null, null, null, 2.3, 100, 2, 'sample')"
  >
    <span class="icon-layer-handling btn text-white rounded-circle btn-sm">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-plus"
        viewBox="0 0 16 16"
      >
        <path
          d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"
        />
      </svg>
    </span>
    <span class="text">Add Layer</span>
  </a>
</template>

<style>
.button {
  text-decoration: none;
  border-radius: 60px;
  height: 32px;
  display: inline-flex;
  align-items: center;
  overflow: hidden;
  width: auto;
  max-width: 32px;
  -webkit-transition: max-width 0.5s;
  transition: max-width 0.5s;
}

.button:hover {
  max-width: 300px;
}

.icon-layer-handling {
  font-family: 'Font Awesome 5 Free';
  font-size: 16px;
  margin-right: 15px;
  padding: 0px 8px;
  display: flex;
  align-items: center;
}

.text {
  white-space: nowrap;
  padding-right: 15px;
}
</style>

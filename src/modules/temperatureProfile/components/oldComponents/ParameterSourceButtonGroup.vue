<script setup>
import { useTemperatureProfileStore } from '../stores/temperatureProfile'

const tempProfile = useTemperatureProfileStore()
</script>

<template>
  <div
    class="btn-group d-flex align-items-center"
    role="group"
    aria-label="Basic radio toggle button group"
  >
    <!-- <input
      type="radio"
      class="btn-check"
      name="btn-radio-parameter-source"
      id="dataBased"
      autocomplete="off"
      value="dataBased"
      v-model="tempProfile.parameterSource"
    />
    <label class="btn btn-outline-success" for="dataBased">Data Based</label> -->

    <input
      type="radio"
      class="btn-check"
      name="btn-radio-parameter-source"
      id="customParameter"
      value="customParameter"
      v-model="tempProfile.parameterSource"
    />
    <label class="btn btn-outline-success" for="customParameter">Custom Parameter</label>
  </div>
</template>

<style></style>

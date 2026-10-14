<script setup>
import { ref } from 'vue'
import { useTemperatureProfileStore } from '../stores/temperatureProfile'
import AttributionBtn from '@/modules/attribution/components/AttributionBtn.vue'
import AttributionCard from '@/modules/attribution/components/AttributionCard.vue'
import { CRUST1, NOAA } from '@/shared/constants/externalGeoData'

const tempProfile = useTemperatureProfileStore()
</script>
<template>
  <div class="mt-1">
    <span class="">Use global data sets</span>

    <div class="row d-flex">
      <div class="col-9 p-2 flex-shrink-1">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckDefault"
            v-model="tempProfile.useCrust1"
            checked
          />
          <label class="form-check-label" for="switchCheckDefault">
            <span class="fw-bold">CRUST1.0</span>
            for
            <math display="">
              <msub>
                <mi>&Delta;</mi>
                <mn>Zi</mn>
              </msub>
            </math>
            <!-- <mo>Layer Thickness</mo> -->
            <!-- </math> -->
            Layer Thickness
          </label>
        </div>
      </div>
      <div class="col p-2 w-100">
        <AttributionBtn :id="CRUST1.general.id" />
      </div>
    </div>

    <div class="row d-flex">
      <div class="col-9 p-2 flex-shrink-1">
        <div class="form-check form-switch">
          <input
            class="form-check-input"
            type="checkbox"
            role="switch"
            id="switchCheckChecked"
            v-model="tempProfile.useNOAA"
            checked
          />

          <label class="form-check-label" for="switchCheckChecked">
            <span class="fw-bold">NOAA</span> for
            <math display="">
              <msub>
                <mi>T</mi>
                <mn>0</mn>
              </msub>
            </math>
            Ground Surface Temperature
          </label>
        </div>
      </div>

      <div class="col p-2 w-100"><AttributionBtn :id="NOAA.noaa.id" /></div>
    </div>
  </div>

  <Teleport to=".offcanvas">
    <AttributionCard :layer="CRUST1.general" />
    <AttributionCard :layer="NOAA.noaa" />
  </Teleport>
</template>

<style></style>

<script setup>
import { ref, watch } from 'vue'
import { Map } from 'maplibre-gl'
import { CTooltip } from '@coreui/bootstrap-vue'
import LineDrawToolbox from '@/components/left-panel/analysis-panel/LineDrawToolbox.vue'
import LineSetup from '@/components/left-panel/analysis-panel/LineSetup.vue'
import { use2DProfileStore } from '@/store/2DProfile'
import { useMeasurementStore } from '@/store/measurements'

const profile = use2DProfileStore()
const measurements = useMeasurementStore()

const props = defineProps({ map: Map })
const activeTab = ref('setup')

watch(profile, () => {
  const element = document.getElementById('startCalculationBtn')
  if (profile.selectedProperty1 && profile.threshold && profile.line) {
    element.classList.remove('disabled')
    // element.classList.add('btn-success')
  } else {
    // element.classList.remove('btn-success')
    element.classList.add('disabled')
  }
})

/**
 *
 * @param {String} tab
 */
function setActiveTab(tab) {
  activeTab.value = tab
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-md-auto ps-0">
        <div class="btn-group-vertical" role="group">
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="setupInput"
            autocomplete="off"
            checked
            data-bs-toggle="collapse"
            href="#setup"
          />
          <label class="btn btn-outline-primary" for="setupInput" @click="setActiveTab('setup')">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-sliders"
              viewBox="0 0 16 16"
            >
              <path
                fill-rule="evenodd"
                d="M11.5 2a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M9.05 3a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0V3zM4.5 7a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3M2.05 8a2.5 2.5 0 0 1 4.9 0H16v1H6.95a2.5 2.5 0 0 1-4.9 0H0V8zm9.45 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m-2.45 1a2.5 2.5 0 0 1 4.9 0H16v1h-2.05a2.5 2.5 0 0 1-4.9 0H0v-1z"
              />
            </svg>
          </label>
          <input
            type="radio"
            class="btn-check"
            name="btnradio"
            id="toolboxInput"
            autocomplete="off"
            data-bs-toggle="collapse"
            href="#toolbox"
          />
          <label
            class="btn btn-outline-primary"
            for="toolboxInput"
            @click="setActiveTab('toolbox')"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pencil-fill"
              viewBox="0 0 16 16"
            >
              <path
                d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"
              />
            </svg>
          </label>
        </div>
      </div>
      <div class="col pe-0">
        <div v-if="activeTab == 'setup'" class="card collapse mb-1" id="setup" style="width: 100%">
          <LineSetup :map="map" />
        </div>
        <div
          v-if="activeTab == 'toolbox'"
          class="card collapse mb-1"
          id="toolbox"
          style="width: 100%"
        >
          <LineDrawToolbox :map="map" />
        </div>
      </div>
    </div>
    <div class="row">
      <div class="col px-0">
        <div
          v-if="!profile.selectedProperty1 || !profile.threshold || !profile.line"
          id=""
          class="form-text"
        >
          {{ profile.selectedProperty1 ? '' : 'Property' }}
          {{ profile.threshold ? '' : 'Threshold' }}, {{ profile.line ? '' : 'Line' }} is missing to
          start the calculation
        </div>
        <button
          id="startCalculationBtn"
          type="button"
          class="btn mt-2 btn-success"
          data-bs-toggle="tooltip"
          data-bs-placement="bottom"
          data-bs-title="Click to start the calculation"
          @click="
            profile.setPointsWithinDistance(
              measurements.geojson.features,
              profile.line,
              profile.threshold
            ),
              profile.highlightPointsWithinDistance(props.map, profile.pointsWithinDistance)
          "
        >
          Calculate 2D Profile
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>

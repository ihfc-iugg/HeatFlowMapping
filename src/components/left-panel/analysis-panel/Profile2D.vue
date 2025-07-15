<script setup>
import { ref, watch } from 'vue'
import { Map } from 'maplibre-gl'

import Profile2DLineDrawToolbox from '@/components/left-panel/analysis-panel/Profile2DLineDrawToolbox.vue'
import Profile2DLineSetup from '@/components/left-panel/analysis-panel/Profile2DLineSetup.vue'
import Profile2DLineChartPopup from '@/components/left-panel/analysis-panel/Profile2DLineChartPopup.vue'
import Profile2DAbout from '@/components/left-panel/analysis-panel/Profile2DAbout.vue'
import AccordionItem from '../AccordionItem.vue'

import { use2DProfileStore } from '@/store/2DProfile'
import { useGHFDBStore } from '@/store/ghfdb'
import { useMapStore } from '@/store/map'

const profile = use2DProfileStore()
const ghfdb = useGHFDBStore()
const mapStore = useMapStore()

const props = defineProps({ map: Map })
const activeTab = ref('toolbox')
const hasChartPopup = ref(false)

/**
 * add or remove disable for calculation btn
 */
watch(profile, () => {
  const element = document.getElementById('startCalculationBtn')
  if (profile.selectedProperty1 && profile.threshold && profile.line) {
    element.classList.remove('disabled')
  } else {
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
  <AccordionItem title="2D Profile" id="profile2DAccordion">
    <div class="vstack gap-1">
      <div class="btn-group" role="group" data-toggle="buttons" aria-label="2D Profile group">
        <input
          type="radio"
          class="btn-check"
          name="vbtn-radio"
          id="toolboxInput"
          autocomplete="off"
          checked
        />
        <label
          class="btn btn-outline-secondary"
          for="toolboxInput"
          title="Line draw toolbox"
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
        <input
          type="radio"
          class="btn-check"
          name="vbtn-radio"
          id="setupInput"
          autocomplete="off"
        />
        <label
          class="btn btn-outline-secondary"
          for="setupInput"
          title="Parameter settings"
          @click="setActiveTab('setup')"
        >
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
          name="vbtn-radio"
          id="about2DProfile"
          autocomplete="off"
        />
        <label
          class="btn btn-outline-secondary"
          for="about2DProfile"
          title="Information about 2D Profile"
          @click="setActiveTab('about2DProfile')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-info-circle"
          >
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
            <path
              d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
            />
          </svg>
        </label>
      </div>

      <div v-if="activeTab === 'setup'" class="card" id="setup">
        <Profile2DLineSetup :map="map" />
      </div>
      <div v-if="activeTab == 'toolbox'" class="card" id="toolbox">
        <Profile2DLineDrawToolbox :map="map" />
      </div>
      <div v-if="activeTab === 'about2DProfile'" class="card" id="about2DProfile">
        <Profile2DAbout />
      </div>
    </div>
    <div class="col d-grid justify-content-md-end">
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
        class="btn mt-2 btn-success rounded-pill disabled"
        data-bs-toggle="tooltip"
        data-bs-placement="bottom"
        data-bs-title="Click to start the calculation"
        @click="
          (profile.setPointsWithinDistance(ghfdb.geojson.features, profile.line, profile.threshold),
          // profile.highlightPointsWithinDistance(props.map, profile.pointsWithinDistance),
          mapStore.map.setPaintProperty(
            'ghfdb',
            'circle-color',
            profile.generatePaintProperty(profile.pointsWithinDistance)
          ),
          profile.toggleTriggerPopup())
        "
      >
        Calculate 2D Profile
      </button>
      <Profile2DLineChartPopup :hasPopup="hasChartPopup" />
    </div>
  </AccordionItem>
</template>

<style></style>

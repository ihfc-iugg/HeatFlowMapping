<script setup>
import { ref, defineProps, watch, onMounted } from 'vue'
import { Map } from 'maplibre-gl'

import { useDigitalBoreholeStore } from '@/store/digitalBorehole'
import DBCustomParameters from '@/components/left-panel/analysis-panel/DBCustomParameters.vue'
import DBAboutBootstrapping from '@/components/left-panel/analysis-panel/DBAboutBootstrapping.vue'
import DBPointDrawToolbox from '@/components/left-panel/analysis-panel/DBPointDrawToolbox.vue'
import DBPopup from './DBPopup.vue'
import AccordionItem from '../AccordionItem.vue'

const props = defineProps({ map: Map })
const dB = useDigitalBoreholeStore()

const activeTab = ref('pntToolBox')

dB.setLayer(null, null, null, null, 2.3, 100, 2, 'Layer 1')
dB.setLayer(null, null, null, null, 5, 200, 3, 'Layer 2')
dB.setLayer(null, null, null, null, 1.4, 300, 1.3, 'Layer 3')
dB.setLayer(null, null, null, null, 1.5, 200, 0.8, 'Layer 4')

/**
 * @description Sets the active tab for the digital borehole analysis panel.
 * @param {String} tab
 */
function setActiveTab(tab) {
  activeTab.value = tab
}
</script>

<template>
  <AccordionItem id="analysis-accordion-item" title="Digital Borehole">
    <div class="vstack gap-1">
      <div class="btn-group" role="group" data-toggle="buttons" aria-label="Digital borehole group">
        <input
          type="radio"
          class="btn-check"
          name="btnradio"
          id="pntToolBox"
          autocomplete="off"
          checked
        />
        <label
          class="btn btn-outline-secondary"
          for="pntToolBox"
          title="Point draw toolbox"
          @click="setActiveTab('pntToolBox')"
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
          name="btnradio"
          id="parameterToolBox"
          autocomplete="off"
        />
        <label
          class="btn btn-outline-secondary"
          for="parameterToolBox"
          title="Customize boostrapping parameter"
          @click="setActiveTab('parameterToolBox')"
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
          name="btnradio"
          id="aboutBootstrapping"
          autocomplete="off"
        />
        <label
          class="btn btn-outline-secondary"
          for="aboutBootstrapping"
          title="Information about Digital Borehole"
          @click="setActiveTab('aboutBootstrapping')"
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

      <div v-if="activeTab === 'pntToolBox'" class="card" id="pntToolBox">
        <DBPointDrawToolbox />
      </div>
      <div v-if="activeTab === 'parameterToolBox'" class="card" id="parameterToolBox">
        <DBCustomParameters />
      </div>
      <div v-if="activeTab === 'aboutBootstrapping'" class="card" id="aboutBootstrapping">
        <DBAboutBootstrapping />
      </div>
    </div>

    <DBPopup />
  </AccordionItem>
</template>

<style></style>

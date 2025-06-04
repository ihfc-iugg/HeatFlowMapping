<script setup>
import { defineProps, ref } from 'vue'
import { Map } from 'maplibre-gl'

import FilterPanelFIlterByLocationDrawToolbox from './FilterPanelFIlterByLocationDrawToolbox.vue'
import FilterPanelFilterByLocationAbout from '@/components/left-panel/filter-panel/FilterPanelFilterByLocationAbout.vue'
import AccordionItem from '../AccordionItem.vue'

const props = defineProps({ map: Map })

const activeTab = ref('toolbox')

/**
 *
 * @param {String} tab
 */
function setActiveTab(tab) {
  activeTab.value = tab
}
</script>

<template>
  <AccordionItem id="locationFilter" title="Location Filter">
    <div class="container">
      <div class="row">
        <div class="col-md-auto ps-0">
          <div class="btn-group-vertical" role="group">
            <input
              type="radio"
              class="btn-check"
              name="btn-radio"
              id="toolbox"
              autocomplete="off"
              checked
            />
            <label class="btn btn-outline-secondary" for="toolbox" @click="setActiveTab('toolbox')">
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
              name="btn-radio"
              id="aboutLocationFIlter"
              autocomplete="off"
            />
            <label
              class="btn btn-outline-secondary"
              for="aboutLocationFIlter"
              @click="setActiveTab('aboutLocationFIlter')"
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
        </div>
        <div class="col pe-0">
          <div v-if="activeTab == 'toolbox'" class="card mb-1" id="toolbox" style="width: 100%">
            <FilterPanelFIlterByLocationDrawToolbox :map="map" />
          </div>
          <div
            v-if="activeTab == 'aboutLocationFIlter'"
            class="card mb-1"
            id="aboutLocationFIlter"
            style="width: 100%"
          >
            <FilterPanelFilterByLocationAbout />
          </div>
        </div>
      </div>
    </div>
  </AccordionItem>
</template>

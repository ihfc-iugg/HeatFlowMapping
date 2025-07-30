<script setup>
import SettingsPanel from './settings-panel/SettingsPanel.vue'
import FilterPanal from './filter-panel/FilterPanal.vue'
import StatisticsPanal from './statistics-panel/StatisticsPanal.vue'
import AnalysisPanal from './analysis-panel/AnalysisPanal.vue'

import { useNavigationBarStore } from '@/store/navigationBar'

const navBar = useNavigationBarStore()
</script>

<template>
  <div class="offcanvas-header bg-primary">
    <div class="row">
      <div class="col">
        <div class="col-md-auto text-light" v-html="navBar.panelIcon"></div>
      </div>
      <div class="col col-md-auto">
        <h5 class="offcanvas-title text-light">
          {{ navBar.panelTitle }}
        </h5>
      </div>
    </div>
    <button
      type="button"
      class="text-reset btn-close btn-close-white"
      data-bs-dismiss="offcanvas"
      aria-label="Close"
      @click="(navBar.toggleIsCollapsed(), navBar.toggleVisibleScrolling())"
    ></button>
  </div>
  <div class="offcanvas-body p-0">
    <KeepAlive>
      <SettingsPanel v-if="navBar.panelTitle === 'Settings'" />
    </KeepAlive>
    <KeepAlive>
      <FilterPanal v-if="navBar.panelTitle === 'Filter'" />
    </KeepAlive>
    <KeepAlive>
      <StatisticsPanal v-if="navBar.panelTitle === 'Statistics'" />
    </KeepAlive>
    <KeepAlive>
      <AnalysisPanal v-if="navBar.panelTitle === 'Analysis'" />
    </KeepAlive>
  </div>
</template>

<style scoped></style>

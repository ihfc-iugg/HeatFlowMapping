<script setup>
import { useNavigationBarStore } from '@/store/navigationBar'

const navBar = useNavigationBarStore()

function controlNavbarOffcanvasInteraction(clickedPanel, navBar) {
  if (navBar.isCollapsed) {
    navBar.setPanelTitle(clickedPanel.title)
    navBar.setPanelIcon(clickedPanel.svgElement)
    navBar.setIsCollapsed()
    navBar.toggleVisibleScrolling()
  } else if (!navBar.isCollapsed && navBar.getPanelTitle() == clickedPanel.title) {
    navBar.setIsCollapsed()
    navBar.toggleVisibleScrolling()
  } else if (!navBar.isCollapsed && navBar.getPanelTitle() != clickedPanel.title) {
    navBar.setPanelTitle(clickedPanel.title)
    navBar.setPanelIcon(clickedPanel.svgElement)
  }
}
</script>

<template>
  <div id="map-navbar" class="btn-group bg-primary rounded-0 w-100 mb-0 mb-md-3" role="group">
    <!-- <div v-for="item in navBar.navigationElements" :key="item.title"> -->
    <button
      v-for="item in navBar.navigationElements"
      :key="item.title"
      type="button"
      class="btn btn-primary flex-fill"
      @click="controlNavbarOffcanvasInteraction(item, navBar)"
    >
      <div v-html="item.svgElement"></div>
      <span class="">{{ item.title }}</span>
    </button>
    <!-- </div> -->
  </div>
</template>

<style scoped>
@media (min-width: 768px) {
  #map-navbar {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: fit-content !important;
    z-index: 1000; /* Ensure it is above other elements */
    border-radius: var(--bs-border-radius) !important;
  }
}
</style>

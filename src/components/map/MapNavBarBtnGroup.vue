<script setup>
import { useNavigationBarStore } from '@/store/navigationBar'

const navBar = useNavigationBarStore()

/**
 * @description Handles the interaction between the navigation bar and the offcanvas panel.
 * @param {Object} clickedPanel
 * @param navBar
 */
function controlNavbarOffcanvasInteraction(clickedPanel, navBar) {
  if (navBar.isCollapsed) {
    navBar.setPanelTitle(clickedPanel.title)
    navBar.setPanelIcon(clickedPanel.svgElement)
    navBar.toggleIsCollapsed()
    navBar.toggleVisibleScrolling()
  } else if (!navBar.isCollapsed && navBar.getPanelTitle() == clickedPanel.title) {
    navBar.toggleIsCollapsed()
    navBar.toggleVisibleScrolling()
  } else if (!navBar.isCollapsed && navBar.getPanelTitle() != clickedPanel.title) {
    navBar.setPanelTitle(clickedPanel.title)
    navBar.setPanelIcon(clickedPanel.svgElement)
  }
}
</script>

<template>
  <div id="map-navbar" class="btn-group bg-primary rounded-0 w-100 mb-0 mb-md-3" role="group">
    <button
      v-for="item in navBar.navigationElements"
      :key="item.title"
      :id="item.title + 'navBarBtn'"
      type="button"
      class="btn btn-primary flex-fill"
      data-bs-toggle="offcanvas"
      data-bs-target="#offcanvasPanel"
      aria-controls="offcanvasPanel"
      @click="controlNavbarOffcanvasInteraction(item, navBar)"
    >
      <div v-html="item.svgElement"></div>
      <span class="">{{ item.title }}</span>
    </button>
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
    z-index: 1000;
    border-radius: var(--bs-border-radius) !important;
  }
}
</style>

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
  <div
    class="btn-group rounded-left rounded-right"
    role="group"
    style="background-color: #2f5597; border: 1px solid #00c9a7"
  >
    <div v-for="item in navBar.navigationElements" :key="item.title">
      <input
        type="radio"
        class="btn-check"
        name="btn-radio1"
        :id="item.title"
        autocomplete="off"
        @click="controlNavbarOffcanvasInteraction(item, navBar)"
      />

      <label class="btn" :for="item.title"
        ><div v-html="item.svgElement"></div>
        {{ item.title }}</label
      >
    </div>
  </div>
</template>

<style scoped>
input[name='btn-radio1'] + .btn {
  color: #fff;
}

input[name='btn-radio1']:enabled + .btn {
  border: 0px;
}

input[name='btn-radio1']:checked + .btn {
  color: #00c9a7;
  border: 0px;
}

input[name='btn-radio1']:hover + .btn {
  color: #00c9a7;
}
</style>

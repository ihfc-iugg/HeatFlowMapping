<script setup>
import { useNavButtonGroupStore } from '../stores/navButtonGroup'
import Button from './Button.vue'

const navBtnGroup = useNavButtonGroupStore()
</script>

<template>
  <div
    id="map-navbar"
    class="btn-group position-absolute bottom-0 start-50 translate-middle-x mb-3 bg-primary"
    role="group"
  >
    <Button
      v-for="panel in navBtnGroup.panels"
      :id="panel.id"
      :icon="panel.svgElement"
      :title="panel.title"
    ></Button>
  </div>
</template>

<style scoped></style>

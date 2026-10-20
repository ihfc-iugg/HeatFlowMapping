<script setup>
import { usePanelSwitcherStore } from '../stores/panelSwitcher'
import { defineProps } from 'vue'

const panelSwitcher = usePanelSwitcherStore()

const props = defineProps({
  panel: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <input
    type="radio"
    class="btn-check"
    name="btn-radio-main-nav-bar"
    :id="panel.id"
    :value="panel"
    v-model="panelSwitcher.selected"
    data-bs-toggle="offcanvas"
    data-bs-target="#offcanvasPanel"
    aria-controls="offcanvasPanel"
    @click="console.log('hallo')"
  />
  <label class="btn text-light" :for="panel.id">
    <div class="row d-grid justify-content-md-center">
      <component :is="panel.svg" />
    </div>
    <div class="row">
      <span class="">{{ panel.title }}</span>
    </div>
  </label>
</template>

<style scoped></style>

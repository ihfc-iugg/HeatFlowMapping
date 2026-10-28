<script setup>
import { useApplicationStore } from '@/core/stores/app'

const app = useApplicationStore()
</script>

<template>
  <div
    class="offcanvas offcanvas-start overflow-auto m-2 h-auto"
    data-bs-scroll="true"
    data-bs-backdrop="false"
    tabindex="-1"
    id="offcanvasPanel"
    aria-labelledby="offcanvasPanelLabel"
  >
    <div class="offcanvas-header bg-primary text-light">
      <div class="row">
        <div class="col">
          <component :is="app.selectedPanel.svg" />
        </div>
        <div class="col col-md-auto">
          <h5 class="offcanvas-title text-light">
            {{ app.selectedPanel.title }}
          </h5>
        </div>
      </div>
      <button
        type="button"
        class="text-reset btn-close btn-close-white"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
    </div>
    <div class="offcanvas-body p-0">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.offcanvas {
  overflow: visible !important;
}
</style>

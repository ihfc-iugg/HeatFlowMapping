<script setup>
import { defineProps } from 'vue'

const props = defineProps({
  layer: {
    type: Object,
    required: true
  }
})
</script>
<template>
  <div class="position-absolute top-50 translate-middle-y ps-1" style="left: 100%">
    <div class="d-flex align-items-end">
      <div class="collapse collapse-horizontal" :id="props.layer.id">
        <div class="card shadow-sm" style="width: 280px; border-radius: 0 0.375rem 0.375rem 0">
          <div class="card-header d-inline-flex">
            <div class="row">
              <div class="col-9">
                <h6 class="card-title">{{ props.layer.title }}</h6>
              </div>
              <div class="col">
                <button
                  type="button"
                  class="btn-close btn-close position-absolute end-0"
                  aria-label="Close"
                  data-bs-toggle="collapse"
                  :data-bs-target="'#' + props.layer.id"
                ></button>
              </div>
            </div>
          </div>
          <div class="card-body small">
            <span>{{ props.layer.attribution }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style></style>

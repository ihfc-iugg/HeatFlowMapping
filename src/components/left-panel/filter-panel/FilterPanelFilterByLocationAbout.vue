<script setup>
import { CRow } from '@coreui/bootstrap-vue'
</script>

<template>
  <div class="card-body">
    <CRow>
      <h6>About Location Filter</h6>
      <p>
        Filter points within a custom drawn polygon. The filter uses the latest drawn polygon as
        geometrical restriction and the previous polygon will be deleted.
      </p>
    </CRow>
  </div>
</template>

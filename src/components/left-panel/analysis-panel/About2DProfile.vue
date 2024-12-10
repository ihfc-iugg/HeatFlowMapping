<script setup>
import { ref } from 'vue'
import { CRow } from '@coreui/bootstrap-vue'

const visibleInfos = ref(false)
</script>

<template>
  <div class="card-body">
    <CRow>
      <h6>About this Graph</h6>
      <p>
        This graph shows a 2D profile along the drawn line. Users can set a threshold which defines
        the maximum distance a point can have to the line unless it will count as selected. after
        that, the selected points have to get brought in the right order. therefore the points are
        projected by the verticaly to the drawn line.
      </p>
      <img
        src="@/assets/img/about_2D_profile_.svg"
        alt="triangle with all three sides equal"
        width="100%"
      />
    </CRow>
  </div>
</template>

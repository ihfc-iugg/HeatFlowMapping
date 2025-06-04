<script setup>
import DBDigitalBorehole from '@/components/left-panel/analysis-panel/DBDigitalBorehole.vue'
import Profile2D from '@/components/left-panel/analysis-panel/Profile2D.vue'
import Accordion from '../Accordion.vue'
</script>

<template>
  <Accordion id="analysis-accordion">
    <DBDigitalBorehole />
    <Profile2D />
  </Accordion>
</template>

<style></style>

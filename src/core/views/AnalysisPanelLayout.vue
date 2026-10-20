<script setup>
import Accordion from '@/shared/components/Accordion.vue'
import TemperatureProfile from '@/modules/temperatureProfile/views/TemperatureProfile.vue'
import CrossSection from '@/modules/crossSection/views/CrossSection.vue'
</script>

<template>
  <Accordion accordionId="analysis-accordion">
    <TemperatureProfile />
    <CrossSection />
  </Accordion>
</template>

<style scoped></style>

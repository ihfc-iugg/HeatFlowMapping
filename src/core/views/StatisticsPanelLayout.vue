<script setup>
import Accordion from '@/shared/components/Accordion.vue'
import AccordionItem from '@/shared/components/AccordionItem.vue'
import Distribution from '@/modules/distribution/components/Distribution.vue'
import { KeepAlive } from 'vue'
</script>

<template>
  <KeepAlive>
    <Accordion accordionId="statistics-accordion">
      <AccordionItem title="Distribution" id="distribution-Statistics">
        <Distribution />
      </AccordionItem>
    </Accordion>
  </KeepAlive>
</template>

<style scoped></style>

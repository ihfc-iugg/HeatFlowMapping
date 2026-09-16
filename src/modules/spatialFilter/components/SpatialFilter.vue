<script setup>
import { watch } from 'vue'
import AccordionItem from '@/core/components/AccordionItem.vue'
import Card from '@/core/components/Card.vue'
import NavBarButtonGroup from './NavBarButtonGroup.vue'
import DrawToolboxCardBody from './DrawToolboxCardBody.vue'
import InfoCardBody from './InfoCardBody.vue'
import { useSpatialFilterStore } from '../stores/spatialFilter.js'

const spatialfilter = useSpatialFilterStore()

// watch(
//   () => spatialfilter.filterObject,
//   () => {
//     console.log('checke')
//   }
// )
</script>

<template>
  <AccordionItem id="locationFilter" title="Spatial Filter">
    <NavBarButtonGroup />
    <Card
      v-if="spatialfilter.activeTab == 'toolbox'"
      :id="spatialFiltertoolbox"
      :title="'Polygon Draw Toolbox'"
    >
      <DrawToolboxCardBody />
    </Card>
    <Card
      v-if="spatialfilter.activeTab == 'info'"
      :id="spatialFilterInfotoolbox"
      :title="'About Spatial Filter'"
    >
      <InfoCardBody />
    </Card>
  </AccordionItem>
</template>

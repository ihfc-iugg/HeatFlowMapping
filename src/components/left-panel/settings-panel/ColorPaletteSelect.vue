<script setup>
import { defineProps } from 'vue'

import VueMultiselect from 'vue-multiselect/src/Multiselect.vue'
import ColorPalettePreview from './ColorPalettePreview.vue'

import { useMapStore } from '@/store/map.js'
import { useDataCrivenColoringStore } from '@/store/dataDrivenColoring'
import { useLegendStore } from '@/store/legend.js'

const mapStore = useMapStore()
const dataColoringStore = useDataCrivenColoringStore()
const legendStore = useLegendStore()

const props = defineProps({
  schemaOptions: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <VueMultiselect
    class="py-1"
    v-model="dataColoringStore.colorPalette"
    :options="schemaOptions"
    :multiple="false"
    :close-on-select="true"
    :allow-empty="false"
    @select="
      (mapStore.map.setPaintProperty(
        'ghfdb',
        'circle-color',
        dataColoringStore.generatePaintProperty(
          dataColoringStore.propertyDataType,
          dataColoringStore.selectedProperty.key,
          dataColoringStore.colorPalette.colors
        )
      ),
      legendStore.setSelectedProperty(dataColoringStore.selectedProperty.key),
      legendStore.setLegendObject(
        dataColoringStore.getClasses(),
        dataColoringStore.colorPalette.colors
      ))
    "
  >
    <template #singleLabel="{ option }">
      <div class="btn-group">
        <button
          type="button"
          class="btn btn-secondary"
          v-for="color in option.colors"
          :key="color"
          :style="{ backgroundColor: color }"
        ></button>
      </div>
    </template>
    <template #option="{ option }">
      <ColorPalettePreview :colors="option.colors"></ColorPalettePreview>
    </template>
  </VueMultiselect>
</template>

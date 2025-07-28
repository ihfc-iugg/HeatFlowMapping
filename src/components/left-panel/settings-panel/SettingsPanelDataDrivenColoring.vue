<script setup>
import { watch } from 'vue'

import VueMultiselect from 'vue-multiselect/src/Multiselect.vue'
import AccordionItem from '../AccordionItem.vue'
import SettingsPanelDataDrivenColoringSequential from './SettingsPanelDataDrivenColoringSequential.vue'
import ColorPaletteSelect from './ColorPaletteSelect.vue'

import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useMapStore } from '@/store/map'
import { useDataCrivenColoringStore } from '@/store/dataDrivenColoring.js'
import { useDataDrivenColoringSequentialStore } from '@/store/dataDrivenColoringSequential'
import { useLegendStore } from '@/store/legend'

const schemaStore = useDataSchemaStore()
const mapStore = useMapStore()
const dataColoringStore = useDataCrivenColoringStore()
const sequentialStore = useDataDrivenColoringSequentialStore()
const legendStore = useLegendStore()

/**
 * set new color options when amount of classes (colorSteps) is changing
 */
watch(dataColoringStore.numberOfClasses, (newNumberOfClasses) => {
  dataColoringStore.setColorPaletteOptions(dataColoringStore.natureOfData, newNumberOfClasses)
  dataColoringStore.colorPalette = dataColoringStore.colorPaletteOptions[0]
})
</script>

<template>
  <!-- Data Driven Coloring -->
  <!-- Property selection -->
  <AccordionItem title="Data Driven Coloring" id="dataDrivenColoring">
    <VueMultiselect
      class="py-1"
      v-model="dataColoringStore.selectedProperty"
      :options="schemaStore.selectableProperties"
      label="title"
      placeholder="Select Property"
      :allow-empty="false"
      @select="
        (dataColoringStore.setPropertyDataType(
          dataColoringStore.getPropertyDataType(dataColoringStore.selectedProperty.key)
        ),
        dataColoringStore.setNatureOfData(dataColoringStore.propertyDataType),
        dataColoringStore.setNumberOfClasses(dataColoringStore.selectedProperty.key),
        dataColoringStore.setClasses(
          dataColoringStore.propertyDataType,
          dataColoringStore.selectedProperty.key
        ),
        dataColoringStore.setColorPaletteOptions(
          dataColoringStore.natureOfData,
          dataColoringStore.numberOfClasses
        ),
        mapStore.map.setPaintProperty(
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
    </VueMultiselect>

    <SettingsPanelDataDrivenColoringSequential
      v-if="dataColoringStore.propertyDataType == 'number'"
    />

    <!-- Select color palette -->
    <ColorPaletteSelect
      v-if="dataColoringStore.selectedProperty"
      :schema-options="dataColoringStore.colorPaletteOptions"
    />
  </AccordionItem>
</template>

<style></style>

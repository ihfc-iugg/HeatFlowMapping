<script setup>
import VueMultiselect from 'vue-multiselect/src/Multiselect.vue'
import { CPopover, CButton } from '@coreui/bootstrap-vue'

import { useMapStore } from '@/store/map.js'
import { useDataCrivenColoringStore } from '@/store/dataDrivenColoring.js'
import { useDataDrivenColoringSequentialStore } from '@/store/dataDrivenColoringSequential.js'
import { useLegendStore } from '@/store/legend.js'

const mapStore = useMapStore()
const dataColoringStore = useDataCrivenColoringStore()
const sequentialStore = useDataDrivenColoringSequentialStore()
const legendStore = useLegendStore()
</script>

<template>
  <!-- Select classification method for number values -->
  <VueMultiselect
    class="py-1"
    v-model="sequentialStore.classification"
    :options="sequentialStore.classificationTypes"
    label="title"
    placeholder="Data classification method"
    :allow-empty="false"
    @select="
      (sequentialStore.setClassBreaks(
        mapStore.map.getSource('ghfdb')._data,
        dataColoringStore.selectedProperty.key,
        dataColoringStore.numberOfClasses
      ),
      dataColoringStore.setClasses(
        dataColoringStore.propertyDataType,
        dataColoringStore.selectedProperty.key
      ),
      mapStore.map.setPaintProperty(
        'ghfdb',
        'circle-color',
        sequentialStore.generatePaintProperty(
          dataColoringStore.selectedProperty.key,
          sequentialStore.classes,
          dataColoringStore.colorPalette.colors
        )
      ),
      legendStore.setSelectedProperty(dataColoringStore.selectedProperty.key),
      legendStore.setLegendObject(sequentialStore.classes, dataColoringStore.colorPalette.colors))
    "
  >
    <template #option="{ option }">
      <span>{{ option.title }}</span>
      <CPopover placement="right" trigger="hover">
        <template #content>
          {{ option.desc }}
        </template>
        <template #toggler="{ on }">
          <CButton color="transparent" v-on="on" aria-label="Show info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-info-circle"
            >
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path
                d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
              />
            </svg>
          </CButton>
        </template>
      </CPopover>
    </template>
  </VueMultiselect>

  <!-- Select number of classes -->
  <VueMultiselect
    class="py-1"
    v-model="dataColoringStore.numberOfClasses"
    :options="[3, 4, 5, 6, 7, 8, 9]"
    placeholder="Number of classes"
    :allow-empty="false"
    @select="
      (sequentialStore.setClassBreaks(
        mapStore.map.getSource('ghfdb')._data,
        dataColoringStore.selectedProperty.key,
        dataColoringStore.numberOfClasses
      ),
      dataColoringStore.setColorPaletteOptions(
        dataColoringStore.natureOfData,
        dataColoringStore.numberOfClasses
      ),
      dataColoringStore.setClasses(
        dataColoringStore.propertyDataType,
        dataColoringStore.selectedProperty.key
      ),
      mapStore.map.setPaintProperty(
        'ghfdb',
        'circle-color',
        sequentialStore.generatePaintProperty(
          dataColoringStore.selectedProperty.key,
          sequentialStore.classes,
          dataColoringStore.colorPalette.colors
        )
      ),
      legendStore.setSelectedProperty(dataColoringStore.selectedProperty.key),
      legendStore.setLegendObject(sequentialStore.classes, dataColoringStore.colorPalette.colors))
    "
  >
  </VueMultiselect>
</template>

<style></style>

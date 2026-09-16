<script setup>
import SelectClassification from './SelectClassification.vue'
import SelectNumberOfClasses from './SelectNumberOfClasses.vue'
import SelectColorSchema from './SelectColorSchema.vue'
import ApplyButton from './ApplyButton.vue'
import AccordionItem from '@/core/components/AccordionItem.vue'
import SelectProperty from '@/modules/selectProperty/components/SelectProperty.vue'

import { useDataDrivenColoringStore } from '../stores/dataDrivenColoring'
import { useClassifierStore } from '../stores/classifier.js'
import { useApplicationStore } from '@/core/stores/app.js'
import { watch } from 'vue'

const dataColoring = useDataDrivenColoringStore()
const classifier = useClassifierStore()
const app = useApplicationStore()

/**
 * @description
 * @param {String} property
 * @param {String} dataType
 */
function handleSelection(property, dataType) {
  dataColoring.property = property
  dataColoring.dataType = dataType
}

watch(
  () => dataColoring.property,
  () => {
    classifier.setNrOfClasses(dataColoring.property, dataColoring.dataType, app.dataSchema)
  }
)
</script>

<template>
  <AccordionItem title="Data Driven Coloring" id="dataDrivenColoring">
    <SelectProperty @select="handleSelection" class="p-1 mb-1" />
    <SelectClassification v-if="dataColoring.dataType == 'number'" class="p-1 mb-1" />
    <SelectNumberOfClasses v-if="dataColoring.dataType == 'number'" class="p-1 mb-1" />
    <SelectColorSchema />
    <ApplyButton />
  </AccordionItem>
</template>

<style></style>

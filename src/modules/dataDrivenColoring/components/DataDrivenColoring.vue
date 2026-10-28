<script setup>
import SelectClassification from './SelectClassification.vue'
import SelectNumberOfClasses from './SelectNumberOfClasses.vue'
import SelectColorSchema from './SelectColorSchema.vue'
import ApplyButton from './ApplyButton.vue'
import AccordionItem from '@/shared/components/AccordionItem.vue'
import SelectProperty from '@/shared/components/SelectProperty.vue'

import { useDataDrivenColoringStore } from '../stores/dataDrivenColoring'
import { useApplicationStore } from '@/core/stores/app.js'
import { watch } from 'vue'
import { classesLength } from '@/shared/utils/ghfdb/classification.js'

const dataDriven = useDataDrivenColoringStore()
const app = useApplicationStore()

/**
 * @description
 * @param {String} property
 * @param {String} dataType
 */
function handleSelection(property, dataType) {
  dataDriven.property = property
  dataDriven.dataType = dataType
}

watch(
  () => dataDriven.property,
  () => {
    // TODO: change for not hard coded solution
    if (dataDriven.dataType === 'number') dataDriven.nrOfClasses = 3
    else
      dataDriven.nrOfClasses = classesLength(
        dataDriven.property,
        dataDriven.dataType,
        app.dataSchema
      )
  }
)
</script>

<template>
  <AccordionItem title="Data Driven Coloring" id="dataDrivenColoring">
    <SelectProperty @select="handleSelection" class="p-1 mb-1" />
    <SelectClassification v-if="dataDriven.dataType == 'number'" class="p-1 mb-1" />
    <SelectNumberOfClasses v-if="dataDriven.dataType == 'number'" class="p-1 mb-1" />
    <SelectColorSchema />
    <ApplyButton />
  </AccordionItem>
</template>

<style></style>

<script setup>
import { defineProps, ref, watch } from 'vue'
import ButtonRemoveFilter from './ButtonRemoveFilter.vue'
import ButtonResetValues from './ButtonResetValues.vue'
import SelectProperty from '@/shared/components/SelectProperty.vue'
import MultiSelectPropertyValues from './MultiSelectPropertyValues.vue'
import RangeSlider from './RangeSlider.vue'
import { useFilterStore } from '../stores/attributeFilter'
import { useApplicationStore } from '@/core/stores/app.js'
import {
  getEnumValues,
  getBooleanValues,
  getRange,
  getNumberValues
} from '@/shared/utils/ghfdb/properties.js'

const filter = useFilterStore()
const app = useApplicationStore()
const options = ref(null)
const data = ref(getNumberValues(app.geojson, 'q'))
const range = ref(getRange(data.value))

const props = defineProps({
  uuid: { type: String, required: true },
  filterObj: { type: Object, required: true }
})

/**
 * @description
 * @param {String} property
 * @param {String} dataType
 */
function handleSelection(property, dataType) {
  props.filterObj.property = property
  props.filterObj.dataType = dataType
}

watch(
  () => props.filterObj.property,
  () => {
    filter.resetFilterObject(props.uuid)
    const dataType = props.filterObj.dataType
    const property = props.filterObj.property

    switch (dataType) {
      case 'number':
        data.value = getNumberValues(app.geojson, props.filterObj.property)
        range.value = getRange(data.value)
        props.filterObj.values = range.value
      case 'enum':
        options.value = getEnumValues(property, app.dataSchema)
      case 'boolean':
        options.value = getBooleanValues(property, app.dataSchema)
      default:
        return null
    }
  }
)
</script>

<template>
  <div class="filter-element py-1 border-bottom border-success">
    <table class="table">
      <div class="row">
        <div class="col-9">
          <SelectProperty @select="handleSelection" />

          <MultiSelectPropertyValues
            class="p-0 pt-2"
            v-if="props.filterObj.dataType != 'number'"
            :uuid="props.uuid"
            :filter-obj="props.filterObj"
            :options="options"
            ref="multiselect"
          />
        </div>
        <div class="col d-flex flex-column align-items-end">
          <ButtonRemoveFilter :uuid="props.uuid" />
          <ButtonResetValues v-if="props.filterObj.dataType != 'number'" :uuid="props.uuid" />
        </div>
        <div class="col">
          <RangeSlider
            v-if="props.filterObj.dataType == 'number'"
            :uuid="props.uuid"
            :filter-obj="props.filterObj"
            :data="data"
            :range="range"
          />
        </div>
      </div>
    </table>
  </div>
</template>

<style scoped></style>

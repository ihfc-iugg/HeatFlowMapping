<script setup>
import { defineProps, watch } from 'vue'
import VueMultiselect from 'vue-multiselect/src/Multiselect.vue'
import { useFilterStore } from '../stores/attributeFilter'

const filter = useFilterStore()

const props = defineProps({
  uuid: { type: String, required: true },
  filterObj: { type: Object, required: true },
  options: { type: Array, required: true }
})

/**
 * @description Generates filter expression for properties of type string with enum
 * @param {String} property
 * @param {Array} values
 * @returns {Array}
 */
function filterExpression(property, values) {
  let filterExpression = ['any']

  values.forEach((value) => {
    filterExpression.push(['in', ['get', property], value])
  })

  return filterExpression
}

watch(
  () => props.filterObj.values,
  () => {
    const values = props.filterObj.values
    const property = props.filterObj.property
    if (!values) {
      return
    }

    if (values.length) {
      props.filterObj.expression = filterExpression(property, values)
    } else {
      filter.resetFilterObject(props.uuid)
    }
  }
)
</script>

<template>
  <VueMultiselect
    v-model="props.filterObj.values"
    :options="props.options"
    :modelValue="props.filterObj.values"
    :multiple="true"
    placeholder="Select value(s)"
  >
  </VueMultiselect>
</template>

<style scoped></style>

<script setup>
import { useSchemaStore } from '@/core/stores/schema'
import { computed, ref, defineEmits, defineProps } from 'vue'

const props = defineProps({
  ofType: {
    type: String,
    default: 'all',
    validator: (value) => ['number', 'string', 'boolean', 'all'].includes(value)
  }
})
const emit = defineEmits(['select'])
const schema = useSchemaStore()
const selectedProperty = ref('q')
const dataType = ref('number')
const selectable = computed(() => {
  if (!schema.data || !schema.data.properties) return []

  let number = []
  let string = []
  let bool = []

  for (const [key, value] of Object.entries(schema.data.properties)) {
    if (value.oneOf) {
      string.push(key)
    } else if (value.type == 'number' && value.minimum && value.maximum) {
      number.push(key)
    } else if (value.type == 'boolean') {
      bool.push(key)
    }
  }

  if (props.ofType == 'all') {
    return number.concat(string, bool)
  } else if (props.ofType == 'number') {
    return number
  } else if (props.ofType == 'string') {
    return string
  } else if (props.ofType == 'boolean') {
    return bool
  }
})

/**
 * @description
 * @param {String} property
 * @param {*} dataSchema
 */
function setDataType(property, dataSchema) {
  if (dataSchema.properties[property].type) {
    dataType.value = dataSchema.properties[property].type
  } else {
    dataType.value = 'enum'
  }
}

/**
 * @description
 * @param {String} property
 * @param {String} dataType
 */
function selectProperty(property, dataType) {
  emit('select', property, dataType)
}
</script>

<template>
  <select
    class="form-select form-select-sm"
    v-model="selectedProperty"
    @change="
      (setDataType(selectedProperty, schema.data), selectProperty(selectedProperty, dataType))
    "
  >
    <option selected="selected" disabled>Select a property</option>
    <option v-for="property in selectable" :value="property">
      {{ schema.data.properties[property].title }}
    </option>
  </select>
</template>

<style></style>

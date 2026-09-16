<script setup>
import { useSchemaStore } from '@/core/stores/schema'
import { computed, ref } from 'vue'

const emit = defineEmits(['select'])
const schema = useSchemaStore()
const selectedProperty = ref('q')
const dataType = ref('number')
const selectable = computed(() => {
  if (!schema.data || !schema.data.properties) return []
  console.log(schema.data)

  let properties = []

  for (const [key, value] of Object.entries(schema.data.properties)) {
    if (value.oneOf) {
      properties.push(key)
    } else if (value.type == 'number' && value.minimum && value.maximum) {
      properties.push(key)
    } else if (value.type == 'boolean') {
      properties.push(key)
    }
  }
  return properties
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

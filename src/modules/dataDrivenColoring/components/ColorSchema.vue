<script setup>
import { defineProps, watch } from 'vue'
import colorbrewer from 'colorbrewer'
import { useColorPaletteStore } from '../stores/colorPalette'

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  classes: {
    type: Number,
    required: true
  },
  natureOfData: {
    type: String,
    required: true
  }
})
const colorPalette = useColorPaletteStore()

/**
 * @description
 * @param {String} schema
 */
function setColorPalette(schema) {
  if (schema) {
    colorPalette.selectedColorSchema = schema
  }
}

/**
 * @description
 * @param {String} newSchema
 * @param {String} rgba
 */
function handleHighlightedSchema(newSchema, rgba) {
  for (const [key, value] of Object.entries(document.getElementById('schemaGroups').children)) {
    if (value.id === newSchema) {
      document.getElementById(newSchema).style.backgroundColor = rgba
    } else {
      value.style.backgroundColor = ''
    }
  }
}

watch(
  () => colorPalette.selectedColorSchema,
  (newSchema) => {
    //if color schema is selected, highlight it
    handleHighlightedSchema(newSchema, 'rgba(227,30,36,0.4)')
  }
)

watch(
  () => props.natureOfData,
  () => {
    //if nature of data is changing, adjust the related color palettes
    colorPalette.selectedColorSchema = colorbrewer.schemeGroups[props.natureOfData][0]
    handleHighlightedSchema(colorPalette.selectedColorSchema, 'rgba(227,30,36,0.4)')
  }
)
</script>

<template>
  <label class="pt-2 pb-1" for="schemaGroups">{{ colorPalette.selectedColorSchema }}</label>
  <div id="schemaGroups" class="d-flex">
    <div
      v-for="schema in colorbrewer.schemeGroups[props.natureOfData]"
      :id="schema"
      @click="setColorPalette(schema)"
    >
      <svg
        class="m-1"
        width="20"
        :height="props.classes * 15"
        @mousemove="$event.currentTarget.style.border = '2px solid rgba(227,30,36,0.6)'"
        @mouseleave="$event.currentTarget.style.border = ''"
      >
        <rect
          v-for="(color, index) in colorbrewer[schema][props.classes]"
          :style="{ fill: color }"
          width="20"
          height="15"
          :y="0 + index * 15"
        ></rect>
      </svg>
    </div>

    <br />
  </div>
</template>

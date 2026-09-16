<script setup>
import { defineProps, ref, watch } from 'vue'
import HistogramSlider from 'vue3-histogram-slider'
import 'vue3-histogram-slider/dist/histogram-slider.css'

const props = defineProps({
  uuid: { type: String, required: true },
  filterObj: { type: Object, required: true },
  data: { type: Array, required: true },
  range: { type: Array, required: true }
})

const sliderKey = ref(0)
const histogrammSlider = ref(null)

/**
 * @description
 * @param {Array} values
 */
function onFinish(values) {
  props.filterObj.values = [values.from, values.to]
}

/**
 * @description
 * @param {Number} newMin
 * @param {Number} newMax
 */
function onInputChange(newMin, newMax) {
  histogrammSlider.value.update({ from: newMin, to: newMax })
  props.filterObj.values = [newMin, newMax]
}

/**
 * @description
 * @param {Event} event
 */
function onSliderChange(event) {
  props.filterObj.values[0] = event.from
  props.filterObj.values[1] = event.to
}

/**
 * @description Generates filter expression for properties of type number
 * @param {String} property
 * @param {Array} values
 * @returns {Array}
 */
function filterExpression(property, values) {
  const minValue = values[0]
  const maxValue = values[1]

  let filterExpression = [
    'all',
    ['>=', ['get', property], minValue],
    ['<=', ['get', property], maxValue]
  ]

  return filterExpression
}

watch(
  () => props.filterObj.values,
  () => {
    const property = props.filterObj.property
    const values = props.filterObj.values
    props.filterObj.expression = filterExpression(property, values)
    console.log('checke wenn ändert')
  }
)

watch(
  () => [props.data, props.range],
  () => {
    sliderKey.value++ // Forces the component to be destroyed and re-created
  }
  // { deep: true }
)
</script>

<template>
  <HistogramSlider
    ref="histogrammSlider"
    v-model="props.filterObj.values"
    :key="sliderKey"
    :bar-height="100"
    :data="props.data"
    step="0.5"
    :min="props.range[0]"
    :max="props.range[1]"
    :barGap="2"
    :resettable="true"
    style="width: 100%"
    @change="onSliderChange($event)"
    @finish="onFinish"
  />

  <div class="slider-inputs d-flex justify-content-between">
    <input
      v-model="props.filterObj.values[0]"
      type="number"
      class="form-control me-1"
      :min="props.range[0]"
      :max="props.range[1]"
      placeholder="Min"
      @change="onInputChange(props.filterObj.values[0], props.filterObj.values[1])"
    />
    <input
      v-model="props.filterObj.values[1]"
      type="number"
      class="form-control ms-1"
      :min="props.range[0]"
      :max="props.range[1]"
      placeholder="Max"
      @change="onInputChange(props.filterObj.values[0], props.filterObj.values[1])"
    />
  </div>
</template>

<style scoped></style>

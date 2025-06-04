<script setup>
//TODO: refactor code and split number filter and enum filter in seperate components

import { defineProps, ref, watch } from 'vue'
import VueMultiselect from 'vue-multiselect/src/Multiselect.vue'
import 'vue-multiselect/dist/vue-multiselect.css'
import { CRow, CCol } from '@coreui/bootstrap-vue'
import AccordionItem from '../AccordionItem.vue'
import FilterPanelFilterElement from './FilterPanelFilterElement.vue'

import HistogramSlider from 'vue3-histogram-slider'
import 'vue3-histogram-slider/dist/histogram-slider.css'

import { useGHFDBStore } from '@/store/ghfdb'
import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useFilterStore } from '@/store/filter'

const props = defineProps({ id: String })

const ghfdb = useGHFDBStore()
const dataSchema = useDataSchemaStore()
const filter = useFilterStore()

const filterElement = ref(filter.filters.attributeFilter[props.id])
const histogramSlider = ref(null)
const valueOptions = ref(null)
const arrayOfPropertyValues = ref(null)

/**
 * @description
 */
// watch(filterElement.value.selectedValues, () => {
//   if (filterElement.value.selectedValues.length > 0) {
//     setFilterExpression(filterElement.value.selectedProperty, filterElement.value.selectedValues)
//   }
// })

/**
 * @description Is called when btn gets clicked. New entry added to array with the current date when btn gets clicked (as id for filterElement).
 */
function addFilterElement() {
  if (Object.keys(filter.filters['attributeFilter']).length <= filter.maxAttributeFilter) {
    const filterID = 'attrFilter' + Date.now()
    filter.addFilter(filterID, 'attributeFilter')
  } else {
    filter.reachedLimit = true
    console.log('You reached the maximum number of filters')
  }
}

/**
 * @description Store data type of selected property
 * @param {String} selectedProperty
 */
function setSelectedPropertyType(selectedProperty) {
  filterElement.value.selectedPropertyType = dataSchema.dataSchema.properties[selectedProperty].type
}

/**
 * @description Resets the array with the selected filter values
 */
function resetSelectedValues(selectedProperty) {
  if (filterElement.value.selectedPropertyType == 'number') {
    // TODO: adjust to new slider lib, not working right now
    console.log('befor reset: ' + filterElement.value.selectedValues)
    filterElement.value.selectedValues = [valueOptions.value[0], valueOptions.value[1]]
    console.log('after reset: ' + filterElement.value.selectedValues)
    // arrayOfPropertyValues.value = getArrayOfPropertyValues(measurements.geojson, selectedProperty)
  } else {
    filterElement.value.selectedValues = []
  }
}

/**
 * @description
 */
function resetFilterExpression() {
  filterElement.value.expression = null
}

/**
 * @description Collects all leagle enum classes from the data schema
 * @param {Object} enumProperty
 * @returns {Array}
 */
function getEnumClasses(enumProperty) {
  let classes = []

  dataSchema.dataSchema.properties[enumProperty].oneOf.forEach((enumSchema) => {
    enumSchema.enum.forEach((enumClass) => {
      if (enumClass) {
        classes.push(enumClass)
      }
    })
  })

  return classes
}

/**
 * @description Helper function for Math.quantileSeq() to collect only the values of a single property within one array
 * @param {*} geoJson
 * @param {String} property
 * @returns {Array}
 */
function getArrayOfPropertyValues(geoJson, property) {
  let values = []

  geoJson.features.forEach((feature) => {
    if (feature.properties[property]) {
      values.push(feature.properties[property])
    }
  })
  return values
}

/**
 * @description Calculate breaks for quantil classification (each class has the same amount of data points)
 * @param {*} geoJson
 * @param {String} property
 * @param {Number} steps
 * @returns {Array}
 */
function getRange(numberArray) {
  const min = Math.floor(Math.min.apply(null, numberArray))
  const max = Math.ceil(Math.max.apply(null, numberArray))

  return [min, max]
}

/**
 * @description Set legal options for selected property
 * @param {String} selectedProperty
 */
function setValueOptions(selectedProperty) {
  if (filterElement.value.selectedPropertyType == undefined) {
    valueOptions.value = getEnumClasses(selectedProperty)
  } else if (filterElement.value.selectedPropertyType == 'number') {
    const geoJson = ghfdb.geojson
    arrayOfPropertyValues.value = getArrayOfPropertyValues(geoJson, selectedProperty)
    valueOptions.value = getRange(arrayOfPropertyValues.value)
    console.log('value')
    filterElement.value.selectedValues = [valueOptions.value[0], valueOptions.value[1]]
  } else {
    console.log('Data type of property is not defined')
  }
}

/**
 * @description Generates filter expression for properties of type string with enum
 * @param {String} property
 * @param {Array} values
 * @returns {Array}
 */
function writeEnumFilter(property, values) {
  let filterExpression = ['any']

  values.forEach((value) => {
    filterExpression.push(['in', ['get', property], value])
  })

  return filterExpression
}

/**
 * @description Generates filter expression for properties of type number
 * @param {String} property
 * @param {Array} values
 * @returns {Array}
 */
function writeContinuousFilter(property, values) {
  const minValue = values[0]
  const maxValue = values[1]

  let filterExpression = [
    'all',
    ['>=', ['get', property], minValue],
    ['<=', ['get', property], maxValue]
  ]

  return filterExpression
}

/**
 * @description
 * @returns {Void}
 */
function setFilterExpression(property, values) {
  if (filterElement.value.selectedPropertyType == undefined) {
    filterElement.value.expression = writeEnumFilter(property, values)
  } else if (filterElement.value.selectedPropertyType == 'number') {
    filterElement.value.expression = writeContinuousFilter(property, values)
  } else if (!filterElement.value.selectedPropertyType) {
    console.error('no property selected')
    console.log(filterElement.value.selectedPropertyType)
    return
  }
}

/**
 * @description
 * @param newMin
 * @param newMax
 */
function updateSliderRange(newMin, newMax) {
  histogramSlider.value.update({ from: newMin, to: newMax })
  filterElement.value.selectedValues = [newMin, newMax]
}
</script>

<template>
  <AccordionItem title="Attribute Filter" id="attribute-filter">
    <FilterPanelFilterElement
      v-for="id in Object.keys(filter.filters.attributeFilter)"
      class="mb-1"
      :key="id"
      :id="id"
    ></FilterPanelFilterElement>
    <div class="filter-managing-tools d-grid justify-content-md-center">
      <label for="add-filter-btn" v-if="filter.reachedLimit"
        >You reached the max number of filters</label
      >
      <button
        id="add-filter-btn"
        class="btn rounded-pill"
        style="color: #4366a1; border: 1px solid #4366a1"
        v-if="!filter.reachedLimit"
        @click="addFilterElement()"
      >
        + Add Filter
      </button>
    </div>
  </AccordionItem>
</template>

<style scoped>
.filter-property {
  display: flex;
  align-items: center; /* This will vertically align items in the middle */
  gap: 10px; /* This adds space between the children elements. If not supported in your browser, use margins on children */
  padding-bottom: 5px;
}

/* This will make the VueMultiselect expand to take available space */
.filter-property > VueMultiselect {
  flex: 1;
}

.filter-values {
  display: flex;
  align-items: center; /* Vertical alignment (optional, if needed) */
  justify-content: space-between; /* Maximizes space between the two child divs; optional based on design */
  gap: 10px; /* Adjust spacing between children, if your browser supports it */
  padding-bottom: 5px;
}

/* If you want the filter-controller to take most of the available space */
.filter-controller {
  flex: 1;
}

.slider {
  padding: 15px;
}
</style>

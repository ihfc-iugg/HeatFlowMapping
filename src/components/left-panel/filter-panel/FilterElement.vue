<script setup>
import { defineProps, ref, watch } from 'vue'
import VueMultiselect from 'vue-multiselect/src/Multiselect.vue'
import 'vue-multiselect/dist/vue-multiselect.css'
import { CRow, CCol } from '@coreui/bootstrap-vue'

import HistogramSlider from 'vue3-histogram-slider'
import 'vue3-histogram-slider/dist/histogram-slider.css'

import { useMeasurementStore } from '@/store/measurements'
import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useFilterStore } from '@/store/filter'

const props = defineProps({ id: String })

const measurements = useMeasurementStore()
const dataSchema = useDataSchemaStore()
const filter = useFilterStore()

const filterElement = ref(filter.filters.attributeFilter[props.id])

/**
 * TODO: wenn filterElement bereits besteht, werden valueOptions nicht gesetzt.
 * Problem: valueOptions wird gesetzt, wenn ein property ausgewählt wird, was nicht der Fall ist, wenn filterElement bereits existiert
 */
const valueOptions = ref(null)
const arrayOfPropertyValues = ref(null)

/**
 * @description
 */
watch(filterElement.value.selectedValues, () => {
  if (filterElement.value.selectedValues.length > 0) {
    setFilterExpression(filterElement.value.selectedProperty, filterElement.value.selectedValues)
  }
})

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
    const geoJson = measurements.geojson
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
</script>

<template>
  <div class="filter-element">
    <CRow class="d-felx justify-content-start">
      <CCol xs="10">
        <VueMultiselect
          v-model="filterElement.selectedProperty"
          :options="dataSchema.selectableProperties"
          label="title"
          :allow-empty="false"
          placeholder="Select Property"
          @select="
            setSelectedPropertyType(filterElement.selectedProperty.key),
              setValueOptions(filterElement.selectedProperty.key),
              resetSelectedValues()
          "
        >
        </VueMultiselect>
      </CCol>
      <CCol xs="1">
        <button
          class="btn btn-primary"
          @click="filter.removeFilterElement(props.id, 'attributeFilter')"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-trash"
            viewBox="0 0 16 16"
          >
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z"
            />
            <path
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z"
            />
          </svg>
        </button>
      </CCol>
    </CRow>

    <div class="filter-values" v-if="filterElement.selectedProperty">
      <div class="filter-controller">
        <div v-if="filterElement.selectedPropertyType === undefined">
          <VueMultiselect
            v-model="filterElement.selectedValues"
            :options="valueOptions"
            :modelValue="filterElement.selectedValues"
            :multiple="true"
            placeholder="Select value(s)"
            @select="
              setFilterExpression(filterElement.selectedProperty.key, filterElement.selectedValues)
            "
            @remove="
              setFilterExpression(filterElement.selectedProperty.key, filterElement.selectedValues)
            "
          >
          </VueMultiselect>
        </div>

        <div class="slider" v-if="filterElement.selectedPropertyType === 'number'">
          <HistogramSlider
            v-model="filterElement.selectedValues"
            :bar-height="100"
            :data="arrayOfPropertyValues"
            step="0.1"
            :min="valueOptions[0]"
            :max="valueOptions[1]"
            :barGap="3"
            :resettable="true"
            style="width: 100%"
            @change="
              (filterElement.selectedValues[0] = $event.from),
                (filterElement.selectedValues[1] = $event.to)
            "
            @finish="
              console.log('from: ' + $event.from + '; to: ' + $event.to),
                setFilterExpression(
                  filterElement.selectedProperty.key,
                  filterElement.selectedValues
                )
            "
          />

          <!-- TODO: Include null value OR select only null values as filter criteria -->
        </div>
      </div>
      <div class="reset-filter-btn" v-if="filterElement.selectedValues.length > 0">
        <button
          class="btn btn-primary"
          @click="resetSelectedValues(filterElement.selectedProperty.key), resetFilterExpression()"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            class="bi bi-bootstrap-reboot"
            viewBox="0 0 16 16"
          >
            <path
              d="M1.161 8a6.84 6.84 0 1 0 6.842-6.84.58.58 0 1 1 0-1.16 8 8 0 1 1-6.556 3.412l-.663-.577a.58.58 0 0 1 .227-.997l2.52-.69a.58.58 0 0 1 .728.633l-.332 2.592a.58.58 0 0 1-.956.364l-.643-.56A6.812 6.812 0 0 0 1.16 8z"
            />
            <path
              d="M6.641 11.671V8.843h1.57l1.498 2.828h1.314L9.377 8.665c.897-.3 1.427-1.106 1.427-2.1 0-1.37-.943-2.246-2.456-2.246H5.5v7.352h1.141zm0-3.75V5.277h1.57c.881 0 1.416.499 1.416 1.32 0 .84-.504 1.324-1.386 1.324h-1.6z"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-element {
  border-bottom: 4px inset;
}

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

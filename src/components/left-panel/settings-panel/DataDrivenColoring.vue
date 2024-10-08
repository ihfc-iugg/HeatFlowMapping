<script setup>
import { defineProps, ref, watch } from 'vue'
import { useMeasurementStore } from '@/store/measurements'
import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useLegendStore } from '@/store/legend'

import VueMultiselect from 'vue-multiselect/src/Multiselect.vue'
import { CPopover, CButton } from '@coreui/bootstrap-vue'

// External libraries
import geostats from 'geostats'
import { quantileSeq } from 'mathjs'
import { Map } from 'maplibre-gl'
import colorbrewer from 'colorbrewer'

// Variables
const props = defineProps({ map: Map })

const measurements = useMeasurementStore()
const dataSchema = useDataSchemaStore()
const legend = useLegendStore()

const selectedProperty = ref(null)
const selectedPropertyDataType = ref()

const legalSteps = ref([3, 4, 5, 6, 7, 8, 9, 10, 11])
const colorSteps = ref(4)
const colorPaletteOptions = ref(null)
setColorPaletteOptions(colorSteps.value)
const selectedColorPalette = ref(colorPaletteOptions.value[0])

const classificationTypes = ref([
  {
    name: 'quantil',
    title: 'Quantil',
    desc: 'Each class contains an equal number of features',
    src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_1BDD383C17164B948BF546CEADDA70E9'
  },
  {
    name: 'jenks',
    title: 'Jenks',
    desc: 'Class breaks are created in a way that best groups similar values together and maximizes the differences between classes',
    src: 'https://pro.arcgis.com/en/pro-app/latest/help/mapping/layer-properties/data-classification-methods.htm#ESRI_SECTION1_B47C458CFF6A4EEC933A8C7612DA558B'
  }
])
const selectedClassificationType = ref(classificationTypes.value[0])

/**
 * set new color options when amount of classes (colorSteps) is changing
 */
watch(colorSteps, (newColorSteps) => {
  setColorPaletteOptions(newColorSteps)
})

/**
 * @description
 * @param {Number} classes
 */
function setColorPaletteOptions(classes) {
  if (classes >= 12) {
    console.log('Number of classes out of range')
    return
  }
  let schemaGroup = []

  colorbrewer.schemeGroups.diverging.forEach((schema) => {
    const value = {
      name: schema,
      colors: colorbrewer[schema][classes]
    }
    schemaGroup.push(value)
  })

  colorPaletteOptions.value = schemaGroup
}

/**
 * @description
 * @param {Object} property
 */
function setPropertyDataType(property) {
  selectedPropertyDataType.value = dataSchema.dataSchema.properties[property.key].type
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
 * @description Calculate breaks for jenks classification
 * @param {String} property
 * @param {Number} steps
 * @returns {Array} [minValue, break1, ..., breakN, maxValue]
 */
function getJenksNaturalBreaks(geoJson, property, steps) {
  const values = propertyValuesToArray(geoJson, property).filter(Boolean)
  let classifier = new geostats(values)
  let breaks = classifier.getJenks(steps)

  return breaks
}

/**
 * @description Helper function for Math.quantileSeq() to collect only the values of a single property within one array
 * @param {*} geoJson
 * @param {String} property
 * @returns {Array}
 */
function propertyValuesToArray(geoJson, property) {
  let values = []

  geoJson.features.forEach((feature) => {
    values.push(feature.properties[property])
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
function getQuantilBreaks(geoJson, property, steps) {
  const values = propertyValuesToArray(geoJson, property).filter(Boolean)
  const breaks = quantileSeq(values, steps - 1)

  // add min value to beginning of array
  breaks.unshift(Math.min.apply(null, values))

  // add max value to end of array
  breaks.push(Math.max.apply(null, values))

  return breaks
}

/**
 * @description Case differentiation if quantil or jenks is selected as classification method. According to the method, calculates the braks and returns them as array. Check the
 * following link for a explanation to qunatil and jenks data classification.
 * @link https://gisgeography.com/choropleth-maps-data-classification/
 * @param {String} property
 * @returns {Array} [minValue, break1, ..., breakN, maxValue]
 */
function getNumberBreaks(property) {
  if (selectedClassificationType.value.name == 'jenks') {
    return getJenksNaturalBreaks(props.map.getSource('sites')._data, property, colorSteps.value)
  } else {
    return getQuantilBreaks(props.map.getSource('sites')._data, property, colorSteps.value)
  }
}

/**
 * @description write array containg maplibre conform expressions for properties with enum values. Legal values are according to predefined classes
 * @param {String} property
 * @param {Array} classes
 * @param {Array} colors
 * @returns {Array} ["match", ["get", "property"], class, #color, ..., #colorOthers] --> https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
 */
function generateEnumPaintProperty(property, classes, colors) {
  let paintProperty = []

  paintProperty.push('match')
  paintProperty.push(['get', property])

  classes.forEach((value, index) => {
    paintProperty.push(value, colors[index])
  })

  // others
  paintProperty.push('#ccc')

  return paintProperty
}

/**
 * @description write array containg maplibre conform expressions for properties with continous number values. Each class (start value - end value) one color value is assigned.
 * @param {String} property
 * @param {Array} classes
 * @param {Array} colors
 * @returns {Array} ["step", ["get", "property"], #color, NUMBER, #color, ...]
 */
function generateContinuousPaintProperty(property, classes, colors) {
  let paintProperty = []
  let k = 1

  paintProperty.push('step')
  paintProperty.push(['get', property])

  for (var i = 0; i < colors.length; i++) {
    paintProperty.push(colors[i])
    if (i < colors.length - 1) {
      paintProperty.push(classes[k])
      k++
    }
  }

  return paintProperty
}

/**
 * @description programm for providing and reacting to user driven colorisation of data according to properties
 * @returns {Void}
 */
function dataDrivenColorisation() {
  if (!selectedProperty.value) {
    console.error('no property selected')
  } else if (selectedPropertyDataType.value == 'number') {
    // TODO: Fallunterscheidung Sequential/Diverging
    // handling properties of data type number
    let classes = getNumberBreaks(selectedProperty.value.key)
    const paintProperty = generateContinuousPaintProperty(
      selectedProperty.value.key,
      classes,
      colorbrewer[selectedColorPalette.value.name][colorSteps.value]
    )
    props.map.setPaintProperty('sites', 'circle-color', paintProperty)
    legend.setLegendObject(classes, colorbrewer[selectedColorPalette.value.name][colorSteps.value])
  } else if (selectedPropertyDataType.value == undefined) {
    // TODO: Qualitativ Farbpalette
    // handling properties of data type string + enum
    let classes = getEnumClasses(selectedProperty.value.key)
    colorSteps.value = classes.length
    const paintProperty = generateEnumPaintProperty(
      selectedProperty.value.key,
      classes,
      colorbrewer[selectedColorPalette.value.name][colorSteps.value]
    )
    props.map.setPaintProperty('sites', 'circle-color', paintProperty)
    legend.setLegendObject(classes, colorbrewer[selectedColorPalette.value.name][colorSteps.value])
  } else if (selectedPropertyDataType.value == 'boolean') {
    // TODO: generateBooleanPaintProperty() method
    console.log(selectedProperty.value.key + ' is boolean')
    return
  }
}
</script>

<template>
  <!-- Data Driven Coloring -->
  <!-- Property selection -->
  <p class="mt-1 d-grid gap-2">
    <button
      class="btn btn-primary text-start dropdown-toggle"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#dataDrivenColoring"
      aria-expanded="false"
      aria-controls="dataDrivenColoring"
    >
      Data Driven Coloring
    </button>
  </p>
  <div class="collapse" id="dataDrivenColoring">
    <div class="card card-body">
      <!-- Select property for coloring -->
      <VueMultiselect
        v-model="selectedProperty"
        :options="dataSchema.selectableProperties"
        label="title"
        placeholder="Select Property"
        :allow-empty="false"
        @select="setPropertyDataType(selectedProperty), dataDrivenColorisation()"
      >
      </VueMultiselect>
      <!-- Select classification method for number values -->
      <VueMultiselect
        v-if="selectedPropertyDataType == 'number'"
        v-model="selectedClassificationType"
        :options="classificationTypes"
        label="title"
        placeholder="Data classification method"
        :allow-empty="false"
        @select="dataDrivenColorisation()"
      >
        <template #option="{ option }"
          >{{ option.title }}
          <!-- Custom template for options in the dropdown -->

          <CPopover placement="right" trigger="hover">
            <template #content>
              {{ option.desc }}
            </template>
            <template #toggler="{ on }">
              <CButton color="transparent" v-on="on">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-info-circle"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path
                    d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"
                  />
                </svg>
              </CButton>
            </template>
          </CPopover>
        </template>
      </VueMultiselect>

      <!-- Select number of classes  -->
      <VueMultiselect
        v-if="selectedPropertyDataType == 'number'"
        v-model="colorSteps"
        :options="legalSteps"
        placeholder="Number of classes"
        :allow-empty="false"
        @select="dataDrivenColorisation()"
      >
      </VueMultiselect>

      <!-- Select color palette -->
      <VueMultiselect
        v-if="selectedProperty"
        v-model="selectedColorPalette"
        :options="colorPaletteOptions"
        :multiple="false"
        :close-on-select="true"
        :allow-empty="false"
        @select="dataDrivenColorisation()"
      >
        <!-- TODO: selected color palette is not changing when number of colorSteps is changing -->
        <template #singleLabel="{ option }">
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-secondary"
              v-for="color in option.colors"
              :key="color"
              :style="{ backgroundColor: color }"
            ></button>
          </div>
        </template>
        <template #option="{ option }">
          <div class="btn-group">
            <button
              type="button"
              class="btn btn-secondary"
              v-for="color in option.colors"
              :key="color"
              :style="{ backgroundColor: color }"
            ></button>
          </div> </template
      ></VueMultiselect>
    </div>
  </div>
</template>

<style scoped></style>

<script setup>
import { defineProps, defineEmits, ref, watch } from "vue";
import VueMultiselect from "vue-multiselect";
import VueSlider from "vue-slider-component";
import { CRow, CCol } from "@coreui/bootstrap-vue";

import { useMeasurementStore } from "@/store/measurements";
import { useFilterStore } from "@/store/filter";

const props = defineProps({ id: Number, map: Map });
const emit = defineEmits(["send-filterExpression", "remove-filterElement"]);

const measurements = useMeasurementStore();
const filter = useFilterStore();

const selectedProperty = ref(null);
const selectedPropertyType = ref(null);

const valueOptions = ref(null);
const selectedValues = ref([]);
const filterExpression = ref([]);

/**
 * @description remove filterElement and corresponding filterExpression from filterPanel
 */
const removeFilterElement = () => {
  emit("remove-filterElement", { id: props.id });
};

/**
 * @description
 */
watch(selectedValues, () => {
  console.log(selectedValues.value);
  if (selectedValues.value.length > 0) {
    setFilterExpression(selectedProperty.value, selectedValues.value);
  } else if (selectedValues.value.length == 0) {
    // props.map.setFilter("sites", undefined);
  }
});

/**
 * @description Store data type of selected property
 * @param {String} selectedProperty
 */
function setSelectedPropertyType(selectedProperty) {
  selectedPropertyType.value =
    measurements.dataSchema.properties[selectedProperty].type;
}

/**
 * @description Resets the array with the selected filter values
 */
function resetSelectedValues() {
  if (
    selectedPropertyType.value == "number" &&
    valueOptions.value.length != 0
  ) {
    selectedValues.value = [valueOptions.value[0], valueOptions.value[1]];
  } else {
    selectedValues.value = [];
  }
}

function resetFilterExpression() {
  filterExpression.value = [];
}

/**
 * @description Collects all leagle enum classes from the data schema
 * @param {Object} enumProperty
 * @returns {Array}
 */
function getEnumClasses(enumProperty) {
  let classes = [];

  measurements.dataSchema.properties[enumProperty].oneOf.forEach(
    (enumSchema) => {
      enumSchema.enum.forEach((enumClass) => {
        if (enumClass) {
          classes.push(enumClass);
        } else {
          // classes.push("null");
        }
      });
    }
  );

  return classes;
}

/**
 * @description Helper function for Math.quantileSeq() to collect only the values of a single property within one array
 * @param {*} geoJson
 * @param {String} property
 * @returns {Array}
 */
function propertyValuesToArray(geoJson, property) {
  let values = [];

  geoJson.features.forEach((feature) => {
    values.push(feature.properties[property]);
  });

  return values;
}

/**
 * @description Calculate breaks for quantil classification (each class has the same amount of data points)
 * @param {*} geoJson
 * @param {String} property
 * @param {Number} steps
 * @returns {Array}
 */
function getRange(geoJson, property) {
  const values = propertyValuesToArray(geoJson, property).filter(Boolean);

  const min = Math.floor(Math.min.apply(null, values));
  const max = Math.ceil(Math.max.apply(null, values));

  const bounds = [min, max];

  return bounds;
}

/**
 * @description Set legal options for selected property
 * @param {String} selectedProperty
 */
function setValueOptions(selectedProperty) {
  if (selectedPropertyType.value == undefined) {
    valueOptions.value = getEnumClasses(selectedProperty);
  } else if (selectedPropertyType.value == "number") {
    const geoJson = measurements.geojson;
    valueOptions.value = getRange(geoJson, selectedProperty);
    selectedValues.value = [valueOptions.value[0], valueOptions.value[1]];
  } else {
    console.log("Data type of property is not defined");
  }
}

/**
 * @description Generates filter expression for properties of type string with enum
 * @param {String} property
 * @param {Array} values
 * @returns {Array}
 */
function writeEnumFilter(property, values) {
  let filterExpression = ["any"];

  values.forEach((value) => {
    filterExpression.push(["in", ["get", property], value]);
  });

  return filterExpression;
}

/**
 * @description Generates filter expression for properties of type number
 * @param {String} property
 * @param {Array} values
 * @returns {Array}
 */
function writeContinuousFilter(property, values) {
  const minValue = values[0];
  const maxValue = values[1];

  console.log("writeContinuousFilter");
  console.log(property + " : " + values + " type of: " + typeof values[1]);

  let filterExpression = [
    "all",
    [">=", ["get", property], minValue],
    ["<=", ["get", property], maxValue],
  ];

  return filterExpression;
}

/**
 * @description
 * @returns {Void}
 */
function setFilterExpression(property, values) {
  if (!selectedProperty.value) {
    console.error("no property selected");
    return;
  } else if (selectedPropertyType.value == undefined) {
    filterExpression.value = writeEnumFilter(property, values);
  } else if (selectedPropertyType.value == "number") {
    filterExpression.value = writeContinuousFilter(property, values);
  }
}

/**
 * Helper function
 */
function printOutValues(value) {
  console.log("hier selectedValue");
  console.log(value);
}
</script>

<template>
  <div class="filter-element">
    <CRow class="d-felx justify-content-start">
      <CCol xs="10">
        <VueMultiselect
          v-model="selectedProperty"
          :options="measurements.selectableProperties"
          label="title"
          :allow-empty="false"
          placeholder="Select property"
          @select="
            setSelectedPropertyType(selectedProperty.key);
            setValueOptions(selectedProperty.key);
            resetSelectedValues();
          "
        >
        </VueMultiselect>
      </CCol>
      <CCol xs="1">
        <button class="btn btn-primary" @click="removeFilterElement()">
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

    <div class="filter-values" v-if="selectedProperty">
      <div class="filter-controller">
        <div v-if="selectedPropertyType === undefined">
          <VueMultiselect
            v-model="selectedValues"
            :options="valueOptions"
            :multiple="true"
            placeholder="Select value(s)"
            @select="
              printOutValues();
              setFilterExpression(selectedProperty.key, selectedValues);
              filter.addFilterExpression(filterExpression, id);
            "
            @remove="
              setFilterExpression(selectedProperty.key, selectedValues);
              filter.addFilterExpression(filterExpression, id);
            "
          >
          </VueMultiselect>
        </div>

        <!-- 
        Slider:
        https://www.npmjs.com/package/vue-slider-component 
        -->
        <div class="slider" v-if="selectedPropertyType === 'number'">
          <vue-slider
            v-model="selectedValues"
            :min="valueOptions[0]"
            :max="valueOptions[1]"
            :interval="0.01"
            @change="
              printOutValues(valueOptions);
              setFilterExpression(selectedProperty.key, selectedValues);
              filter.addFilterExpression(filterExpression, id);
            "
          ></vue-slider>

          <!-- TODO: Include null value OR select only null values as filter criteria -->
        </div>
      </div>
      <div class="reset-filter-btn" v-if="selectedValues.length > 0">
        <button
          class="btn btn-primary"
          @click="
            resetSelectedValues();
            resetFilterExpression();
            filter.removeFilterExpression(id);
          "
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
@import "vue-multiselect/dist/vue-multiselect.css";
@import "vue-slider-component/theme/default.css";
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

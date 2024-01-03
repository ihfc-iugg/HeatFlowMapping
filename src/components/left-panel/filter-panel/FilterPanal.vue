<script setup>
import { defineProps, ref, watch } from "vue";
import { Map } from "maplibre-gl";
import {
  CButton,
  // COffcanvasHeader,
  // COffcanvasTitle,
  // CCloseButton,
  // COffcanvasBody,
} from "@coreui/bootstrap-vue";

import { useFilterStore } from "@/store/filter";

import FilterElement from "./FilterElement.vue";

const props = defineProps({ map: Map, heatFlowSchema: Object });

const filters = useFilterStore();

const filterIds = ref([]);
const maxNrOfFilters = ref(4);
const reachedFilterLimit = ref(false);

/**
 * @description Watches changes in filterExpressions object and set the filter to map.
 */
watch(filters.filterExpressions, () => {
  console.log("jo wird gecheckt wenn sich was ändert");
  applyFilterToMap();
});

/**
 * @description Is called when btn gets clicked. New entry added to array with the current date when btn gets clicked (as id for filterElement).
 */
function addFilterElement() {
  if (filterIds.value.length <= maxNrOfFilters.value) {
    filterIds.value.push(Date.now());
  } else {
    reachedFilterLimit.value = true;
    console.log("You reached the maximum number of filters");
  }
}

/**
 * @description remove corresponding id of filter from array and filterExpressions object.
 * @param {Object} event
 */
const removeFilterElement = (event) => {
  if (filterIds.value.includes(event.id)) {
    /*remove id from filterIds */
    const ix = filterIds.value.indexOf(event.id);
    filterIds.value.splice(ix, 1);
    /*remove filterExpression from object */
    delete filters.filterExpressions[event.id];
  } else {
    console.log("FilterElement ID is not in filterIds array");
  }

  if (filterIds.value.length === maxNrOfFilters.value) {
    reachedFilterLimit.value = false;
  }
};

/**
 * @description combine multiple filter expressions to one. All filter expressions have to be true.
 * @returns {Array} containing filter expressions
 */
function writeFilterExpression() {
  let expression = ["all"];

  Object.entries(filters.filterExpressions).forEach(([key]) => {
    if (filters.filterExpressions[key].length != 0) {
      console.log("how does filertexpression look like");
      console.log(filters.filterExpressions[key]);
      expression.push(filters.filterExpressions[key]);
    } else {
      console.log("Empty filterExpression for filter with key: " + key);
    }
  });
  let polygon = {
    type: "Polygon",
    coordinates: [
      [
        [-45.87890625, 43.197167283],
        [-40.394529104, -31.203404951],
        [59.132888956, -31.533467254],
        [59.27351181, 45.926810515],
        [-45.87890625, 43.197167283],
      ],
    ],
  };
  let withinExpression = ["within", polygon];
  expression.push(withinExpression);
  console.log(expression);

  return expression;
}

/**
 * @description set Filter to map via internal maplibre function.
 */
function applyFilterToMap() {
  const expression = writeFilterExpression();

  props.map.setFilter("sites", expression);
}
</script>

<template>
  <!-- Attribute Filter -->
  <p class="d-grid gap-2">
    <button
      class="btn btn-primary"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#attributeFilter"
      aria-expanded="false"
      aria-controls="attributeFilter"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrows-expand"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2M8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
        />
      </svg>
      Attribute Filter
    </button>
  </p>
  <div class="collapse" id="attributeFilter">
    <FilterElement
      v-for="id in filterIds"
      :key="id"
      :id="id"
      :heatFlowSchema="heatFlowSchema"
      :map="map"
      @remove-filterElement="removeFilterElement($event)"
    >
    </FilterElement>

    <div class="filter-managing-tools">
      <label for="add-filter-btn" v-if="reachedFilterLimit"
        >You reached the max number of filters</label
      >
      <button
        id="add-filter-btn"
        class="btn btn-primary"
        v-if="!reachedFilterLimit"
        @click="addFilterElement()"
      >
        + Add Filter
      </button>
    </div>
  </div>

  <!-- Location Filter -->
  <p class="d-grid gap-2">
    <button
      class="btn btn-primary"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#locationFilter"
      aria-expanded="false"
      aria-controls="locationFilter"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-arrows-expand"
        viewBox="0 0 16 16"
      >
        <path
          fill-rule="evenodd"
          d="M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708l2-2M8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
        />
      </svg>
      Location Filter
    </button>
  </p>
  <div class="collapse" id="locationFilter">
    <div class="filters-panel">
      <CButton>start draw polygon</CButton>
    </div>
  </div>
</template>

<style scoped></style>

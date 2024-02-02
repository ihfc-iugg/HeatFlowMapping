<script setup>
import { defineProps, watch } from "vue";
import { Map } from "maplibre-gl";

import { useFilterStore } from "@/store/filter";

import FilterElement from "./FilterElement.vue";
import FilterByLocation from "./FilterByLocation.vue";

const props = defineProps({ map: Map });

const filter = useFilterStore();

/**
 * @description Watches changes in filterExpressions object and set the filter to map.
 */
watch(filter.filters, () => {
  applyFilterToMap();
});

/**
 * @description Is called when btn gets clicked. New entry added to array with the current date when btn gets clicked (as id for filterElement).
 */
function addFilterElement() {
  if (
    Object.keys(filter.filters["attributeFilter"]).length <=
    filter.maxNumberOfFilters
  ) {
    const filterID = "attrFilter" + Date.now();
    filter.addFilter(filterID, "attributeFilter");
  } else {
    filter.reachedLimit = true;
    console.log("You reached the maximum number of filters");
  }
}

/**
 * @description combine multiple filter expressions to one. All filter expressions have to be true.
 * @returns {Array} containing filter expressions
 */
function writeFilterExpression() {
  let expression = ["all"];

  Object.entries(filter.filters).forEach(([category]) => {
    Object.entries(filter.filters[category]).forEach(([key]) => {
      if (filter.filters[category][key].expression != null) {
        expression.push(filter.filters[category][key].expression);
      } else {
        console.log("Empty filterExpression for filter with key: " + key);
      }
    });
  });
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

function getRenderedFeatures() {
  console.log("inside getRenderesFeatures()");
  console.log(props.map.queryRenderedFeatures());
}
</script>

<template>
  <!-- Attribute Filter -->
  <p class="mt-1 d-grid gap-2">
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
      v-for="id in Object.keys(filter.filters.attributeFilter)"
      :key="id"
      :id="id"
    >
    </FilterElement>

    <div class="filter-managing-tools">
      <label for="add-filter-btn" v-if="filter.reachedLimit"
        >You reached the max number of filters</label
      >
      <button
        id="add-filter-btn"
        class="btn btn-primary"
        v-if="!filter.reachedLimit"
        @click="addFilterElement()"
      >
        + Add Filter
      </button>
    </div>
  </div>

  <!-- Location Filter -->
  <p class="mt-1 d-grid gap-2">
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
  <FilterByLocation :map="map" />

  <!-- Download Features -->
  <button
    class="btn btn-primary rounded-pill bg-white text-primary position-absolute bottom-0 start-0 mx-2 my-2"
    @click="getRenderedFeatures()"
  >
    <button class="btn btn-primary rounded-circle" type="button">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        fill="currentColor"
        class="bi bi-download"
        viewBox="0 0 16 16"
      >
        <path
          d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5"
        />
        <path
          d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z"
        />
      </svg>
    </button>
    Download
  </button>
</template>

<style scoped></style>

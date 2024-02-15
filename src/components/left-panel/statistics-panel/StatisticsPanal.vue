<script setup>
import { ref, defineProps } from "vue";
import { newPlot } from "plotly.js-dist";
import { mean, std, median } from "mathjs";
import Statistics from "statistics.js";

import VueMultiselect from "vue-multiselect";
import {
  CTable,
  CTableHead,
  CTableBody,
  CTableHeaderCell,
  CTableRow,
  CTableDataCell,
} from "@coreui/bootstrap-vue";

import { useMeasurementStore } from "@/store/measurements";
import { useFilterStore } from "@/store/filter";

const props = defineProps({ map: Map });

const measurements = useMeasurementStore();
const filter = useFilterStore();

const options = ref(["GHFDB", "Filtered GHFDB"]);
const selectedSourceTitle = ref(null);
const selectedSource = ref(measurements.geojson);
const selectedProperty = ref(null);
const table = ref({
  min: null,
  max: null,
  mean: null,
  std: null,
  median: null,
  skewness: null,
  kurtosis: null,
});

/**
 *
 */
function setDataSource() {
  if (selectedSourceTitle.value == "GHFDB") {
    selectedSource.value = measurements.geojson;
  } else if (selectedSourceTitle.value == "Filtered GHFDB") {
    const filteredFeatures = {
      type: "FeatureCollection",
      features: filter.getFilteredFeatures(props.map),
    };
    selectedSource.value = filteredFeatures;
  }
}

/**
 *
 * @param {String} property
 */
function plotGraph(property) {
  let dataArr = getPropertyValues(property);
  console.log("plotGraph");
  console.log(dataArr);
  const trace = {
    x: dataArr,
    type: "histogram",
  };
  const data = [trace];
  newPlot("statisticGraph", data);
}

/**
 *
 * @param {Sting} property
 */
function getPropertyValues(property) {
  let values = selectedSource.value.features.map(
    (feature) => feature.properties[property]
  );

  return values;
}

/**
 *
 * @param {Array} values
 */
function setMin(values) {
  table.value.min = Math.floor(Math.min.apply(null, values));
}

/**
 *
 * @param {Array} values
 */
function setMax(values) {
  table.value.max = Math.ceil(Math.max.apply(null, values));
}

/**
 *
 * @param {Array} values
 */
function setMean(values) {
  table.value.mean = mean(values);
}

/**
 *
 * @param {Array} values
 */
function setStd(values) {
  table.value.std = std(values);
}

/**
 *
 * @param {Array} values
 */
function setMedian(values) {
  table.value.median = median(values);
}

/**
 *
 * @param {Array} values
 */
function setSkewness(values) {
  const stats = new Statistics([]);
  table.value.skewness = stats.skewness(values);
  console.log("----skewness");
  console.log(table.value.skewness);
}

/**
 *
 * @param {Array} values
 */
function setKurtosis(values) {
  const stats = new Statistics([]);
  table.value.kurtosis = stats.kurtosis(values);
  console.log("----kurtosis");
  console.log(table.value.kurtosis);
}

/**
 *
 * @param {Array} property
 */
function setTableValues(property) {
  const values = getPropertyValues(property);
  setMin(values);
  setMax(values);
  setMean(values);
  setStd(values);
  setMedian(values);
  setSkewness(values);
  setKurtosis(values);
}

function printOut(value) {
  console.log("--------statistics panel---------");
  console.log(value);
}
</script>

<template>
  <div>
    <p class="mt-1 d-grid gap-2">
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#datasetSelection"
        aria-expanded="false"
        aria-controls="datasetSelection"
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
        1. select dataset
      </button>
    </p>
    <div class="collapse" id="datasetSelection">
      <VueMultiselect
        v-model="selectedSourceTitle"
        :options="options"
        :allow-empty="false"
        placeholder="1. select dataset"
        @select="printOut(selectedSourceTitle), setDataSource()"
      >
      </VueMultiselect>
    </div>

    <p class="mt-1 d-grid gap-2">
      <button
        class="btn btn-primary"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#propertySelection"
        aria-expanded="false"
        aria-controls="propertySelection"
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
        2. select property
      </button>
    </p>
    <div class="collapse" id="propertySelection">
      <VueMultiselect
        v-model="selectedProperty"
        :options="measurements.selectableProperties"
        label="title"
        :allow-empty="false"
        placeholder="2. select property"
        @select="
          printOut(selectedProperty),
            plotGraph(selectedProperty.key),
            setTableValues(selectedProperty.key)
        "
      >
      </VueMultiselect>
    </div>

    <div class="w-100 h-100 d-inline-block" id="statisticGraph"></div>

    <CTable v-if="selectedProperty">
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell scope="col">Measure</CTableHeaderCell>
          <CTableHeaderCell scope="col">Values</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow>
          <CTableHeaderCell scope="row">Min</CTableHeaderCell>
          <CTableDataCell>{{ table.min }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Max</CTableHeaderCell>
          <CTableDataCell>{{ table.max }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Mean</CTableHeaderCell>
          <CTableDataCell>{{ table.mean }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Median</CTableHeaderCell>
          <CTableDataCell>{{ table.median }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Std</CTableHeaderCell>
          <CTableDataCell>{{ table.std }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Skewness</CTableHeaderCell>
          <CTableDataCell>{{ table.skewness }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Kurtosis</CTableHeaderCell>
          <CTableDataCell>{{ table.kurtosis }}</CTableDataCell>
        </CTableRow>
        <CTableRow>
          <CTableHeaderCell scope="row">Count</CTableHeaderCell>
          <CTableDataCell>{{ selectedSource.features.length }}</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </div>
</template>

<style></style>

<script setup>
import { ref } from "vue";
import { newPlot } from "plotly.js-dist";
import { mean } from "mathjs";

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

const measurements = useMeasurementStore();

const options = ref(["GHFDB", "Filtered GHFDB"]);
const selectedSourceTitle = ref(null);
const selectedSource = ref(null);
const selectedProperty = ref(null);
const table = ref({ min: null, max: null, mean: null });

function setDataSource() {
  if (!selectedSourceTitle.value) {
    console.log("No source selected in statistic panel");
    return;
  } else if (selectedSourceTitle.value == "GHFDB") {
    selectedSource.value = measurements.geojson;
  } else if (selectedSourceTitle.value == "Filtered GHFDB") {
    // set whole dataset as source
  }
}

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

function getPropertyValues(property) {
  let values = selectedSource.value.features.map(
    (feature) => feature.properties[property]
  );

  return values;
}

function setMin(property) {
  const values = getPropertyValues(property);
  table.value.min = Math.floor(Math.min.apply(null, values));
}

function setMax(property) {
  const values = getPropertyValues(property);
  table.value.max = Math.ceil(Math.max.apply(null, values));
}

function setMean(property) {
  const values = getPropertyValues(property);
  table.value.mean = mean(values);
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
            setMin(selectedProperty.key),
            setMax(selectedProperty.key),
            setMean(selectedProperty.key)
        "
      >
      </VueMultiselect>
    </div>

    <div class="w-100 h-100 d-inline-block" id="statisticGraph"></div>

    <CTable v-if="selectedProperty">
      <CTableHead>
        <CTableRow>
          <!-- <CTableHeaderCell scope="col">Property</CTableHeaderCell> -->
          <CTableHeaderCell scope="col">Minimum</CTableHeaderCell>
          <CTableHeaderCell scope="col">Maximum</CTableHeaderCell>
          <CTableHeaderCell scope="col">Mean</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow>
          <!-- <CTableHeaderCell scope="row">{{
            selectedProperty.title
          }}</CTableHeaderCell> -->
          <CTableDataCell>{{ table.min }}</CTableDataCell>
          <CTableDataCell>{{ table.max }}</CTableDataCell>
          <CTableDataCell>{{ table.mean }}</CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>
  </div>
</template>

<style></style>

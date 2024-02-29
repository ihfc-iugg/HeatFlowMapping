<script setup>
// import { computed, defineEmits, defineProps, onMounted, ref } from "vue";

// import DataTable from "datatables.net-vue3";
// import DataTablesLib from "datatables.net";
// import DataTablesCore from "datatables.net";

// import { Map } from "maplibre-gl";

// onMounted(() => {});

// defineEmits(["toggle-dt-event"]);
// const props = defineProps({ map: Map });
// const geojsonData = ref(props.map.getSource("sites")._data.features);
// const tableData = ref([]);
// const columns = ref([
//   { title: "Id", data: "id" },
//   { title: "Name", data: "name" },
//   { title: "Environment", data: "env" },
//   { title: "Method", data: "method" },
// ]);
// const options = ref({
//   dom: "Bftip",
//   select: true,
//   lengthChange: true,
//   lengthMenu: [
//     [10, 25, 50, -1],
//     [10, 25, 50, "All"],
//   ],
//   pageLength: 10,
// });

// DataTable.use(DataTablesLib);
// DataTable.use(DataTablesCore);

/**
 * Pseudo Code:
 * 1. select data source (whole data set or selection)
 * 2. get geojson data
 * 3. select colums shown in the table
 * 4. If (selection) {
 *  show btn "Show selection on map"
 *  get filtered data
 *  set filter on map object
 * }
 */

// tableData.value = computed(() => {
//   if (!geojsonData.value) {
//     return [];
//   } else {
//     return geojsonData.value.map((feature) => ({
//       // Assuming each feature has properties 'name' and 'type' as an example
//       id: feature.id,
//       name: feature.properties.name,
//       env: feature.properties.env,
//       method: feature.properties.method,
//     }));
//   }
// });
</script>

<template>
  <div class="data-table-overlay">
    <!-- <div class="attribute-table rounded-rect collapsed">
      <div class="attribute-table-header">
        <h3 class="attribute-table-title">Attribute Table</h3>
        <button
          type="button"
          class="btn-close btn-close-white pull-right"
          aria-label="Close"
          @click="$emit('toggle-dt-event')"
        ></button>
      </div>
      <div class="attribute-table-content" ref="attributeTableContent">
        <DataTable
          :data="tableData.value"
          :columns="columns"
          :options="options"
          class="display"
          width="100%"
        />
      </div>
    </div> -->
  </div>
</template>

<style scoped>
/* @import "bootstrap";
@import "datatables.net-bs5";
@import "datatables.net-dt";
.data-table-overlay {
  position: absolute;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1000;
} */

/* .attribute-table {
  position: relative;
  width: 90%;
  height: 85%;
  top: 50%;
  left: 50%;
  overflow: hidden;
  padding-bottom: 2.5%;
  background-color: white;
  box-shadow: 0 0 50px -25px black;
  -moz-transform: translateX(-50%) translateY(-50%);
  -webkit-transform: translateX(-50%) translateY(-50%);
  transform: translateX(-50%) translateY(-50%);
  z-index: 1000;
} */

/* .rounded-rect {
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 50px -25px black;
} */

/* .attribute-table-header {
  background-color: #304b9b;
  border-bottom: 0.2rem solid #8eb7e2;
} */

/* .attribute-table-title {
  display: inline-block;
  color: #8eb7e2;
  font-weight: bold;
  padding-top: 10px;
  padding-bottom: 5px;
  padding-left: 15px;
} */

/* .btn-close {
  float: right;
  color: #8eb7e2;
  display: inline-block;
  margin-top: 15px;
  margin-right: 15px;
} */

/* .attribute-table-content {
  padding: 5px;
} */
</style>

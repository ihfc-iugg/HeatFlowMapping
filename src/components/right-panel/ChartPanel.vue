<!-- Chart Panel -->
<script setup>
// import {
//   ref,
//   defineEmits,
//   watch,
//   computed,
//   defineProps,
//   defineExpose,
// } from "vue";

// // Extern Libraries
// import {
//   CCloseButton,
//   CCard,
//   CCardHeader,
//   CCardBody,
//   CCardTitle,
//   CPopover,
//   CButton,
//   CForm,
//   CFormLabel,
//   CFormInput,
//   CFormText,
// } from "@coreui/bootstrap-vue";
// import Multiselect from "vue-multiselect";
// import VueApexCharts from "vue3-apexcharts";

// const apexchart = VueApexCharts;
// const emit = defineEmits(["point-click", "legend-event"]);

// // stores
// import { useSelectPropertiesStore } from "@/store/selectProperties";
// const selectProperties = useSelectPropertiesStore();
// import { useMeasurementStore } from "@/store/measurements";
// const measurements = useMeasurementStore();
// import { useMapControlsStore } from "@/store/mapControls";
// const mapControls = useMapControlsStore();
// import { useAnalysisFunctionsStore } from "@/store/analysisFunctions";
// const analysisFunctions = useAnalysisFunctionsStore();

// // props
// const props = defineProps({
//   map: Map,
//   currentPage: Number,
//   selectedColorPalette: Object,
//   colorPaletteOptions: Array,
// });

// // functions
// const haversine = analysisFunctions.haversine;

// const draw = mapControls.mapboxDraw;
// const coordinateA = ref();
// const coordinateB = ref();
// const error = ref(false);

// const propertyOptions = computed(() => {
//   const options = [...measurements.selectableNumberProperties];

//   if (
//     !options.some(
//       (option) => option.key === null && option.title === "No Property"
//     )
//   ) {
//     options.push({ title: "No Property", key: null, units: null });
//   }

//   return options;
// });

// // Chart initial settings
// const charts = ref([]);
// chartInitialSetting();
// function chartInitialSetting() {
//   let data = [];
//   let options = [];
//   let series = [];
//   let selectedProperty1 = [];
//   let selectedProperty2 = [];
//   let distance = [];

//   const initialChart = {
//     data,
//     options,
//     series,
//     selectedProperty1,
//     selectedProperty2,
//     distance,
//   };
//   charts.value.push(initialChart);

//   const last = charts.value.length - 1;
//   charts.value[last].selectedProperty1.push(selectProperties.selectedProperty1);
//   if (selectProperties.selectedProperty2 != null) {
//     charts.value[last].selectedProperty2.push(
//       selectProperties.selectedProperty2
//     );
//   } else {
//     charts.value[last].selectedProperty2.push(null);
//   }
//   charts.value[last].distance.push(selectProperties.distance);
//   selectProperties.selectedProperty1 = [];
//   selectProperties.selectedProperty2 = [];
//   selectProperties.distance = [];
// }

// function Options() {
//   const last = charts.value.length - 1;
//   charts.value[last].options.push({
//     chart: {
//       height: "100%",
//       type: "line",
//       stacked: false,
//       zoom: {
//         enabled: false,
//       },
//     },
//     colors: ["#FF1654", "#247BA0"],
//     stroke: {
//       width: [2, 2],
//     },
//     dataLabels: {
//       enabled: false,
//     },
//     markers: {
//       size: 1.7,
//       colors: "#fff",
//       strokeColors: ["#FF1654", "#247BA0"],
//       strokeWidth: 1.2,
//       fillOpacity: 1,
//     },
//     tooltip: {
//       y: {
//         formatter: function (y) {
//           if (typeof y !== "undefined") {
//             return y.toFixed(3);
//           }
//           return y;
//         },
//       },
//       x: {
//         style: {
//           colors: ["#333"],
//         },
//         formatter: function (val, opts) {
//           const { seriesIndex, dataPointIndex, w } = opts;
//           const id = w.config.series[seriesIndex].data[dataPointIndex].id;
//           return "ID" + ":  " + id;
//         },
//       },
//       shared: false,
//       intersect: true,
//     },
//     noData: {
//       text: "draw a line to create a chart",
//       offsetY: -15,
//       zIndex: 10000,
//     },
//     grid: {
//       row: {
//         colors: ["#f3f3f3", "transparent"],
//         opacity: 0.5,
//       },
//     },
//     xaxis: {
//       type: "numeric",
//       title: {
//         text: "Distance from A to B (km)",
//       },
//     },
//     yaxis: [
//       {
//         axisTicks: {
//           show: true,
//         },
//         axisBorder: {
//           show: true,
//           color: "#FF1654",
//         },
//         labels: {
//           style: {
//             colors: "#FF1654",
//           },
//         },
//         title: {
//           text:
//             charts.value[last].selectedProperty1[0].title +
//             " (" +
//             charts.value[last].selectedProperty1[0].units +
//             ")",
//           style: {
//             color: "#FF1654",
//           },
//         },
//       },
//       {
//         opposite:
//           charts.value[last].selectedProperty2[0] != null ? true : false,
//         axisTicks: {
//           show: charts.value[last].selectedProperty2[0] != null ? true : false,
//         },
//         axisBorder: {
//           show: charts.value[last].selectedProperty2[0] != null ? true : false,
//           color:
//             charts.value[last].selectedProperty2[0] != null ? "#247BA0" : "",
//         },
//         labels: {
//           show: charts.value[last].selectedProperty2[0] != null ? true : false,
//           style: {
//             colors:
//               charts.value[last].selectedProperty2[0] != null ? "#247BA0" : "",
//           },
//         },
//         title: {
//           text:
//             charts.value[last].selectedProperty2[0] != null
//               ? charts.value[last].selectedProperty2[0].title +
//                 " (" +
//                 charts.value[last].selectedProperty2[0].units +
//                 ")"
//               : "",
//           style: {
//             color:
//               charts.value[last].selectedProperty2[0] != null ? "#247BA0" : "",
//           },
//         },
//       },
//     ],
//   });
// }
// Options();

// // added chart settings
// const addNewChart = () => {
//   if (charts.value.length < 4) {
//     charts.value.push({
//       options: [],
//       series: [],
//       selectedProperty1: [],
//       selectedProperty2: [],
//       distance: [],
//     });
//     const last = charts.value.length - 1;
//     charts.value[last].selectedProperty1.push(
//       selectProperties.selectedProperty1
//     );
//     if (selectProperties.selectedProperty2.key != null) {
//       charts.value[last].selectedProperty2.push(
//         selectProperties.selectedProperty2
//       );
//     } else {
//       charts.value[last].selectedProperty2.push(null);
//     }
//     charts.value[last].distance.push(selectProperties.distance);
//     selectProperties.selectedProperty1 = [];
//     selectProperties.selectedProperty2 = [];
//     selectProperties.distance = [];
//     Options();
//   }
// };

// const handleEnterKey = () => {
//   if (validateDistance() && validateProperty()) {
//     addNewChart();
//   } else {
//     alert(
//       "Error! Please check if the selected property or distance is correct."
//     );
//   }
// };

// const handleOkButton = () => {
//   if (validateDistance() && validateProperty()) {
//     addNewChart();
//   } else {
//     alert(
//       "Error! Please check if the selected property or distance is correct."
//     );
//   }
// };

// const validateDistance = () => {
//   const distance = parseInt(selectProperties.distance, 10);
//   if (distance < 1 || distance > 500 || isNaN(distance)) {
//     error.value = true;
//     return false;
//   } else {
//     error.value = false;
//     return true;
//   }
// };

// const validateProperty = () => {
//   if (selectProperties.selectedProperty1) {
//     console.log("called", selectProperties.selectedProperty1);
//     return true;
//   } else {
//     return false;
//   }
// };

// // Popover
// const popoverContent = computed(() => {
//   return charts.value.map((chart) => {
//     const selectedProperty1 = chart.selectedProperty1[0].title;
//     const selectedProperty2 = chart.selectedProperty2?.[0]?.title || "none";
//     const distance = chart.distance[0];
//     return `Property1: ${selectedProperty1} \n Property2: ${selectedProperty2} \n Distance: ${distance} km`;
//   });
// });

// // pointA & pointB
// watch([coordinateA, coordinateB], () => {
//   console.log("coordinateA&B are changed");
//   updatePoints();
// });

// function updatePoints() {
//   if (props.map.getLayer("pointAB")) {
//     props.map.removeLayer("pointAB");
//   }
//   if (props.map.getSource("pointAB")) {
//     props.map.removeSource("pointAB");
//   }

//   const pointAB = {
//     type: "FeatureCollection",
//     features: [
//       {
//         type: "Feature",
//         geometry: {
//           type: "Point",
//           coordinates: coordinateA.value,
//         },
//         properties: { "marker-symbol": "A" },
//       },
//       {
//         type: "Feature",
//         geometry: {
//           type: "Point",
//           coordinates: coordinateB.value,
//         },
//         properties: { "marker-symbol": "B" },
//       },
//     ],
//   };

//   function addPoints() {
//     console.log("function addPoints is called");

//     props.map.addSource("pointAB", {
//       type: "geojson",
//       data: pointAB,
//     });

//     props.map.addLayer({
//       id: "pointAB",
//       type: "symbol",
//       source: "pointAB",
//       layout: {
//         "text-field": ["get", "marker-symbol"],
//         "text-offset": [0, 1.0],
//       },
//     });
//   }
//   addPoints();
// }

// // draw Chart
// // Todo 欠損データのグラフ描写
// const drawChart = async (index) => {
//   const data = draw.getAll();
//   if (data.features.length > 0) {
//     try {
//       const points = analysisFunctions.pointsWithinDistance;
//       const line = analysisFunctions.line;
//       console.log("points data within", index.distance[0], points);
//       index.series = [];
//       index.data = [];
//       index.data.push(points);
//       coordinateA.value = line.geometry.coordinates[1];
//       coordinateB.value = line.geometry.coordinates[0];
//       console.log("A:", coordinateA.value, "B:", coordinateB.value);

//       // Coordinates transformation
//       const latA = coordinateA.value[1];
//       const lonA = coordinateA.value[0];
//       const latB = coordinateB.value[1];
//       const lonB = coordinateB.value[0];

//       console.log(
//         "selected Properties:",
//         index.selectedProperty1[0],
//         index.selectedProperty2[0]
//       );
//       const pointsData1 = points.map((item) => ({
//         id: item.properties.ID,
//         y: item.properties[index.selectedProperty1[0].key],
//         lon: item.geometry.coordinates[0],
//         lat: item.geometry.coordinates[1],
//         properties: item.properties,
//       }));

//       // calculate distance to pointA
//       pointsData1.forEach((point) => {
//         const distanceToA = haversine(latA, lonA, point.lat, point.lon, "K");
//         point.x = distanceToA;
//       });
//       const distanceBtoA = haversine(latA, lonA, latB, lonB, "K");
//       const pointAData = {
//         id: "pointA",
//         x: 0,
//         y: null,
//         lat: latA,
//         lon: lonA,
//       };
//       const pointBData = {
//         id: "pointB",
//         x: distanceBtoA,
//         y: null,
//         lat: latB,
//         lon: lonB,
//       };
//       const newData1 = [...pointsData1, pointAData, pointBData];
//       console.log("New Data:", newData1);
//       index.options[0] = {
//         ...index.options[0],
//         xaxis: {
//           categories: newData1.map((item) => item.x.toFixed(2)),
//         },
//       };
//       newData1.sort((a, b) => a.x - b.x);
//       // push in series
//       index.series.push({
//         name: index.selectedProperty1[0].title,
//         type: "line",
//         data: newData1,
//       });
//       console.log("series:", index.series);

//       if (index.selectedProperty2[0] != null) {
//         const pointsData2 = points.map((item) => ({
//           id: item.properties.ID,
//           y: item.properties[index.selectedProperty2[0].key],
//           lon: item.geometry.coordinates[0],
//           lat: item.geometry.coordinates[1],
//           properties: item.properties,
//         }));
//         // calculate distance to PointA
//         pointsData2.forEach((point) => {
//           const distanceToA = haversine(latA, lonA, point.lat, point.lon, "K");
//           point.x = distanceToA;
//         });
//         const newData2 = [...pointsData2, pointAData, pointBData];
//         console.log("New Data:", newData1, newData2);
//         newData2.sort((a, b) => a.x - b.x);

//         // push in series
//         index.series.push({
//           name: index.selectedProperty2[0].title,
//           type: "line",
//           data: newData2,
//         });
//         console.log("series:", index.series);
//       }
//     } catch (error) {
//       console.error("Error occured:", error);
//     }
//   } else {
//     charts.value.forEach((index) => {
//       index.series = [];
//       index.data = [];
//     });
//   }
// };

// defineExpose({
//   charts,
//   drawChart,
// });

// function aboutSelectedData(val, chartContext, config) {
//   if (!config) {
//     console.warn("config is undefined");
//     return;
//   } else {
//     emit("point-click", val, chartContext, config);
//   }
// }

// const removeChart = (index) => {
//   charts.value.splice(index, 1);
// };
</script>
<template>
  <div class="chartContainer">
    <CCard
      class="mb-2"
      style="height: 80%"
      v-for="(chart, index) in charts"
      :key="index"
      v-show="props.currentPage === 0 || props.currentPage - 1 === index"
    >
      <CCardHeader style="display: flex; justify-content: space-between; align-items: center"
        ><CCardTitle style="margin: 0.3em"
          ><strong>Chart {{ index + 1 }}</strong></CCardTitle
        >
        <div>
          <CCloseButton class="text-reset" @click="removeChart(index)" />
        </div>
      </CCardHeader>
      <CCardBody style="margin: 0.3em; padding: 0">
        <apexchart
          type="line"
          height="95%"
          style="margin: 0.3em"
          :options="chart.options[0]"
          :series="chart.series"
          :key="index"
          @dataPointSelection="aboutSelectedData"
        >
        </apexchart>
      </CCardBody>
    </CCard>
  </div>
</template>
<style scoped>
.chartContainer {
  position: absolute;
  width: 100%;
  height: 70%;
  padding-right: 12px;
  overflow: auto;
}
.select-box {
  display: flex;
  margin: 0.3em;
}
.select-box label {
  width: 25%;
  font-size: 1em;
}
.multiselect {
  width: 70%;
}
.add-button {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 8px;
}
.add-button label {
  color: #0d6efd;
  margin-left: 8px;
}
</style>

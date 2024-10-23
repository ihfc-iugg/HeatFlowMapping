<script setup>
import { ref, defineEmits, watch, defineProps, defineExpose } from 'vue'

// Extern Libraries
import {
  CCloseButton,
  CButtonGroup,
  CButton,
  CCard,
  CCardTitle,
  CCardBody
} from '@coreui/bootstrap-vue'
import colorbrewer from 'colorbrewer'
import Multiselect from 'vue-multiselect'

// stores
// import { useAnalysisFunctionsStore } from '@/store/analysisFunctions'
// const analysisFunctions = useAnalysisFunctionsStore()
import { useLegendStore } from '@/store/legend'
const legend = useLegendStore()
import { useMeasurementStore } from '@/store/measurements'
const measurements = useMeasurementStore()

// components
import ChartPanel from './ChartPanel.vue'

const props = defineProps({ map: Map })
// const emit = defineEmits(["close-event"]);

// const getPoint = analysisFunctions.getPointsWithinDistance;
// const chartPanel = ref();
// const infoPanel = ref();
// const defaultCircleColor = ref("#41b6c4");
// const chartsNr = ref([]);
// const colorSteps = ref(4);
// const colorPaletteOptions = ref(null);
// setColorPaletteOptions(colorSteps.value);
// const selectedColorPalette = ref(colorPaletteOptions.value[0]);
// const currentPage = ref(0);
// const selectedProperty = ref(null);

// watch(
//   () => chartPanel.value?.charts,
//   (newCharts) => {
//     chartsNr.value = newCharts || [];
//   },
//   { immediate: true, deep: true }
// );

// // function InfoPanel
// const getAboutSelectedData = (val, chartContext, config) => {
//   infoPanel.value.aboutSelectedData(val, chartContext, config);
// };

// const hideText = () => {
//   infoPanel.value.hideText();
// };

// // draw events
// const createUpdateEvents = ["draw.create", "draw.update"];
// const deleteEvent = "draw.delete";
// createUpdateEvents.forEach((event) => {
//   props.map.on(event, function (e) {
//     chartPanel.value.charts.forEach((index) => {
//       getPoint(e, index.distance[0]);
//       chartPanel.value.drawChart(index);
//     });
//     // infoPanel.value.showText();
//     backPointColor(e);
//     dataDrivenColorisation();
//   });
// });
// props.map.on(deleteEvent, function (e) {
//   chartPanel.value.drawChart(e);
//   backPointColor(e);
// });
// function deletePointAB() {
//   if (props.map.getLayer("pointAB")) {
//     props.map.removeLayer("pointAB");
//   }
//   if (props.map.getSource("pointAB")) {
//     props.map.removeSource("pointAB");
//   }
// }
// function backPointColor() {
//   console.log("backPointColor is called");
//   props.map.setPaintProperty("sites", "circle-color", defaultCircleColor.value);
//   deletePointAB();
// }

// defineExpose({
//   deletePointAB,
// });

// // Legend
// function dataDrivenColorisation() {
//   if (currentPage.value === 0) {
//     let classes = getClasses();
//     colorSteps.value = classes.length - 1;
//     selectedColorPalette.value = colorPaletteOptions.value[3];
//     if (colorSteps.value < 3) {
//       let colors;
//       if (colorSteps.value === 1) {
//         colors = ["#e66101"];
//       } else if (colorSteps.value === 2) {
//         colors = ["#e66101", "#fdb863"];
//       }
//       const paintProperty = generatePaintProperty(
//         chartPanel.value.charts,
//         classes,
//         colors
//       );

//       props.map.setPaintProperty("sites", "circle-color", paintProperty);
//       legend.setLegendObject(classes, colors);
//     } else {
//       const paintProperty = generatePaintProperty(
//         chartPanel.value.charts,
//         classes,
//         colorbrewer[selectedColorPalette.value.name][colorSteps.value]
//       );

//       props.map.setPaintProperty("sites", "circle-color", paintProperty);
//       legend.setLegendObject(
//         classes,
//         colorbrewer[selectedColorPalette.value.name][colorSteps.value]
//       );
//     }
//   } else if (currentPage.value !== 0) {
//     let classes = getClasses(selectedProperty.value.key);
//     colorSteps.value = classes.length;
//     const paintProperty = generatePaintProperty(
//       chartPanel.value.charts,
//       classes,
//       colorbrewer[selectedColorPalette.value.name][colorSteps.value]
//     );
//     props.map.setPaintProperty("sites", "circle-color", paintProperty);
//     legend.setLegendObject(
//       classes,
//       colorbrewer[selectedColorPalette.value.name][colorSteps.value]
//     );
//   }
// }

// function getClasses(Property) {
//   let classes = [];

//   if (currentPage.value === 0) {
//     chartPanel.value.charts.forEach((index) => {
//       classes.push(index.distance[0]);
//     });
//     classes.push("0");
//     classes.sort((a, b) => a - b);
//   } else {
//     measurements.dataSchema.properties[Property].oneOf.forEach((enumSchema) => {
//       enumSchema.enum.forEach((enumClass) => {
//         if (enumClass) {
//           classes.push(enumClass);
//         } else {
//           // classes.push("null");
//         }
//       });
//     });
//   }
//   return classes;
// }

// function setColorPaletteOptions(colorSteps) {
//   if (colorSteps >= 12) {
//     console.log("Number of colorSteps out of range");
//     return;
//   }
//   let schemaGroup = [];

//   colorbrewer.schemeGroups.diverging.forEach((schema) => {
//     const value = {
//       name: schema,
//       colors: colorbrewer[schema][colorSteps],
//     };
//     schemaGroup.push(value);
//   });

//   colorPaletteOptions.value = schemaGroup;
// }

// function generatePaintProperty(property, classes, colors) {
//   let paintProperty = [];
//   paintProperty.push("match");
//   paintProperty.push(["get", "ID"]);

//   if (currentPage.value === 0) {
//     const sortedCharts = [...property].sort((a, b) => a.distance - b.distance);
//     const idToColor = new Map();
//     const distanceToColor = new Map();
//     let colorIndex = 0;

//     sortedCharts.forEach((index) => {
//       if (!distanceToColor.has(index.distance)) {
//         if (colorIndex < colors.length) {
//           distanceToColor.set(index.distance, colors[colorIndex]);
//           colorIndex++;
//         }
//       }
//       const color = distanceToColor.get(index.distance);
//       if (!index.data[0]) {
//         props.map.setPaintProperty(
//           "sites",
//           "circle-color",
//           defaultCircleColor.value
//         );
//       } else {
//         index.data[0].forEach((item) => {
//           if (!idToColor.has(item.properties.ID)) {
//             idToColor.set(item.properties.ID, color);
//           }
//         });
//       }
//     });

//     idToColor.forEach((color, id) => {
//       paintProperty.push(id);
//       paintProperty.push(color);
//     });

//     // others
//     paintProperty.push("#41b6c4");

//     return paintProperty;
//   } else {
//     const propertyToColor = new Map();
//     const idToColor = new Map();

//     classes.forEach((value, index) => {
//       propertyToColor.set(value, colors[index]);
//     });

//     property[currentPage.value - 1].data[0].forEach((item) => {
//       if (item.properties[selectedProperty.value.key] == null) {
//         const color = "#ccc";
//         if (!idToColor.has(item.properties.ID)) {
//           idToColor.set(item.properties.ID, color);
//         }
//       } else {
//         const color = propertyToColor.get(
//           item.properties[selectedProperty.value.key]
//         );
//         if (!idToColor.has(item.properties.ID)) {
//           idToColor.set(item.properties.ID, color);
//         }
//       }
//     });

//     idToColor.forEach((color, id) => {
//       paintProperty.push(id);
//       paintProperty.push(color);
//     });

//     // others
//     paintProperty.push("#41b6c4");

//     return paintProperty;
//   }
// }

// watch(colorSteps, (newColorSteps) => {
//   setColorPaletteOptions(newColorSteps);
// });

// // Pages
// const changePage = (index) => {
//   currentPage.value = index + 1;
//   colorSteps.value = 4;
//   selectedProperty.value = null;
// };
// const getTopPage = () => {
//   currentPage.value = 0;
//   colorSteps.value = 4;
//   selectedProperty.value = null;
// };
</script>

<template>
  <header>
    <h3>2D Profil</h3>
    <CCloseButton class="text-reset" @click="" />
  </header>
  <body>
    <div class="container">
      <ChartPanel ref="chartPanel" />

      <InfoPanel ref="infoPanel" :currentPage="currentPage" />
    </div>
    <div class="fixed-bottom">
      <CButtonGroup class="me-2" role="group" aria-label="First group">
        <CButton color="secondary" variant="outline">Top </CButton>
        <CButton color="secondary" variant="outline"> </CButton>
      </CButtonGroup>
    </div>
  </body>
</template>

<style scoped>
header {
  height: 10%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3em;
  color: white;
  background-color: rgb(13, 110, 253);
}
header h3 {
  margin: 0 0 0 5px;
}
body {
  position: relative;
  margin: 0.3em;
  height: 89%;
}
.container {
  position: absolute;
  height: 93%;
  padding: 0;
}
.color-container {
  position: absolute;
  width: 100%;
  height: 30%;
  bottom: 0;
  padding-right: 12px;
}
.fixed-bottom {
  position: absolute;
  width: fit-content;
  margin: 0 auto;
  z-index: 1;
}
</style>

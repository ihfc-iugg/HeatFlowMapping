<script setup>
// vue
import { onMounted, onUnmounted, markRaw, ref } from 'vue'

// map viewer
import { Map } from 'maplibre-gl'

// components
// import AttributeTable from "./common/AttributeTable.vue";
import { CButton, CButtonGroup, COffcanvas, CRow, CSpinner } from '@coreui/bootstrap-vue'
import CursorCoordinates from './map/CursorCoordinates.vue'
import LeftPanel from './left-panel/LeftPanel.vue'
import InfoPopup from './map/InfoPopup.vue'
import MapLegend from './map/MapLegend.vue'

import { useMeasurementStore } from '@/store/measurements'
import { useMapControlsStore } from '@/store/mapControls'
import { useSettingsStore } from '@/store/settings'
import { useBaseMapsStore } from '@/store/baseMaps'
import { useMapAppConfig } from '@/store/mapAppConfig'

import dataURL from '@/assets/data/heatflow_sample_data.json'
import schemaURL from '@/assets/data/Heatflow_worldAPI.yaml'

const measurements = useMeasurementStore()
measurements.fetchAPIDataSchema(schemaURL)
const mapControls = useMapControlsStore()
const settings = useSettingsStore()
const bm = useBaseMapsStore()
const mapAppConfig = useMapAppConfig()
mapAppConfig.setElement(document.querySelector('#whfd-mapping'))
mapAppConfig.setDataURL('dataUrl')
mapAppConfig.setSchemaURL('schemaUrl')
mapAppConfig.printOutMapAppConfig()

const mapContainer = ref()
const map = ref()
const navbarTitles = ref(['Settings', 'Filter', 'Statistics', 'Analysis']) // TODO: change to object and add key with bootstrap related icon class https://icons.getbootstrap.com/
const panelTitle = ref('')

const isCollapsed = ref(true)
const visibleScrolling = ref(false)

const setIsCollapsed = () => (isCollapsed.value = !isCollapsed.value)

/**
 * @description get title of corresponding button and set it as title of sidepanel
 * @param {*} event
 */
function setPanelTitle(event) {
  panelTitle.value = event.srcElement.innerHTML
}

/**
 * @description create object for base map sources
 */
function setBaseMapsSource() {
  let bmSourceObject = {}

  bm.baseMaps.forEach((baseMapSource) => {
    bmSourceObject[baseMapSource.id] = {
      type: 'raster',
      tiles: [baseMapSource.tiles],
      tileSize: 256,
      attribution: baseMapSource.attribution,
      minzoom: 0,
      maxzoom: 22
    }
  })
  return bmSourceObject
}

/**
 * @description create object for base map layers
 */
function setBaseMapsLayer() {
  let layerObjects = []

  bm.baseMaps.forEach((baseMapLayer, ix) => {
    let layerObject = {
      id: baseMapLayer.id,
      type: 'raster',
      source: baseMapLayer.id
    }
    if (ix == 0) {
      settings.activeBaseLayer = baseMapLayer.id
      // first object in maps.json will be default base map
      layerObject.layout = {
        visibility: 'visible'
      }
    } else {
      // others are already added but not visible
      layerObject.layout = {
        visibility: 'none'
      }
    }
    layerObjects.push(layerObject)
  })
  return layerObjects
}

onMounted(() => {
  // instantiate map object
  map.value = markRaw(
    new Map({
      mapId: 'map_1',
      container: mapContainer.value,
      attributionControl: true,
      style: {
        version: 8,
        sources: setBaseMapsSource(),
        layers: setBaseMapsLayer(),
        glyphs: 'https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf' // https://maplibre.org/maplibre-gl-js-docs/style-spec/glyphs/
      }
    })
  )

  map.value.once('load', async () => {
    // add controls
    map.value.addControl(mapControls.scale, 'bottom-right')
    map.value.addControl(mapControls.fullscreen, 'top-right')
    map.value.addControl(mapControls.navigation, 'top-right')
    map.value.addControl(mapControls.mapboxDraw)

    // add data source
    // try {
    //   await measurements.fetchAPIData(mapAppConfig.dataUrl);
    // } catch (error) {
    //   console.log(error);
    // }

    // measurements.fetchAPIDataSchema(mapAppConfig.schemaUrl);

    measurements.geojson = dataURL

    map.value.addSource('sites', {
      type: 'geojson',
      data: measurements.geojson
      // data: sites.value,
    })

    // add data layer
    map.value.addLayer({
      id: 'sites',
      type: 'circle',
      source: 'sites',
      paint: {
        'circle-color': settings.circleColor,
        'circle-radius': settings.circleRadius,
        'circle-stroke-width': 0.5,
        'circle-stroke-color': '#a1dab4'
      },
      layout: {
        visibility: 'visible'
      }
    })
  })
}),
  onUnmounted(() => {
    map.value?.remove()
  })

function toggleVisibleScrolling() {
  visibleScrolling.value = !visibleScrolling.value
}
</script>

<template>
  <div class="map-wrap">
    <CRow class="align-items-center">
      <CButton v-if="measurements.isDataLoading">
        <CSpinner component="span" size="sm" aria-hidden="true" />
        Loading Data ...
      </CButton>
    </CRow>
    <div class="map" ref="mapContainer" @mousemove="updateLatLng">
      <InfoPopup :map="map" />
      <MapLegend />

      <!-- Navigation buttons -->
      <div class="fixed-bottom">
        <CButtonGroup role="group" aria-label="Basic example">
          <CButton
            color="primary"
            v-for="title in navbarTitles"
            :key="title"
            @click="
              isCollapsed ? setPanelTitle($event) : 0,
                // toggleSidebar(),
                setIsCollapsed(),
                toggleVisibleScrolling()
            "
            type="button"
            class="btn btn-primary"
          >
            {{ title }}
          </CButton>
        </CButtonGroup>

        <COffcanvas
          :backdrop="false"
          placement="start"
          scroll
          :visible="visibleScrolling"
          @hide="
            () => {
              visibleScrolling = !visibleScrolling
            }
          "
        >
          <LeftPanel
            :title="panelTitle"
            :map="map"
            @collapse-event="setIsCollapsed()"
            @toggle-event="toggleVisibleScrolling()"
          />
        </COffcanvas>

        <div class="cursor-div">
          <CursorCoordinates :map="map" />
        </div>
      </div>

      <!-- <div class="trigger-data-table">
        <button
          type="button"
          class="btn-trigger-data-table btn btn-primary"
          @click="
            toggleDataTable();
            printHeatFlowSchema();
          "
        >
          Show Data Table
        </button>
      </div> -->
    </div>
  </div>
  <!-- <AttributeTable
    v-if="showsDataTable"
    @toggle-dt-event="toggleDataTable()"
    :map="map"
  /> -->
</template>

<style scoped>
@import url('maplibre-gl/dist/maplibre-gl.css');
@import url('@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css');

.map-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
}

.map {
  /* position: relative; */
  width: 100%;
  height: 100%;
}

.fixed-bottom {
  position: absolute;
  width: fit-content;
  height: fit-content;
  margin: 0 auto;
  z-index: 1;
}

.cursor-position {
  background: rgba(255, 255, 255, 0.5);
  z-index: 1;
}
</style>

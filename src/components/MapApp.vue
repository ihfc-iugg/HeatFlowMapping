<script setup>
// vue
import { onMounted, onUnmounted, markRaw, ref } from 'vue'

// map viewer
import { Map } from 'maplibre-gl'

// components
import { CButton, CButtonGroup, COffcanvas, CRow, CSpinner } from '@coreui/bootstrap-vue'
import CursorCoordinates from './map/CursorCoordinates.vue'
import DataLoadingModal from './map/DataLoadingModal.vue'
import LeftPanel from './left-panel/LeftPanel.vue'
import InfoPopup from './map/InfoPopup.vue'
import MapLegend from './map/MapLegend.vue'
// import RightPanel from '@/components/right-panel/RightPanel.vue'

import { useMeasurementStore } from '@/store/measurements'
import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useMapControlsStore } from '@/store/mapControls'
import { useSettingsStore } from '@/store/settings'
import { useBaseMapsStore } from '@/store/baseMaps'
import { useMapAppConfig } from '@/store/mapAppConfig'
import { useNavigationBarStore } from '@/store/navigationBar'
// import schemaURL from '@/assets/data/Heatflow_worldAPI.yaml'

// import dataURL from '@/assets/data/heatflow_sample_data.json'
// import dataURL from '@/assets/data/parent_elements.json'
const ROOT_DOMAIN = import.meta.env.VITE_ROOT_API_DOMAIN
const schemaURL = ROOT_DOMAIN + '/api/v1/schema/'

const measurements = useMeasurementStore()
const dataSchema = useDataSchemaStore()
dataSchema.fetchAPIDataSchema(schemaURL)
const mapControls = useMapControlsStore()
const settings = useSettingsStore()
const bm = useBaseMapsStore()
const mapAppConfig = useMapAppConfig()
mapAppConfig.setElement(document.querySelector('#whfd-mapping'))
mapAppConfig.setDataURL('dataUrl')
mapAppConfig.setSchemaURL('schemaUrl')

const mapContainer = ref()
const map = ref()
const navBar = useNavigationBarStore()
const panelTitle = ref(null)
const panelIcon = ref(null)

const isCollapsed = ref(true)
const visibleScrolling = ref(false)

const setIsCollapsed = () => (isCollapsed.value = !isCollapsed.value)

/**
 * @description get title of corresponding button and set it as title of sidepanel
 * @param {*} event
 */
function setPanelTitle(title) {
  panelTitle.value = title
}

/**
 *
 * @param {String} htmlIcon
 */
function setPanelIcon(htmlIcon) {
  panelIcon.value = htmlIcon
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
      zoom: 3,
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

    console.log(map.value)

    // add data source
    // try {
    //   await measurements.fetchAPIData(dataURL)
    // } catch (error) {
    //   console.log(error)
    // }

    // measurements.geojson = dataURL
    measurements.geojson = {
      type: 'FeatureCollection',
      name: 'parent_elements',
      crs: { type: 'name', properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' } },
      features: [
        {
          type: 'Feature',
          properties: {
            q: 366.0,
            q_uncertainty: null,
            environment: '[offshore (continental)]',
            corr_HP_flag: null,
            total_depth_MD: null,
            total_depth_TVD: null,
            explo_method: null,
            explo_purpose: null,
            geo_lithology: null,
            ID: 'R24-000001'
          },
          geometry: { type: 'Point', coordinates: [-129.981, 49.615] }
        }
      ]
    }

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
    <div class="column map" ref="mapContainer" @mousemove="updateLatLng">
      <DataLoadingModal />
      <InfoPopup :map="map" />
      <MapLegend />

      <!-- Navigation buttons -->
      <div class="fixed-bottom">
        <CButtonGroup role="group" aria-label="Basic example">
          <CButton
            color="primary"
            v-for="item in navBar.navigationElements"
            :key="item.title"
            panelTitle="{item.title}"
            @click="
              isCollapsed ? setPanelTitle(item.title) : 0,
                setPanelIcon(item.svgElement),
                // toggleSidebar(),
                setIsCollapsed(),
                toggleVisibleScrolling()
            "
            type="button"
            class="btn btn-primary"
            ><div v-html="item.svgElement"></div>
            {{ item.title }}
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
            :icon="panelIcon"
            :map="map"
            @collapse-event="setIsCollapsed()"
            @toggle-event="toggleVisibleScrolling()"
          />
        </COffcanvas>
        <CursorCoordinates :map="map" />
      </div>
    </div>
    <!-- <div class="column chart-panel">
      <RightPanel @close-event="setIsClosed()" :map="map" />
    </div> -->
  </div>
</template>

<style scoped>
.offcanvas {
  --bs-offcanvas-width: 600px;
}
.map-wrap {
  position: absolute;
  width: 100%;
  height: 100%;
}

.map {
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

.chart-panel {
  max-width: 600px;
}

@media all and (min-width: 500px) {
  .map-wrap {
    display: flex;
  }
}
</style>

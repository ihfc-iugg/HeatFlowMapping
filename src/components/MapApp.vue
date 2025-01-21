<script setup>
// vue
import { onMounted, onUnmounted, ref } from 'vue'

// components
import { CButton, CButtonGroup, COffcanvas, CRow, CSpinner } from '@coreui/bootstrap-vue'
import CursorCoordinates from './map/CursorCoordinates.vue'
import DataLoadingModal from './map/DataLoadingModal.vue'
import LeftPanel from './left-panel/LeftPanel.vue'
import InfoPopup from './map/InfoPopup.vue'
import MapLegend from './map/MapLegend.vue'
// import RightPanel from '@/components/right-panel/RightPanel.vue'

import { useMapStore } from '@/store/map.js'
import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useMapControlsStore } from '@/store/mapControls'
import { useSettingsStore } from '@/store/settings'
// import { useBaseMapsStore } from '@/store/baseMaps'
// import { useMapAppConfig } from '@/store/mapAppConfig'
import { useNavigationBarStore } from '@/store/navigationBar'
import { useGHFDBStore } from '@/store/ghfdb'
import schemaURL from '@/assets/data/Heatflow_worldAPI_Hardcoded.yaml'

import dataURL from '@/assets/data/geojsonFromCSV_4.json'

const ROOT_DOMAIN = import.meta.env.VITE_ROOT_API_DOMAIN
// const schemaURL = ROOT_DOMAIN + '/api/v1/schema/'

const schema = schemaURL

const ghfdb = useGHFDBStore()
const mapStore = useMapStore()
const dataSchema = useDataSchemaStore()
dataSchema.fetchAPIDataSchema(schema)
const mapControls = useMapControlsStore()
const settings = useSettingsStore()
// const mapAppConfig = useMapAppConfig()
// mapAppConfig.setElement(document.querySelector('#whfd-mapping'))
// mapAppConfig.setDataURL('dataUrl')
// mapAppConfig.setSchemaURL('schemaUrl')

const mapContainer = ref()
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

onMounted(() => {
  mapStore.setMap(mapContainer.value)

  mapStore.map.once('load', async () => {
    // add controls
    mapStore.map.addControl(mapControls.scale, 'bottom-right')
    mapStore.map.addControl(mapControls.fullscreen, 'top-right')
    mapStore.map.addControl(mapControls.navigation, 'top-right')
    mapStore.map.addControl(mapControls.mapboxDraw)

    console.log(mapStore.map)

    try {
      if (dataURL) {
        ghfdb.geojson = dataURL
        ghfdb.toggleInProcess()
      } else {
        const strValues = await ghfdb.getGhfdbFromAPI('http://127.0.0.1:8000/api/ghfdb')
        ghfdb.json = await ghfdb.csv2JSON(strValues)
        ghfdb.geojson = await ghfdb.json2GeoJSON(ghfdb.json.data, ghfdb.parentProperties)
        ghfdb.toggleInProcess()
      }
    } catch (error) {
      console.log('Error in fetching GHFDB')
      console.log(error)
    }

    mapStore.map.addSource('sites', {
      type: 'geojson',
      data: ghfdb.geojson
      // data: measurements.geojson
      // data: sites.value,
    })

    // add data layer
    mapStore.map.addLayer({
      id: 'sites',
      type: 'circle',
      source: 'sites',
      paint: {
        'circle-color': [
          'case',
          ['boolean', ['feature-state', 'hover'], false],
          '#ff0000',
          settings.circleColor
        ],
        'circle-radius': settings.circleRadius,
        'circle-stroke-width': 0.5,
        'circle-stroke-color': '#a1dab4'
      },
      layout: {
        visibility: 'visible'
      }
    })

    console.log(mapStore.map.getSource('sites'))
  })
}),
  onUnmounted(() => {
    mapStore.map?.remove()
  })

function toggleVisibleScrolling() {
  visibleScrolling.value = !visibleScrolling.value
}
</script>

<template>
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong>This is a demo service. It shows a sub set of the Global Heat Flow Database</strong>
    Please provide your feedback here (nikolas.ott(at)tu-dresden.de)
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  <div class="map-wrap">
    <div class="column map" ref="mapContainer" @mousemove="updateLatLng">
      <DataLoadingModal />
      <InfoPopup :map="mapStore.map" />
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
              (isCollapsed ? setPanelTitle(item.title) : 0,
              setPanelIcon(item.svgElement),
              // toggleSidebar(),
              setIsCollapsed(),
              toggleVisibleScrolling())
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
            :map="mapStore.map"
            @collapse-event="setIsCollapsed()"
            @toggle-event="toggleVisibleScrolling()"
          />
        </COffcanvas>
        <CursorCoordinates :map="mapStore.map" />
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

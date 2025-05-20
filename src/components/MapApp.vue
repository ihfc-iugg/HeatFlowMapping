<script setup>
// vue
import { onMounted, onUnmounted, ref } from 'vue'

// components
import { CButton, CButtonGroup, COffcanvas } from '@coreui/bootstrap-vue'
import MapNavBarBtnGroup from './map/MapNavBarBtnGroup.vue'
import MapCursorCoordinates from './map/MapCursorCoordinates.vue'
import MapDataLoadingModal from './map/MapDataLoadingModal.vue'
import LeftPanel from './left-panel/LeftPanel.vue'
import MapInfoPopup from './map/MapInfoPopup.vue'
import MapLegend from './map/MapLegend.vue'

import { useMapStore } from '@/store/map.js'
import { useDataSchemaStore } from '@/store/dataSchema.js'
import { useMapControlsStore } from '@/store/mapControls'
import { useSettingsStore } from '@/store/settings'
import { useDrawStore } from '@/store/draw'
// import { useBaseMapsStore } from '@/store/baseMaps'
// import { useMapAppConfig } from '@/store/mapAppConfig'
import { useNavigationBarStore } from '@/store/navigationBar'
import { useGHFDBStore } from '@/store/ghfdb'
import schemaURL from '@/assets/data/Heatflow_worldAPI_Hardcoded.yaml'

// import dataURL from '@/assets/data/IHFC_2024_GHFDB_45_samples.csv'
// import dataURL from '@/assets/data/parent_elements.json'
// import dataURL from '@/assets/data/geojsonFromCSV.json'

const ROOT_DOMAIN = import.meta.env.VITE_ROOT_API_DOMAIN
// const schemaURL = ROOT_DOMAIN + '/api/v1/schema/'

const ghfdb = useGHFDBStore()
const mapStore = useMapStore()
const dataSchema = useDataSchemaStore()
dataSchema.fetchAPIDataSchema(schemaURL)
const mapControls = useMapControlsStore()
const settings = useSettingsStore()
const draw = useDrawStore()
// const mapAppConfig = useMapAppConfig()
// mapAppConfig.setElement(document.querySelector('#whfd-mapping'))
// mapAppConfig.setDataURL('dataUrl')
// mapAppConfig.setSchemaURL('schemaUrl')

const mapContainer = ref()
const navBar = useNavigationBarStore()

onMounted(() => {
  mapStore.setMap(mapContainer.value)

  mapStore.map.once('load', async () => {
    // add controls
    mapStore.map.addControl(mapControls.scale, 'bottom-right')
    mapStore.map.addControl(mapControls.fullscreen, 'top-right')
    mapStore.map.addControl(mapControls.navigation, 'top-right')
    mapStore.map.addControl(mapControls.featureInfo, 'top-right')
    draw.setDraw(mapStore.map)
    // console.log('access controls')
    // console.log(mapControls.featureInfo)

    try {
      // ghfdb.toggleInProcess()
      // // const strValues = null

      // const strValues = await ghfdb.getGhfdbFromAPI('@/assets/data/IHFC_2024_GHFDB_45_samples.csv')
      // const strValues = await ghfdb.getGhfdbFromAPI('http://127.0.0.1:8000/api/ghfdb')

      const strValues = await ghfdb.getGhfdbFromAPI(
        'https://raw.githubusercontent.com/ihfc-iugg/ghfdb-portal/14959d8593724396c9d5b3a89a4427394907cd06/assets/ghfdb/IHFC_2024_GHFDB.csv'
      )

      ghfdb.json = await ghfdb.csv2JSON(strValues)
      ghfdb.geojson = await ghfdb.json2GeoJSON(ghfdb.json.data, ghfdb.parentProperties)
      ghfdb.toggleInProcess()
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
</script>

<template>
  <div
    class="column map"
    style="background-color: black"
    ref="mapContainer"
    @mousemove="updateLatLng"
  >
    <MapDataLoadingModal />
    <MapInfoPopup />
    <MapLegend />

    <!-- Navigation buttons -->
    <div class="fixed-bottom">
      <MapNavBarBtnGroup />
      <MapCursorCoordinates />
    </div>
  </div>

  <COffcanvas :backdrop="false" placement="start" scroll :visible="navBar.visibleScrolling">
    <LeftPanel />
  </COffcanvas>
</template>

<style scoped>
.offcanvas {
  overflow-y: auto; /* Enable scrolling inside the offcanvas if content is too large */
}

/* Map container */
.map {
  position: absolute;
  height: 100%; /* Adjust to take up the full height minus navbar height */
  width: 100%;
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
  .map {
    display: flex;
  }
}
</style>

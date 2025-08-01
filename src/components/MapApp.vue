<script setup>
// vue
import { onMounted, onUnmounted, ref } from 'vue'

// components
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
import { useGHFDBStore } from '@/store/ghfdb'
import { useIndexDBStore } from '@/store/indexDBTools'
import { useHFModelsStore } from '@/store/hfModels'
import schemaURL from '@/assets/data/Heatflow_worldAPI_Hardcoded.yaml'

const ROOT_DOMAIN = import.meta.env.VITE_ROOT_API_DOMAIN

const ghfdb = useGHFDBStore()
const mapStore = useMapStore()
const dataSchema = useDataSchemaStore()
const mapControls = useMapControlsStore()
const settings = useSettingsStore()
const draw = useDrawStore()
const indexdb = useIndexDBStore()
const hfModels = useHFModelsStore()

const mapContainer = ref()

/***
 * @description: Handles the initial data fetching and processing for the GHFDB and the schema file
 */
async function initialDataHandling() {
  // TODO: store data schema in IndexedDB
  dataSchema.fetchAPIDataSchema(schemaURL)
  try {
    indexdb.removeData('ghfdbDatabase', 'ghfdbStore', 'ghfdb')
    let storedData = await indexdb.getData('ghfdbDatabase', 'ghfdbStore', 'ghfdb_release_2024')

    if (!storedData) {
      indexdb.hasGHFDB = false
      const strValues = await ghfdb.getGhfdbFromAPI(
        'https://raw.githubusercontent.com/ihfc-iugg/ghfdb-portal/refs/heads/main/assets/ghfdb/IHFC_2024_GHFDB.zip'
      )
      ghfdb.json = await ghfdb.csv2JSON(strValues)
      ghfdb.geojson = await ghfdb.json2GeoJSON(ghfdb.json.data, ghfdb.parentProperties)
      await indexdb.saveData('ghfdbDatabase', 'ghfdbStore', {
        id: 'ghfdb_release_2024',
        release: 2024, // store version of release to query if data in DB is up to date
        data: JSON.parse(JSON.stringify(ghfdb.geojson))
      })

      console.log('GeoJSON data saved to IndexedDB')
    } else {
      indexdb.hasGHFDB = true
      ghfdb.geojson = storedData.data
      console.log('GeoJSON data retrieved from IndexedDB')
    }

    ghfdb.toggleInProcess()
    ghfdb.addGhfdbToMap(mapStore.map, ghfdb.geojson, settings.circleColor, settings.circleRadius)

    hfModels.addModelsToMap(mapStore.map)
  } catch (error) {
    console.error('Error handling GeoJSON data:', error)
  }
}

onMounted(() => {
  mapStore.setMap(mapContainer.value)

  mapStore.map.once('load', async () => {
    // add controls
    mapStore.map.addControl(mapControls.scale, 'top-right')
    mapStore.map.addControl(mapControls.featureInfo, 'top-right')
    mapStore.map.addControl(mapControls.fullscreen, 'top-right')
    mapStore.map.addControl(mapControls.navigation, 'top-right')
    mapStore.map.addControl(mapControls.globe, 'top-right')
    draw.setDraw(mapStore.map)
    initialDataHandling()
  })
}),
  onUnmounted(() => {
    mapStore.map?.remove()
  })
</script>

<template>
  <div class="wrapper vstack w-100 vh-100">
    <div class="column map flex-grow-1" style="background-color: black" ref="mapContainer">
      <MapDataLoadingModal />
      <MapInfoPopup />
      <MapLegend />
      <MapCursorCoordinates />
    </div>
    <MapNavBarBtnGroup />
  </div>
  <div
    class="offcanvas offcanvas-start"
    data-bs-scroll="true"
    data-bs-backdrop="false"
    tabindex="-1"
    id="offcanvasPanel"
    aria-labelledby="offcanvasPanelLabel"
  >
    <LeftPanel />
  </div>
</template>

<style scoped>
.offcanvas {
  overflow-y: auto; /* Enable scrolling inside the offcanvas if content is too large */
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

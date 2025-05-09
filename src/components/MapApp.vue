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
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    <strong
      >This is a demo service. It shows the Global Heat Flow Database Release 2024 and makes it
      explorable.</strong
    >
    Please provide your feedback here
    <a href="https://github.com/WorldHeatFlowDatabase/HeatFlowMapping/issues"
      >HeatFlowMapping/issues</a
    >
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
  <div class="content">
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand navbar-brand-image ms-5" title="Back to homepage" href="/">
          <img
            class="navbar-brand-logo-normal"
            src="@/assets/img/WHFSProject_final_large.png"
            alt="heatflow.X logo"
            width="127px"
            height=""
          />
        </a>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
          <ul class="navbar-nav ms-auto me-5">
            <li class="nav-item">
              <a
                id="nav-item-2"
                href="https://www.heatflow.world/"
                class="nav-link nav-link-main"
                aria-current="false"
              >
                <span class="nav-link-text fw-bold"> Home </span>
              </a>

              <div class="dropdown-menu" bis_skin_checked="1"></div>
            </li>

            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle fw-bold"
                href="https://www.heatflow.world/about"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                About
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/about/mission"
                    >Mission</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/about/team">Team</a>
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/about/project"
                    >Project</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/about/partners"
                    >Partners</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/about/heat-flow"
                    >What is heat flow?</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/about/funding"
                    >Funding</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/about/support-us"
                    >Support us</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/about/how-to-cite"
                    >How to cite</a
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <a
                class="nav-link active fw-bold"
                aria-current="page"
                href="http://138.68.69.242:5000/"
                >Explore</a
              >
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle fw-bold"
                href="https://www.heatflow.world/about"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Data Access
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/data/catalogue"
                    >Data catalogue</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/data/download"
                    >Download</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/data/api">API Access</a>
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/data/background"
                    >Background data</a
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle fw-bold"
                href="https://www.heatflow.world/about"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Contribute
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a
                    class="dropdown-item"
                    href="https://www.heatflow.world/contribute/data-submission-guidelines"
                    >Data submission guidlines</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/contribute/metadata"
                    >Metadata format</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/contribute/upload-data"
                    >Upload data</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="https://www.heatflow.world/contribute/generate-data-publication"
                    >Generate data publication</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="https://www.heatflow.world/contribute/upload-literature"
                    >Contribute literature</a
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item dropdown">
              <a
                class="nav-link dropdown-toggle fw-bold"
                href="https://www.heatflow.world/about"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Resources
              </a>
              <ul class="dropdown-menu">
                <li>
                  <a
                    class="dropdown-item"
                    href="https://www.heatflow.world/resources/heat-flow-library"
                    >Heat flow library</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="https://www.heatflow.world/resources/missing-literature"
                    >Missing literature</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/resources/code-library"
                    >Code library</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/resources/tutorials"
                    >Tutorials</a
                  >
                </li>
                <li>
                  <a
                    class="dropdown-item"
                    href="https://www.heatflow.world/resources/features-documentation"
                    >Features - Documentation</a
                  >
                </li>
                <li>
                  <a class="dropdown-item" href="https://www.heatflow.world/resources/help-faq"
                    >Help - FAQ</a
                  >
                </li>
              </ul>
            </li>
            <li class="nav-item">
              <a
                class="nav-link active fw-bold"
                aria-current="page"
                href="https://www.heatflow.world/learning"
                >Learning</a
              >
            </li>
          </ul>
        </div>
      </div>
    </nav>
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
  </div>
  <COffcanvas :backdrop="false" placement="start" scroll :visible="navBar.visibleScrolling">
    <LeftPanel />
  </COffcanvas>
</template>

<style scoped>
.offcanvas {
  overflow-y: auto; /* Enable scrolling inside the offcanvas if content is too large */
}

/* Make the navbar fixed at the top */
.navbar {
  width: 100%;
  z-index: 1000; /* Ensure navbar stays on top */
}

/* Fix navbar height */
.navbar.navbar-expand-lg {
  height: 92px; /* Adjust to the height of your navbar */
}

/* Content area takes the full height */
.content {
  position: relative;
  height: 100vh; /* Viewport height */
  width: 100%;
}

/* Map container */
.map {
  position: absolute; /* Absolute position to ensure it's below the navbar */
  top: 92px; /* Adjust based on the navbar height */
  left: 0;
  right: 0;
  bottom: 0;
  height: calc(100vh - 92px); /* Adjust to take up the full height minus navbar height */
  width: 100%;
  background-color: #eaeaea; /* Default background color */
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

<script setup>
import { onMounted, ref, watch } from 'vue'
import { newPlot } from 'plotly.js-dist'
import Card from '@/core/components/Card.vue'
import AboutBootstrappingCardBody from './AboutBootstrappingCardBody.vue'
import Popup from './Popup.vue'
import AccordionItem from '@/core/components/AccordionItem.vue'
import NavBarButtonGroup from './NavBarButtonGroup.vue'
import PointDrawToolboxCardBody from './PointDrawToolboxCardBody.vue'
import GlobalDataFormCheck from './GlobalDataFormCheck.vue'
import ParameterTable from './ParameterTable.vue'
import RunCalculationBtn from './RunCalculationBtn.vue'
import { useTemperatureProfileStore } from '../stores/temperatureProfile.js'
import { useTemperatureProfile } from '@/core/composables/useTemperatureProfile.js'
import { useApplicationStore } from '@/core/stores/app.js'
import { useWMS } from '@/core/composables/useWMS.js'
import { useBootstrapping } from '@/core/composables/useBootstrapping.js'
import { CRUST1 } from '@/core/constants/externalGeoData.js'
import { COLORS } from '@/core/constants/temperatureProfile.js'

const { generatePopup } = useTemperatureProfile()
const { generatePlotPamareter } = useTemperatureProfile()
const { getFeatureInfo } = useWMS()
const { bootstrapping } = useBootstrapping()

const tempProfile = useTemperatureProfileStore()
const app = useApplicationStore()

const popup = ref(null)
const wmsUrl = ref(CRUST1.general.wmsUrl)
const crs = ref('EPSG:4326')
const layers = ref([
  CRUST1.ice,
  CRUST1.water,
  CRUST1.upper_crust,
  CRUST1.middle_crust,
  CRUST1.lower_crust
])

function handleRunCalculation(event) {
  if (popup) {
    popup.value = null
  }
  tempProfile.layers = bootstrapping(tempProfile.layers, 20, tempProfile.nearestPoint.properties.q)
  const coordinates = tempProfile.geoPoint.geometry.coordinates
  popup.value = generatePopup(coordinates, app.map)

  const [plotData, temperatureUncertainty, layout] = generatePlotPamareter(
    tempProfile.layers,
    20,
    5
  )
  setTimeout(() => newPlot('tempPlot', [plotData, temperatureUncertainty], layout), 1)

  popup.value.addTo(app.map)

  tempProfile.toggleOpenPopup()

  popup.value.on('open', (event) => {
    const popupInstance = event.target
    const coordinates = popupInstance.getLngLat()
  })
}

watch(
  () => tempProfile.wmsParameterLoaded,
  async () => {
    if (!tempProfile.useCrust1) {
      tempProfile.addLayer(null, null, null, null, 2.3, 100, 2, 'Layer 1')
      tempProfile.addLayer(null, null, null, null, 5, 200, 3, 'Layer 2')
      tempProfile.addLayer(null, null, null, null, 1.4, 300, 1.3, 'Layer 3')
      tempProfile.addLayer(null, null, null, null, 1.5, 200, 0.8, 'Layer 4')
    } else {
      let mapBoundsSW = tempProfile.mapBoundsSW
      let mapBoundsNE = tempProfile.mapBoundsNE
      let mapCanvas = tempProfile.mapCanvas
      let point = tempProfile.screenPoint
      for (const [ix, layer] of layers.value.entries()) {
        const featureCollection = await getFeatureInfo(
          wmsUrl.value,
          layer.wmsLayer,
          '',
          crs.value,
          mapBoundsSW,
          mapBoundsNE,
          mapCanvas,
          point
        )

        const dZ = featureCollection.features[0].properties.GRAY_INDEX * 1000 //km to m
        tempProfile.addLayer(null, null, null, null, 2.3, dZ, 2, layer.id, COLORS[ix])
      }
    }
  }
)
</script>

<template>
  <AccordionItem id="analysis-accordion-item" title="Bootstrap Subsurface Temperature">
    <NavBarButtonGroup />

    <div v-if="tempProfile.activeTab === 'calculationSetup'">
      <Card :id="parameterToolBox" :title="'Calculation Setup'">
        <Card>
          <PointDrawToolboxCardBody />
        </Card>
        <Card>
          <GlobalDataFormCheck />
        </Card>
      </Card>
      <Card v-if="tempProfile.geoPoint" :id="parameterTable" :title="'Parameter Table'">
        <ParameterTable />
      </Card>
      <RunCalculationBtn @run-calculation="handleRunCalculation" />
    </div>

    <Card
      v-if="tempProfile.activeTab === 'aboutBootstrapping'"
      :id="aboutBootstrapping"
      :title="'About Bootstraping'"
    >
      <AboutBootstrappingCardBody />
    </Card>

    <div ref="popupcard" id="popupcard" v-if="tempProfile.openPopup">
      <Teleport to=".maplibregl-popup-content">
        <component :is="Popup" :popup="popup"></component>
      </Teleport>
    </div>
  </AccordionItem>
</template>

<style></style>

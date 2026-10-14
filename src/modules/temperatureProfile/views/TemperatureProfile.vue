<script setup>
import { ref, watch } from 'vue'
import Card from '@/shared/components/Card.vue'
import TabSwitcherButtonGroup from '@/shared/components/TabSwitcherButtonGroup.vue'
import AboutBootstrappingCardBody from '../components/AboutBootstrappingCardBody.vue'
import TemperatureProfilePopupContent from '../components/TemperatureProfilePopupContent.vue'
import AccordionItem from '@/shared/components/AccordionItem.vue'
import PointDrawToolsButtonGroup from '../components/PointDrawToolsButtonGroup.vue'
import GlobalDataFormCheck from '../components/GlobalDataFormCheck.vue'
import ParameterTable from '../components/ParameterTable.vue'
import RunCalculationBtn from '../components/RunCalculationBtn.vue'
import { useTemperatureProfileStore } from '../stores/temperatureProfile.js'
import { useWMS } from '@/shared/composables/useWMS.js'
import { useBootstrapping } from '../composables/useBootstrapping.js'
import { CRUST1 } from '@/shared/constants/externalGeoData.js'
import { COLORS } from '@/shared/constants/temperatureProfile.js'

const { getFeatureInfo } = useWMS()
const { bootstrapping } = useBootstrapping()

const tempProfile = useTemperatureProfileStore()

const wmsUrl = ref(CRUST1.general.wmsUrl)
const crs = ref('EPSG:4326')
const layers = ref([
  CRUST1.ice,
  CRUST1.water,
  CRUST1.upper_crust,
  CRUST1.middle_crust,
  CRUST1.lower_crust
])

/**
 * @description
 */
function handleRunCalculation() {
  tempProfile.layers = bootstrapping(tempProfile.layers, 20, tempProfile.nearestPoint.properties.q)
  tempProfile.toggleHasPopup()
}

/**
 * @description
 */
function handleDeletedPoint() {
  tempProfile.toggleHasPopup()
}

/**
 * @description
 * @param {string} selectedTab
 */
function handleTabSwitcher(selectedTab) {
  tempProfile.selectedTab = selectedTab
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
  <AccordionItem
    id="analysis-temperature-profile-accordion-item"
    title="Bootstrap Subsurface Temperature"
  >
    <TabSwitcherButtonGroup
      :id="'temperature-profile'"
      :aria-label="'Tab switcher for temperature profile tool'"
      @update:selected="handleTabSwitcher"
    />

    <div v-if="tempProfile.selectedTab === 'settings'">
      <Card :id="'temp-profile-settings'" :title="'Calculation Setup'">
        <Card>
          <PointDrawToolsButtonGroup @point-deleted="handleDeletedPoint" />
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
      v-if="tempProfile.selectedTab === 'info'"
      :id="aboutBootstrapping"
      :title="'About Bootstraping'"
    >
      <AboutBootstrappingCardBody />
    </Card>

    <div id="tempprofilepopupcard" v-if="tempProfile.hasPopup">
      <TemperatureProfilePopupContent :has-popup="tempProfile.hasPopup" />
    </div>
  </AccordionItem>
</template>

<style></style>

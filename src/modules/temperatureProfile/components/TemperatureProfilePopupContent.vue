<script setup>
import { defineProps, onMounted, onUnmounted, ref, watch } from 'vue'
import { newPlot } from 'plotly.js-dist'
import Card from '@/shared/components/Card.vue'
import AddLayerBtn from './AddLayerBtn.vue'
import RemoveLastLayerBtn from './RemoveLastLayerBtn.vue'
import { useApplicationStore } from '@/core/stores/app.js'
import { useTemperatureProfileStore } from '../stores/temperatureProfile'
import { useMapLibrePopup } from '@/shared/composables/useMapLibrePopup.js'
import { useTemperatureProfile } from '../composables/useTemperatureProfile.js'

const { generatePopup } = useMapLibrePopup()
const { generatePlotPamareter } = useTemperatureProfile()

const app = useApplicationStore()
const tempProfile = useTemperatureProfileStore()
const tempProfilePopup = ref(null)

const props = defineProps({
  hasPopup: { type: Boolean, required: true }
})

onMounted(() => {
  if (!tempProfile.geoPoint) return
  if (tempProfilePopup.value) {
    tempProfilePopup.value = null
  }
  const coordinates = tempProfile.geoPoint.geometry.coordinates
  tempProfilePopup.value = generatePopup(coordinates, app.map)

  tempProfilePopup.value.on('open', async (event) => {
    const [plotData, temperatureUncertainty, layout] = await generatePlotPamareter(
      tempProfile.layers,
      20,
      5
    )
    newPlot('tempPlot', [plotData, temperatureUncertainty], layout)
  })

  tempProfilePopup.value.on('close', (event) => {
    tempProfile.toggleHasPopup()
    tempProfilePopup.value = null
  })

  tempProfilePopup.value.addTo(app.map)
})

onUnmounted(() => {
  if (tempProfilePopup.value) {
    tempProfilePopup.value.remove()
    tempProfilePopup.value = null
  }
})
</script>

<template>
  <Teleport v-if="tempProfilePopup" to=".maplibregl-popup-content">
    <Card :id="'temp-profile-card'" :title="'Temperature Profile'">
      <div id="tempPlot" style="width: fit-content"></div>
      <div v-if="tempProfile.parameterSource === 'customParameter'" class="container text-center">
        <div class="row justify-content-md-center">
          <div class="col">
            <AddLayerBtn />
          </div>
          <div class="col">
            <RemoveLastLayerBtn />
          </div>
        </div>
      </div>
    </Card>
  </Teleport>
</template>
<style></style>

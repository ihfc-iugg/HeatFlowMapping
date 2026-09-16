<script setup>
import { useTemplateRef, defineProps, ref } from 'vue'
import Card from '@/core/components/Card.vue'
import AddLayerBtn from './AddLayerBtn.vue'
import RemoveLastLayerBtn from './RemoveLastLayerBtn.vue'
import { useApplicationStore } from '@/core/stores/app'
import { useTemperatureProfileStore } from '../stores/temperatureProfile'
import { Popup } from 'maplibre-gl'

const app = useApplicationStore()
const tempProfile = useTemperatureProfileStore()
const tempPopupEl = useTemplateRef('tempPopup')
const tempPlotEl = useTemplateRef('tempPlot')
const tempPopupML = ref(null)
const props = defineProps({ popup: { type: Popup, require: true } })

// props.popup.on('open', () => {
//   console.log('popup was ')
//   const coordinates = tempProfile.geoPoint.geometry.coordinates
//   app.map.flyTo({ center: coordinates })
// })

props.popup.on('close', (event) => {
  tempProfile.openPopup = false
})
</script>

<template>
  <Card ref="tempPopup" :id="'temp-profile-card'" :title="'Temperature Profile'">
    <div ref="tempPlot" id="tempPlot" style="width: fit-content"></div>
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
</template>
<style></style>

<script setup>
import { onMounted, ref, useTemplateRef } from 'vue'
import Card from '@/shared/components/Card.vue'
import { useApplicationStore } from '@/core/stores/app'
import { useFeatureInfoStore } from '../stores/featureInfoPopup'

const featureInfo = useFeatureInfoStore()
const app = useApplicationStore()
const selectedPoint = ref(null)
const featureInfoCard = useTemplateRef('featureInfoPopup')
const testFlag = ref(false)

onMounted(() => {
  const featureInfoControl = app.controls.get('featureInfo')

  featureInfoControl.onHasPopupChanged((newHasPopup) => {
    featureInfo.hasPopup = newHasPopup
    console.log(featureInfo.hasPopup)
  })
  featureInfoControl.onSelectedPointChanged((newPoint) => {
    testFlag.value = true
    selectedPoint.value = newPoint
    console.log('newPoint')
    console.log(newPoint)
    featureInfoControl.getPopup()
    console.log('wann diese?')
  })
})
</script>

<template>
  <Teleport v-if="featureInfo.hasPopup" to=".maplibregl-popup-content">
    <Card :id="'feature-info-popup-card'" :title="'About ' + selectedPoint.properties.ID">
      <table class="table table-sm">
        <thead>
          <tr>
            <th scope="col">Attribute</th>
            <th scope="col">Value</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(value, key) in selectedPoint.properties" :key="key">
            <td>{{ key }}</td>
            <td>{{ value }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </Teleport>
</template>

<style></style>

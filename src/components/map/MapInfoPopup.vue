<script setup>
import { onMounted, ref, watch } from 'vue'
import { useMapControlsStore } from '@/store/mapControls'

const mapControls = useMapControlsStore()

const popupInfoContent = ref(null)
const hasPopup = ref(false)
const selectedPnt = ref(null)

onMounted(() => {
  popupInfoContent.value = document.getElementById('infoPopup')

  // Listen for changes to the hasPopup state in the JS class
  mapControls.featureInfo.onHasPopupChanged((newHasPopup) => {
    hasPopup.value = newHasPopup // Update the Vue ref
  })
  mapControls.featureInfo.onSelectedPointChanged((newPoint) => {
    selectedPnt.value = newPoint // Update the Vue ref
  })
})

/***
 * @description Watches the hasPopup state and updates the popup content accordingly.
 */
watch(hasPopup, (newValue) => {
  if (newValue) {
    mapControls.featureInfo.getPopup().setDOMContent(popupInfoContent.value)
  } else {
  }
})
</script>

<template>
  <div class="infoPopup" id="infoPopup">
    <table v-if="selectedPnt" class="table table-hover table-sm">
      <thead>
        <tr>
          <th scope="col">Property</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="key in Object.keys(selectedPnt.properties)" :key="key">
          <th scope="row">{{ key }}</th>
          <td>{{ selectedPnt.properties[key] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped></style>

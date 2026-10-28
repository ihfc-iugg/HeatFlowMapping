<script setup>
import { defineProps, ref, onMounted, onUnmounted } from 'vue'
import { midpoint, destination, center } from '@turf/turf'
import { newPlot } from 'plotly.js-dist'
import Card from '@/shared/components/Card.vue'
import { useApplicationStore } from '@/core/stores/app'
import { useCrossSectionStore } from '../stores/crossSection'
import { useCrossSection } from '../composables/useCrossSection.js'
import { calculateZoomDelta } from '../service'
import { generatePopup } from '@/shared/utils/map/maplibregl'

const { generatePlotPamareter } = useCrossSection()

const app = useApplicationStore()
const crossSection = useCrossSectionStore()
const crossSectionPopup = ref(null)

const props = defineProps({
  hasPopup: { type: Boolean, required: true }
})

onMounted(() => {
  if (!crossSection.lineString) return
  if (crossSectionPopup.value) {
    crossSectionPopup.value = null
  }

  const lineMidPoint = midpoint(crossSection.startPnt, crossSection.endPnt)
  const popupPosition = destination(
    lineMidPoint,
    crossSection.lineOffset,
    crossSection.bearing - 90,
    {
      unit: crossSection.unit
    }
  )
  crossSectionPopup.value = generatePopup(popupPosition.geometry.coordinates, app.map)

  crossSectionPopup.value.on('open', async (event) => {
    const [plotData, offsetTrace, layout] = await generatePlotPamareter(
      crossSection.orderedPntsWithinBBox,
      crossSection.property
    )
    newPlot('crossSectionPlot', [plotData, offsetTrace], layout)

    const clientRect = event.target.getElement().getBoundingClientRect()
    const popupWidth = clientRect.width
    const popupHeight = clientRect.height
    const zoomDelta = calculateZoomDelta(app.map, crossSection.lineString, popupWidth)

    app.map.easeTo({
      bearing: crossSection.bearing - 90,
      duration: 600,
      essential: true
    })

    app.map.easeTo({
      center: center(crossSection.lineString).geometry.coordinates,
      padding: {
        top: 40 + popupHeight,
        bottom: 40
      },
      zoom: app.map.getZoom() + zoomDelta,
      bearing: crossSection.bearing - 90,
      duration: 800,
      essential: true
    })
  })

  crossSectionPopup.value.on('close', (event) => {
    crossSection.toggleHasPopup()
    crossSectionPopup.value = null
    app.map.easeTo({ bearing: 0 })
  })

  crossSectionPopup.value.addTo(app.map)
})

onUnmounted(() => {
  if (crossSectionPopup.value) {
    crossSectionPopup.value.remove()
    crossSectionPopup.value = null
  }
})
</script>

<template>
  <Teleport v-if="crossSectionPopup" to=".maplibregl-popup-content">
    <Card :id="'cross-section-popup-card'" :title="'Cross Section'">
      <div id="crossSectionPlot" style="width: fit-content"></div>
    </Card>
  </Teleport>
</template>
<style></style>

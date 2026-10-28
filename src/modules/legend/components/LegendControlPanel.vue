Map Legend
<script setup>
import { onMounted } from 'vue'
import { useApplicationStore } from '@/core/stores/app'
import { useLegendStore } from '../stores/legend'
import Card from '@/shared/components/Card.vue'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase'

const app = useApplicationStore()
const legend = useLegendStore()

onMounted(() => {
  const legendControl = app.controls.get('legend')

  legendControl.onOpen((isOpen) => {
    legend.isOpen = isOpen
    legend.paintProperty = app.map.getPaintProperty(GHFDB.r2024.id, 'circle-color')
  })
})
</script>

<template>
  <Teleport
    v-if="legend.isOpen"
    to="#legend-control-panel"
    id="legend-control-panel-card"
    class="position-absolute bottom-0 start-50 translate-middle-x mb-3 bg-primary"
  >
    <Card :id="'legend-controls-card'" :title="'Legend'">
      <table class="table table-borderless table-sm w-auto">
        <tbody>
          <!-- TODO: v-for over array of paintpropertys, td1 = color; td2=value -->
          <tr v-for="value in legend.legendClasses">
            <td class="text-center">
              <svg class="m-1 rounded-pill" width="20" height="10">
                <rect :style="{ fill: value.color }" width="20" height="20"></rect>
              </svg>
            </td>
            <td>{{ value.label }}</td>
          </tr>
        </tbody>
      </table>
    </Card>
  </Teleport>
</template>

<style scoped></style>

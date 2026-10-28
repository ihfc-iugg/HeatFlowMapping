import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { extractProperty, parseExpression } from '@/shared/utils/map/styling/parsePaintProperty'
import { getRange, aggregateValues } from '@/shared/utils/ghfdb/properties'
import { useApplicationStore } from '@/core/stores/app'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase'

export const useLegendStore = defineStore('legend', () => {
  const app = useApplicationStore()
  const isOpen = ref(false)
  const paintProperty = computed(() => {
    return app.map.getPaintProperty(GHFDB.r2024.id, 'circle-color')
  })
  const selectedProperty = computed(() => {
    return extractProperty(paintProperty.value)
  })
  const range = computed(() => {
    const values = aggregateValues(app.geojson, selectedProperty.value)
    return getRange(values)
  })
  const legendClasses = computed(() => {
    if (paintProperty) return parseExpression(paintProperty.value, app.geojson).classes
  })

  return { isOpen, paintProperty, selectedProperty, range, legendClasses }
})

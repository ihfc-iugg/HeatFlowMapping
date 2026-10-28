import { defineStore, storeToRefs } from 'pinia'
import { computed, ref, watch } from 'vue'
import { usePanelSwitcherStore } from '@/modules/panelSwitcher/stores/panelSwitcher'
import { useSchemaStore } from './schema'
import { useMapStore } from '@/modules/map/stores/map'
import { useDrawStore } from './draw'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase'

export const useApplicationStore = defineStore(
  'Gloabl states related to the entire application',
  () => {
    const schema = useSchemaStore()
    const panelSwitcher = usePanelSwitcherStore()
    const mapStore = useMapStore()
    const drawStore = useDrawStore()

    const geojson = ref(null)
    const map = computed(() => mapStore.map)
    const dataSchema = computed(() => schema.data)
    const selectedPanel = computed(() => panelSwitcher.selected) // set layers as default panel
    const attributeFilter = ref({})
    const spatialFilter = ref({})
    const draw = computed(() => drawStore.tools)
    const controls = ref(null)

    function applyFilter() {
      let expression = ['all']
      for (const [key, value] of Object.entries(attributeFilter.value)) {
        if (value.expression) {
          expression.push(value.expression)
        }
      }
      for (const [key, value] of Object.entries(spatialFilter.value)) {
        if (value.expression) {
          expression.push(value.expression)
        }
      }

      map.value.setFilter(GHFDB.r2024.id, expression)
    }

    watch([attributeFilter.value, spatialFilter.value], () => {
      applyFilter()
    })

    return {
      geojson,
      map,
      dataSchema,
      selectedPanel,
      attributeFilter,
      spatialFilter,
      draw,
      controls
    }
  }
)

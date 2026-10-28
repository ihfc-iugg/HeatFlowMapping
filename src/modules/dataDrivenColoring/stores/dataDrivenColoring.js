// 3. party
import { defineStore } from 'pinia'
import { computed, ref, toRefs } from 'vue'
import colorbrewer from 'colorbrewer'

// stores composables
import { useColorbrewer } from '../composables/useColorbrewer'
import { aggregateValues } from '@/shared/utils/ghfdb/properties'
import { useApplicationStore } from '@/core/stores/app'
import { getRange } from '@/shared/utils/ghfdb/properties'

// constants
import { CLASSIFIER } from '@/shared/constants/classificationMethods'
import { NATUREOFDATA } from '@/shared/constants/colorBrewer'

export const useDataDrivenColoringStore = defineStore('Data driven coloring', () => {
  const { getSchemaColors } = useColorbrewer()
  const app = useApplicationStore()

  const property = ref('q')
  const dataType = ref('number')
  const nrOfClasses = ref(3)
  const selectedMethod = ref(CLASSIFIER.quantil)
  const selectedNatureOfData = ref(NATUREOFDATA[0].id)
  const selectedColorSchema = ref(colorbrewer.schemeGroups[selectedNatureOfData.value][0])
  const colors = computed(() => getSchemaColors(selectedColorSchema.value, nrOfClasses.value))
  const values = computed(() => {
    if (dataType.value === 'number')
      return aggregateValues(app.geojson, property.value).filter(Boolean)
    else return null
  })
  const range = computed(() => {
    if (values.value) return getRange(values.value)
  })
  // const max = computed(() => {
  //   if (values.value) return Math.max.apply(null, values.value)
  // })

  return {
    property,
    dataType,
    nrOfClasses,
    selectedMethod,
    selectedNatureOfData,
    selectedColorSchema,
    colors,
    values,
    range
  }
})

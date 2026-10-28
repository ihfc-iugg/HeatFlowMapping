import { buildPaintProperty } from '@/shared/utils/map/styling/buildPaintProerty'
import { GHFDB } from '@/shared/constants/globalHeatFlowDatabase'
import { useDataDrivenColoringStore } from '../stores/dataDrivenColoring'
import { useApplicationStore } from '@/core/stores/app'

export function useLayerColoring() {
  const dataDriven = useDataDrivenColoringStore()
  const app = useApplicationStore()

  function applyColoringLogic(map, paintPropertyObserver) {
    const config = {
      dataType: dataDriven.dataType,
      property: dataDriven.property,
      nrOfClasses: dataDriven.nrOfClasses,
      method: dataDriven.selectedMethod.name,
      colors: dataDriven.colors,
      dataSchema: app.dataSchema
    }

    if (dataDriven.dataType === 'number') {
      config['values'] = dataDriven.values
      config['min'] = dataDriven.range.min
      config['max'] = dataDriven.range.max
    }

    const paintProperty = buildPaintProperty(config)

    if (!paintProperty) {
      console.warn('No paint property built for dataType:', styling.dataType)
      return null
    }

    map.setPaintProperty(GHFDB.r2024.id, 'circle-color', paintProperty)
    // paintPropertyObserver.notify(paintProperty)

    return paintProperty
  }

  return { applyColoringLogic }
}

import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { calculateOrientedBBox } from '@/shared/utils/geo/orientedBBox'
import { pointsWithinPolygon, point } from '@turf/turf'
import { bearing as bearingTurfJS } from '@turf/turf'
import { useApplicationStore } from '@/core/stores/app'
import { extractIds, orderPointsInBBox } from '../service'

export const useCrossSectionStore = defineStore('Cross Section Store', () => {
  const app = useApplicationStore()

  const selectedTab = ref('settings') // default
  const lineString = ref(null)
  const lineOffset = ref(100)
  const unit = ref('km')
  const property = ref('q')
  const orientedBBoxId = ref('orientedBBox')
  const orientedBBoxLabelId = ref('orientedBBoxLabel')
  const hasPopup = ref(false)

  const startPnt = computed(() => {
    if (lineString.value) return point(lineString.value.geometry.coordinates[0])
  })
  const endPnt = computed(() => {
    if (lineString.value) return point(lineString.value.geometry.coordinates[1])
  })

  const bearing = computed(() => {
    if (startPnt.value && endPnt.value) return bearingTurfJS(startPnt.value, endPnt.value)
  })

  /***
   * @description
   * @returns {Object} GeoJSON Polygon Feature
   */
  const orientedBBox = computed(() => {
    if ((lineString.value != null) & (lineOffset.value != null) & (unit.value != null)) {
      return calculateOrientedBBox(startPnt.value, endPnt.value, lineOffset.value, {
        units: unit.value
      })
    } else return null
  })

  /**
   * @description
   * @returns {}
   */
  const orderedPntsWithinBBox = computed(() => {
    if (orientedBBox)
      return orderPointsInBBox(app.geojson.features, orientedBBox.value, lineString.value, {
        units: unit.value
      })
  })

  /**
   *
   */
  const idsOfPntWithin = computed(() => {
    return extractIds(orderedPntsWithinBBox.value)
  })

  /**
   * @description
   * @returns {boolean} returns boolean if all neccessery inputs are set to run the calculaiton
   */
  const hasValidinputs = computed(() => {
    return (
      lineString.value !== null &&
      orientedBBox.value !== null &&
      lineOffset.value !== null &&
      lineOffset.value > 0 &&
      lineOffset.value < 500 &&
      property.value !== null
    )
  })

  /**
   *
   */
  function toggleHasPopup() {
    hasPopup.value = false === hasPopup.value ? true : false
  }

  return {
    selectedTab,
    lineString,
    lineOffset,
    unit,
    property,
    hasPopup,
    startPnt,
    endPnt,
    bearing,
    orientedBBox,
    orientedBBoxId,
    orientedBBoxLabelId,
    orderedPntsWithinBBox,
    idsOfPntWithin,
    hasValidinputs,
    toggleHasPopup
  }
})

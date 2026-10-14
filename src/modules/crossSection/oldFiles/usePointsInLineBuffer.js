import { computed, unref } from 'vue'
import { orderPointsInBuffer } from '@/shared/services/geo/lineReferencing'

/**
 * Reactive wrapper around `orderPointsInBuffer`.
 * Accepts refs, getters, or plain values for maximum flexibility.
 *
 * @param {import('vue').Ref<Object[]>|Object[]} points
 * @param {import('vue').Ref<number[]>|number[]} start
 * @param {import('vue').Ref<number[]>|number[]} end
 * @param {import('vue').Ref<number>|number} radius
 * @param {{ units?: string }} [options]
 */
export function useCorridorPoints(points, start, end, radius, options = {}) {
  const orderedPoints = computed(() =>
    orderPointsInBuffer(unref(points) ?? [], unref(start), unref(end), unref(radius), options)
  )

  const totalInCorridor = computed(() => orderedPoints.value.length)
  const firstPoint = computed(() => orderedPoints.value[0] ?? null)
  const lastPoint = computed(() => orderedPoints.value[orderedPoints.value.length - 1] ?? null)

  return { orderedPoints, totalInCorridor, firstPoint, lastPoint }
}

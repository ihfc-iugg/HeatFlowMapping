<script setup>
import { ref, defineProps, onMounted } from 'vue'
import Statistics from 'statistics.js'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const stats = ref(null)

// const distribution = useDistributionStore()
onMounted(() => {
  const dataTable = ref(props.data.filter((n) => n).map((value) => ({ property: value })))
  const columns = ref({
    property: { scale: 'metric' }
  })
  stats.value = new Statistics(dataTable.value, columns.value)
})

/**
 * @description Sets the minimum value from the provided values.
 * @param {Array} data
 */
function min(data) {
  try {
    return Math.min.apply(null, data).toFixed(2)
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description Sets the maximum value from the provided values.
 * @param {Array} data
 */
function max(data) {
  try {
    return Math.max.apply(null, data).toFixed(2)
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description Sets the mean value from the provided values.
 * @param {Array} data
 */
function mean() {
  try {
    return stats.value.arithmeticMean('property').toFixed(2)
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description Sets the standard deviation from the provided values.
 * @param {Array} data
 */
function std() {
  try {
    return stats.value.standardDeviation('property').toFixed(2)
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description Sets the median value from the provided values.
 * @param {Array} data
 */
function median() {
  try {
    return stats.value.median('property').toFixed(2)
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description Sets the skewness from the provided values.
 * @param {Array} data
 */
function skewness() {
  try {
    return stats.value.skewness('property').toFixed(2)
  } catch (error) {
    console.log(error)
  }
}

/**
 * @description Sets the kurtosis from the provided values.
 * @param {Array} data
 */
function kurtosis() {
  try {
    return stats.value.kurtosis('property').toFixed(2)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <tbody>
    <tr>
      <th scope="row">Min</th>
      <td>{{ min(props.data) }}</td>
    </tr>
    <tr>
      <th scope="row">Max</th>
      <td>{{ max(props.data) }}</td>
    </tr>
    <tr v-if="stats">
      <th scope="row">Mean</th>
      <td>{{ mean(props.data) }}</td>
    </tr>
    <tr v-if="stats">
      <th scope="row">Median</th>
      <td>{{ median(props.data) }}</td>
    </tr>
    <tr v-if="stats">
      <th scope="row">Std</th>
      <td>{{ std(props.data) }}</td>
    </tr>
    <tr v-if="stats">
      <th scope="row">Skewness</th>
      <td>{{ skewness(props.data) }}</td>
    </tr>
    <tr v-if="stats">
      <th scope="row">Kurtosis</th>
      <td>{{ kurtosis(props.data) }}</td>
    </tr>
  </tbody>
</template>

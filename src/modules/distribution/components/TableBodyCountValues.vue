<script setup>
import { defineProps } from 'vue'
import InofoSVG from '@/shared/assets/icons/info-circle-bootstrap.svg'

const props = defineProps({ data: { type: Array, required: true } })

/**
 * @description
 * @param {Array} data
 */
function countNull(data) {
  return data.length - data.filter((n) => n).length
}
</script>

<template>
  <tbody>
    <tr>
      <th scope="row">
        Count total
        <CTooltip content="Number of features" placement="right">
          <template #toggler="{ on }">
            <CButton color="secondary" v-on="on">
              <InofoSVG />
            </CButton>
          </template>
        </CTooltip>
      </th>
      <td>{{ props.data.length }}</td>
    </tr>
    <tr>
      <th scope="row">
        Count null
        <CTooltip content="Number of features with no value" placement="right">
          <template #toggler="{ on }">
            <CButton color="secondary" v-on="on">
              <InofoSVG />
            </CButton>
          </template>
        </CTooltip>
      </th>
      <td>{{ countNull(props.data) }}</td>
    </tr>
  </tbody>
</template>

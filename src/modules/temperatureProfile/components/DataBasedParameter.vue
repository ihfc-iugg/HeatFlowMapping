<script setup>
import { midpoint } from '@turf/turf'
import { useTemperatureProfileStore } from '../stores/temperatureProfile'

const tempProfile = useTemperatureProfileStore()
</script>
<template>
  <p v-if="!tempProfile.nearestPoint">
    This panel will be enabled once you place a point where the temperature profile should be
    calculated.
  </p>
  <table class="table">
    <thead>
      <tr>
        <th scope="col" class="col-5">Parameter</th>
        <th scope="col">Source</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">
          <math display="block">
            <msub>
              <mi>T</mi>
              <mn>0</mn>
            </msub>
          </math>
          <p>
            <small> Ground surface temperature </small>
          </p>
        </th>
        <td>
          <select class="form-select form-select-sm">
            <option selected="selected" disabled>Select Source</option>
            <option>1</option>
          </select>
        </td>
      </tr>
      <tr>
        <th>
          <math display="block">
            <msub>
              <mi>&Delta;</mi>
              <mn>Z1</mn>
            </msub>
          </math>
          <p>
            <small>Sediment</small>
          </p>
        </th>
        <td>
          <select class="form-select form-select-sm">
            <option selected="selected" disabled>Select Source</option>
            <option>Sediment ECM1</option>
          </select>
        </td>
      </tr>
      <tr>
        <th>
          <math display="block">
            <msub>
              <mi>&Delta;</mi>
              <mn>Z2</mn>
            </msub>
          </math>
          <p>
            <small>Upper Crust</small>
          </p>
        </th>
        <td>
          <select class="form-select form-select-sm">
            <option selected="selected" disabled>Select Source</option>
            <option>Upper Crust Crust1.0</option>
          </select>
        </td>
      </tr>
      <tr>
        <th>
          <math display="block">
            <msub>
              <mi>&Delta;</mi>
              <mn>Z3</mn>
            </msub>
          </math>
          <p>
            <small>Middle Crust</small>
          </p>
        </th>
        <td>
          <select class="form-select form-select-sm">
            <option selected="selected" disabled>Select Source</option>
            <option>Middle Crust Crust1.0</option>
          </select>
        </td>
      </tr>
      <tr>
        <th>
          <math display="block">
            <msub>
              <mi>&Delta;</mi>
              <mn>Z4</mn>
            </msub>
          </math>
          <p>
            <small>Lower Crust</small>
          </p>
        </th>
        <td>
          <select class="form-select form-select-sm">
            <option selected="selected" disabled>Select Source</option>
            <option>Lower Crust Crust1.0</option>
          </select>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<style></style>

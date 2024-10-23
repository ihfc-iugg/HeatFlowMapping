<script setup>
import { CFormText } from '@coreui/bootstrap-vue'
import { useDataSchemaStore } from '@/store/dataSchema'
import { use2DProfileStore } from '@/store/2DProfile'

const dataSchema = useDataSchemaStore()
const profile = use2DProfileStore()
</script>

<template>
  <div class="form card-body">
    <h6>Setup</h6>
    <CFormText as="span" id="" :class="{ 'text-danger': error }">
      Select one (or optional two) propertie(s) to plot on the Y-axis
    </CFormText>
    <form class="was-validated">
      <div class="mb-3">
        <select
          class="form-select"
          required
          aria-label="select example"
          v-model="profile.selectedProperty1"
        >
          <option
            v-for="property in dataSchema.numberProperties"
            :key="property.key"
            :value="property.key"
          >
            {{ property.title }}
          </option>
        </select>
        <div class="invalid-feedback">Please select a property</div>
      </div>
      <div class="mb-3">
        <select class="form-select" aria-label="select example" v-model="profile.selectedProperty2">
          <option
            v-for="property in dataSchema.numberProperties"
            :key="property.key"
            :value="property.key"
          >
            {{ property.title }}
          </option>
        </select>
      </div>
      <div class="col">
        <div id="" class="form-text">
          Orthogonal distance to the line in which data points will be selected [1 - 500 km]
        </div>
        <input
          v-model.number="profile.threshold"
          type="number"
          class="form-control"
          id=""
          required
          min="1"
          max="500"
          @keydown.enter.prevent
        />
        <div class="invalid-feedback">Please enter a threshold within 1-500 km</div>
      </div>
    </form>
  </div>
</template>

<style></style>

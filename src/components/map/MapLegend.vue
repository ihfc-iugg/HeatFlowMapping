<!-- Map Legend -->
<script setup>
import { ref, watch } from 'vue'
import { useLegendStore } from '@/store/legend'
import { useDataSchemaStore } from '@/store/dataSchema.js'

const legend = useLegendStore()
const schema = useDataSchemaStore()

const property = ref(null)

/**
 * @description Initializes the property based on the selected property in the legend.
 */
watch(legend.selectedProperty, (newProperty) => {
  property.value = schema.dataSchema.properties[newProperty]
})
</script>

<template>
  <div v-if="legend.legend" class="legend-container">
    <p class="d-grid gap-1">
      <button
        class="btn text-start text-light dropdown-toggle"
        type="button"
        style="background-color: #4366a1"
        data-bs-toggle="collapse"
        data-bs-target="#legend"
        aria-expanded="true"
        aria-controls="legend"
      >
        Legend
      </button>
    </p>
    <div class="collapse-show" id="legend">
      <div class="card" style="width: 10rem" role="button">
        <h6 class="card-header">
          {{ schema.dataSchema.properties[legend.selectedProperty].title }}
          <h6
            class="card-subtitle text-muted mt-1"
            v-if="schema.dataSchema.properties[legend.selectedProperty].units"
          >
            [{{ schema.dataSchema.properties[legend.selectedProperty].units }}]
          </h6>
        </h6>

        <div class="card-body">
          <div class="row justify-content-md-center" v-for="entry in legend.legend" :key="entry.id">
            <div class="col-md-auto align-self-start" xs="2">
              <button
                class="btn btn-sm"
                :style="{
                  'background-color': entry.colorHEX,
                  border: '1px solid #00c9a7'
                }"
              ></button>
            </div>

            <div class="col d-flex align-self-end" xs="10">
              {{ entry.text }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.legend-container {
  position: absolute;
  bottom: 4rem;
  right: 0.5rem;
  z-index: 1;
}
</style>

Map Legend
<script setup>
import { computed, onMounted, ref, watch } from 'vue'
// import { useLegendStore } from '@/modules/legend/stores/legend'
// import { useDataSchemaStore } from '@/modules/map/stores/dataSchema.js'
// import paintPropertyObserver from '@/shared/utils/observer/paintPropertyObserver'
import { useApplicationStore } from '@/core/stores/app'
import { useLegendStore } from '../stores/legend'

// const legend = useLegendStore()
// const schema = useDataSchemaStore()

const property = ref(null)

const app = useApplicationStore()
const legend = useLegendStore()

function handlePaintPropertyNotification(paintProperty) {
  console.log(paintProperty)
  legend.paintProperty = paintProperty
}

// paintPropertyObserver.subscribe(handlePaintPropertyNotification)

onMounted(() => {
  const legendControl = app.controls.get('legend')

  legendControl.onOpen((isOpen) => {
    legend.isOpen = isOpen
    console.log('inside legend event')
  })
})

//TODO: html attribute data-toggle oder so an btn hängen, damit der das ding collapsed oder nicht
// /**
//  * @description Initializes the property based on the selected property in the legend.
//  */
// watch(legend.selectedProperty, (newProperty) => {
//   property.value = schema.dataSchema.properties[newProperty]
// })
</script>

<template>
  <!-- <div></div> -->
  <div v-if="legend.isOpen" class="legend-container">
    <p class="d-grid gap-1">
      <!-- <button
        class="btn text-start text-light dropdown-toggle"
        type="button"
        style="background-color: #4366a1"
        data-bs-toggle="collapse"
        data-bs-target="#legend"
        aria-expanded="true"
        aria-controls="legend"
      >
        Legend
      </button> -->
    </p>
    <!-- <div class="collapse-show" id="legend">
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
    </div> -->
  </div>
</template>

<style scoped></style>

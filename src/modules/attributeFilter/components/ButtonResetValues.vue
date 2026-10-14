<script setup>
import { defineProps } from 'vue'
import { useFilterStore } from '../stores/attributeFilter'
import RebootSVG from '@/shared/assets/icons/reboot-bootstrap.svg'

const props = defineProps({
  uuid: { type: String, required: true }
})

const filter = useFilterStore()

//  @click="
//         (resetSelectedValues(filterElement),
//         resetFilterExpression(),
//         updateSliderRange(valueOptions[0], valueOptions[1]))
//       "
</script>

<template>
  <div class="pt-0" :id="props.uuid + '-reset'">
    <button
      class="btn rounded-pill btn-outline-success"
      @click="filter.resetFilterObject(props.uuid)"
    >
      <RebootSVG />
    </button>
  </div>
</template>

<style scoped></style>

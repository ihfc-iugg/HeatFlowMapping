<script setup>
import { defineProps, defineEmits, ref, watch } from 'vue'
import SliderSVG from '@/shared/assets/icons/sliders-bootstrap.svg'
import InfoSVG from '@/shared/assets/icons/info-circle-bootstrap.svg'

const props = defineProps({
  id: { type: String, required: true },
  ariaLabel: { type: String, required: true }
})

const emit = defineEmits(['update:selected'])

const selected = ref('settings') // default

watch(selected, (newSelectedTab) => {
  emit('update:selected', newSelectedTab)
})
</script>

<template>
  <div class="vstack gap-1">
    <div class="btn-group" role="group" data-toggle="buttons" :aria-label="props.ariaLabel">
      <input
        type="radio"
        class="btn-check"
        :name="`btn-radio-${props.id}`"
        :id="`${props.id}-settings`"
        autocomplete="off"
        value="settings"
        v-model="selected"
      />
      <label class="btn btn-outline-primary" :for="`${props.id}-settings`" :title="props.title">
        <SliderSVG />
      </label>
      <input
        type="radio"
        class="btn-check"
        :name="`btn-radio-${props.id}`"
        :id="`${props.id}-info`"
        autocomplete="off"
        value="info"
        v-model="selected"
      />
      <label class="btn btn-outline-primary" :for="`${props.id}-info`" :title="props.title">
        <InfoSVG />
      </label>
    </div>
  </div>
</template>

<style></style>

<script setup>
import { elementaryChargeDependencies } from 'mathjs'
import { useNavButtonGroupStore } from '../stores/navButtonGroup'
import { defineProps } from 'vue'

const navBtnGroup = useNavButtonGroupStore()

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  }
})

// function onchange(){
//   nehm input elem
//   setz attributz data-bs-toggle="offcanvas"
//     data-bs-target="#offcanvasPanel"
//     aria-controls="offcanvasPanel"
// }
</script>

<template>
  <!-- <input
    type="radio"
    class="btn-check"
    name="btn-radio-main-nav-bar"
    :id="id"
    :value="navBtnGroup.panels[id]"
    v-model="navBtnGroup.selected"
    data-bs-toggle="offcanvas"
    data-bs-target="#offcanvasPanel"
    aria-controls="offcanvasPanel"
  /> -->

  <input
    type="radio"
    class="btn-check"
    name="btn-radio-main-nav-bar"
    :id="id"
    :value="navBtnGroup.panels[id]"
    v-model="navBtnGroup.selected"
    data-bs-toggle="offcanvas"
    data-bs-target="#offcanvasPanel"
    aria-controls="offcanvasPanel"
    @change="console.log(navBtnGroup.selected)"
  />
  <label class="btn text-light" :for="id"
    ><div class="" v-html="icon"></div>
    <span class="">{{ title }}</span></label
  >
</template>

<style scoped></style>

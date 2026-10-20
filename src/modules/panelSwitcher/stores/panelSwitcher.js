import { defineStore } from 'pinia'
import { ref } from 'vue'
import { PANEL_THEMES } from '@/shared/constants/panelThemes'

export const usePanelSwitcherStore = defineStore('navigation bar', () => {
  const selected = ref(PANEL_THEMES.layers)

  return {
    selected
  }
})

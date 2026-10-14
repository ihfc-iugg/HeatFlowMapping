<script setup>
import AccordionItem from '@/shared/components/AccordionItem.vue'
import Card from '@/shared/components/Card.vue'
import TabSwitcherButtonGroup from '@/shared/components/TabSwitcherButtonGroup.vue'
import LineDrawToolsButtonGroup from '../components/LineDrawToolsButtonGroup.vue'
import CrossSectionParameterSetUp from '../components/CrossSectionParameterSetUp.vue'
import CalculateCrossSectionBtn from '../components/CalculateCrossSectionBtn.vue'
import AboutCrossSection from '../components/AboutCrossSection.vue'
import CrossSectionPopupContent from '../components/CrossSectionPopupContent.vue'
import { useCrossSectionStore } from '../stores/crossSection.js'

const crossSection = useCrossSectionStore()

/**
 * @description
 * @param selectedTab
 */
function handleTabSwitcher(selectedTab) {
  crossSection.selectedTab = selectedTab
}

/**
 * @description
 */
function handleRunCalculation() {
  crossSection.toggleHasPopup()
}

/**
 * @description
 */
function handleDeleteLineString() {
  crossSection.toggleHasPopup()
}
</script>

<template>
  <AccordionItem id="analysis-cross-section-accordion-item" title="Cross Section">
    <TabSwitcherButtonGroup
      :id="'cross-section'"
      :aria-label="'Tab switcher for cross section tool'"
      @update:selected="handleTabSwitcher"
    />

    <div v-if="crossSection.selectedTab === 'settings'">
      <Card :id="'cross-section-settings'" :title="'Calculation Setup'">
        <Card :id="'cross-section-settings-draw'">
          <LineDrawToolsButtonGroup @line-string-deleted="handleDeleteLineString()" />
        </Card>
        <Card :id="'cross-section-settings-attribute'">
          <CrossSectionParameterSetUp />
        </Card>
      </Card>
      <CalculateCrossSectionBtn @run-calculation="handleRunCalculation()" />
    </div>

    <Card
      v-if="crossSection.selectedTab === 'info'"
      :id="'info-cross-section'"
      :title="'About Cross Section'"
    >
      <AboutCrossSection />
    </Card>

    <div id="crosssectionpopupcard" v-if="crossSection.hasPopup">
      <CrossSectionPopupContent :has-popup="crossSection.hasPopup" />
    </div>
  </AccordionItem>
</template>

<style></style>

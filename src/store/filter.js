import { defineStore } from "pinia";
import { ref } from "vue";

export const useFilterStore = defineStore("filter", () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  // const filterIDs = ref([]);
  const filters = ref({ attributeFilter: {}, locationFilter: {} });
  const maxNumberOfFilters = ref(5);
  const reachedLimit = ref(false);

  /**
   *
   * @param {*} filterId
   */
  function addFilter(filterId, category) {
    filters.value[category][filterId] = {
      selectedProperty: null,
      selectedPropertyType: null,
      selectedValues: null,
      expression: null,
    };
  }

  /**
   *
   * @param {*} id
   */
  function removeFilterElement(filterId, category) {
    delete filters.value[category][filterId];
    setReachedLimit();
  }

  /**
   *
   */
  function setReachedLimit() {
    if (Object.keys(filters.value).length <= maxNumberOfFilters.value) {
      reachedLimit.value = false;
    }
  }

  return {
    filters,
    maxNumberOfFilters,
    reachedLimit,
    addFilter,
    removeFilterElement,
  };
});

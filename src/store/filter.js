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

  /**
   * @description combine multiple filter expressions to one. All filter expressions have to be true.
   * @returns {Array} containing filter expressions
   */
  function writeFilterExpression() {
    let expression = ["all"];

    Object.entries(filters.value).forEach(([category]) => {
      Object.entries(filters.value[category]).forEach(([key]) => {
        if (filters.value[category][key].expression != null) {
          expression.push(filters.value[category][key].expression);
        } else {
          console.log("Empty filterExpression for filter with key: " + key);
        }
      });
    });
    console.log(expression);

    return expression;
  }

  /**
   * @description set Filter to map via internal maplibre function.
   */
  function applyFilterToMap(mapObject) {
    const expression = writeFilterExpression();

    mapObject.setFilter("sites", expression);
  }

  /**
   * method code from https://docs.mapbox.com/mapbox-gl-js/example/filter-features-within-map-view/
   * @param {*} features
   * @param {*} comparatorProperty
   */
  function getUniqueFeatures(features, comparatorProperty) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
      const id = feature.properties[comparatorProperty];
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        uniqueFeatures.push(feature);
      }
    }
    return uniqueFeatures;
  }

  /**
   *
   */
  function getFilteredFeatures(mapObject) {
    let filterExpression = writeFilterExpression();
    let queriedFeatures = mapObject.querySourceFeatures("sites", {
      sourceLayer: "sites",
      filter: filterExpression,
    });
    const uniqueFeatures = getUniqueFeatures(queriedFeatures, "id");
    console.log(uniqueFeatures);
  }

  return {
    filters,
    maxNumberOfFilters,
    reachedLimit,
    addFilter,
    removeFilterElement,
    applyFilterToMap,
    getFilteredFeatures,
  };
});

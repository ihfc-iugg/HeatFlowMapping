import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapAppConfig = defineStore("mapAppConfig", () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const el = ref(document.querySelector("#whfd-mapping"));
  const dataUrl = ref(getDataAttributes("dataUrl"));
  const schemaUrl = ref(getDataAttributes("schemaUrl"));

  function getDataAttributes(attributeName) {
    try {
      return el.value.dataset[attributeName];
    } catch (error) {
      console.log("Attribute " + attributeName + " not found; " + error);
    }
  }

  function printOutMapAppConfig() {
    console.log("Map app config:");
    console.log("Data url: " + dataUrl.value);
    console.log("Schema url: " + schemaUrl.value);
  }

  return { dataUrl, schemaUrl, printOutMapAppConfig };
});

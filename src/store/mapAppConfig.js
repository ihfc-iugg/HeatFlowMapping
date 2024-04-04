import { defineStore } from "pinia";
import { ref } from "vue";

export const useMapAppConfig = defineStore("mapAppConfig", () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const el = document.querySelector("#whfd-mapping");
  const dataUrl = ref(el.dataset.dataUrl);
  const schemaUrl = ref(el.dataset.schemaUrl);

  function printOutMapAppConfig() {
    console.log("Map app config:");
    console.log("Data url: " + dataUrl.value);
    console.log("Schema url: " + schemaUrl.value);
  }

  return { dataUrl, schemaUrl, printOutMapAppConfig };
});

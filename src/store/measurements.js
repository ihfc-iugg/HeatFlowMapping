import { defineStore } from "pinia";
import { ref } from "vue";

import * as SwaggerParser from "@apidevtools/swagger-parser";
import axios from "axios";
import gjv from "geojson-validation";

export const useMeasurementStore = defineStore("measurements", () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const geojson = ref(null);
  const dataSchema = ref(null);
  const selectableProperties = ref(null);
  const isDataLoading = ref(null);
  const isSchemaLoading = ref(null);

  /**
   * @description
   * @param {String} url
   */
  async function fetchAPIDataSchema(url) {
    //   /api/v1/schema/
    isSchemaLoading.value = true;
    console.log("API Data Schema");
    try {
      let parser = new SwaggerParser();
      await parser.dereference(url).then((apiSchema) => {
        dataSchema.value = apiSchema.components.schemas.Measurement;
        console.log(dataSchema.value);
        setSelectableProperties();
        isSchemaLoading.value = false;
      });
    } catch (e) {
      console.log("error in fetching data schema" + e);
    }
  }

  /**
   * @description
   * @param {String} url
   * @param {Array} data
   * @returns {Array}
   */
  async function fetchPagedAPIData(url, data) {
    data = data || [];

    await axios
      .get(url)
      .then((response) => {
        response.data.results.forEach((entry) => {
          data.push(entry);
        });

        if (response.data.next != null) {
          // return fetchPagedAPIData(response.data.next, data);
        }
        return data;
      })
      .catch((err) => {
        console.log("rejected", err);
      });
    console.log("return data");
    console.log(data);
    return data;
  }

  /**
   * @description Gather information of each site and write it to GeoJSON feature
   * @param {Object} siteObject
   */
  function collectPntAttributes(siteObject) {
    const featKeys = Object.keys(siteObject);

    let coord = null;
    let property = {};

    featKeys.forEach((key) => {
      if (key == "sample") {
        if (siteObject[key].location != null) {
          coord = siteObject[key].location.point;
        }
      } else {
        // console.log("hat keine location");
        property[key] = siteObject[key];
      }
    });

    return [coord, property];
  }

  /**
   * @description Write GeoJSON point feature and validate it
   * @param {String} uuid
   * @param {Array} coord
   * @param {Object} property
   */
  function writePntFeature(pntAttributes) {
    const feature = {
      id: pntAttributes[1].id,
      type: "Feature",
      geometry: pntAttributes[0],
      properties: pntAttributes[1],
    };

    if (gjv.isFeature(feature, true)) {
      return feature;
    } else {
      console.log(gjv.isFeature(feature, true));
    }
  }

  /**
   * @description fetch JSON from heat flow API and convert it to geojson
   * @param {String} url
   */
  function convertAPIData2GeoJSON(url) {
    return fetchPagedAPIData(url).then((value) => {
      console.log("measurments");
      console.log(value);

      let featuresArray = [];

      value.forEach((siteObject) => {
        // console.log(siteObject);
        const pntAttributes = collectPntAttributes(siteObject);
        featuresArray.push(writePntFeature(pntAttributes));
      });

      const featureCollection = {
        type: "FeatureCollection",
        features: featuresArray,
      };

      if (gjv.isFeatureCollection(featureCollection)) {
        console.log("inside async func");
        console.log(featureCollection);
        return featureCollection;
      } else {
        console.log(gjv.isFeatureCollection(featureCollection, true));
      }
    });
  }

  /**
   *
   * @param {String} url
   */
  async function fetchAPIData(url) {
    isDataLoading.value = true;
    geojson.value = await convertAPIData2GeoJSON(url);
    isDataLoading.value = false;
  }

  /**
   * @description
   * @param {*} property
   * @returns {Boolean}
   */
  function isPropertySelectable(property) {
    let isSelectable = null;

    if (
      dataSchema.value.properties[property].type == "string" &&
      !dataSchema.value.properties[property].enum
    ) {
      console.log(property + " is not suitable for data driven coloring");
      isSelectable = false;
    } else if (
      dataSchema.value.properties[property].type == "integer" &&
      (!dataSchema.value.properties[property].minimum ||
        !dataSchema.value.properties[property].maximum)
    ) {
      console.log(property + " is not suitable for data driven coloring");
      isSelectable = false;
    } else if (dataSchema.value.properties[property].type == "object") {
      console.log(property + " is not suitable for data driven coloring");
      isSelectable = false;
    } else {
      isSelectable = true;
    }
    return isSelectable;
  }

  /**
   * @description Takes property name and brings it to structure necessary for VueMultiselect component
   * @param {String} propertyName
   * @returns {Object}
   */
  function createVueMultiselectOption(propertyName) {
    const propertyObj = dataSchema.value.properties[propertyName];
    let optionsObject = {};
    optionsObject["title"] = propertyObj.title;
    optionsObject["key"] = propertyName;

    return optionsObject;
  }

  /**
   * @description Throw out all properties options which are not suitable for the data driven coloring e.g. name, data points either be already classified (enum) or should be able to classify (continouse numerbs)
   * @param {*} schema
   * @returns {Array}
   */
  function setSelectableProperties() {
    const propertiesKey = Object.keys(dataSchema.value.properties);
    let selection = [];

    propertiesKey.forEach((propertyName) => {
      if (isPropertySelectable(propertyName)) {
        selection.push(createVueMultiselectOption(propertyName));
      }
    });

    selectableProperties.value = selection;
    console.log("check selectable properties");
    console.log(selectableProperties.value);
  }

  return {
    geojson,
    dataSchema,
    selectableProperties,
    isDataLoading,
    isSchemaLoading,
    fetchAPIData,
    fetchAPIDataSchema,
  };
});

import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  TerraDraw,
  TerraDrawPointMode,
  TerraDrawLineStringMode,
  TerraDrawPolygonMode,
  TerraDrawSelectMode
} from 'terra-draw'
import { TerraDrawMapLibreGLAdapter } from 'terra-draw-maplibre-gl-adapter'
import { Map } from 'maplibre-gl'
import { lineString } from '@turf/turf'

export const useDrawStore = defineStore('Setup and access draw tool', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  const tools = ref(null)
  const selectedFeature = ref(null)
  const pointMode = ref(
    new TerraDrawPointMode({
      styles: {
        pointColor: '#EA5E20',
        pointWidth: 4,
        pointOutlineColor: '#354F9E',
        pointOutlineWidth: 1
      }
    })
  )
  const lineMode = ref(
    new TerraDrawLineStringMode({
      styles: {
        lineStringColor: '#EA5E20',
        lineStringWidth: 2
      }
    })
  )
  const polygonMode = ref(
    new TerraDrawPolygonMode({
      styles: {
        fillColor: '#EA5E20',
        fillOpacity: 0.5,
        outlineColor: '#354F9E',
        outlineWidth: 2
      }
    })
  )
  const selectMode = ref(
    new TerraDrawSelectMode({
      // Allow manual deselection of features
      allowManualDeselection: true, // this defaults to true - allows users to deselect by clicking on the map

      // Enable editing tools by Feature
      flags: {
        // Point
        point: {
          feature: {
            draggable: true
          }
        },

        // Polygon
        polygon: {
          feature: {
            draggable: true,
            coordinates: {
              midpoints: true,
              draggable: true,
              deletable: true
            }
          }
        },

        // Line
        linestring: {
          feature: {
            draggable: true,
            coordinates: {
              midpoints: false,
              draggable: true,
              deletable: true
            }
          }
        }
      },

      // Styles go here...
      styles: {
        // See Styling Guide for more information
      }
    })
  )

  /**
   *
   * @param {Map} map
   */
  function setDraw(map) {
    tools.value = new TerraDraw({
      adapter: new TerraDrawMapLibreGLAdapter({ map }),
      modes: [pointMode.value, lineMode.value, polygonMode.value, selectMode.value]
    })
    tools.value.start()
  }

  function setSelectedFeature(feature) {
    selectedFeature.value = feature
  }

  /**
   *
   * @param {Array} features
   * @param {Object} featureToKeep
   * @param {String} featureType
   * @returns Array of Ids
   */
  function getFeatureIdsToRemove(features, featureToKeep) {
    let featureIds = []
    features.forEach((feature) => {
      if (feature.geometry.type === featureToKeep.geometry.type && feature.id != featureToKeep.id) {
        featureIds.push(feature.id)
        console.log(feature.id)
      }
    })
    return featureIds
  }

  /**
   *
   * @description Get selected line, keep only start and end coordinate to avoid edges and add it as feature.
   * @param {Object} lineFeature
   */
  function lineCoordinatesConstrain(lineFeature) {
    if (lineFeature.geometry.coordinates.length > 2) {
      const firstPoint = lineFeature.geometry.coordinates[0]
      const lastPoint =
        lineFeature.geometry.coordinates[lineFeature.geometry.coordinates.length - 1]

      const featureId = tools.value.getFeatureId()

      return lineString([firstPoint, lastPoint], { mode: 'linestring' }, { id: featureId })
    } else {
      return lineFeature
    }
  }

  return {
    tools,
    selectedFeature,
    pointMode,
    lineMode,
    polygonMode,
    selectMode,
    setDraw,
    setSelectedFeature,
    getFeatureIdsToRemove,
    lineCoordinatesConstrain
  }
})

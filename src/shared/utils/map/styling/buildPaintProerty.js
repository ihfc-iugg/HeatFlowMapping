import { defineClassBreaks } from '@/shared/utils/ghfdb/classification'
import { getEnumValues, getBooleanValues } from '@/shared/utils/ghfdb/properties'

/**
 * @description write array containg maplibre conform expressions for properties with enum values. Legal values are according to predefined classes
 * @param {String} property
 * @param {Array} classes
 * @param {Array} colors
 * @returns {Array} ["match", ["get", "property"], class, #color, ..., #colorOthers] --> https://docs.mapbox.com/mapbox-gl-js/example/data-driven-circle-colors/
 */
export function buildMatchPaintProperty(property, classes, colorPalette) {
  let paintProperty = []

  paintProperty.push('match')
  paintProperty.push(['get', property])

  classes.forEach((value, index) => {
    paintProperty.push(value, colorPalette[index])
  })

  // others
  paintProperty.push('#ccc')

  return paintProperty
}

/**
 * @description write array containg maplibre conform expressions for properties with continous number values. Each class (start value - end value) one color value is assigned.
 * @param {String} property
 * @param {Array} classBreaks
 * @param {Array} colorPalette
 * @returns {Array}
 * @example ["step", ["get", "property"], #color, NUMBER, #color, ...]
 */
export function buildStepPaintProperty(property, classBreaks, colorPalette) {
  let paintProperty = []
  let k = 1

  paintProperty.push('step')
  paintProperty.push(['get', property])

  for (var i = 0; i < colorPalette.length; i++) {
    paintProperty.push(colorPalette[i])
    if (i < colorPalette.length - 1) {
      paintProperty.push(classBreaks[k])
      k++
    }
  }

  return paintProperty
}

/**
 * Build a MapLibre paint expression from a feature collection and styling config.
 *
 * @param {Object} featureCollection
 * @param {Object} config
 * @param {string} config.dataType  'number' | 'enum' | 'boolean'
 * @param {string} config.property
 * @param {number} config.nrOfClasses
 * @param {string} config.method
 * @param {string[]} config.colors
 * @param {Object} config.dataSchema
 * @returns {Array|null} MapLibre paint expression
 */
export function buildPaintProperty(config) {
  const { dataType, property, nrOfClasses, method, colors, dataSchema, values, min, max } = config

  switch (dataType) {
    case 'number': {
      const classBreaks = defineClassBreaks(values, min, max, property, nrOfClasses, method)
      return buildStepPaintProperty(property, classBreaks, colors)
    }

    case 'enum':
      return buildMatchPaintProperty(property, getEnumValues(property, dataSchema), colors)

    case 'boolean':
      return buildMatchPaintProperty(property, getBooleanValues(property, dataSchema), colors)

    default:
      return null
  }
}

/**
 * @description Build a MapLibre color expression that highlights features whose id
 * appears in `ids`, and dims everything else.
 * @param {Array<string|number>} ids        Feature ids to highlight
 * @param {string} highlightColor
 * @param {string} defaultColor
 * @returns {Array|string} MapLibre expression, or a plain color if ids is empty
 */
export function buildCasePaintProperty(ids, defaultColor, highlightColor) {
  if (!Array.isArray(ids) || ids.length === 0) {
    return defaultColor
  }

  const idProperty = 'ID'

  const input = idProperty ? ['get', idProperty] : ['id']

  return ['case', ['in', input, ['literal', ids]], highlightColor, defaultColor]
}

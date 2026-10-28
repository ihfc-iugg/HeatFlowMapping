import { aggregateValues, getRange } from '@/shared/utils/ghfdb/properties'

/**
 * @description Segment a MapLibre `match` paint expression into label/color pairs.
 * @param {Array} expression  e.g. ["match", ["get", "p"], "a", "#f00", "b", "#fff", "#ccc"]
 * @returns {{ classes: Array<{value: *, color: string}>, fallback: string|null, property: string|null }}
 */
export function parseMatchExpression(expression) {
  const empty = { classes: [], fallback: null, property: null }

  if (!Array.isArray(expression) || expression[0] !== 'match') return empty
  if (expression.length < 4) return empty

  const classes = []
  const fallback = expression[expression.length - 1]

  // Pairs occupy indices 2 .. length-2; stop before the trailing fallback
  for (let i = 2; i < expression.length - 1; i += 2) {
    classes.push({ label: expression[i], color: expression[i + 1] })
  }

  return {
    classes,
    fallback,
    property: extractProperty(expression[1])
  }
}

/**
 * @description
 * @param {Array} expression e.g. ["step", input, baseColor, stop1, "#color1", stop2, "#color2", ...]
 * @returns {{ classes: Array<{value: *, color: string}>, fallback: string|null, property: string|null }}
 */
export function parseStepExpression(expression, geoJSON) {
  if (!Array.isArray(expression) || expression[0] !== 'step') {
    return { classes: [], fallback: null, property: null }
  }
  const property = extractProperty(expression[1])
  let classes = []

  for (let i = 2; i < expression.length; i += 2) {
    classes.push({ label: expression[i + 1], color: expression[i] })
  }

  classes = setBounds(classes, geoJSON, property)

  return { classes, fallback: null, property: property }
}

/**
 * @description
 * @param {Array} expression e.g. ["case", ["==", ["get", "ID"], "R24-047468"],"red","#000000"]
 * @returns {{ classes: Array<{value: *, color: string}>, fallback: string|null, property: null }}
 */
export function parseCaseExpression(expression) {
  //TODO:
  if (!Array.isArray(expression) || expression[0] !== 'case') {
    return { classes: [], fallback: null, property: null }
  }

  console.log(expression)
  const classes = [
    { label: 'Nearest Point', color: expression[2] },
    { label: 'Others', color: expression[3] }
  ]

  // for (let i = 3; i < expression.length - 1; i += 2) {
  //   classes.push({ value: expression[i], color: expression[i + 1] })
  // }

  return { classes, fallback: null, property: null }
}

/**
 * @description
 * @param {Array} input
 * @returns {String}
 */
export function extractProperty(input) {
  if (Array.isArray(input) && input[0] === 'get') return input[1] ?? null
  return null
}

/**
 * @description
 * @param {Array} classes
 * @param {Object} geojson
 * @param {String} property
 * @returns {Array} with upper and lower bound set as lable of each class
 */
function setBounds(classes, geojson, property) {
  const values = aggregateValues(geojson, property)
  const range = getRange(values)

  let lowerBound = range.min
  let upperBound
  let bounds

  for (let i = 0; i < classes.length; i += 1) {
    classes[i]['lower'] = lowerBound
    classes[i]['upper'] = classes[i].label

    if (i < classes.length - 1) {
      upperBound = classes[i].label
      bounds = lowerBound.toFixed(2) + ' - ' + upperBound.toFixed(2)
      lowerBound = classes[i].label
    } else if (i === classes.length - 1) {
      upperBound = range.max
      bounds = lowerBound.toFixed(2) + ' - ' + upperBound.toFixed(2)
    }

    classes[i].label = bounds
  }

  return classes
}

/**
 *
 * @param {Array} expression
 */
export function parseExpression(expression, geoJSON) {
  if (!Array.isArray(expression) || expression.length <= 2) return

  const expressionType = expression[0]

  switch (expressionType) {
    case 'match':
      return parseMatchExpression(expression)

    case 'step':
      return parseStepExpression(expression, geoJSON)

    case 'case':
      return parseCaseExpression(expression)

    default:
      return null
  }
}

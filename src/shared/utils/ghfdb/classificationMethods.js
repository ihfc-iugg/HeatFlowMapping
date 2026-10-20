import geostats from 'geostats'
import { quantileSeq } from 'mathjs'
import { getEnumValues, getBooleanValues } from '@/shared/utils/ghfdb/properties'

/**
 * @description
 * @param {string} property
 * @param {string} dataType
 * @param {Object} dataSchema
 */
export function classesLength(property, dataType, dataSchema) {
  if (!property || !dataType || !dataSchema) throw new Error('no arguments')

  // classes for datatype number are defined by selectNumberOfClasses
  if (dataType == 'boolean') {
    return getBooleanValues(property, dataSchema).length
  } else if (dataType == 'enum') {
    return getEnumValues(property, dataSchema).length
  } else {
    return
  }
}

/**
 * @description Helper function for Math.quantileSeq() to collect only the values of a single property within one array
 * @param {Object} featureCollection
 * @param {String} property
 * @returns {Array}
 */
export function aggregateValues(featureCollection, property) {
  if (!featureCollection || !property) throw new Error('no arguments')

  let values = []

  featureCollection.features.forEach((feature) => {
    let value = feature.properties[property]
    // to filter sting values, e.g. q_uncertainty contains a value of type string ([Unspecified])
    if (typeof value === 'number') {
      values.push(value)
    }
  })
  return values
}

/**
 * @description Calculate breaks for jenks classification
 * @param {Object} featureCollection
 * @param {String} property
 * @param {Number} nrOfClasses
 * @returns {Array} [minValue, break1, ..., breakN, maxValue]
 */
export function jenksNaturalBreaks(values, property, nrOfClasses) {
  if (!values || !property || !nrOfClasses) throw new Error('no arguments')

  let classifier = new geostats(values)
  let breaks = classifier.getJenks(nrOfClasses)

  return breaks
}

/**
 * @description Calculate breaks for quantil classification (each class has the same amount of data points)
 * @param {Object} featureCollection
 * @param {String} property
 * @param {Number} nrOfClasses
 * @returns {Array}
 */
export function quantilBreaks(values, property, nrOfClasses) {
  if (!values || !property || !nrOfClasses) throw new Error('no arguments')

  const breaks = quantileSeq(values, nrOfClasses - 1)

  // add min value to beginning of array
  breaks.unshift(Math.min.apply(null, values))

  // add max value to end of array
  breaks.push(Math.max.apply(null, values))

  return breaks
}

/**
 * @description Calculate breaks for equal interval classification (each class has the same range of values)
 * @param {Object} featureCollection
 * @param {String} property
 * @param {Number} nrOfClasses
 * @returns {Array}
 */
export function equalIntervalBreaks(values, property, nrOfClasses) {
  if (!values || !property || !nrOfClasses) throw new Error('no arguments')

  const minValue = Math.min.apply(null, values)
  const maxValue = Math.max.apply(null, values)
  const stepSize = (maxValue - minValue) / nrOfClasses
  let breaks = []

  for (let i = 0; i <= nrOfClasses; i++) {
    breaks.push(minValue + i * stepSize)
  }

  return breaks
}

/**
 * @description
 * @param {Object} featureCollection
 * @param {Sting} property
 * @param {Number} nrOfClasses
 * @returns
 */
export function defineClassBreaks(featureCollection, property, nrOfClasses, method) {
  if (!featureCollection || !property || !nrOfClasses || !method) throw new Error('no arguments')

  const values = aggregateValues(featureCollection, property).filter(Boolean)
  let breaks = undefined

  if (method == 'quantil') {
    breaks = quantilBreaks(values, property, nrOfClasses)
  } else if (method == 'equal') {
    breaks = equalIntervalBreaks(values, property, nrOfClasses)
  } else if (method == 'jenks') {
    breaks = jenksNaturalBreaks(values, property, nrOfClasses)
  }

  return breaks
}

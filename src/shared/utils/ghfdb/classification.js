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
export function quantilBreaks(values, min, max, property, nrOfClasses) {
  if (!values || !property || !nrOfClasses) throw new Error('no arguments')

  const breaks = quantileSeq(values, nrOfClasses - 1)

  // add min value to beginning of array
  breaks.unshift(min)

  // add max value to end of array
  breaks.push(max)

  return breaks
}

/**
 * @description Calculate breaks for equal interval classification (each class has the same range of values)
 * @param {Object} featureCollection
 * @param {String} property
 * @param {Number} nrOfClasses
 * @returns {Array}
 */
export function equalIntervalBreaks(values, min, max, property, nrOfClasses) {
  if (!values || !property || !nrOfClasses) throw new Error('no arguments')

  const stepSize = (max - min) / nrOfClasses
  let breaks = []

  for (let i = 0; i <= nrOfClasses; i++) {
    breaks.push(min + i * stepSize)
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
export function defineClassBreaks(values, min, max, property, nrOfClasses, method) {
  if (!values || !property || !nrOfClasses || !method) throw new Error('no arguments')

  let breaks

  if (method == 'quantil') {
    breaks = quantilBreaks(values, min, max, property, nrOfClasses)
  } else if (method == 'equal') {
    breaks = equalIntervalBreaks(values, min, max, property, nrOfClasses)
  } else if (method == 'jenks') {
    breaks = jenksNaturalBreaks(values, property, nrOfClasses)
  }

  return breaks
}

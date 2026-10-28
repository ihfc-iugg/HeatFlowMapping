/**
 * @description
 * @param {String} property
 * @returns
 */
export function getEnumValues(property, dataSchema) {
  if (!property && !dataSchema) throw new Error('no arguments')

  let classes = []

  dataSchema.properties[property].oneOf.forEach((enumSchema) => {
    enumSchema.enum.forEach((enumClass) => {
      if (enumClass) {
        classes.push(enumClass)
      }
    })
  })

  return classes
}

/**
 * @description
 * @param {String} property
 * @returns
 */
export function getBooleanValues(property, dataSchema) {
  if (!property && !dataSchema) throw new Error('no arguments')

  let classes = []
  if (dataSchema.properties[property].type == 'boolean') {
    classes = ['true', 'false', 'undefined']

    return classes
  }
}

/**
 * @description
 * @param {Array} values
 * @returns {Array}
 */
export function getRange(values) {
  if (!values) throw new Error('no arguments')

  const min = Math.floor(Math.min.apply(null, values))
  const max = Math.ceil(Math.max.apply(null, values))

  return { min: min, max: max }
}

/**
 * @description Helper function for Math.quantileSeq() to collect only the values of a single property within one array
 * @param {*} geoJson
 * @param {String} property
 * @returns {Array}
 */
export function getNumberValues(geoJson, property) {
  if (!geoJson && !property) throw new Error('no arguments')

  let values = []

  geoJson.features.forEach((feature) => {
    if (feature.properties[property]) {
      values.push(feature.properties[property])
    }
  })
  return values
}

/**
 * @description
 * @param {String} property
 * @param {*} dataSchema
 */
export function getDataType(property, dataSchema) {
  if (!property && !dataSchema) throw new Error('no arguments')

  let dataType = undefined
  if (dataSchema.properties[property].type) {
    dataType = dataSchema.properties[property].type
  } else {
    dataType = 'enum'
  }
  return dataType
}

/**
 * @description
 * @param {Object} schema
 */
export function getSelectableProperties(schema) {
  if (!schema) throw new Error('no arguments')

  let properties = []

  for (const [key, value] of Object.entries(schema.properties)) {
    if (value.oneOf) {
      properties.push(key)
    } else if (value.type == 'number' && value.minimum && value.maximum) {
      properties.push(key)
    } else if (value.type == 'boolean') {
      properties.push(key)
    }
  }
  return properties
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

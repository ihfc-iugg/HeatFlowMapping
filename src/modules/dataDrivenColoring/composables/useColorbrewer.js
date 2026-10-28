import colorbrewer from 'colorbrewer'

export function useColorbrewer() {
  /**
   * @description
   * @param {number} nrOfClasses
   * @returns
   */
  function getSchemaColors(colorSchema, nrOfClasses) {
    console.log('getSchemaCOlor nrOfClass')
    console.log(nrOfClasses)
    try {
      console.log('getSchemaCOlor colorbrewer')
      console.log(colorbrewer[colorSchema][nrOfClasses])
      return colorbrewer[colorSchema][nrOfClasses]
    } catch (error) {
      console.log(error)
    }
  }
  return { getSchemaColors }
}

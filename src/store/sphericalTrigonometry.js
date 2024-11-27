import { defineStore } from 'pinia'

export const useSphericalTrigonometry = defineStore('spherical trgonometry', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */

  /**
   * @description Get alpha with three known sides a, b, c (in radians units) through spherical law of cosines
   * https://en.wikipedia.org/wiki/Solution_of_triangles#Solving_spherical_triangles
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @returns
   */
  function calculateAlpha(a, b, c) {
    // Ensure that the sides are in radians
    try {
      const cosA = (Math.cos(a) - Math.cos(b) * Math.cos(c)) / (Math.sin(b) * Math.sin(c))
      console.log('cosA: ' + cosA)

      // Clamp the value to avoid NaN from acos
      const angleA = Math.acos(Math.max(-1, Math.min(1, cosA)))
      console.log('A: ' + angleA)
      return angleA // Returns angle A in radians
    } catch (error) {
      console.log('Error in calculating angle alpha')
    }
  }

  /**
   * @description calculate b within a right spherical triangle (distance along the profile line where the data point is projected verticaly)
   * source: https://tu-dresden.de/bu/umwelt/geo/ipg/astro/ressourcen/dateien/skripte/Vorl-sp-trig.pdf?lang=en slide 73
   * @param {number} alpha
   * @param {number} c
   * @returns
   */
  function calculateB(alpha, c) {
    // Ensure angles are in radians
    const cosAlpha = Math.cos(alpha)
    const tanC = Math.tan(c) // Calculate tan(c)

    // Calculate tan(b)
    const tanB = cosAlpha * tanC

    // Clamp the value for valid input to atan
    const validTanB = Math.max(-1, Math.min(1, tanB))

    // Calculate b in radians
    const b = Math.atan(validTanB)

    return b // Returns b in radians
  }

  /**
   * @description calculate a within a right spherical triangle (the vertical distance of the data point and the profile line)
   * source: https://tu-dresden.de/bu/umwelt/geo/ipg/astro/ressourcen/dateien/skripte/Vorl-sp-trig.pdf?lang=en slide 73
   * @param {number} alpha
   * @param {number} c
   * @returns
   */
  function calculateA(alpha, c) {
    // Ensure angles are in radians
    const sinAlpha = Math.sin(alpha) // Calculate sin(alpha)
    const sinC = Math.sin(c) // Calculate sin(c)

    // Calculate sin(a)
    const sinA = sinAlpha * sinC

    // Clamp the value to ensure it's within the valid range for arcsin
    const validSinA = Math.max(-1, Math.min(1, sinA))

    // Calculate a in radians
    const a = Math.asin(validSinA)

    return a // Returns a in radians
  }

  return { calculateAlpha, calculateB, calculateA }
})

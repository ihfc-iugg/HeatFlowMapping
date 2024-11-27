import { describe, beforeEach, it } from 'vitest'

import { setActivePinia, createPinia } from 'pinia'
import { useSphericalTrigonometry } from '../sphericalTrigonometry.js'

describe('Spherical trigonometry store', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })

  it('should return a known value', () => {
    const spherTrig = useSphericalTrigonometry()
    // Case where all angles are the same (i.e., near equal sides in spherical geometry)
    const result = spherTrig.calculateAlpha(Math.PI / 3, Math.PI / 3, Math.PI / 3)
    expect(result).toBeCloseTo(1.230959, 5) // The result should be a very small value close to zero
  })

  it('should return NaN for invalid input (acos of a number greater than 1)', () => {
    const spherTrig = useSphericalTrigonometry()
    // Case where the inputs result in an invalid value (cosA > 1), expecting NaN
    const result = spherTrig.calculateAlpha(0, Math.PI / 2, Math.PI)
    expect(Number.isNaN(result)).toBe(true) // Expecting NaN
  })

  it('should return correct angle for specific known values', () => {
    const spherTrig = useSphericalTrigonometry()
    // Known case: angles in radians
    const result = spherTrig.calculateAlpha(Math.PI / 3, Math.PI / 4, Math.PI / 6)
    expect(result).toBeCloseTo(0.579, 3) // Known result for this input
  })

  it('should return angle in radians between 0 and pi', () => {
    const spherTrig = useSphericalTrigonometry()
    // Check if the result is in the valid range [0, π]
    const result = spherTrig.calculateAlpha(Math.PI / 4, Math.PI / 3, Math.PI / 2)
    expect(result).toBeGreaterThanOrEqual(0)
    expect(result).toBeLessThanOrEqual(Math.PI)
  })

  // Importiere die zu testende Funktion (falls sie in einer Datei ist)
  // const { calculateA } = require('./calculateA');

  it('should calculate the correct value of a for given alpha and c', () => {
    const spherTrig = useSphericalTrigonometry()
    // Beispielwerte, wo wir wissen, was das Ergebnis ist.
    const alpha = Math.PI / 6 // 30 Grad
    const c = Math.PI / 4 // 45 Grad

    // sin(30°) * sin(45°) = 0.5 * 0.7071 ≈ 0.3535
    // arcsin(0.3535) ≈ 0.3627
    const result = spherTrig.calculateA(alpha, c)

    expect(result).toBeCloseTo(0.3627, 4) // Vergleiche mit einer Toleranz
  })

  it('should return a value between -π/2 and π/2', () => {
    const spherTrig = useSphericalTrigonometry()
    // Werte testen, um sicherzustellen, dass das Ergebnis im richtigen Bereich bleibt.
    const alpha = Math.PI / 2 // 90 Grad
    const c = Math.PI / 2 // 90 Grad
    const result = spherTrig.calculateA(alpha, c)

    expect(result).toBeGreaterThanOrEqual(-Math.PI / 2)
    expect(result).toBeLessThanOrEqual(Math.PI / 2)
  })

  it('should handle edge cases where sinA is out of bounds', () => {
    const spherTrig = useSphericalTrigonometry()
    // Testen von Eingabewerten, die zu einem Ergebnis außerhalb des gültigen Bereichs führen könnten.
    const alpha = Math.PI / 2 // sin(90°) = 1
    const c = Math.PI / 2 // sin(90°) = 1
    const result = spherTrig.calculateA(alpha, c)

    // sinA = 1 * 1 = 1, so arcsin(1) = π/2
    expect(result).toBeCloseTo(Math.PI / 2, 4)

    // Jetzt testen wir eine Kombination, die zu einem sinA < -1 führt (z.B. sin(α) = 1, sin(c) = -1)
    const alpha2 = Math.PI / 2 // sin(90°) = 1
    const c2 = -Math.PI / 2 // sin(-90°) = -1
    const result2 = spherTrig.calculateA(alpha2, c2)

    // sinA = 1 * (-1) = -1, so arcsin(-1) = -π/2
    expect(result2).toBeCloseTo(-Math.PI / 2, 4)
  })

  it('should handle very small values correctly', () => {
    const spherTrig = useSphericalTrigonometry()
    // Testen von sehr kleinen Winkeln
    const alpha = 0.0001 // Sehr kleiner Winkel
    const c = 0.0001 // Sehr kleiner Winkel
    const result = spherTrig.calculateA(alpha, c)

    // Da beide Winkel sehr klein sind, wird sin(α) * sin(c) auch sehr klein und das Ergebnis sollte nahe 0 liegen
    expect(result).toBeCloseTo(0, 4)
  })

  it('should handle zero values correctly', () => {
    const spherTrig = useSphericalTrigonometry()
    const alpha = 0 // sin(0) = 0
    const c = 0 // sin(0) = 0
    const result = spherTrig.calculateA(alpha, c)

    // arcsin(0) = 0
    expect(result).toBeCloseTo(0, 4)
  })

  it('should work with negative angles', () => {
    const spherTrig = useSphericalTrigonometry()
    const alpha = -Math.PI / 4 // -45 Grad
    const c = Math.PI / 4 // 45 Grad
    const result = spherTrig.calculateA(alpha, c)

    // sin(-45°) * sin(45°) = -0.7071 * 0.7071 = -0.5
    // arcsin(-0.5) ≈ -0.5236
    expect(result).toBeCloseTo(-0.5236, 4)
  })
})

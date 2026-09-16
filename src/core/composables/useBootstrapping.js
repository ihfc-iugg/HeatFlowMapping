/**
 * @description Reusable composable to calculate subsurface temperature in relation to depth intervals with bootstrapping method.
 */
export function useBootstrapping() {
  /**
   * @description calculates the temperature within a certain depth
   * @param {number} t0 ground surface temperature
   * @param {number} qTop
   * @param {number} dZi thickness of layer
   * @param {number} k thermal conductivity
   * @param {number} a heat production
   * @returns {number} temperature
   */
  function calcTemperature(qTop, dZi, k, a) {
    return (qTop * dZi) / k - ((a / 1000000) * (dZi * dZi)) / (2 * k)
  }

  function calcHeatFlowBottom(qTop, a, dZ) {
    return qTop - (a / 1000000) * dZ
  }

  /**
   * @description Bootstrapping the layers with initial values for temperature and heat flow.
   * @param {Array} layers
   * @param {number} t0 °C
   * @param {number} q0 mW/m^2 10^-3
   */
  function bootstrapping(layers, t0, q0) {
    // q0 mW 10^-3 (Milliwatt)
    // ground surface temperature = top temperature of the first layer
    layers[0].tTop = t0
    // q at surface from mW to W
    layers[0].qTop = q0 / 1000
    // initial value for temperature
    let temp = structuredClone(t0)
    for (let ix = 0; ix < layers.length; ix++) {
      let l = layers[ix]
      // calc q at the bottom if the ix layer
      l.qBot = calcHeatFlowBottom(l.qTop, l.a, l.dZ)
      // sum temperature
      temp = temp + calcTemperature(l.qTop, l.dZ, l.k, l.a)
      l.tBot = structuredClone(temp)
      // console.log('akk temp: ' + temp)
      if (ix < layers.length - 1) {
        layers[ix + 1].tTop = l.tBot
        layers[ix + 1].qTop = l.qBot
      }
    }
    return layers
  }

  return { bootstrapping }
}

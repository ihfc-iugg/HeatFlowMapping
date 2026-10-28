export function createControlRegistry(map) {
  if (!map) throw new Error('no arguments')

  const controls = new Map()

  return {
    add(name, control, position = 'top-right') {
      if (!name || !control) throw new Error('no arguments')

      if (controls.has(name)) this.remove(name)
      map.addControl(control, position)
      controls.set(name, control)
      return control
    },

    get(name) {
      if (!name) throw new Error('no arguments')

      return controls.get(name) ?? null
    },

    has(name) {
      if (!name) throw new Error('no arguments')

      return controls.has(name)
    },

    remove(name) {
      if (!name) throw new Error('no arguments')

      const control = controls.get(name)
      if (!control) return
      map.removeControl(control)
      controls.delete(name)
    },

    removeAll() {
      controls.forEach((c) => map.removeControl(c))
      controls.clear()
    },

    entries() {
      return [...controls.entries()]
    }
  }
}

import { Map, IControl, Popup } from 'maplibre-gl'
import clickInfoSVG from '@/shared/assets/icons/click_infochatgpt_orig.svg?raw'

/**
 * @implements {IControl}
 */
export class FeatureInfoControl {
  _map = null
  _enabled = null
  _featureInfoButton = null
  _container = null
  _selectedPoint = null
  _popup = new Popup()
  _svg = clickInfoSVG
  layer = null
  hasPopup = false
  eventTarget = new EventTarget()

  /**
   *
   * @param {Object} options
   */
  constructor(options) {
    this._enabled = true
    this.layer = options && options.layer ? options.layer : console.log('please provide a layer')
    if (options && options.container) {
      if (options.container instanceof HTMLElement) {
        this._container = options.container
      } else {
        warnOnce("Feature info control 'container' must be a DOM element.")
      }
    }
  }
  /**
   *
   * @param {Map} map
   * @returns {HTMLElement}
   */
  onAdd(map) {
    if (!map) throw new Error('no arguments')

    this._map = map
    this._container = document.createElement('div')
    this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group'
    this._setupUI()
    return this._container
  }

  /**
   * @description
   */
  onRemove() {
    this._container.parentNode.removeChild(this._container)
    this._map = null
  }

  /**
   * @description
   */
  _setupUI() {
    const button = (this._featureInfoButton = document.createElement('button'))
    button.type = 'button'
    button.className = 'maplibregl-ctrl-icon'
    button.setAttribute('title', 'Disable point info on click')
    button.innerHTML = this._svg
    this._enableFeatureInfo()
    this._setSVGColor(this._enabled ? '#55C2E9' : '#000000')
    button.addEventListener('click', () => this._toggleFeatureInfo())
    this._container.appendChild(button)
  }

  /**
   * @description Find the SVG element inside the button and set its fill color
   * @param {string} color
   */
  _setSVGColor(color) {
    if (!color) throw new Error('no arguments')

    const svg = this._featureInfoButton.querySelector('svg')
    if (svg) {
      // this._svg.setAttribute('fill', color)
      // Also set fill for all paths inside the SVG
      svg.querySelectorAll('path').forEach((path) => {
        path.setAttribute('fill', color)
      })
    }
  }

  /**
   * @description
   */
  _toggleFeatureInfo() {
    this._enabled = !this._enabled
    this._enabled
    if (this._enabled) this._enableFeatureInfo()
    else this._disableFeatureInfo()
  }

  /**
   * @description
   */
  _enableFeatureInfo() {
    this._onMouseEnter
    this._onMouseLeave
    this._map.on('click', this.layer, this._onClickSites.bind(this))
    this._map.on('mouseenter', this.layer, this._onMouseEnter)
    this._map.on('mouseleave', this.layer, this._onMouseLeave)
    this._popup.on('close', this._onPopupClose)
    this._featureInfoButton.title = 'Disable point info on click'
    this._setSVGColor('#55C2E9')
  }

  /**
   * @description
   * @returns {Object}
   */
  getSelectedPoint() {
    return this._selectedPoint
  }

  /**
   * @description
   * @returns {Popup}
   */
  getPopup() {
    return this._popup
  }

  /**
   * @description Method to trigger event on popup state change
   * @param {*} value
   */
  _setHasPopup(value) {
    // if (!value) throw new Error('no arguments')

    if (this.hasPopup !== value) {
      this.hasPopup = value
      const event = new CustomEvent('hasPopupChanged', {
        detail: { hasPopup: this.hasPopup } // Pass the new state in the event detail
      })
      this.eventTarget.dispatchEvent(event) // Dispatch the event
    }
  }

  /**
   * @description
   * @param {*} value
   */
  _setSelectedPoint(value) {
    if (!value) throw new Error('no arguments')

    this._selectedPoint = value
    const event = new CustomEvent('selectedPointChanged', {
      detail: { selectedPoint: this._selectedPoint } // Pass the new state in the event detail
    })
    this.eventTarget.dispatchEvent(event) // Dispatch the event
  }

  /**
   * @description
   */
  _onMouseEnter = () => {
    this._map.getCanvas().style.cursor = 'pointer'
  }

  /**
   * @description
   */
  _onMouseLeave = () => {
    this._map.getCanvas().style.cursor = ''
  }

  /**
   * @description
   * @param {*} e
   */
  _onClickSites(e) {
    if (!e) throw new Error('no arguments')

    if (this._enabled) {
      this._setSelectedPoint(e.features[0])
      const coordinates = e.features[0].geometry.coordinates.slice()

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }

      this._popup.setLngLat(coordinates)
      this._popup.setHTML('')
      this._popup.addTo(this._map)
      this._setHasPopup(true) // Set hasPopup to true
    }
  }

  /**
   * @description
   */
  _onPopupClose = () => {
    this._setHasPopup(false) // Set hasPopup to false
  }

  /**
   * @description Use this method to listen to changes in hasPopup from the Vue component
   * @param {*} callback
   */
  onHasPopupChanged(callback) {
    if (!callback) throw new Error('no arguments')

    this.eventTarget.addEventListener('hasPopupChanged', (event) => {
      callback(event.detail.hasPopup) // Pass the updated hasPopup value
    })
  }

  /**
   * @description Use this method to listen to changes in hasPopup from the Vue component
   * @param {*} callback
   */
  onSelectedPointChanged(callback) {
    if (!callback) throw new Error('no arguments')

    this.eventTarget.addEventListener('selectedPointChanged', (event) => {
      callback(event.detail.selectedPoint) // Pass the updated selectedPoint value
    })
  }

  /**
   * @description Remove the event listeners using the stored function references.
   */
  _disableFeatureInfo() {
    this._map.off('click', this.layer, this._onClickSites)
    this._map.off('mouseenter', this.layer, this._onMouseEnter)
    this._map.off('mouseleave', this.layer, this._onMouseLeave)
    this._popup.off('close', this._onPopupClose)
    this._featureInfoButton.title = 'Enable point info on click'
    this._setSVGColor('#000000')
  }
}

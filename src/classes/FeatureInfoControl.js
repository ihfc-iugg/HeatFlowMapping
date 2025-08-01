import { Map, IControl, Popup } from 'maplibre-gl'
import clickInfo from '@/assets/img/click_infochatgpt_orig.svg'

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
  layerID = null
  hasPopup = false
  eventTarget = new EventTarget()

  constructor(options) {
    this._enabled = true
    this.layerID =
      options && options.layerID ? options.layerID : console.log('please provide a layerID')
    console.log('konstruktor feat info')
    console.log(this.layerID)
    if (options && options.container) {
      if (options.container instanceof HTMLElement) {
        this._container = options.container
      } else {
        warnOnce("Full screen control 'container' must be a DOM element.")
      }
    }
  }
  /**
   *
   * @param {Map} map
   * @returns {HTMLElement}
   */
  onAdd(map) {
    this._map = map
    this._container = document.createElement('div')
    this._container.className = 'maplibregl-ctrl maplibregl-ctrl-group'
    this._setupUI()
    return this._container
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container)
    this._map = null
  }

  _setupUI() {
    const button = (this._featureInfoButton = document.createElement('button'))
    button.type = 'button'
    button.className = 'mapboxgl-ctrl-icon'
    button.setAttribute('title', 'Disable point info on click')
    this._enableFeatureInfo()
    fetch(clickInfo)
      .then((response) => response.text())
      .then((svg) => {
        button.innerHTML = svg
        this._setSVGColor(this._enabled ? '#55C2E9' : '#000000')
      })
    button.addEventListener('click', () => this._toggleFeatureInfo())
    this._container.appendChild(button)
  }

  _setSVGColor(color) {
    // Find the SVG element inside the button and set its fill color
    const svg = this._featureInfoButton.querySelector('svg')
    if (svg) {
      svg.setAttribute('fill', color)
      // Also set fill for all paths inside the SVG
      svg.querySelectorAll('path').forEach((path) => {
        path.setAttribute('fill', color)
      })
    }
  }

  _toggleFeatureInfo() {
    this._enabled = !this._enabled
    if (this._enabled) {
      this._enableFeatureInfo()
      this._featureInfoButton.title = 'Disable point info on click'
      this._setSVGColor('#55C2E9')
    } else {
      this._disableFeatureInfo()
      this._featureInfoButton.title = 'Enable point info on click'
      this._setSVGColor('#000000')
    }
  }

  _enableFeatureInfo() {
    this._onMouseEnter
    this._onMouseLeave
    this._map.on('click', this.layerID, this._onClickSites.bind(this))
    this._map.on('mouseenter', this.layerID, this._onMouseEnter)
    this._map.on('mouseleave', this.layerID, this._onMouseLeave)
    this._popup.on('close', this._onPopupClose)
  }

  getSelectedPoint() {
    return this._selectedPoint
  }

  getPopup() {
    return this._popup
  }

  // Method to trigger event on popup state change
  _setHasPopup(value) {
    if (this.hasPopup !== value) {
      this.hasPopup = value
      const event = new CustomEvent('hasPopupChanged', {
        detail: { hasPopup: this.hasPopup } // Pass the new state in the event detail
      })
      this.eventTarget.dispatchEvent(event) // Dispatch the event
    }
  }

  _setSelectedPoint(value) {
    this._selectedPoint = value
    const event = new CustomEvent('selectedPointChanged', {
      detail: { selectedPoint: this._selectedPoint } // Pass the new state in the event detail
    })
    this.eventTarget.dispatchEvent(event) // Dispatch the event
  }

  _onMouseEnter = () => {
    this._map.getCanvas().style.cursor = 'pointer'
  }
  _onMouseLeave = () => {
    this._map.getCanvas().style.cursor = ''
  }

  _onClickSites(e) {
    if (this._enabled) {
      console.log('hier event wenn sites geklickt wird')
      console.log(e)
      this._setSelectedPoint(e.features[0])
      const coordinates = e.features[0].geometry.coordinates.slice()

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }

      this._popup.setLngLat(coordinates)
      this._popup.addTo(this._map)
      this._setHasPopup(true) // Set hasPopup to true
    }
  }

  _onPopupClose = () => {
    this._setHasPopup(false) // Set hasPopup to false
  }
  // Use this method to listen to changes in hasPopup from the Vue component
  onHasPopupChanged(callback) {
    this.eventTarget.addEventListener('hasPopupChanged', (event) => {
      callback(event.detail.hasPopup) // Pass the updated hasPopup value
    })
  }

  // Use this method to listen to changes in hasPopup from the Vue component
  onSelectedPointChanged(callback) {
    this.eventTarget.addEventListener('selectedPointChanged', (event) => {
      callback(event.detail.selectedPoint) // Pass the updated selectedPoint value
    })
  }

  _disableFeatureInfo() {
    // Remove the event listeners using the stored function references.

    this._map.off('click', this.layerID, this._onClickSites)
    this._map.off('mouseenter', this.layerID, this._onMouseEnter)
    this._map.off('mouseleave', this.layerID, this._onMouseLeave)
    this._popup.off('close', this._onPopupClose)
  }
}

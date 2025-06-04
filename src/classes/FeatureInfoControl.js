import { Map, IControl, Popup } from 'maplibre-gl'
import clickInfo from '@/assets/img/click_infochatgpt_orig.svg'

/**
 * @implements {IControl}
 */
export class FeatureInfoControl {
  _map = null
  _enabled = false
  _featureInfoButton = null
  _container = null
  _selectedPoint = null
  _popup = new Popup()
  hasPopup = false
  eventTarget = new EventTarget()

  constructor(options) {
    this._enabled = false

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
    button.setAttribute('title', 'Enable point info')
    fetch(clickInfo)
      .then((response) => response.text())
      .then((svg) => {
        button.innerHTML = svg
      })
    button.innerHTML = this._featureInfoButton.addEventListener('click', () =>
      this._toggleFeatureInfo()
    )
    this._container.appendChild(button)
  }

  _toggleFeatureInfo() {
    this._enabled = !this._enabled
    if (this._enabled) {
      this._enableFeatureInfo()
      this._featureInfoButton.title = 'Disable point info on click'
    } else {
      this._disableFeatureInfo()
      this._featureInfoButton.title = 'Enable point info on click'
    }
  }

  _enableFeatureInfo() {
    this._onMouseEnter
    this._onMouseLeave
    this._map.on('click', 'clickableLayer', this._onClickSites.bind(this))
    this._map.on('mouseenter', 'clickableLayer', this._onMouseEnter)
    this._map.on('mouseleave', 'clickableLayer', this._onMouseLeave)
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

    this._map.off('click', 'sites', this._onClickSites)
    this._map.off('mouseenter', 'sites', this._onMouseEnter)
    this._map.off('mouseleave', 'sites', this._onMouseLeave)
    this._popup.off('close', this._onPopupClose)
  }
}

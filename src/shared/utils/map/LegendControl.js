import { Map, IControl } from 'maplibre-gl'
import listSVG from '@/shared/assets/icons/list-ul.svg?raw'
import observer from '../observer/observer'

function testObserer() {
  console.log('hallöchen inside testObserver')
  console.log(app.map.getPaintProperty(GHFDB.r2024.id, 'circle-color'))
}

observer.subscribe(testObserer)

/**
 * @implements {IControl}
 */
export class LegendControl {
  _map = null
  _mapContainer = null
  _container = null
  _button = null
  _panel = null
  isOpen = false
  layer = null
  eventTarget = new EventTarget()

  /**
   *
   * @param {Object} options
   */
  constructor(options) {
    this._isOpen = false
    this.layer = options && options.layer ? options.layer : console.log('please provide a layer')
    if (options && options.container) {
      if (options.container instanceof HTMLElement) {
        this._container = options.container
      } else {
        warnOnce("Legend control 'container' must be a DOM element.")
      }
    }
  }

  /**
   * @description
   * @param {Map} map
   * @returns
   */
  onAdd(map) {
    if (!map) throw new Error('no arguments')

    this._map = map

    // this._mapContainer = map.getContainer()
    this._container = this._createContainer()
    console.log('this._container')
    console.log(this._container)
    this._button = this._createButton()
    console.log('this._button')
    console.log(this._button)
    // this._panel = this._createPanel()

    this._container.appendChild(this._button)
    // this._mapContainer.appendChild(this._panel)

    return this._container
  }

  /**
   * @description
   */
  onRemove() {
    this._container.parentNode.removeChild(this._container)
    this._map = null
  }

  // /**
  //  * @description
  //  */
  // _setupUI() {
  //   const button = (this._legeButton = document.createElement('button'))
  //   button.type = 'button'
  //   button.className = 'mapboxgl-ctrl-icon'
  //   button.setAttribute('title', 'Open Legend')
  //   button.innerHTML = listSVG
  //   // this._enableFeatureInfo()
  //   // this._setSVGColor(this._enabled ? '#55C2E9' : '#000000')
  //   button.addEventListener('click', () => this._toggleLegend())
  //   this._container.appendChild(button)
  // }

  /**
   * @description
   * @returns {HTMLElement}
   */
  _createContainer() {
    const container = document.createElement('div')
    container.className = 'maplibregl-ctrl maplibregl-ctrl-group'

    return container
  }

  /**
   * @description
   * @returns {HTMLElement}
   */
  _createButton() {
    const button = (this._button = document.createElement('button'))

    button.type = 'button'
    button.className = 'mapboxgl-ctrl-icon'
    button.setAttribute('title', 'Open Legend')
    button.innerHTML = listSVG
    this._setSVGColor(this._isOpen ? '#55C2E9' : '#000000')
    button.addEventListener('click', () => this._toggleLegend())

    return button
  }

  //   /**
  //    * @description
  //    * @returns {HTMLElement}
  //    */
  //   _createPanel() {
  //     let panel = document.createElement('div')

  //     return panel
  //   }

  /**
   * @description Find the SVG element inside the button and set its fill color
   * @param {string} color
   */
  _setSVGColor(color) {
    if (!color) throw new Error('no arguments')

    const svg = this._button.querySelector('svg')
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
  _toggleLegend() {
    this._isOpen = !this._isOpen
    if (this._isOpen) {
      this._openLegend()
    } else this._closeLegend()
    const event = new CustomEvent('onOpen', {
      detail: { isOpen: this.isOpen } // Pass the new state in the event detail
    })
    this.eventTarget.dispatchEvent(event) // Dispatch the event
  }

  /**
   * @description
   */
  _openLegend() {
    this._button.title = 'Close Legend'
    this._setSVGColor('#55C2E9')
  }

  /**
   * @description
   */
  _closeLegend() {
    this._button.title = 'Open Legend'
    this._setSVGColor('#000000')
  }

  /**
   * @description Use this method to listen to changes in hasPopup from the Vue component
   * @param {*} callback
   */
  onOpen(callback) {
    if (!callback) throw new Error('no arguments')

    this.eventTarget.addEventListener('onOpen', (event) => {
      callback(event.detail.isOpen) // Pass the updated selectedPoint value
    })
  }
}

// /**
//  * A `GlobeControl` control contains a button for toggling the map projection between "mercator" and "globe".
//  *
//  * @group Markers and Controls
//  *
//  * @example
//  * ```ts
//  * let map = new Map()
//  *     .addControl(new GlobeControl());
//  * ```
//  *
//  * @see [Display a globe with a fill extrusion layer](https://maplibre.org/maplibre-gl-js/docs/examples/display-a-globe-with-a-fill-extrusion-layer/)
//  * @see [Sky, Fog, Terrain](https://maplibre.org/maplibre-gl-js/docs/examples/sky-fog-terrain/)
//  */
// export class GlobeControl implements IControl {
//     _map: Map;
//     _container: HTMLElement;
//     _globeButton: HTMLButtonElement;

//     /** {@inheritDoc IControl.onAdd} */
//     onAdd(map: Map): HTMLElement {
//         this._map = map;
//         this._container = DOM.create('div', 'maplibregl-ctrl maplibregl-ctrl-group');
//         this._globeButton = DOM.create('button', 'maplibregl-ctrl-globe', this._container);
//         DOM.create('span', 'maplibregl-ctrl-icon', this._globeButton).setAttribute('aria-hidden', 'true');
//         this._globeButton.type = 'button';
//         this._globeButton.addEventListener('click', this._toggleProjection);

//         this._updateGlobeIcon();
//         this._map.on('styledata', this._updateGlobeIcon);
//         this._map.on('projectiontransition', this._updateGlobeIcon);
//         return this._container;
//     }

//     /** {@inheritDoc IControl.onRemove} */
//     onRemove(): void {
//         this._container.remove();
//         this._map.off('styledata', this._updateGlobeIcon);
//         this._map.off('projectiontransition', this._updateGlobeIcon);
//         this._globeButton.removeEventListener('click', this._toggleProjection);
//         this._map = undefined;
//     }

//     _toggleProjection = (): void => {
//         const currentProjection = this._map.getProjection()?.type;
//         if (currentProjection === 'mercator' || !currentProjection) {
//             this._map.setProjection({type: 'globe'});
//         } else {
//             this._map.setProjection({type: 'mercator'});
//         }
//         this._updateGlobeIcon();
//     };

//     _updateGlobeIcon = (): void => {
//         this._globeButton.classList.remove('maplibregl-ctrl-globe');
//         this._globeButton.classList.remove('maplibregl-ctrl-globe-enabled');
//         if (this._map.getProjection()?.type === 'globe') {
//             this._globeButton.classList.add('maplibregl-ctrl-globe-enabled');
//             this._globeButton.title = this._map._getUIString('GlobeControl.Disable');
//         } else {
//             this._globeButton.classList.add('maplibregl-ctrl-globe');
//             this._globeButton.title = this._map._getUIString('GlobeControl.Enable');
//         }
//     };
// }

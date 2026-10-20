import { point } from '@turf/turf'
import axios from 'axios'

/**
 * @description
 */
export function useWMS() {
  /**
   * @param {Sting} serviceURL
   * @param {String} service
   * @param {String} version
   * @param {String} request
   * @param {String} layers
   * @param {String} style
   * @param {String} crs
   * @param {Object} sw
   * @param {Object} ne
   * @param {String} queryLayer
   * @returns {Promise<Number>}
   * @link https://docs.geoserver.org/stable/en/user/services/wms/reference.html#getfeatureinfo
   */
  async function getFeatureInfo(wmsURL, layer, style, crs, boundsSW, boundsNE, canvas, point) {
    // https://sdi.gfz.de/geoserver/ows?
    // service=WMS
    // &version=1.1.1
    // &request=GetFeatureInfo
    // &layers=geonode%3Acrust1_rho_r01_middle_crust_thickness
    // &styles=
    // &srs=EPSG%3A4326
    // &bbox=-42.84667968749994%2C+-31.27855085894584%2C+42.84667968749852%2C+31.278550858947042
    // &width=1218
    // &height=937
    // &query_layers=geonode%3Acrust1_rho_r01_middle_crust_thickness
    // &x=642
    // &y=418
    // &info_format=application%2Fjson

    // south, west, north, east
    const bbox = [boundsSW.lng, boundsSW.lat, boundsNE.lng, boundsNE.lat].join(',')

    let url = new URL(wmsURL)
    url.search = new URLSearchParams({
      service: 'WMS',
      version: '1.1.1',
      request: 'GetFeatureInfo',
      layers: layer,
      styles: style,
      srs: crs,
      bbox: bbox,
      width: canvas.clientWidth,
      height: canvas.clientHeight,
      query_layers: layer,
      x: Math.round(point.x),
      y: Math.round(point.y),
      info_format: 'application/json',
      FEATURE_COUNT: 1,
      FORMAT: 'image/png'
    })

    const response = await axios.get(url)

    return response.data
  }

  /**
   * @param {String} wmsURL
   * @param {String} layer
   * @param {String} style
   * @param {String} srs
   * @param {Object} sw
   * @param {Object} ne
   * @param {String} queryLayer
   * @returns {Promise<Number>}
   * @link https://docs.geoserver.org/stable/en/user/services/wms/reference.html#getmap
   */
  function getMapURL(wmsURL, layer, style, srs, sw, ne, width, height, format) {
    const url = new URL(wmsURL)
    url.search = new URLSearchParams({
      service: 'WMS',
      version: '1.1.1',
      request: 'GetMap',
      layers: layer,
      styles: style,
      srs: srs,
      bbox: `${sw.lng}, ${sw.lat}, ${ne.lng}, ${ne.lat}`,
      width: width,
      height: height,
      format: format
    })

    return url
  }

  return { getFeatureInfo, getMapURL }
}

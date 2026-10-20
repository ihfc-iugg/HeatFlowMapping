export const BASEMAPS = Object.freeze({
  open_street_map: {
    id: 'open_street_map',
    title: 'OpenStreetMap',
    cardImage: 'https://a.tile.openstreetmap.org/0/0/0.png',
    tiles: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap Contributors'
  },
  open_topo_map: {
    id: 'open_topo_map',
    title: 'OpenTopoMap',
    cardImage: 'https://a.tile.opentopomap.org/0/0/0.png',
    tiles: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution:
      "Kartendaten: <a href='https://openstreetmap.org/copyright'>© OpenStreetMap-Mitwirkende</a>, <a href='http://viewfinderpanoramas.org/'>SRTM</a> | Kartendarstellung: <a href='https://opentopomap.org/'>© OpenTopoMap</a> <a href='https://creativecommons.org/licenses/by-sa/3.0/'>CC-BY-SA</a>"
  },
  world_bathymetry: {
    id: 'world_bathymetry',
    title: 'World Bathymetry',
    cardImage:
      'https://services.ga.gov.au/gis/rest/services/World_Bathymetry_Base_Map/MapServer/WMTS/tile/1.0.0/World_Bathymetry_Base_Map/default/default028mm/0/0/0.png',
    tiles:
      'https://services.ga.gov.au/gis/rest/services/World_Bathymetry_Base_Map/MapServer/WMTS/tile/1.0.0/World_Bathymetry_Base_Map/default/default028mm/{z}/{y}/{x}.png',
    attribution:
      "Map tiles by <a href='https://ecat.ga.gov.au/geonetwork/srv/api/records/62030aca-329d-44b2-8b36-c74a5ac1f574'>World Bathymetry Base Map WMTS</a>, <a href='https://creativecommons.org/licenses/'>CC BY 4.0</a>"
  },
  esri_world_physical: {
    id: 'esri_world_physical',
    title: 'ESRI World Physical',
    cardImage:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/0/0/0.png',
    tiles:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}.png',
    attribution: 'Tiles &copy; Esri &mdash; Source: US National Park Service'
  },
  esri_world_imagery: {
    id: 'esri_world_imagery',
    title: 'ESRI World Imagery',
    cardImage:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/0/0/0.png',
    tiles:
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}.png',
    attribution:
      'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  esri_ocean_basemap: {
    id: 'esri_ocean_basemap',
    title: 'ESRI Ocean Basemap',

    cardImage:
      'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/0/0/0.png',
    tiles:
      'https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}.png',
    attribution:
      'Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri'
  },
  world_light_gray: {
    id: 'world_light_gray',
    title: 'World Light Gray',
    cardImage:
      'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/0/0/0.png',
    tiles:
      'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png',
    attribution:
      'Sources: Esri, HERE, Garmin, © OpenStreetMap contributors, and the GIS User Community'
  },
  bluemarble: {
    id: 'bluemarble',
    title: 'Bluemarble',
    cardImage:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:basemap_bluemarble/EPSG:3857x2/EPSG:3857x2:0/0/0?format=image/png',
    // 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/0/0/0.png',
    tiles:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:basemap_bluemarble/EPSG:3857x2/EPSG:3857x2:{z}/{y}/{x}?format=image/png',
    // 'https://server.arcgisonline.com/arcgis/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}.png',
    attribution: 'Reto Stöckli, NASA Earth Observatory / Goddard Space Flight Center (GSFC)'
  }
})

export const CRUST1 = Object.freeze({
  general: {
    id: 'crust1_general',
    title: 'CRUST1.0 Crustal Model',
    wmsUrl: 'https://sdi.gfz.de/geoserver/ows',
    cardImage: '',
    tiles: '',
    attribution:
      'Laske, G., Masters., G., Ma, Z. and Pasyanos, M., Update on CRUST1.0 - A 1-degree Global Model of Earths Crust, Geophys. Res. Abstracts, 15, Abstract EGU2013-2658, 2013.<br/> https://igppweb.ucsd.edu/~gabi/rem.html; '
  },
  ice: {
    id: 'ice',
    title: 'CRUST1.0 Ice Thickness',
    // wmsLayer: 'geonode:crust1_rho_r01_ice_thickness',
    wmsLayer: 'geonode:crust1_rho_r01_ice_thickness_epsg3857',
    cardImage:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_ice_thickness/EPSG:3857x2/EPSG:3857x2:0/0/0?format=image/png',
    tiles:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_ice_thickness/EPSG:3857x2/EPSG:3857x2:{z}/{x}/{y}?format=image/png',
    attribution:
      'Laske, G., Masters., G., Ma, Z. and Pasyanos, M., Update on CRUST1.0 - A 1-degree Global Model of Earths Crust, Geophys. Res. Abstracts, 15, Abstract EGU2013-2658, 2013. <br/> https://igppweb.ucsd.edu/~gabi/rem.html; '
  },
  water: {
    id: 'water',
    title: 'CRUST1.0 Water Thickness',
    wmsLayer: 'geonode:crust1_rho_r01_water_thickness_epsg3857',
    cardImage:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_water_thickness/EPSG:3857x2/EPSG:3857x2:0/0/0?format=image/png',
    tiles:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_water_thickness/EPSG:3857x2/EPSG:3857x2:{z}/{x}/{y}?format=image/png',
    attribution:
      'Laske, G., Masters., G., Ma, Z. and Pasyanos, M., Update on CRUST1.0 - A 1-degree Global Model of Earths Crust, Geophys. Res. Abstracts, 15, Abstract EGU2013-2658, 2013. <br/> https://igppweb.ucsd.edu/~gabi/rem.html; '
  },
  upper_crust: {
    id: 'upper_crust_thickness',
    title: 'CRUST1.0 Upper Crust Thickness',
    wmsLayer: 'geonode:crust1_rho_r01_upper_crust_thickness_epsg3857',
    cardImage:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_upper_crust_thickness/EPSG:3857x2/EPSG:3857x2:0/0/0?format=image/png',
    tiles:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_upper_crust_thickness/EPSG:3857x2/EPSG:3857x2:{z}/{x}/{y}?format=image/png',
    attribution:
      'https://igppweb.ucsd.edu/~gabi/rem.html; Laske, G., Masters., G., Ma, Z. and Pasyanos, M., Update on CRUST1.0 - A 1-degree Global Model of Earths Crust, Geophys. Res. Abstracts, 15, Abstract EGU2013-2658, 2013.'
  },
  middle_crust: {
    id: 'middle_crust_thickness',
    title: 'CRUST1.0 Middle Crust Thickness',
    wmsLayer: 'geonode:crust1_rho_r01_middle_crust_thickness_epsg3857',
    cardImage:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_middle_crust_thickness/EPSG:3857x2/EPSG:3857x2:0/0/0?format=image/png',
    tiles:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_middle_crust_thickness/EPSG:3857x2/EPSG:3857x2:{z}/{x}/{y}?format=image/png',
    attribution:
      'https://igppweb.ucsd.edu/~gabi/rem.html; Laske, G., Masters., G., Ma, Z. and Pasyanos, M., Update on CRUST1.0 - A 1-degree Global Model of Earths Crust, Geophys. Res. Abstracts, 15, Abstract EGU2013-2658, 2013.'
  },
  lower_crust: {
    id: 'lower_crust_thickness',
    title: 'CRUST1.0 Lower Crust Thickness',
    wmsLayer: 'geonode:crust1_rho_r01_lower_crust_thickness_epsg3857',
    cardImage:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_lower_crust_thickness/EPSG:3857x2/EPSG:3857x2:0/0/0?format=image/png',
    tiles:
      'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_lower_crust_thickness/EPSG:3857x2/EPSG:3857x2:{z}/{x}/{y}?format=image/png',
    attribution:
      'https://igppweb.ucsd.edu/~gabi/rem.html; Laske, G., Masters., G., Ma, Z. and Pasyanos, M., Update on CRUST1.0 - A 1-degree Global Model of Earths Crust, Geophys. Res. Abstracts, 15, Abstract EGU2013-2658, 2013.'
  }
})

export const NOAA = Object.freeze({
  noaa: {
    id: 'noaa',
    title: 'NOAA Global Surface Temperature',
    // cardImage:
    //   'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_ice_thickness/EPSG:3857x2/EPSG:3857x2:0/0/0?format=image/png',
    // tiles:
    //   'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_ice_thickness/EPSG:3857x2/EPSG:3857x2:{z}/{x}/{y}?format=image/png',
    attribution:
      'Huang, Boyin; Yin, Xungang; Menne, Matthew J.; Vose, Russell S.; and Zhang, Huai-Min. 2024. NOAA Global Surface Temperature Dataset (NOAAGlobalTemp), Version 6.0. [indicate subset used]. NOAA National Centers for Environmental Information. https://doi.org/10.25921/rzxg-p717.'
  }
})

export const ECM1 = Object.freeze({
  ecm1: {
    id: 'ecm1',
    title: 'Earth Crustal Model 1',
    // cardImage:
    //   'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_ice_thickness/EPSG:3857x2/EPSG:3857x2:0/0/0?format=image/png',
    // tiles:
    //   'https://sdi.gfz.de/geoserver/gwc/service/wmts/rest/geonode:crust1_rho_r01_ice_thickness/EPSG:3857x2/EPSG:3857x2:{z}/{x}/{y}?format=image/png',
    attribution:
      'Mooney, W. D., Barrera-Lopez, C., Suárez, M. G., & Castelblanco, M. A. (2023). Earth Crustal Model 1 (ECM1): A 1° x 1° Global Seismic and Density Model. Earth-Science Reviews, 243, 104493. https://doi.org/10.1016/j.earscirev.2023.104493 '
  }
})

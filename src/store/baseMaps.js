import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useBaseMapsStore = defineStore('baseMaps', () => {
  /**
   * ref()s become state properties
   * computed()s become getters
   * function()s become actions
   */
  const baseMaps = ref([
    {
      id: 'bm_osm',
      title: 'OpenStreetMap',
      cardImage: 'https://a.tile.openstreetmap.org/0/0/0.png',
      tiles: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap Contributors'
    },
    {
      id: 'bm_otm',
      title: 'OpenTopoMap',
      cardImage: 'https://a.tile.opentopomap.org/0/0/0.png',
      tiles: 'https://a.tile.opentopomap.org/{z}/{x}/{y}.png',
      attribution:
        "Kartendaten: <a href='https://openstreetmap.org/copyright'>© OpenStreetMap-Mitwirkende</a>, <a href='http://viewfinderpanoramas.org/'>SRTM</a> | Kartendarstellung: <a href='https://opentopomap.org/'>© OpenTopoMap</a> <a href='https://creativecommons.org/licenses/by-sa/3.0/'>CC-BY-SA</a>"
    },
    {
      id: 'bm_world_bathymetry',
      title: 'Some example for WMTS',
      cardImage:
        'https://services.ga.gov.au/gis/rest/services/World_Bathymetry_Base_Map/MapServer/WMTS/tile/1.0.0/World_Bathymetry_Base_Map/default/default028mm/0/0/0.png',
      tiles:
        'https://services.ga.gov.au/gis/rest/services/World_Bathymetry_Base_Map/MapServer/WMTS/tile/1.0.0/World_Bathymetry_Base_Map/default/default028mm/{z}/{y}/{x}.png',
      attribution:
        "Map tiles by <a href='https://ecat.ga.gov.au/geonetwork/srv/api/records/62030aca-329d-44b2-8b36-c74a5ac1f574'>World Bathymetry Base Map WMTS</a>, <a href='https://creativecommons.org/licenses/'>CC BY 4.0</a>"
    }
  ])

  return { baseMaps }
})

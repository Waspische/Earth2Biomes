<template>
  <v-container>
    <Snackbar />
    <v-card id="menu-wrapper">
      <v-card-title>
        <span>Earth2 Biomes</span>
        <v-spacer />
        <v-icon>mdi-earth</v-icon>
      </v-card-title>
      <v-expansion-panels>
        <v-expansion-panel
          v-for="biome in biomes"
          :key="biome.name"
          class="mt-0"
        >
          <v-divider />
          <v-expansion-panel-header>
            {{ biome.name }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-radio-group
              v-model="selectedLanduse"
              class="ma-0"
              hide-details="auto"
            >
              <v-radio
                v-for="landuse in biome.landuses"
                :key="landuse.name"
                :value="landuse"
                :label="`${landuse.name}`"
                @click="onLanduseSelection(landuse)"
              />
            </v-radio-group>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <v-layout id="map-wrapper" fluid>
      <v-flex id="map" />
    </v-layout>
  </v-container>
</template>

<script>
import Vue from 'vue'
import mapboxgl from 'mapbox-gl'
import centroid from '@turf/centroid'
import Snackbar from '../components/Snackbar'
import MapPopup from '~/components/MapPopup'

export default {
  name: 'MapboxMap',
  components: {
    Snackbar
  },
  data () {
    return {
      biomes: [
        {
          name: 'Quarries',
          landuses: [
            {
              key: 'gold',
              name: 'Gold',
              color: '#FFD700',
              type: 'quarry'
            },
            {
              key: 'coal',
              name: 'Coal',
              color: '#36454f',
              type: 'quarry'
            },
            {
              key: 'uranium',
              name: 'Uranium',
              color: '#757575',
              type: 'quarry'
            },
            {
              key: 'silver',
              name: 'Silver',
              color: '#C0C0C0',
              type: 'quarry'
            },
            {
              key: 'iron_ore',
              name: 'Iron ore',
              color: '#4e4f55',
              type: 'quarry'
            },
            {
              key: 'copper',
              name: 'Copper',
              color: '#b87333',
              type: 'quarry'
            },
            {
              key: 'marble',
              name: 'Marble',
              color: '#596e7f',
              type: 'quarry'
            }
          ]
        },
        {
          name: 'Gem stones',
          landuses: [
            {
              key: 'diamond',
              name: 'Diamond',
              color: '#b9f2ff',
              type: 'quarry'
            },
            {
              key: 'opal',
              name: 'Opal',
              color: '#a8c3bc',
              type: 'quarry'
            },
            {
              key: 'amethyst',
              name: 'Amethyst',
              color: '#9966cc',
              type: 'quarry'
            },
            {
              key: 'quartz',
              name: 'Quartz',
              color: '#DDDDDF',
              type: 'quarry'
            },
            {
              key: 'ruby',
              name: 'Ruby',
              color: '#e0115f',
              type: 'quarry'
            }
          ]
        },
        {
          name: 'Urban',
          landuses: [
            {
              name: 'Cities',
              fileName: 'cities/cities',
              type: 'urban'
            }
          ]
        },
        {
          name: 'Petroleum well',
          landuses: [
            {
              name: 'Oil',
              fileName: 'oilWells',
              color: '#494c4f',
              type: 'well'
            },
            {
              name: 'Gas',
              fileName: 'gasWells',
              color: '#ffdf46',
              type: 'well'
            },
            {
              name: 'Offshore',
              fileName: 'offshoreWells',
              color: '#cad7d9',
              type: 'well'
            }
          ]
        }
      ],
      quarriesTypes: [],
      selectedLanduse: null,
      previousLanduse: null,
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      landuseLocation: {
        id: 'landuseLocation',
        source: 'landuse',
        type: 'circle',
        paint: {
          'circle-radius': 4,
          'circle-stroke-color': '#000',
          'circle-stroke-width': 1,
          'circle-opacity': 0.6
        }
      },
      citiesLocation: {
        id: 'citiesLocation',
        source: 'urban',
        type: 'symbol',
        layout: {
          'icon-image': 'town-hall-15',
          'icon-allow-overlap': true,
          'text-font': [
            'Open Sans Bold',
            'Arial Unicode MS Bold'
          ]
        },
        paint: {
          'text-color': '#202',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      }
    }
  },
  async mounted () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWlzaHdlcnlhIiwiYSI6ImNrYzVyYXBlNzBrZGgzMG8wc3FtZjU5NDAifQ.u4azaXjkh41xSMC1NJLhTw'

    // create a new mapbox instance
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle,
      zoom: 1, // starting zoom
      sprite: 'mapbox://sprites/mapbox/bright-v8'
    })
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    this.map.on('load', this.onMapLoad)
    this.map.on('zoom', this.onZoom)
    // this.map.on('sourcedataloading', this.onSourceDataLoading)

    this.quarriesTypes = await fetch(
      '/data/mines/OSM_quarriesTypes.json'
    ).then(res => res.json())
  },
  methods: {
    onMapLoad (event) {
      this.map.addSource('landuse', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })

      this.map.addSource('urban', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })

      this.map.addLayer(this.landuseLocation)
      this.map.addLayer(this.citiesLocation)
      this.map.setLayoutProperty('landuseLocation', 'visibility', 'none')
      this.map.on('click', 'landuseLocation', this.onFeatureClick)
      this.map.on('click', 'citiesLocation', this.onCityClick)

      this.map.on('mouseenter', 'landuseLocation', this.onMouseEnter)
      this.map.on('mouseleave', 'landuseLocation', this.onMouseOut)
      this.map.on('mouseenter', 'citiesLocation', this.onMouseEnterCity)
      this.map.on('mouseleave', 'citiesLocation', this.onMouseOutCity)
    },
    async onLanduseSelection (landuse) {
      if (this.selectedLanduse !== this.previousLanduse) {
        const popUps = document.getElementsByClassName('mapboxgl-popup')
        /** Check if there is already a popup on the map and if so, remove it */
        if (popUps[0]) { popUps[0].remove() };

        this.previousLanduse = this.selectedLanduse
        if (landuse.type === 'quarry') {
          await this.map.getSource('landuse').setData('./data/mines/OSM_allresourcesLabels.json')
          // this.map.setFilter('landuseLocation', ['==', ['get', 'resource'], landuse.key])
          // this.map.setFilter('landuseLocation', ['==', ['get', 'disused'], 'yes'])
          // this.map.setFilter('landuseLocation', ['==', ['get', 'abandoned'], 'yes'])
          const filtered = this.quarriesTypes.filter(function (type) {
            return type.includes(landuse.key)
          })
          this.map.setFilter('landuseLocation', [
            'match',
            ['get', 'resource'],
            filtered,
            true,
            false
          ])
          this.map.setLayoutProperty('landuseLocation', 'visibility', 'visible')
          this.map.setLayoutProperty('citiesLocation', 'visibility', 'none')
          this.map.setPaintProperty('landuseLocation', 'circle-color', landuse.color)
        } else if (landuse.type === 'well') {
          await this.map.getSource('landuse').setData('./data/' + landuse.fileName + '.json')
          this.map.setFilter('landuseLocation', null)
          this.map.setLayoutProperty('landuseLocation', 'visibility', 'visible')
          this.map.setLayoutProperty('citiesLocation', 'visibility', 'none')
          this.map.setPaintProperty('landuseLocation', 'circle-color', landuse.color)
        } else if (landuse.type === 'urban') {
          await this.map.getSource('urban').setData('./data/' + landuse.fileName + '.json')
          this.map.setLayoutProperty('landuseLocation', 'visibility', 'none')
          this.map.setLayoutProperty('citiesLocation', 'visibility', 'visible')
        }
      }
    },
    onZoom () {
      // console.log(this.map.getZoom())
    },
    // Change the cursor to a pointer when the mouse is over the states layer.
    onMouseEnter () {
      this.map.getCanvas().style.cursor = 'pointer'
    },
    onMouseEnterCity (e) {
      this.map.getCanvas().style.cursor = 'pointer'
      const currentFeature = e.features[0]
      const name = (currentFeature.properties.name === undefined) ? this.selectedLanduse : currentFeature.properties.name
      const coordinates = e.features[0].geometry.coordinates.slice()

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }
      const popupContent = new Vue({
        ...MapPopup,
        parent: this,
        propsData: {
          popupName: name,
          type: this.selectedLanduse.type
        }
      }).$mount()

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(coordinates)
        .setDOMContent(popupContent.$el)
        .addTo(this.map)
    },
    // Change it back to a pointer when it leaves.
    onMouseOutCity () {
      this.map.getCanvas().style.cursor = ''
      const popUps = document.getElementsByClassName('mapboxgl-popup')
      /** Check if there is already a popup on the map and if so, remove it */
      if (popUps[0]) { popUps[0].remove() };
    },
    onMouseOut () {
      this.map.getCanvas().style.cursor = ''
    },
    // When a click event occurs on a feature in the states layer, open a popup at the
    // location of the click, with description HTML from its properties.
    onFeatureClick (e) {
      const currentFeature = e.features[0]
      const popUps = document.getElementsByClassName('mapboxgl-popup')
      /** Check if there is already a popup on the map and if so, remove it */
      if (popUps[0]) { popUps[0].remove() };

      let lat, lng

      if (currentFeature.geometry.type === 'Polygon') {
        const centeredFeature = centroid(e.features[0])
        lat = centeredFeature.geometry.coordinates[1]
        lng = centeredFeature.geometry.coordinates[0]
      } else if (currentFeature.geometry.type === 'Point') {
        lat = currentFeature.geometry.coordinates[1]
        lng = currentFeature.geometry.coordinates[0]
      }

      const name = (currentFeature.properties.name === undefined) ? this.selectedLanduse.name : currentFeature.properties.name

      const popupContent = new Vue({
        ...MapPopup,
        parent: this,
        propsData: {
          popupName: name,
          lat,
          lng,
          type: this.selectedLanduse.type
        }
      }).$mount()

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setDOMContent(popupContent.$el)
        .addTo(this.map)
    },
    onCityClick (e) {
      const currentFeature = e.features[0]
      const url = currentFeature.properties.url
      const win = window.open(url, '_blank')
      win.focus()
    }
  }

}
</script>

<style >
#menu-wrapper{
  position: relative;
  z-index: 3;
  width: 250px;
}

#map-wrapper{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

</style>

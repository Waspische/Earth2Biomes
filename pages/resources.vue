<template>
  <v-container fluid class="pa-0">
    <Snackbar />
    <v-navigation-drawer
      id="menu-wrapper"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      width="300"
      class="rounded ml-4 mt-4"
    >
      <v-list-item class="px-2">
        <v-list-item-avatar>
          <v-btn
            icon
            @click.stop="mini = !mini"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
        </v-list-item-avatar>
        <v-list-item-title>{{ biomes.name }}</v-list-item-title>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider />
      <v-list dense>
        <v-select
          v-model="selectedSource"
          class="pr-4 pt-4 pl-16"
          :items="datasources"
          item-text="label"
          item-value="key"
          label="Datasource"
          hide-details="auto"
          dense
          @change="onDatasourceSelection"
        />
        <v-list-group
          v-for="category in filteredBiomes"
          :key="category.id"
          sub-group
          no-action
          class="mt-0"
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title>{{ category.name }}</v-list-item-title>
            </v-list-item-content>
          </template>
          <v-list-item>
            <v-radio-group
              v-model="selectedLanduse"
              class="ma-0"
              hide-details="auto"
            >
              <v-radio
                v-for="landuse in category.landuses"
                :key="landuse.name"
                :value="landuse"
                :label="`${landuse.name}`"
                @click="onLanduseSelection(landuse)"
              />
            </v-radio-group>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-row
      id="map-wrapper"
      fluid
      no-gutters
    >
      <v-col
        id="map"
        cols="12"
      />
    </v-row>
  </v-container>
</template>

<script>
import Vue from 'vue'
import mapboxgl from 'mapbox-gl'
import centroid from '@turf/centroid'
import Snackbar from '../components/Snackbar'
import MapPopup from '~/components/MapPopup'

export default {
  name: 'Resources',
  components: {
    Snackbar
  },
  data () {
    return {
      drawer: true,
      mini: false,
      selectedLanduse: null,
      previousLanduse: null,
      selectedSource: 'MRDS',
      datasources: [{
        key: 'OSM',
        label: 'OpenStreet Map'
      }, {
        key: 'MRDS',
        label: 'MRDS Data'
      }],
      biomes: {
        name: 'Resources',
        icon: 'mdi-earth',
        categories: [
          {
            id: 'osm_mmm',
            name: 'Most mined minerals',
            datasource: 'OSM',
            tooltip: 'Tooltip',
            landuses: [
              {
                key: 'coal',
                name: 'Coal',
                color: '#36454f',
                type: 'quarry'
              },
              {
                key: 'iron_ore',
                name: 'Iron',
                color: '#4e4f55',
                type: 'quarry'
              },
              {
                key: 'bauxite',
                name: 'Bauxite',
                color: '#665e5a',
                type: 'quarry'
              },
              {
                key: 'phosphate',
                name: 'Phosphate',
                color: '#4e4f55',
                type: 'quarry'
              },
              {
                key: 'gypsum',
                name: 'Gypsum',
                color: '#c6c9ca',
                type: 'quarry'
              }
            ]
          },
          {
            id: 'osm_other',
            name: 'Other minerals',
            datasource: 'OSM',
            landuses: [
              {
                key: 'gold',
                name: 'Gold',
                color: '#FFD700',
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
            id: 'osm_gem',
            name: 'Gem stones',
            datasource: 'OSM',
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
            id: 'osm_petrol',
            name: 'Petroleum well',
            datasource: 'OSM',
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
          },
          {
            id: 'mrds_mmm',
            name: 'Most mined minerals',
            datasource: 'MRDS',
            tooltip: 'Tooltip',
            landuses: [
              {
                key: 'coal',
                name: 'Coal',
                color: '#36454f',
                type: 'quarry'
              },
              {
                key: 'iron',
                name: 'Iron',
                color: '#4e4f55',
                type: 'quarry'
              },
              {
                key: 'bauxite',
                name: 'Bauxite',
                color: '#665e5a',
                type: 'quarry'
              },
              {
                key: 'phosphate',
                name: 'Phosphate',
                color: '#4e4f55',
                type: 'quarry'
              },
              {
                key: 'gypsum',
                name: 'Gypsum',
                color: '#c6c9ca',
                type: 'quarry'
              }
            ]
          },
          {
            id: 'mrds_quarries',
            name: 'Quarries',
            datasource: 'MRDS',
            landuses: [
              {
                key: 'nickel',
                name: 'Nickel',
                color: '#727472',
                type: 'quarry'
              },
              {
                key: 'aluminum',
                name: 'Aluminum',
                color: '#848789',
                type: 'quarry'
              },
              {
                key: 'copper',
                name: 'Copper',
                color: '#b87333',
                type: 'quarry'
              },
              {
                key: 'lead',
                name: 'Lead',
                color: '#212121',
                type: 'quarry'
              },
              {
                key: 'pge',
                name: 'PGE',
                color: '#bdcdde',
                type: 'quarry'
              },
              {
                key: 'gold',
                name: 'Gold',
                color: '#FFD700',
                type: 'quarry'
              },
              {
                key: 'rare earth elements',
                name: 'Rare Earths',
                color: '#665647',
                type: 'quarry'
              },
              {
                key: 'potash',
                name: 'Potash',
                color: '#e07757',
                type: 'quarry'
              },
              {
                key: 'silver',
                name: 'Silver',
                color: '#C0C0C0',
                type: 'quarry'
              }
            ]
          },
          {
            id: 'mrds_gem',
            name: 'Gem stones',
            datasource: 'MRDS',
            landuses: [
              {
                key: 'diamond',
                name: 'Diamond',
                color: '#b9f2ff',
                type: 'quarry'
              },
              {
                key: 'sapphire',
                name: 'Sapphire',
                color: '#0f52ba',
                type: 'quarry'
              },
              {
                key: 'amethyst',
                name: 'Amethyst',
                color: '#9966cc',
                type: 'quarry'
              },
              {
                key: 'emerald',
                name: 'Emerald',
                color: '#50C878',
                type: 'quarry'
              },
              {
                key: 'jade',
                name: 'Jade',
                color: '#00a86b',
                type: 'quarry'
              },
              {
                key: 'ruby',
                name: 'Ruby',
                color: '#e0115f',
                type: 'quarry'
              }
            ]
          }
        ]
      },
      depositsTypes: [],
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
      }
    }
  },
  computed: {
    filteredBiomes () {
      return this.biomes.categories.filter(c =>
        c.datasource === this.selectedSource || c.datasource === undefined
      )
    }
  },
  async mounted () {
    mapboxgl.accessToken = this.accessToken

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

    this.depositsTypes = await fetch(
      './data/mines/' + this.selectedSource + '_depositsTypes.json'
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

      this.map.addLayer(this.landuseLocation)
      this.map.setLayoutProperty('landuseLocation', 'visibility', 'none')
      this.map.on('click', 'landuseLocation', this.onFeatureClick)

      this.map.on('mouseenter', 'landuseLocation', this.onMouseEnter)
      this.map.on('mouseleave', 'landuseLocation', this.onMouseOut)
    },
    async onDatasourceSelection () {
      this.depositsTypes = await fetch(
        './data/mines/' + this.selectedSource + '_depositsTypes.json'
      ).then(res => res.json())
    },
    async onLanduseSelection (landuse) {
      this.trackBiomeClick(landuse)
      if (this.selectedLanduse !== this.previousLanduse) {
        const popUps = document.getElementsByClassName('mapboxgl-popup')
        /** Check if there is already a popup on the map and if so, remove it */
        if (popUps[0]) { popUps[0].remove() };

        this.previousLanduse = this.selectedLanduse
        if (landuse.type === 'quarry') {
          await this.map.getSource('landuse').setData('./data/mines/' + this.selectedSource + '_mineralDeposits.json')
          // this.map.setFilter('landuseLocation', ['==', ['get', 'resource'], landuse.key])
          // this.map.setFilter('landuseLocation', ['==', ['get', 'disused'], 'yes'])
          // this.map.setFilter('landuseLocation', ['==', ['get', 'abandoned'], 'yes'])
          const filtered = this.depositsTypes.filter(function (type) {
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
          this.map.setPaintProperty('landuseLocation', 'circle-color', landuse.color)
        } else if (landuse.type === 'well') {
          await this.map.getSource('landuse').setData('./data/' + landuse.fileName + '.json')
          this.map.setFilter('landuseLocation', null)
          this.map.setLayoutProperty('landuseLocation', 'visibility', 'visible')
          this.map.setPaintProperty('landuseLocation', 'circle-color', landuse.color)
        }
      }
    },
    onZoom () {
      console.log(this.map.getZoom())
    },
    // Change the cursor to a pointer when the mouse is over the states layer.
    onMouseEnter () {
      this.map.getCanvas().style.cursor = 'pointer'
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
    trackBiomeClick (landuse) {
      this.$gtag.event('click', {
        event_category: 'biome',
        event_label: landuse.key
      })
    }
  },
  head () {
    return {
      title: 'Resources'
    }
  }

}
</script>

<style >
#menu-wrapper{
  position: relative;
  z-index: 3;
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

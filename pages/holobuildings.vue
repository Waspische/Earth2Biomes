<template>
  <v-container fluid>
    <v-navigation-drawer
      id="features"
      v-model="drawer"
      :mini-variant.sync="mini"
      permanent
      width="400"
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
        <v-list-item-title>HoloBuildings</v-list-item-title>
        <v-btn
          icon
          @click.stop="mini = !mini"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </v-list-item>
      <v-divider />
      <v-data-table
        v-show="!mini"
        dense
        :headers="headers"
        :items="holobuildings"
        :items-per-page="5"
        class="elevation-1"
        :search="onSearch"
        :loading="loadingData"
        loading-text="Loading... Please wait"
        @click:row="flyToCity"
      >
        <template #top>
          <v-toolbar
            flat
          >
            <v-text-field
              v-model="search"
              label="Search holobuilding name"
            />
          </v-toolbar>
        </template>
      </v-data-table>
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

import mapboxgl from 'mapbox-gl'
import Vue from 'vue'
import MapPopup from '~/components/MapPopup'

export default {
  name: 'HoloBuildings',
  components: {
  },
  data () {
    return {
      drawer: true,
      mini: false,
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'name' // TODO
        },
        {
          text: 'Vertex',
          align: 'start',
          value: 'total_vertex_count' // TODO
        }
      ],
      holobuildings: [], // TODO
      search: '',

      citiesDialog: false,
      editedCity: {
        cityName: '',
        url: '',
        discord: '',
        website: '',
        description: ''
      },
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/dark-v10',
      holoLocation: {
        id: 'holoLocation',
        source: 'urban',
        type: 'fill-extrusion',
        paint: {
          // Get the `fill-extrusion-color` from the source `color` property.
          'fill-extrusion-color': '#21CFF3',
          // Get `fill-extrusion-height` from the source `extrusionHeight` property.
          'fill-extrusion-height': ['get', 'extrusionHeight'],
          // Get `fill-extrusion-base` from the source `extrusionBase` property.
          'fill-extrusion-base': ['get', 'extrusionBase'],
          // Make extrusions slightly opaque to see through indoor walls.
          'fill-extrusion-opacity': 1,
          'fill-extrusion-vertical-gradient': true

        }
      }
    }
  },
  head () {
    return {
      title: 'HoloBuildings'
    }
  },
  computed: {
    onSearch () { // TODO
      const value = this.search.trim().toLowerCase()

      // Filter visible features that don't match the input value.
      const filtered = this.holobuildings.filter(function (holo) {
        const name = holo.name.trim().toLowerCase()
        return name.includes(value)
      })

      // TODO don't work / Set the filter to populate features into the layer.
      if (filtered.length) {
        this.map.setFilter('holoLocation', [
          'match',
          ['get', 'name'],
          filtered.map(function (holo) {
            return holo.name
          }),
          true,
          false
        ])
      }

      return this.search
    },
    loadingData () {
      return this.holobuildings.length === 0 // TODO
    }
  },
  mounted () {
    mapboxgl.accessToken = this.accessToken

    // create a new mapbox instance
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle,
      zoom: 1, // starting zoom
      pitch: 40,
      sprite: 'mapbox://sprites/mapbox/bright-v8'
    })
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    this.map.on('load', this.onMapLoad)
  },
  methods: {
    async onMapLoad (event) {
      this.map.addSource('urban', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })

      this.map.addLayer(this.holoLocation)

      // this.map.on('mouseenter', 'holoLocation', this.onMouseEnterCity)
      // this.map.on('mouseleave', 'holoLocation', this.onMouseOutCity)

      // initialize data
      this.holobuildings = await this.getHolobuildings()
    },
    async getHolobuildings () { // TODO
      const data = await fetch(
        './data/holobuildings-details-v1.json'
      ).then(res => res.json())

      let places = []
      data.forEach((holo) => {
        places = places.concat(holo.geojson.features.map((holoFeature) => {
          const properties = {
            ...holoFeature.properties,
            id: holo.id,
            name: holo.name
          }
          holoFeature.properties = properties
          return holoFeature
        }))
      })

      this.map.getSource('urban').setData({
        type: 'FeatureCollection',
        features: places
      })
      return data
    },
    flyToCity (currentFeature) {
      this.$vuetify.goTo(0)
      this.map.jumpTo({ // or flyTo speed: 3
        center: currentFeature.geojson.features[0].geometry.coordinates[0][0],
        zoom: 19
      })
    },
    onMouseEnterCity (e) {
      console.log(e)
      this.map.getCanvas().style.cursor = 'pointer'
      const currentFeature = e.features[0]
      console.log(currentFeature)
      const name = (currentFeature.properties.name === undefined) ? '' : currentFeature.properties.name
      const coordinates = currentFeature.geometry.coordinates[0][0].slice()
      console.log(coordinates)

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }
      const popupContent = new Vue({
        ...MapPopup,
        parent: this,
        propsData: {
          popupName: name,
          type: 'urban'
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
    }
  }
}
</script>

<style scoped>

#features {
  position: relative;
  z-index: 3;
  max-height: 650px;
  overflow-y: auto;
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

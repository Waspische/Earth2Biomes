<template>
  <v-container fluid class="pa-0">
    <Snackbar />
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
        <v-list-item-title>Mines</v-list-item-title>
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
        :items="mines"
        :items-per-page="5"
        item-key="name"
        class="elevation-1 pa-2"
        @click:row="clickOnMine"
      >
        <template v-slot:top>
          <v-text-field
            v-model="commodityFilter"
            label="Search for commodity"
          />
        </template>
        <template v-slot:item.location="{ item }">
          <v-btn
            plain
            class="pa-0 mr-1"
            min-width="0"
          >
            <v-icon
              v-clipboard:copy="formatLocation(item.geometry.coordinates)"
              v-clipboard:success="snackTime"
              v-clipboard:error="onCopyError"
              dense
              plain
              class="mr-1"
            >
              mdi-content-copy
            </v-icon>
          </v-btn>
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
    <v-card />
  </v-container>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import Snackbar from '../components/Snackbar'

export default {
  name: 'BlueDots',
  components: {
    Snackbar
  },
  data () {
    return {
      snackbar: false,
      text: 'Location copied in clipboard',
      drawer: true,
      mini: false,
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/waspische/cklpn034z3o3z17o0n12ui4l0',
      commodityFilter: '',
      mines: []
    }
  },
  computed: {
    headers () {
      return [
        {
          text: 'Name',
          align: 'start',
          sortable: false,
          value: 'properties.site_name'
        },
        {
          text: 'Commodity',
          value: 'properties.commod1',
          filter: (value) => {
            if (!this.commodityFilter) { return true }
            return value != null &&
              this.commodityFilter != null &&
              typeof value === 'string' &&
              value.toString().toLocaleUpperCase().includes(this.commodityFilter.toLocaleUpperCase())
          }
        },
        { text: 'Location', value: 'location', sortable: false }
      ]
    }
  },
  mounted () {
    mapboxgl.accessToken = this.accessToken

    // create a new mapbox instance
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle,
      zoom: 1, // starting zoom
      sprite: 'mapbox://sprites/mapbox/bright-v8'
    })
    this.map.on('load', this.onMapLoad)
  },
  methods: {
    onCopy (e) {
      console.log(e)
    },
    onCopyError (e) {
      console.log(e)
    },
    snackTime (snack) {
      this.$toast.success(this.text)
    },
    onMapLoad (event) {
      this.map.on('moveend', this.pointToFeature)
      // init
      this.pointToFeature()
    },
    formatLocation (value) {
      console.log(value)
      return value[1].toString().substring(0, 8) + ', ' + value[0].toString().substring(0, 8)
    },
    pointToFeature (e) {
      const features = this.map.queryRenderedFeatures({ layers: ['mrds 3'] })

      // Limit the number of properties we're displaying for
      // legibility and performance
      const displayProperties = [
        'type',
        'properties',
        'id',
        'layer',
        'source',
        'sourceLayer',
        'geometry'
      ]

      const displayFeatures = features.map(function (feat) {
        const displayFeat = {}
        displayProperties.forEach(function (prop) {
          displayFeat[prop] = feat[prop]
        })
        return displayFeat
      })

      this.mines = displayFeatures
    },
    clickOnMine (mine) {
      console.log(mine.geometry)
      this.map.flyTo({
        center: mine.geometry.coordinates,
        zoom: 13,
        speed: 4
      })
    }
  },
  head () {
    return {
      title: 'Blue dots'
    }
  }
}
</script>

<style>
html {
  overflow-y: hidden !important;
}
</style>
<style scoped>

#map-wrapper{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

#features {
  position: relative;
  z-index: 3;
  max-height: 650px;
  overflow-y: auto;
}

</style>

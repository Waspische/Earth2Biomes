<template>
  <v-container fluid class="pa-0">
    <Snackbar />
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          rounded
          class="v-btn--example"
          color="primary"
          absolute
          bottom
          v-bind="attrs"
          v-on="on"
        >
          Display on earth2.io
        </v-btn>
      </template>
      <v-card>
        <v-card-title>
          <span class="headline">Script to copy on Earth2.io</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <div
              class="text-h6"
            >
              Step 1. Copy the following code
            </div>
            <div>
              <code>{{ codeCutted }}</code>
              <v-btn
                plain
                class="pa-0 mr-1"
                min-width="0"
              >
                <v-icon
                  v-clipboard:copy="code"
                  v-clipboard:success="copyCode"
                  dense
                  plain
                  class="mr-1"
                >
                  mdi-content-copy
                </v-icon>
              </v-btn>
            </div>
            <br>
            <v-divider />
            <div
              class="text-h6"
            >
              Step 2. Paste into Chrome console on earth2.io Map page
            </div>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
      dialog: false,
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/waspische/cklpn034z3o3z17o0n12ui4l0',
      commodityFilter: '',
      mines: [],
      code: 'function setStyle(){$(".map-toolbar").append("<a class=\'waves-effect waves-light btn-small\' id=\'showFeatures\'>What\'s here ?</a>"),$("#showFeatures").click(function(){showFeatures()}),window.mapgl.easeTo({center:[0,0],zoom:0}),window.mapgl.setStyle({version:8,name:"Blue dots",metadata:{"mapbox:autocomposite":!0,"mapbox:type":"template","mapbox:sdk-support":{js:"0.50.0",android:"6.7.0",ios:"4.6.0"},"mapbox:groups":{"45bf0c7e89724249ad82d32c248fba77":{name:"Group"}}},center:[-105.69,38.16],zoom:4.25,bearing:0,pitch:0,light:{intensity:.08,color:"hsl(41, 0%, 100%)",anchor:"map",position:[10,100,300]},sources:{"mapbox://mapbox.satellite":{url:"mapbox://mapbox.satellite",type:"raster",tileSize:256},"mapbox://mapbox.satellite-watermask":{url:"mapbox://mapbox.satellite-watermask",type:"raster",tileSize:256},composite:{url:"mapbox://mapbox.mapbox-streets-v8,ealessandrini.60h01sbw",type:"vector"}},sprite:"mapbox://sprites/ev2/ckl107xyn00ac17nvqikolcvt/b8l8yeuy4fg22z515axrafrk3",glyphs:"mapbox://fonts/ev2/{fontstack}/{range}.pbf",layers:[{id:"mapbox-satellite (1)",type:"raster",source:"mapbox://mapbox.satellite",layout:{},paint:{"raster-saturation":["step",["zoom"],-.8,8,-.6,15,-.73,22,-.73],"raster-contrast":.05,"raster-brightness-max":["step",["zoom"],.69,12.17,1,22,1]}},{id:"mapbox-satellite-watermask",type:"raster",paint:{"raster-saturation":-.47},source:"mapbox://mapbox.satellite-watermask"},{id:"place-label",type:"symbol",source:"composite","source-layer":"place_label",filter:["match",["get","filterrank"],[1],!0,!1],layout:{"text-field":["to-string",["get","name"]],"text-transform":"uppercase","text-letter-spacing":.3,"text-font":["Open Sans Bold","Arial Unicode MS Regular"],"text-size":10},paint:{"text-color":"hsl(188, 31%, 95%)","text-halo-color":"#000000","text-halo-width":1}},{id:"road",type:"symbol",paint:{"text-color":"hsl(0, 0%, 100%)","text-halo-color":"hsla(0, 0%, 0%, 0.91)","text-halo-width":.5,"text-opacity":["step",["zoom"],0,15,1]},layout:{"text-field":["to-string",["get","name"]],"symbol-placement":"line","text-size":13,"text-font":["Open Sans SemiBold","Arial Unicode MS Regular"]},source:"composite","source-layer":"road"},{id:"mrds 3",type:"circle",paint:{"circle-color":"hsl(215, 84%, 46%)","circle-radius":["interpolate",["linear"],["zoom"],0,10,13,20,15,30],"circle-opacity":["step",["zoom"],.04,7,.04,10,.04,13,.06,16,.2],"circle-blur":2},layout:{},source:"composite","source-layer":"mrds"},{id:"mrds 2",type:"circle",paint:{"circle-color":"hsl(191, 84%, 33%)","circle-radius":["interpolate",["linear"],["zoom"],0,10,12.2,20,13.5,22,15,25,22,30],"circle-blur":3,"circle-opacity":["step",["zoom"],.05,6,.05,12,.12,13,.26,15,.3,18,.6]},layout:{},source:"composite","source-layer":"mrds"},{id:"mrds 1",type:"circle",paint:{"circle-color":"hsl(191, 85%, 65%)","circle-radius":["step",["zoom"],5,13,10,22,15],"circle-blur":3,"circle-opacity":["step",["zoom"],.2,12,.43,15,.82]},layout:{visibility:"none"},source:"composite","source-layer":"mrds"},{id:"mrds",type:"circle",paint:{"circle-radius":["interpolate",["linear"],["zoom"],0,1,22,5],"circle-color":"hsl(0, 0%, 100%)"},layout:{},source:"composite","source-layer":"mrds"}],visibility:"private",draft:!1})}function showFeatures(){const e=window.mapgl.queryRenderedFeatures({layers:["mrds"]}),t=["site_name","commod1","commod2","commod3","url"],o=e.map(e=>{const o={};return t.forEach(function(t){o[t]=e.properties[t]}),o.lnglat=e.geometry.coordinates[1].toString().substring(0,8)+", "+e.geometry.coordinates[0].toString().substring(0,8),o});console.table(o),M.toast({html:"Data is printed into the console",classes:"primary darken-1"})}$(".map-toolbar").append("<a class=\'waves-effect waves-light btn-small\' id=\'showBlueDots\'>Show me blue dots</a>"),$("#showBlueDots").click(function(){setStyle()});'
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
    },
    codeCutted () {
      return this.code.substring(0, 40) + ' ...'
    },
    codeToCopy () {
      return this.code
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
    copyCode (snack) {
      this.$toast.success('Code copy successful')
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
.v-btn--example {
  bottom: 0;
  position: absolute;
  margin: 0 0 16px 16px;
  z-index: 4;
  left: 50%;
  transform:translateX(-50%);
}

</style>

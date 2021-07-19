<template>
  <v-container fluid>
    <v-snackbar
      v-model="show"
      :timeout="timeout"
      color="info"
    >
      <v-row>
        <v-col cols="12" sm="10">
          {{ message }}
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/ZvU5Qvqrz6"
            color="secondary"
            text
          >
            <v-icon dark>
              mdi-open-in-new
            </v-icon> Discord
          </v-btn>
        </v-col>
      </v-row>
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <template v-slot:activator="{ on: on, attrs }">
        <v-btn
          id="cities-dialog-btn"
          color="primary darken-1"
          v-bind="attrs"
          v-on="on"
          class="ml-4 mt-4 v-btn--example"
          elevation="2"
          large
          rounded
          absolute
          bottom
        >
          Share your jewels location
        </v-btn>
      </template>
        <v-card>
          <v-card-title>
            <span class="headline">Share your jewels location</span>
          </v-card-title>

          <v-card-text>
            <v-row dense>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                The goal is to discover if there is som factors in the location of jewels spawn. Thanks for participating to the experience.
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                Click
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://app.earth2.io/api/v2/my/jewels/?color=&expires__isnull=true&limit=1000&offset=0">
                this link
              </a> and copy paste the result in discord to Wasp#1975. Their is no personal data here, just jewels locations.<b>It might be a too long message on mobile</b>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <p>Thanks to :</p>
                <span
                  v-for="name in names"
                  :key="name">
                      {{name}},
                </span>
              </v-col>
<!--                  <v-col-->
<!--                    cols="12"-->
<!--                    sm="12"-->
<!--                    md="12"-->
<!--                  >-->
<!--                    <v-text-field-->
<!--                      v-model="editedJewelLocation.profileId"-->
<!--                      label="Profile Id"-->
<!--                    />-->
<!--                  </v-col>-->
<!--                  <v-col-->
<!--                    cols="12"-->
<!--                    sm="12"-->
<!--                    md="12"-->
<!--                  >-->
<!--                    <v-textarea-->
<!--                      v-model="editedJewelLocation.jewels"-->
<!--                      label="Description"-->
<!--                    />-->
<!--                  </v-col>-->
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="close"
            >
              Close
            </v-btn>
<!--                <v-btn-->
<!--                  color="primary"-->
<!--                  text-->
<!--                  @click="save"-->
<!--                >-->
<!--                  Save-->
<!--                </v-btn>-->
          </v-card-actions>
        </v-card>
    </v-dialog>
<!--    <v-navigation-drawer-->
<!--      id="features"-->
<!--      v-model="drawer"-->
<!--      :mini-variant.sync="mini"-->
<!--      permanent-->
<!--      width="400"-->
<!--      class="rounded ml-4 mt-4"-->
<!--    >-->
<!--      <v-list-item class="px-2">-->
<!--        <v-list-item-avatar>-->
<!--          <v-btn-->
<!--            icon-->
<!--            @click.stop="mini = !mini"-->
<!--          >-->
<!--            <v-icon>mdi-menu</v-icon>-->
<!--          </v-btn>-->
<!--        </v-list-item-avatar>-->
<!--        <v-list-item-title>Mines</v-list-item-title>-->
<!--        <v-btn-->
<!--          icon-->
<!--          @click.stop="mini = !mini"-->
<!--        >-->
<!--          <v-icon>mdi-chevron-left</v-icon>-->
<!--        </v-btn>-->
<!--      </v-list-item>-->
<!--      <v-divider />-->
<!--      <v-list dense>-->
<!--        <v-list-item-->
<!--          v-for="name in names"-->
<!--          :key="name">-->
<!--          {{name}}-->
<!--        </v-list-item>-->
<!--      </v-list>-->
<!--    </v-navigation-drawer>-->
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
  name: 'PredictJewels',
  components: {
  },
  data () {
    return {
      drawer: true,
      mini: false,
      show: false,
      message: '',
      timeout: 5000,
      editedJewelLocation: {
        profileId: '',
        jewels: '',
      },
      jewels: [],
      names: [],
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/dark-v10',
      dialog: false,
      jewelsLocation: {
        id: 'jewelsLocation',
        source: 'urban',
        type: 'symbol',
        layout: {
          'icon-image': [
            'coalesce',
            ['image', ['get', 'jewel']],
            ['image', 'rocket-15']
          ],
          // 'icon-image': 'black',
          'icon-size': 0.50,
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
      },
      jewelsTypes: [
        {
          name: 'black',
          file: 'BlackCrystal.png'
        },
        {
          name: 'blue',
          file: 'BlueCrystal.png'
        },
        {
          name: 'grey',
          file: 'GreyCrystal.png'
        },
        {
          name: 'brown',
          file: 'BrownCrystal.png'
        },
        {
          name: 'ochre',
          file: 'OchreCrystal.png'
        },
        {
          name: 'sandy',
          file: 'SandyCrystal.png'
        },
        {
          name: 'yellow',
          file: 'YellowCrystal.png'
        }
      ]
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
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

    const data = await fetch(
      './data/jewels.json'
    ).then(res => res.json())
    this.names = data.results.filter(jewel => {
      return !!jewel.name
    }).map(jewel => jewel.name)
  },
  methods: {
    loadImages (){
      const vm = this

      return this.jewelsTypes.map( icon => {
      // return a promise per icon
      return new Promise(function(resolve,reject){
        // load the image
        vm.map.loadImage(require('../../assets/' + icon.file), function(error,data){
          // if error reject the promise
          if (error){
            console.log(`Error with ${icon.name}`);
            console.error(error);
            reject(error);
          } else {
            // return the data in the icon
            resolve([icon, data]);
          }
        });
      });
    });

    },
    onMapLoad (event) {
      const vm = this

      Promise
        .all(this.loadImages())
        .then(icons => {
          // Add the icons to the map
          icons.forEach( icon_data => {
            var icon = icon_data[0];
            var data = icon_data[1];
            vm.map.addImage(icon.name, data);
          })
          // Check if images are ready
          console.log(icons.map(icon => vm.map.hasImage(icon[0].name)))

          vm.map.addSource('urban', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          })

          vm.map.addLayer(vm.jewelsLocation)
          // vm.map.on('click', 'jewelsLocation', vm.onCityClick)
          // vm.map.on('mouseenter', 'jewelsLocation', vm.onMouseEnterCity)
          // vm.map.on('mouseleave', 'jewelsLocation', vm.onMouseOutCity)

          // initialize data
          vm.jewels = vm.getJewels()
        });

    },
    async getJewels () {
      // const data = await this.$axios.$get('/cities?size=1000') // todo update back

      const data = await fetch(
        './data/1-predictJewels.json'
      ).then(res => res.json())
      const places = data.results.map(place => (
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [place.landfield.center.split(' ')[0], place.landfield.center.split(' ')[1]]
          },
          properties: {
            ...place,
            jewel: this.colorToString(place)
          }
        }
      ))
      this.map.getSource('urban').setData({
        type: 'FeatureCollection',
        features: places
      })
      return places
    },
    colorToString (place) {
      return place.color === 0
        ? 'blue'
        : place.color === 1
          ? 'black'
          : place.color === 2
            ? 'brown'
            : place.color === 3
              ? 'ochre'
              : place.color === 4
                ? 'grey'
                : place.color === 5
                  ? 'sandy'
                  : place.color === 6
                    ? 'yellow'
                    : null
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedCity = Object.assign({}, this.defaultCity)
        this.editedIndex = -1
      })
    },
    async save () {
      const cityContribution = {}
      cityContribution.city = this.editedCity
      cityContribution.id = null
      try {
        const res = await this.$axios.$post('/city-contributions', cityContribution)

        // Success 🎉
        const data = res.data
        console.log(data)
        this.show = true
        this.message = 'Thank you for your contribution ! I\'ll review it as soon as possible. You can follow confirmed cities on Discord.'
        this.close()
      } catch (error) {
        // Error 😨
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log(error.request)
        } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message)
        }
        console.log(error)
      }
    },
    onCityClick (e) {
      const currentFeature = e.features[0]
      const cityId = currentFeature.properties.id
      console.log(currentFeature)
      this.$router.push('/cities/' + cityId)
    },
    onMouseEnterCity (e) {
      this.map.getCanvas().style.cursor = 'pointer'
      const currentFeature = e.features[0]
      const name = (currentFeature.properties.cityName === undefined) ? '' : currentFeature.properties.cityName
      const coordinates = e.features[0].geometry.coordinates.slice()

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
  },
  head () {
    return {
      title: 'Jewels'
    }
  }
}
</script>

<style scoped>

#map-wrapper{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.v-btn--example {
  bottom: 0;
  position: absolute;
  margin: 0 0 16px 16px;
  z-index: 4;
  left: 50%;
  transform:translateX(-50%);
}

#features {
  position: relative;
  z-index: 3;
  max-height: 650px;
  overflow-y: auto;
}
</style>

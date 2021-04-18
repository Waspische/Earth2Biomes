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
    <v-row
      fluid
    >
      <v-col
        cols="12"
        xs="12"
        md="6"
      >
        <v-card id="map" style="height: 450px" />
      </v-col>
      <v-col
        cols="12"
        xs="12"
        md="6"
      >
        <v-alert
          type="info"
          class="ml-2 mr-2"
        >
          You can submit your own city here to contribute to the Cities Database. Every contribution will be reviewed.
        </v-alert>
        <v-data-table
          :headers="headers"
          :items="cities"
          :items-per-page="5"
          :search="onSearch"
          class="elevation-1"
          :loading="loadingData"
          loading-text="Loading... Please wait"
        >
          <template v-slot:top>
            <v-toolbar
              flat
            >
              <v-text-field
                v-model="search"
                label="Search city name or group"
              />
              <v-spacer />
              <v-dialog
                v-model="dialog"
                max-width="500px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    color="primary"
                    dark
                    class="mb-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    New City
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
                  </v-card-title>

                  <v-card-text>
                    <v-row dense>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >
                        <v-text-field
                          v-model="editedCity.cityName"
                          label="Name"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="6"
                        md="6"
                      >
                        <v-select
                          v-model="editedCity.group"
                          :items="groups"
                          item-text="groupName"
                          item-value="id"
                          return-object
                          label="Group"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-text-field
                          v-model="editedCity.url"
                          label="Property url"
                          hint="https://app.earth2.io/#propertyInfo/YOUR_ID"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="6"
                      >
                        <v-text-field
                          v-model="editedCity.discord"
                          label="Discord server"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="6"
                      >
                        <v-text-field
                          v-model="editedCity.website"
                          label="Website"
                        />
                      </v-col>
                      <v-col
                        cols="12"
                        sm="12"
                        md="12"
                      >
                        <v-textarea
                          v-model="editedCity.description"
                          label="Description"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn
                      color="blue darken-1"
                      text
                      @click="close"
                    >
                      Cancel
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="save"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <v-btn
              plain
              class="pa-0 mr-1"
              min-width="0"
            >
              <v-icon
                dense
                plain
                class="mr-1"
                @click="editCity(item)"
              >
                mdi-pencil
              </v-icon>
            </v-btn>
            <v-btn
              plain
              min-width="0"
              class="pa-0 mr-1"
              target="_blank"
              rel="noopener noreferrer"
              icon
              :href="item.properties.url"
            >
              <v-icon
                dense
              >
                mdi-open-in-new
              </v-icon>
            </v-btn>
            <v-btn
              plain
              min-width="0"
              class="pa-0 mr-1"
            >
              <v-icon
                dense
                @click="flyToCity(item)"
              >
                mdi-map-marker
              </v-icon>
            </v-btn>
            <v-btn
              v-if="item.properties.discord"
              plain
              class="pa-0 mr-1"
              min-width="0"
              target="_blank"
              rel="noopener noreferrer"
              icon
              :href="item.properties.discord"
            >
              <v-icon
                dense
              >
                mdi-discord
              </v-icon>
            </v-btn>
            <v-btn
              v-if="item.properties.website"
              plain
              min-width="0"
              class="pa-0 mr-1"
              target="_blank"
              rel="noopener noreferrer"
              icon
              :href="item.properties.website"
            >
              <v-icon
                dense
              >
                mdi-web
              </v-icon>
            </v-btn>
          </template>

          <template v-slot:item.detail="{ item }">
            <v-btn
              plain
              text
              class="pa-0 mr-1"
              min-width="0"
              :to="{ name: 'cities-id', params: { id: item.properties.id} }"
            >
              More info
            </v-btn>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import mapboxgl from 'mapbox-gl'
import Vue from 'vue'
import MapPopup from '~/components/MapPopup'

export default {
  name: 'MapboxMap',
  components: {
  },
  data () {
    return {
      show: false,
      message: '',
      timeout: 5000,
      headers: [
        {
          text: 'Name',
          align: 'start',
          value: 'properties.cityName'
        },
        { text: 'Group', value: 'properties.group.groupName' },
        { text: 'Actions', value: 'actions', sortable: false },
        { text: '', value: 'detail', sortable: false }
      ],
      cities: [],
      groups: [],
      search: '',
      editedCity: {
        cityName: '',
        url: '',
        discord: '',
        website: '',
        description: ''
      },
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      dialog: false,
      editedIndex: -1,
      defaultCity: {
        cityName: '',
        url: '',
        discord: '',
        website: '',
        description: ''
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
  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New City' : 'Edit City'
    },
    onSearch () {
      const value = this.search.trim().toLowerCase()

      // Filter visible features that don't match the input value.
      const filtered = this.cities.filter(function (city) {
        const name = city.properties.cityName.trim().toLowerCase()
        const group = city.properties.group ? city.properties.group.groupName.trim().toLowerCase() : ''
        return name.includes(value) || group.includes(value)
      })

      // Set the filter to populate features into the layer.
      if (filtered.length) {
        this.map.setFilter('citiesLocation', [
          'match',
          ['get', 'cityName'],
          filtered.map(function (feature) {
            return feature.properties.cityName
          }),
          true,
          false
        ])
      }

      return this.search
    },
    loadingData () {
      return this.cities.length === 0
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
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

      this.map.addLayer(this.citiesLocation)
      this.map.on('click', 'citiesLocation', this.onCityClick)

      this.map.on('mouseenter', 'citiesLocation', this.onMouseEnterCity)
      this.map.on('mouseleave', 'citiesLocation', this.onMouseOutCity)

      // initialize data
      this.cities = await this.getCities()
      this.groups = await this.getGroups()
    },
    async getCities () {
      const data = await this.$axios.$get('/cities?size=1000') // todo update back
      const places = data.map(place => (
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [place.location.coordinates[0], place.location.coordinates[1]]
          },
          properties: place
        }
      ))
      this.map.getSource('urban').setData({
        type: 'FeatureCollection',
        features: places
      })
      return places
    },
    flyToCity (currentFeature) {
      this.$vuetify.goTo(0)
      this.map.flyTo({
        center: currentFeature.geometry.coordinates,
        zoom: 8
      })
    },
    async getGroups () {
      const data = await this.$axios.$get('/groups')
      return data
    },
    editCity (city) {
      this.editedIndex = this.cities.indexOf(city)
      this.editedCity = Object.assign({}, city.properties)
      this.dialog = true
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
      const url = currentFeature.properties.url
      const win = window.open(url, '_blank')
      win.focus()
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
      title: 'Cities'
    }
  }
}
</script>

<style scoped>

</style>

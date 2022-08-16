<template>
  <v-card
    elevation="4"
    class="pa-4"
    rounded
  >
    <v-row>
      <v-col
        cols="12"
        md="6"
      >
        <v-card id="map" style="min-height: 200px; height:100%" />
      </v-col>
      <v-col
        cols="12"
        md="6"
        class="text-body-1"
      >
        <v-list>
          <v-list-item>
            <v-list-item-icon>
              <v-icon color="primary">
                mdi-map-marker
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>{{ city.location.coordinates }}</v-list-item-title>
              <v-list-item-subtitle>{{ $t('city.location') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>

          <v-list-item
            :href="city.url"
            target="_blank"
            rel="noopener noreferrer"
          >
            <v-list-item-icon>
              <v-icon color="primary">
                mdi-open-in-new
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ city.url }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ $t('city.e2Location') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="city.website"
            :href="city.website"
            target="_blank"
            rel="noopener noreferrer"
          >
            <v-list-item-icon>
              <v-icon color="primary">
                mdi-web
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title>
                {{ city.website }}
              </v-list-item-title>
              <v-list-item-subtitle>{{ $t('cities.newCityModal.website') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-list-item
            v-if="city.discord"
            :href="city.discord"
            target="_blank"
            rel="noopener noreferrer"
          >
            <v-list-item-icon>
              <v-icon color="primary">
                mdi-discord
              </v-icon>
            </v-list-item-icon>

            <v-list-item-content>
              <v-list-item-title v-if="city.discord">
                {{ city.discord }}
              </v-list-item-title>
              <v-list-item-title v-else>
                No discord
              </v-list-item-title>
              <v-list-item-subtitle>{{ $t('cities.newCityModal.discordServer') }}</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-col>

      <v-list class="pa-4">
        <v-list-item-content>
          <v-list-item-title class="font-weight-medium">
            {{ $t('cities.newCityModal.description') }}
          </v-list-item-title>
          <v-list-item-content v-if="city.description" class="text-justify">
            {{ city.description }}
          </v-list-item-content>
          <v-list-item-content v-else class="text-justify">
            {{ $t('city.noDescription') }}
          </v-list-item-content>
        </v-list-item-content>
      </v-list>
    </v-row>
  </v-card>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import mapUtils from '@/utils/mapUtils'

export default {
  name: 'CityDetails',
  props: {
    city: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v10'
    }
  },
  computed: {
  },
  mounted () {
    console.log(mapUtils.quadkeysToPolygon([1225382330221]))
    mapboxgl.accessToken = this.accessToken

    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle,
      zoom: 4, // starting zoom
      center: this.city.location.coordinates,
      sprite: 'mapbox://sprites/mapbox/bright-v8'
    })
    this.map.addControl(new mapboxgl.FullscreenControl())
    this.map.on('load', this.onMapLoad)
  },
  methods: {
    onMapLoad (event) {
      new mapboxgl.Marker()
        .setLngLat(this.city.location.coordinates)
        .addTo(this.map)
    }
  }
}
</script>

<style scoped>

</style>

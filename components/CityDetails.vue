<template>
  <v-card
    elevation="4"
    class="pa-4"
    rounded
  >
    <v-row>
      <v-col
        cols="12"
        md="8"
      >
        <v-card id="map" style="min-height: 450px; height:100%" />
      </v-col>
      <v-col
        cols="12"
        md="4"
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
              <discord-icon size="1.2x" fill="#21cff3" class="v-icon notranslate v-icon--dense mdi mdi-web theme--dark" />
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
          <v-list-item v-if="city.validated">
            <v-list-item-content>
              <v-btn
                color="primary darken-1"
                dark
                class="mb-2"
                :loading="loadTiles"
                @click="showProperties"
              >
                {{ $t(showPropertiesButton) }}
              </v-btn>
              <v-alert
                v-if="propertyLoaded && cityProperties.length === 0"
                dense
                type="warning"
              >
                {{ $t('city.noProperty') }}
              </v-alert>
              <v-switch
                v-if="propertyLoaded && cityProperties.length !== 0"
                v-model="forSaleToggle"
                label="Highlight properties for sale"
                @change="togglePropertiesForSale"
              />
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
import { DiscordIcon } from 'vue-simple-icons'
import Vue from 'vue'
import mapUtils from '@/utils/mapUtils'
import MapPopup from '~/components/MapPopup'

export default {
  name: 'CityDetails',
  components: {
    DiscordIcon
  },
  props: {
    city: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      loadTiles: false,
      cityProperties: [],
      propertyLoaded: false,
      forSaleToggle: false,
      map: null,
      propertyPopup: null,
      popupContent: null,
      currentProperty: null,
      propertyLayer: {
        id: 'property-layer',
        source: 'properties',
        type: 'line',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': [
            'case',
            [
              '==',
              ['coalesce', ['feature-state', 'tier'], ['get', 'tier']],
              1
            ],
            '#fff',
            ['get', 'color']
          ],
          'line-opacity': [
            'case',
            [
              'boolean',
              ['coalesce', ['feature-state', 'isSelected'], ['get', 'isSelected']],
              false
            ],
            1,
            0.5
          ],
          'line-width': 2
        }
      },
      propertyFillLayer: {
        id: 'property-fill-layer',
        source: 'properties',
        type: 'fill',
        paint: {
          'fill-color': ['get', 'color'],
          'fill-opacity': 0.5
        }
      },
      propertyForSaleLayer: {
        id: 'property-for-sale-layer',
        source: 'properties',
        type: 'line',
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        },
        paint: {
          'line-color': [
            'case',
            [
              'boolean',
              ['coalesce', ['feature-state', 'forSale'], ['get', 'forSale']],
              false
            ],
            '#ff0000',
            '#e2e2e2'
          ],
          'line-opacity': [
            'case',
            [
              'boolean',
              ['coalesce', ['feature-state', 'isSelected'], ['get', 'isSelected']],
              false
            ],
            1,
            0.5
          ],
          'line-width': 2
        }
      },
      propertyForSaleFillLayer: {
        id: 'property-for-sale-fill-layer',
        source: 'properties',
        type: 'fill',
        paint: {
          'fill-color': [
            'case',
            [
              'boolean',
              ['coalesce', ['feature-state', 'forSale'], ['get', 'forSale']],
              false
            ],
            '#ff0000',
            '#e2e2e2'
          ],
          'fill-opacity': 0.5
        }
      }
    }
  },
  computed: {
    showPropertiesButton () {
      return this.propertyLoaded ? 'city.refreshPropertiesButton' : 'city.showPropertiesButton'
    }
  },
  mounted () {
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

    this.cityProperties = this.loadCachedProperties()
  },
  methods: {
    onMapLoad (event) {
      new mapboxgl.Marker()
        .setLngLat(this.city.location.coordinates)
        .addTo(this.map)

      this.map.addSource('properties', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: []
        }
      })
      this.map.addLayer(this.propertyLayer)
      this.map.addLayer(this.propertyFillLayer)
      this.map.addLayer(this.propertyForSaleLayer)
      this.map.addLayer(this.propertyForSaleFillLayer)
      this.map.setLayoutProperty('property-for-sale-layer', 'visibility', 'none')
      this.map.setLayoutProperty('property-for-sale-fill-layer', 'visibility', 'none')
      this.map.getCanvas().style.cursor = 'crosshair'

      this.map.on('mousemove', 'property-fill-layer', this.onMouseEnterProperty)
      this.map.on('mouseleave', 'property-fill-layer', this.onMouseLeaveProperty)
      this.map.on('click', 'property-fill-layer', this.onPropertyClick)
        .on('click', this.onMapClick)

      this.propertyPopup = new mapboxgl.Popup({
        closeButton: false
      })
      this.popupContent = new Vue({
        ...MapPopup,
        parent: this,
        propsData: {
        }
      }).$mount()

      if (this.cityProperties.length > 0) {
        console.log('Add cached properties to map')
        this.addPropertiesToMap(this.cityProperties)
        this.propertyLoaded = true
      }
    },
    onMouseEnterProperty (e) {
      this.map.getCanvas().style.cursor = 'pointer'
      const feature = e.features[0]
      this.currentProperty = feature.properties

      const name = (feature.properties.description === undefined) ? '' : feature.properties.description

      this.popupContent.title = name
      this.popupContent.popupType = 'property'
      this.popupContent.popupData = feature.properties

      this.propertyPopup
        .setLngLat(e.lngLat)
        .setDOMContent(this.popupContent.$el)
        .addTo(this.map)
    },
    onMouseLeaveProperty () {
      this.map.getCanvas().style.cursor = 'crosshair'
      const popUps = document.getElementsByClassName('mapboxgl-popup')
      /** Check if there is already a popup on the map and if so, remove it */
      if (popUps[0]) { popUps[0].remove() };
    },
    onPropertyClick (e) {
      e.preventDefault()
      e.originalEvent.preventDefault()
      const currentFeature = e.features[0]
      const propertyId = currentFeature.properties.propertyId
      console.log(currentFeature)
      window.open('https://app.earth2.io/#thegrid/' + propertyId)
    },
    async showProperties () {
      this.loadTiles = true

      this.cityProperties = await this.getCityProperties()
      this.propertyLoaded = true
      if (this.cityProperties.length > 0) {
        this.addPropertiesToMap(this.cityProperties)
        this.setCachedProperties(this.cityProperties)
      }
    },
    onMapClick (e) {
      if (!e.defaultPrevented) {
        console.log('Map clicked')
        console.log(e.lngLat)

        window.open(`https://app.earth2.io/?lng=${e.lngLat.lng}&lat=${e.lngLat.lat}`)
      }
    },
    async getCityProperties () {
      console.log('getCityProperties')

      const fetchedId = this.$route.params.id
      try {
        const response = await this.$axios.$get('/earth-2-properties/city/' + fetchedId)
        console.log(response)

        this.loadTiles = false
        return response
      } catch (error) {
        this.error = true
        this.loadTiles = false
        // TODO handle error
        console.log('error')
        console.log(error)
      }
    },
    addPropertiesToMap (properties) {
      const polygons = []

      properties.forEach((prop) => {
        const polygon = this.processTiles(prop)
        polygons.push(polygon)
      })

      this.map.getSource('properties').setData({
        type: 'FeatureCollection',
        features: polygons
      })

      console.log(polygons)

      this.map.fitBounds(mapUtils.getBboxForPolygons(polygons))
      // this.map.flyTo({ center: this.city.location.coordinates, zoom: 11 })
    },
    togglePropertiesForSale () {
      if (this.forSaleToggle) {
        this.map.setLayoutProperty('property-layer', 'visibility', 'none')
        this.map.setLayoutProperty('property-layer', 'visibility', 'none')
        this.map.setLayoutProperty('property-for-sale-layer', 'visibility', 'visible')
        this.map.setLayoutProperty('property-for-sale-fill-layer', 'visibility', 'visible')
      } else {
        this.map.setLayoutProperty('property-layer', 'visibility', 'visible')
        this.map.setLayoutProperty('property-layer', 'visibility', 'visible')
        this.map.setLayoutProperty('property-for-sale-layer', 'visibility', 'none')
        this.map.setLayoutProperty('property-for-sale-fill-layer', 'visibility', 'none')
      }
    },
    processTiles (property) {
      // process tiles
      if (!property.indices.length) {
        return null
      }
      const polygon = mapUtils.quadkeysToPolygon(property.indices)

      polygon.properties = {
        ...property,
        color: this.stringToColor(property.ownerId),
        type: 'landfield'
      }

      return polygon
    },
    stringToColor (str) {
      let hash = 0
      for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
      }
      let colour = '#'
      for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF
        colour += ('00' + value.toString(16)).substr(-2)
      }
      return colour
    },
    loadCachedProperties () {
      const cachedProperties = localStorage.getItem('properties')
      console.log('loadCachedProperties')
      console.log(JSON.parse(cachedProperties).filter(e => e.cityId === this.city.id))
      return cachedProperties ? JSON.parse(cachedProperties).filter(e => e.cityId === this.city.id) : []
    },
    setCachedProperties (properties) {
      console.log('setCachedProperties')
      let cachedProperties = localStorage.getItem('properties')
      cachedProperties = cachedProperties ? JSON.parse(cachedProperties).filter(e => e.cityId === this.city.id) : []
      console.log(cachedProperties)

      if (cachedProperties.length === 0) {
        cachedProperties = properties
      } else {
        cachedProperties = cachedProperties.filter(e => e.cityId !== this.city.id).concat(properties)
      }
      localStorage.setItem('properties', JSON.stringify(cachedProperties))
    }
  }
}
</script>

<style scoped>
</style>

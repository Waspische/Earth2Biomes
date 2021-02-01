<template>
  <div class="map-wrapper">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="12">
        <span v-if="loading">Loading...</span>
        <label for="checkbox">GeoJSON Visibility</label>
        <input
          id="checkbox"
          v-model="show"
          type="checkbox"
        >
        <label for="checkboxTooltip">Enable tooltip</label>
        <input
          id="checkboxTooltip"
          v-model="enableTooltip"
          type="checkbox"
        >
      </v-col>
    </v-row>
    <div id="map" class="leaflet-map" style="height: 600px">
      <l-map
        ref="map"
        :zoom="zoom"
        :center="center"
      >
        <l-tile-layer
          :url="url"
          :attribution="attribution"
        />
        <l-geo-json
          v-if="show"
          :geojson="geojson"
          :options="options"
          :options-style="styleFunction"
        />
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet'
import allQuaries from '~/data/allQuarries.json'

export default {
  name: 'Example',
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },
  data () {
    return {
      loading: false,
      show: true,
      enableTooltip: true,
      zoom: 6,
      center: [48, -1.219482],
      geojson: null,
      polygon: {
        color: '#ff00ff'
      },
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  },
  computed: {
    options () {
      return {
        onEachFeature: this.onEachFeatureFunction
      }
    },
    styleFunction () {
      return () => {
        return {
          weight: 5,
          color: '#d800f1',
          opacity: 0.65
        }
      }
    },
    onEachFeatureFunction () {
      if (!this.enableTooltip) {
        return () => {}
      }
      return (feature, layer) => {
        layer.bindTooltip(
          '<div>resource:' +
          feature.properties.resource +
          '</div><div>name: ' +
          feature.properties.name +
          '</div>',
          { permanent: false, sticky: true }
        )
      }
    }
  },
  async created () {
    this.loading = true
    this.geojson = await allQuaries
    this.loading = false
  }
}
</script>

<template>
  <div class="map-wrapper">
    <div id="map" class="leaflet-map" style="height: 600px">
      <l-map
        ref="map"
        :zoom="zoom"
        :center="center"
        :options="{zoomControl: false}"
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
        <l-control-zoom position="bottomright" />
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet'
// import allQuaries from '~/data/allQuarries.json'
// const getAllQuarries = () => import('static/data/allQuarries.json').then(m => m.default || m)

export default {
  name: 'Map',
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
    printSelected () {
      console.log(this.$state.state.selected)
      return this.$state.state.selected
    },
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
  created () {
    this.loading = true
    // this.geojson = await getAllQuarries()
    this.loading = false
  }
}
</script>

<style scoped>
#map {
  z-index: 1;
  position: absolute;
  position: fixed
}

#map,
.info {
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%
}
</style>

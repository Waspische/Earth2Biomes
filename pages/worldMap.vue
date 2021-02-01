<template>
  <div class="world-wrapper">
    <div class="card-wrapper">
      <div id="card">
        <div class="card-header">
          <a href="#" class="backlink" style="display: none;">
            <i class="material-icons">subdirectory_arrow_left</i>&nbsp;&nbsp;
            <span />
          </a>
          <h1 class="title">
            Biomes
          </h1>
        </div>
        <div
          v-for="biome in biomes"
          :key="biome.name"
        >
          <a
            class="maplink"
            :class="{active:selectedBiome !== undefined && biome.name == selectedBiome.name}"
            @click="onBiomeSelect(biome)"
          >
            <svg width="10px" height="10px" viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg" class="spinner">
              <circle
                cx="4"
                cy="4"
                r="3"
                fill="#fff"
                stroke-width="0"
                class="path"
              /></svg>
            <span>{{ biome.name }}</span>
          </a>
        </div>
        <div class="card-footer" />
      </div>
    </div>
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
  </div>
</template>

<script>
import { LMap, LTileLayer, LGeoJson } from 'vue2-leaflet'

export default {
  name: 'WorldMap',
  components: {
    LMap,
    LTileLayer,
    LGeoJson
  },
  data () {
    return {
      biomes: [
        {
          name: 'Gold',
          fileName: 'goldMines.json',
          color: '#FFD700'
        },
        {
          name: 'Clay',
          fileName: 'clayMines.json',
          color: '#D4C59C'
        },
        {
          name: 'Sand',
          fileName: 'sandMines.json',
          color: '#c2b280'
        },
        {
          name: 'Peat',
          fileName: 'peatMines.json',
          color: '#766D52'
        },
        {
          name: 'Coal',
          fileName: 'clayMines.json',
          color: '#36454f'
        }
      ],
      selectedBiome: undefined,
      loading: false,
      show: true,
      enableTooltip: true,
      zoom: 6,
      center: [48, -1.219482],
      geojson: null,
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
      const fillColor = '#FFD700'
      return () => {
        return {
          weight: 5,
          color: fillColor,
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
  methods: {
    async onBiomeSelect (biome) {
      this.selectedBiome = biome
      this.geojson = await fetch(
        '/data/' + biome.fileName
      ).then(res => res.json())
    }
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
.card-wrapper {
  width: 300px;
  position: relative;
  top: 0;
  right: 0;
  z-index: 3
}

#card {
  box-shadow: 0 5px 25px rgba(0, 0, 0, .08);
  background: var(--v-primary-base);
  margin: 20px 0 0 20px;
  -webkit-transition: height 1s;
  transition: height 1s
}

#card .card-header {
  padding: 25px 40px 30px;
  position: relative
}

#card .title {
  margin: 0;
  padding: 0;
  font-size: 32px
}

#card .card-footer {
  padding: 0 30px 20px
}

a.maplink {
  display: block;
  padding: 10px 40px 10px 90px;
  color: var(--v-text-base);
  text-decoration: none;
  position: relative;
  -webkit-transition: background-color .25s ease-out;
  transition: background-color .25s ease-out
}

a.maplink .spinner {
  position: absolute;
  top: 22px;
  left: 45px
}

a.maplink.active {
  background: var(--v-secondary-base);
  border-left: 4px solid var(--v-secondary-base);
  position: relative;
  left: -4px;
  padding-left: 90px;
  color: var(--v-text-base);
  width: 284px;
  box-sizing: border-box
}

a.maplink:hover {
  text-decoration: underline;
  cursor: pointer
}

a.maplink:first-child.active {
  border-top: none;
  margin-top: 1px
}
</style>

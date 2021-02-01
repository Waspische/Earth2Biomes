<template>
  <div id="map-wrapper" fluid fill-height width="700px">
    <div id="map" />
  </div>
</template>

<script>
import mapboxgl from 'mapbox-gl'

export default {
  name: 'MapboxMap',
  components: {
  },
  data () {
    return {
      biomes: [
        {
          name: 'Quarries',
          landuses: [
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
          ]
        }
      ],
      selectedLanduses: [],
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v9', // your map style
      geoJsonSource: './data/goldMines.json',
      sourceId: 'goldMines',
      minesBoundary: {
        id: 'minesBoundary',
        source: 'carte',
        type: 'fill',
        paint: {
          'fill-color': '#B42222',
          'fill-opacity': 0.8
        },
        filter: ['==', '$type', 'Polygon']
      },
      minesLocation: {
        id: 'minesLocation',
        source: 'carte',
        type: 'circle',
        paint: {
          'circle-radius': 6,
          'circle-color': '#B42222'
        },
        filter: ['==', '$type', 'Point']
      },
      minesLocationStroke: {
        id: 'minesLocation-stroke',
        type: 'line',
        source: 'carte',
        minzoom: 0,
        maxzoom: 14,
        layout: {
          visibility: 'visible',
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-width': 8,
          'line-color': '#90CAF9'
        }
      }
    }
  },
  mounted () {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWlzaHdlcnlhIiwiYSI6ImNrYzVyYXBlNzBrZGgzMG8wc3FtZjU5NDAifQ.u4azaXjkh41xSMC1NJLhTw'

    // create a new mapbox instance
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle
    })
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    this.map.on('load', this.onMapLoad)
    this.map.on('zoom', this.onZoom)
    // this.map.on('sourcedataloading', this.onSourceDataLoading)
  },
  methods: {
    async onMapLoad (event) {
      // in component
      // this.map = event.map
      // or just to store if you want have access from other components
      // this.$store.map = event.map
      // Here we cathing 'load' map event
      await this.map.addSource('carte', {
        data: this.geoJsonSource,
        // 'https://gist.githubusercontent.com/Waspische/396c93b2e3ca8c6ddda6462580aec95a/raw/2afdbb4f1d840a4bd8eea87aa102eec57b060d7a/goldMines.json'
        type: 'geojson'
      })
      this.map.addLayer(this.minesBoundary)
      this.map.addLayer(this.minesLocation)
      this.map.addLayer(this.minesLocationStroke)
      // this.map.on("mousemove", this.onMouseMove),
      // this.map.on("mouseout", this.onMouseOut),
      // this.map.on("click", this.onClick)
    },
    onZoom () {
      console.log(this.map.getZoom())
    }
  }

}
</script>

<style scoped>

#map,.map-loader{position:absolute;top:0;left:0;bottom:0;right:0;width:100%;height:100%}.
#menu-wrapper{
  position: relative;
  top: 0;
  left: 0;
  z-index: 3;
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

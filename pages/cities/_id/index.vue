<template>
  <v-container class="mt-2">
    <div v-if="loading" class="text-center">
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>
    <section v-else>
      <v-card
        elevation="4"
        class="pa-4 mb-4"
        rounded
      >
        <v-app-bar
          flat
          color="rgba(0, 0, 0, 0)"
        >
          <v-toolbar-title class="title pl-0 text-wrap">
            {{ city.cityName }} <span v-if="city.group">- This city is part of {{ city.group.groupName }}</span>
          </v-toolbar-title>

          <v-spacer />

          <v-toolbar-title class="subtitle-1 text--secondary pl-0 text-wrap">
            Last updated on {{ $moment(city.lastUpdated).local().format("ddd, MMMM Do YYYY, hh:mm") }}
          </v-toolbar-title>
        </v-app-bar>
      </v-card>

      <v-row>
        <v-col
          cols="12"
          md="12"
        >
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
                      <v-list-item-subtitle>Location</v-list-item-subtitle>
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
                      <v-list-item-subtitle>Earth2 link</v-list-item-subtitle>
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
                      <v-list-item-subtitle>Website</v-list-item-subtitle>
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
                      <v-list-item-subtitle>Discord server</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-col>

              <v-list class="pa-4">
                <v-list-item-content>
                  <v-list-item-title class="font-weight-medium">
                    Description
                  </v-list-item-title>
                  <v-list-item-content v-if="city.description" class="text-justify">
                    {{ city.description }}
                  </v-list-item-content>
                  <v-list-item-content v-else class="text-justify">
                    No description available. Consider adding one to get the city stats later.
                  </v-list-item-content>
                </v-list-item-content>
              </v-list>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-alert
        v-if="!hasData"
        type="warning"
        class="mx-2 mt-4"
      >
        Contact Wasp#1975 on discord to get your city info
      </v-alert>
      <v-row>
        <v-col
          cols="12"
          md="6"
          sm="6"
          class="d-flex"
          style="flex-direction:column"
        >
          <v-card class="mb-2 flex-grow-1">
            <v-card-title>Number of tiles owned</v-card-title>
            <template v-if="hasData">
              <v-card-text
                class="text-center text-h4 text--primary pb-0"
              >
                {{ tilesSoldLastNumber }}
              </v-card-text>
              <apexchart type="area" height="60" :options="lineChartOption" :series="tilesSoldSeries" />
            </template>
            <template v-else>
              <v-card-text
                class="text-center text--primary pb-2"
              >
                No data yet ...
              </v-card-text>
            </template>
          </v-card>

          <v-card class="mt-2 flex-grow-1">
            <v-card-title>Number of players</v-card-title>
            <template v-if="hasData">
              <v-card-text class="text-center text-h4 text--primary pb-0">
                {{ playersLastNumber }}
              </v-card-text>
              <apexchart type="area" height="60" :options="lineChartOption" :series="playersSeries" />
            </template>
            <template v-else>
              <v-card-text
                class="text-center text--primary pb-2"
              >
                No data yet ...
              </v-card-text>
            </template>
          </v-card>

          <v-card class="mt-4 d-flex" style="flex-direction: column">
            <v-card-title>Class distribution</v-card-title>
            <template v-if="hasData">
              <div class="" style="align-self: center;">
                <apexchart type="pie" width="100%" :options="classDistributionChartOptions" :series="classSeries" />
              </div>
            </template>
            <template v-else>
              <v-card-text
                class="text-center text--primary pb-2"
              >
                No data yet ...
              </v-card-text>
            </template>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
          sm="6"
          class="d-flex"
        >
          <v-card class="flex-grow-1">
            <v-card-title>Top 10 players</v-card-title>
            <template v-if="hasData">
              <v-list
                v-for="(player, index) in top10Players"
                :key="player.title"
              >
                <v-list-item>
                  <v-btn :color="playerColor(index)" icon outlined>
                    {{ index + 1 }}
                  </v-btn>
                  <v-list-item-content class="ml-3">
                    {{ player.username }} <span class="grey--text"> {{ player.tileNumber }} tiles</span>
                  </v-list-item-content>
                </v-list-item>
              </v-list>
            </template>
            <template v-else>
              <v-card-text
                class="text-center text--primary pb-2"
              >
                No player info yet
              </v-card-text>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </section>
  </v-container>
</template>

<script>
import mapboxgl from 'mapbox-gl'
import chart from 'vue-apexcharts'

export default {
  name: 'Id',
  components: { apexchart: chart },
  data () {
    return {
      city: null,
      loading: true,
      error: false,
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/light-v10',
      lineChartOption: {
        chart: {
          height: '100%',
          type: 'area',
          sparkline: {
            enabled: true
          },
          toolbar: { show: false },
          animations: {
            enabled: true,
            easing: 'easeinout',
            speed: 800,
            animateGradually: {
              enabled: true,
              delay: 150
            },
            dynamicAnimation: {
              enabled: true,
              speed: 350
            }
          }
        },
        legend: {
          show: false
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        grid: { show: false },
        xaxis: {
          type: 'datetime',
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        yaxis: {
          labels: { show: false },
          axisBorder: { show: false },
          axisTicks: { show: false }
        },
        tooltip: {
          theme: 'dark',
          x: {
            format: 'dd/MM/yy HH:mm'
          }
        },
        noData: {
          text: 'Loading...'
        }
      },
      tilesSoldSeries: [],
      tilesSoldLastNumber: '',
      playersSeries: [],
      playersLastNumber: '',
      classSeries: [],
      classDistributionChartOptions: {
        chart: {
          width: '100%',
          height: 300,
          type: 'pie'
        },
        labels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'No class'],
        dataLabels: {
          formatter (value, { seriesIndex, dataPointIndex, w }) {
            return w.config.labels[seriesIndex] + ':  ' + Math.trunc(value) + '%'
          }
        },
        animations: {
          enabled: true,
          easing: 'easeinout',
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        },
        legend: {
          show: false
        },
        theme: {
          palette: 'palette2'
        },
        stroke: {
          colors: ['#1E1E1E']
        },
        noData: {
          text: 'Loading...'
        }
      },
      top10Players: []
    }
  },
  computed: {
    hasData () {
      return this.tilesSoldLastNumber !== ''
    }
  },
  created () {
    console.log('created')
  },
  async mounted () {
    console.log('mounted')
    await this.getCities()
    mapboxgl.accessToken = this.accessToken

    // create a new mapbox instance
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle,
      zoom: 4, // starting zoom
      center: this.city.location.coordinates,
      sprite: 'mapbox://sprites/mapbox/bright-v8'
    })
    this.map.on('load', this.onMapLoad)

    console.log(this.city)

    this.getCityStats()
  },
  methods: {
    onMapLoad (event) {
      new mapboxgl.Marker()
        .setLngLat(this.city.location.coordinates)
        .addTo(this.map)
    },
    async getCities () {
      console.log('getCities')

      this.loading = true
      const fetchedId = this.$route.params.id
      try {
        const response = await this.$axios.$get('/cities/' + fetchedId)
        this.loading = false
        this.city = response
      } catch (error) {
        this.loading = false
        this.error = true
        // TODO handle error
        console.log('error')
        console.log(error)
      }
    },
    async getCityStats () {
      console.log('getCityStats')
      const fetchedId = this.$route.params.id
      try {
        const response = await this.$axios.$get('/city-stats/' + fetchedId)
        console.log(response)
        this.tilesSoldSeries = [{
          name: 'Number of tiles',
          data: response.tileNumberSoldData
        }]
        this.tilesSoldLastNumber = response.tileNumberSoldData[response.tileNumberSoldData.length - 1].y
        this.playersSeries = [{
          name: 'Number of players',
          data: response.playerNumberData
        }]
        this.playersLastNumber = response.playerNumberData[response.playerNumberData.length - 1].y
        this.classSeries = response.classDistributionFrom1to5
        this.top10Players = response.top10Players
      } catch (error) {
        this.error = true
      }
    },
    playerColor (index) {
      let color = 'grey'
      if (index === 0) {
        color = 'green'
      } else if (index === 1) {
        color = 'orange'
      } else if (index === 2) {
        color = 'red'
      }
      return color
    }
  },
  head () {
    return {
      title: this.city ? this.city.cityName : ''
    }
  }
}
</script>

<style scoped>
svg.apexcharts-svg { background: transparent !important; }

</style>

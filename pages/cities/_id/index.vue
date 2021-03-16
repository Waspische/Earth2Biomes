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
                    href="https://app.earth2.io/#thegrid/af828af6-96d8-4a2c-9751-9d61d070b8ec"
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
                    href="https://app.earth2.io/#thegrid/af828af6-96d8-4a2c-9751-9d61d070b8ec"
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
                    href="https://app.earth2.io/#thegrid/af828af6-96d8-4a2c-9751-9d61d070b8ec"
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
        type="warning"
        class="mx-2 mt-4"
      >
        Information below is fake and should be available in the future.
        If you want your city data here, please fill at least the description and, website or discord link.
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
            <v-card-text class="text-center text-h4 text--primary pb-0">
              63 485
            </v-card-text>
            <apexchart type="area" height="60" :options="userChartOptions" :series="userSeries" />
          </v-card>

          <v-card class="mt-2 flex-grow-1">
            <v-card-title>Number of players</v-card-title>
            <v-card-text class="text-center text-h4 text--primary pb-0">
              456
            </v-card-text>
            <apexchart type="area" height="60" :options="userChartOptions" :series="userSeries" />
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
          sm="6"
          class="d-flex"
        >
          <v-card class="flex-grow-1">
            <v-card-title>Top 5 players</v-card-title>
            <v-list>
              <v-list-item>
                <v-btn color="green" icon outlined>
                  1
                </v-btn>
                <v-list-item-content class="ml-3">
                  Wasp
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-btn color="orange" icon outlined>
                  2
                </v-btn>
                <v-list-item-content class="ml-3">
                  Wasp
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-btn color="red" icon outlined>
                  3
                </v-btn>
                <v-list-item-content class="ml-3">
                  Wasp
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-btn color="grey" icon outlined>
                  4
                </v-btn>
                <v-list-item-content class="ml-3">
                  Wasp
                </v-list-item-content>
              </v-list-item>
              <v-list-item>
                <v-btn color="grey" icon outlined>
                  5
                </v-btn>
                <v-list-item-content class="ml-3">
                  Wasp
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-card class="mt-2">
            <v-card-title>Class distribution</v-card-title>
            <apexchart type="pie" width="100%" :options="classChartOptions" :series="classSeries" />
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
      userSeries: [{
        name: 'Number of players',
        data: [31, 40, 28, 51, 42, 109, 100]
      }],
      userChartOptions: {
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
          categories: ['2018-09-19T00:00:00.000Z', '2018-09-19T01:30:00.000Z', '2018-09-19T02:30:00.000Z', '2018-09-19T03:30:00.000Z', '2018-09-19T04:30:00.000Z', '2018-09-19T05:30:00.000Z', '2018-09-19T06:30:00.000Z'],
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
        }
      },
      classSeries: [44, 55, 13, 43, 22],
      classChartOptions: {
        chart: {
          type: 'pie'
        },
        labels: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5'],
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
        }
      }
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
        console.log('city')
        console.log(this.city)
      } catch (error) {
        this.loading = false
        this.error = true
        // TODO handle error
        console.log('error')
        console.log(error)
      }
    }
  },
  head () {
    return {
      title: 'Dorkslayer'
    }
  }
}
</script>

<style scoped>
svg.apexcharts-svg { background: transparent !important; }

</style>

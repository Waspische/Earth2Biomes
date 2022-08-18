<template>
  <v-row>
    <v-col cols="12" md="12" />
    <v-col
      cols="12"
      md="6"
      sm="6"
      class="d-flex"
      style="flex-direction:column"
    >
      <v-card class="mb-2">
        <v-card-title>{{ $t('city.numberOfTiles') }}</v-card-title>
        <template v-if="hasData">
          <v-card-text
            class="text-center text-h4 text--primary pb-0"
          >
            {{ tilesSoldLastNumber | formatNumber }}
          </v-card-text>
          <apexchart type="area" height="60" :options="lineChartOption" :series="tilesSoldSeries" />
        </template>
        <template v-else>
          <v-card-text
            class="text-center text--primary pb-2"
          >
            {{ $t('city.noDataYet') }}
          </v-card-text>
        </template>
      </v-card>

      <v-card class="mt-2">
        <v-card-title>{{ $t('city.numberOfPlayers') }}</v-card-title>
        <template v-if="hasData">
          <v-card-text class="text-center text-h4 text--primary pb-0">
            {{ playersLastNumber | formatNumber }}
          </v-card-text>
          <apexchart type="area" height="60" :options="lineChartOption" :series="playersSeries" />
        </template>
        <template v-else>
          <v-card-text
            class="text-center text--primary pb-2"
          >
            {{ $t('city.noDatayet') }}
          </v-card-text>
        </template>
      </v-card>
      <v-row class="mt-2">
        <v-col
          cols="12"
          md="6"
          sm="6"
          class="d-flex"
        >
          <v-card class="flex-grow-1">
            <v-card-title>{{ $t('city.classDistribution') }}</v-card-title>
            <template v-if="hasData">
              <div class="" style="align-self: center;">
                <apexchart type="pie" height="220" :options="classDistributionChartOptions" :series="cityStats.classDistributionFrom1to5" />
              </div>
            </template>
            <template v-else>
              <v-card-text
                class="text-center text--primary pb-2"
              >
                {{ $t('city.noDataYet') }}
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
            <v-card-title>{{ $t('city.tierDistribution') }}</v-card-title>
            <template v-if="hasData">
              <div class="" style="align-self: center;">
                <apexchart type="pie" height="220" :options="tierDistributionChartOptions" :series="cityStats.tierDistribution" />
              </div>
            </template>
            <template v-else>
              <v-card-text
                class="text-center text--primary pb-2"
              >
                {{ $t('city.noDataYet') }}
              </v-card-text>
            </template>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
    <v-col
      cols="12"
      md="6"
      sm="6"
      class="d-flex"
    >
      <v-card class="flex-grow-1">
        <v-card-title>{{ $t('city.top10Players') }}</v-card-title>
        <template v-if="hasData">
          <v-list
            v-for="(player, index) in cityStats.top10Players"
            :key="player.title"
            dense
            class="py-1"
          >
            <v-list-item>
              <v-btn :color="playerColor(index)" icon outlined>
                {{ index + 1 }}
              </v-btn>
              <v-list-item-content class="ml-3">
                <a :href="playerLink(player)" target="_blank" rel="noopener noreferrer">
                  {{ player.username }}
                </a>
                <span class="grey--text"> {{ player.tileNumber | formatNumber }} tiles</span>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </template>
        <template v-else>
          <v-card-text
            class="text-center text--primary pb-2"
          >
            {{ $t('city.noPlayerInfo') }}
          </v-card-text>
        </template>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import chart from 'vue-apexcharts'

export default {
  name: 'CityStats',
  components: { apexchart: chart },
  filters: {
    formatNumber (number) {
      return new Intl.NumberFormat().format(Math.trunc(number))
    }
  },
  props: [
    'city', 'cityStats'
  ],
  data () {
    return {
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
      classDistributionChartOptions: {
        chart: {
          height: '100%',
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

      tierDistributionChartOptions: {
        chart: {
          height: '100%',
          type: 'pie'
        },
        labels: ['Tier 1', 'Tier 2'],
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
      tilesSoldLastNumber: '',
      tilesSoldSeries: null,
      playersSeries: null,
      playersLastNumber: null
    }
  },
  computed: {
    hasData () {
      return this.tilesSoldLastNumber !== ''
    }
  },
  mounted () {
    this.tilesSoldSeries = [{
      name: 'Number of tiles',
      data: this.cityStats.tileNumberSoldData
    }]
    this.playersSeries = [{
      name: 'Number of players',
      data: this.cityStats.playerNumberData
    }]
    this.tilesSoldLastNumber = this.cityStats.tileNumberSoldData[this.cityStats.tileNumberSoldData.length - 1].y
    this.playersLastNumber = this.cityStats.playerNumberData[this.cityStats.playerNumberData.length - 1].y
  },
  methods: {
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
    },
    playerLink (player) {
      return 'https://app.earth2.io/#profile/' + player.playerId
    }
  }
}
</script>

<style scoped>

svg.apexcharts-svg { background: transparent !important; }
.v-application a {
  color: #fff;
  text-decoration: none; /* no underline */
}

</style>

<template>
  <v-container>
    <h1 class="text-h6 text-sm-h5 text-md-h4 text-lg-h3 text-center">
      Cities leaderboard
    </h1>
    <v-row justify="center" class="ma-4">
      <v-col cols="12" md="3" sm="4" order-sm="2">
        <v-card
          class="gold"
          height="100%"
          :to="{ name: 'cities-id', params: { id: first.cityId} }"
        >
          <v-card-title class="justify-center">
            <v-avatar
              color="gold"
              size="48"
              class="top-leaders"
            >
              <span class="headline">1</span>
            </v-avatar>
          </v-card-title>
          <v-card-text class="text-center pb-0">
            <p class="text-h6 font-weight-bold">
              {{ first.cityName }}
            </p>
            <p class="text-body-1 font-weight-medium">
              {{ first.tileNumberSold | formatNumber }} tiles
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="4" class="pt-sm-10" order-sm="1">
        <v-card
          class="silver"
          height="100%"
          :to="{ name: 'cities-id', params: { id: second.cityId} }"
        >
          <v-card-title class="justify-center">
            <v-avatar
              color="silver"
              size="48"
              class="top-leaders"
            >
              <span class="headline">2</span>
            </v-avatar>
          </v-card-title>
          <v-card-text class="text-center pb-0">
            <p class="text-h6 font-weight-bold">
              {{ second.cityName }}
            </p>
            <p class="text-body-1 font-weight-medium">
              {{ second.tileNumberSold | formatNumber }} tiles
            </p>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" md="3" sm="4" class="pt-sm-16" order-sm="3">
        <v-card
          class="bronze"
          height="100%"
          :to="{ name: 'cities-id', params: { id: third.cityId} }"
        >
          <v-card-title class="justify-center">
            <v-avatar
              color="bronze"
              size="48"
              class="top-leaders"
            >
              <span class="headline">3</span>
            </v-avatar>
          </v-card-title>
          <v-card-text class="text-center pb-0 ">
            <p class="text-h6 font-weight-bold">
              {{ third.cityName }}
            </p>
            <p class="text-body-1 font-weight-medium">
              {{ third.tileNumberSold | formatNumber }} tiles
            </p>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row justify="center" class="ma-4">
      <v-col cols="12" md="9">
        <v-card>
          <v-list>
            <v-list-item
              v-for="(city, index) in cities"
              :key="city.cityId"
              :to="{ name: 'cities-id', params: { id: city.cityId} }"
            >
              <v-list-item-avatar class="top-leaders">
                {{ index + 4 }}
              </v-list-item-avatar>

              <v-list-item-title
                v-text="city.cityName"
              />

              <v-list-item-subtitle class="text-right">
                {{ city.tileNumberSold | formatNumber }} tiles
              </v-list-item-subtitle>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <p>
      Tile number are calculated from the center tile of the city until the tiles sold are too low.
    </p>
    <p>
      Also, close cities can merge and have a huge number of tiles. Tile plot far from the city may be ignored.
    </p>
    <v-overlay
      :value="overlay"
      :opacity="0.7"
    >
      <v-progress-circular
        indeterminate
        size="64"
      />
    </v-overlay>
  </v-container>
</template>

<script>

export default {
  name: 'Leaderboard',
  filters: {
    formatNumber (number) {
      return new Intl.NumberFormat().format(number)
    }
  },
  data: () => ({
    cities: [],
    overlay: false,
    first: {
      cityId: '',
      cityName: '',
      tileNumberSold: 0
    },
    second: {
      cityId: '',
      cityName: '',
      tileNumberSold: 0
    },
    third: {
      cityId: '',
      cityName: '',
      tileNumberSold: 0
    }
  }),
  created () {
    this.getCities()
  },
  methods: {
    async getCities () {
      this.overlay = true
      const response = await this.$axios.$get('/city-stats/leaderboard')
      this.overlay = false
      this.cities = response.content
      this.first = this.cities.shift()
      this.second = this.cities.shift()
      this.third = this.cities.shift()
    }
  },
  head () {
    return {
      title: 'Leaderboard'
    }
  }
}
</script>

<style scoped>
.gold {
  /*background:linear-gradient(to right, #BF953F, #FCF6BA, #B38728, #FBF5B7, #AA771C);*/
  background: #BF953F;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #BF953F, #ddd678);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #BF953F, #ddd678); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.silver {
  background: #abbaab;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #2c3e50, #bdc3c7);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #2c3e50, #bdc3c7); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.bronze {
  background: #f46b45;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to bottom, #f46b45, #eea849);  /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(to bottom, #f46b45, #eea849); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
.top-leaders{
  border: 1px solid white;
  justify-content: center !important;
}
</style>

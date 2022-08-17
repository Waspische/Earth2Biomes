<!-- eslint-disable vue/v-slot-style -->
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
        class="pa-3 mb-4"
        rounded
      >
        <v-card-title class="title pa-0 text-wrap">
          <span>{{ city.cityName }} <span v-if="city.group"> {{ $t('city.cityGroup') }} {{ city.group.groupName }}</span></span>
        </v-card-title>
        <v-card-text class="subtitle-2 text--secondary pa-0 text-wrap">
          {{ $t('city.lastUpdated') }} {{ $moment(city.lastUpdated).local().format("ddd, MMMM Do YYYY, hh:mm") }}
        </v-card-text>
      </v-card>

      <v-card
        elevation="4"
        class="mb-4"
        rounded
      >
        <v-btn
          color="primary darken-1"
          text
          x-large
          @click="$vuetify.goTo('#city-details')"
        >
          {{ $t('city.details') }}
        </v-btn>
        <v-btn
          color="primary darken-1"
          text
          x-large
          @click="$vuetify.goTo('#properties-for-sale')"
        >
          {{ $t('city.propertiesForSale') }}
        </v-btn>
        <v-btn
          color="primary darken-1"
          text
          x-large
          @click="$vuetify.goTo('#city-stats')"
        >
          {{ $t('city.stats') }}
        </v-btn>
      </v-card>

      <CityDetails id="city-details" :city="city" />
      <div v-if="loadingStats" class="text-center">
        <v-progress-circular
          indeterminate
          color="primary"
        />
      </div>
      <PropertiesForSale
        v-if="!loadingStats"
        id="properties-for-sale"
        :properties-for-sale="propertiesForSale"
      />
      <CityStats
        v-if="!loadingStats"
        id="city-stats"
        :city="city"
        :city-stats="cityStats"
      />
    </section>
  </v-container>
</template>

<script>

export default {
  name: 'Id',
  filters: {
    formatNumber (number) {
      return new Intl.NumberFormat().format(Math.trunc(number))
    }
  },
  data () {
    return {
      city: null,
      loading: true,
      loadingStats: true,
      error: false,
      tab: null,
      cityStats: null,
      propertiesForSale: []
    }
  },
  head () {
    return {
      title: this.city ? this.city.cityName : ''
    }
  },
  async mounted () {
    await this.getCity()
    this.getCityStats()

    console.log(this.city)
  },
  methods: {
    async getCity () {
      console.log('getCity')

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
        this.loadingStats = false
        this.cityStats = response
        console.log(response)
        this.propertiesForSale = (response.propertiesForSale ? response.propertiesForSale : [])
      } catch (error) {
        console.log(error)
        this.loadingStats = false
        this.error = true
      }
    },
    head () {
      return {
        title: this.city ? this.city.cityName : ''
      }
    }
  }
}
</script>

<style scoped>
</style>

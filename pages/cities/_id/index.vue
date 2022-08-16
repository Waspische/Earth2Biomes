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
      <v-tabs
        v-model="tab"
        background-color="primary darken-1"
        fixed-tabs
      >
        <v-tab>{{ $t('city.details') }}</v-tab>
        <v-tab>
          {{ $t('city.propertiesForSale') }}
        </v-tab>
        <v-tab>
          {{ $t('city.stats') }}
        </v-tab>
      </v-tabs>
      <v-tabs-items v-model="tab">
        <v-tab-item>
          <CityDetails :city="city" />
        </v-tab-item>
        <v-tab-item>
          <PropertiesForSale :properties-for-sale="propertiesForSale" />
        </v-tab-item>
        <v-tab-item>
          <CityStats
            :city="city"
            :city-stats="cityStats"
          />
        </v-tab-item>
      </v-tabs-items>
    </section>
  </v-container>
</template>

<script>
import PropertiesForSale from '../../../components/PropertiesForSale.vue'

export default {
  name: 'Id',
  components: { PropertiesForSale },
  filters: {
    formatNumber (number) {
      return new Intl.NumberFormat().format(Math.trunc(number))
    }
  },
  data () {
    return {
      city: null,
      loading: true,
      error: false,
      tilesSoldLastNumber: '',
      tab: null,
      propertiesForSale: [],
      cityStats: null
    }
  },
  head () {
    return {
      title: this.city ? this.city.cityName : ''
    }
  },
  async mounted () {
    await this.getCity()

    console.log(this.city)

    this.getCityStats()
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
        this.cityStats = response
        console.log(response)
        this.propertiesForSale = (response.propertiesForSale ? response.propertiesForSale : [])
      } catch (error) {
        console.log(error)
        this.error = true
      }
    },
    async getCityProperties () {
      console.log('getCityProperties')

      const fetchedId = this.$route.params.id
      try {
        const response = await this.$axios.$get('/earth-2-properties/city/' + fetchedId)
        this.cityProperties = response
      } catch (error) {
        this.error = true
        // TODO handle error
        console.log('error')
        console.log(error)
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

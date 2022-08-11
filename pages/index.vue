<template>
  <div>
    <v-container class="pt-12 pb-0 pt-lg-15 text-center px-0">
      <v-row justify="center">
        <v-col cols="12" md="12">
          <h1 class="text-h4 text-sm-h3 text-md-h2 text-lg-h1">
            Earth 2 <span class="primary--text">Biomes</span>
          </h1>
        </v-col>
        <v-col
          cols="8"
          md="8"
          sm="10"
        >
          <h2
            class="text-h6 text-sm-h5 mt-4"
          >
            {{ $t('index.subtitle') }}
          </h2>
        </v-col>
      </v-row>
    </v-container>
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 50 1440 170"><path fill="#1E1E1E" fill-opacity="1" d="M0,96L48,122.7C96,149,192,203,288,202.7C384,203,480,149,576,128C672,107,768,117,864,112C960,107,1056,85,1152,90.7C1248,96,1344,128,1392,144L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z" /></svg>
    </div>

    <v-container fluid class="pa-0">
      <v-sheet class="py-6 px-md-12 px-4">
        <v-row>
          <v-col cols="12" md="12">
            <div class="text-center text-h6 text-sm-h5 text-md-h4 text-lg-h3">
              {{ $t('index.mainFeatures.title') }}
            </div>
          </v-col>
          <v-col cols="12" md="4" xs="12">
            <div class="text-center">
              <div class="text-h5">
                {{ $t('index.mainFeatures.leaderboard') }}
              </div>
              <div class="body-1 ma-4">
                {{ $t('index.mainFeatures.leaderboardDescription') }}
              </div>
              <v-btn
                class="mt-4"
                elevation="2"
                color="primary darken-1"
                large
                :to="localePath('/leaderboard')"
              >
                <v-icon left dark>
                  mdi-city
                </v-icon>
                {{ $t('index.mainFeatures.leaderboardButton') }}
              </v-btn>
            </div>
          </v-col>
          <v-col cols="12" md="4" xs="12">
            <div class="text-center">
              <div class="text-h5">
                {{ $t('index.mainFeatures.statistics') }}
              </div>
              <div class="body-1 ma-4">
                {{ $t('index.mainFeatures.statisticsDescription') }}
              </div>
              <v-btn
                class="mt-4"
                elevation="2"
                color="primary darken-1"
                large
                :to="localePath('/cities')"
              >
                <v-icon left dark>
                  mdi-city
                </v-icon>
                {{ $t('index.mainFeatures.statisticsButton') }}
              </v-btn>
            </div>
          </v-col>

          <v-col cols="12" md="4" xs="12">
            <div class="text-center">
              <div class="text-h5">
                {{ $t('index.mainFeatures.propertiesForSale') }}
              </div>
              <div class="body-1 ma-4">
                {{ $t('index.mainFeatures.propertiesForSaleDescription') }}
              </div>
              <v-btn
                class="mt-4"
                elevation="2"
                color="primary darken-1"
                large
                :to="localePath('/cities')"
              >
                <v-icon left dark>
                  mdi-city
                </v-icon>
                {{ $t('index.mainFeatures.propertiesButton') }}
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-sheet>
      <v-row justify="space-around" class="py-6 px-md-12 px-4">
        <v-col cols="12" md="12">
          <div class="text-center text-h6 text-sm-h5 text-md-h4 text-lg-h3">
            {{ $t('index.someStats.title') }}
          </div>
        </v-col>
        <v-col cols="12" md="4" xs="12">
          <div class="text-center">
            <div class="text-h5">
              129
            </div>
            <div class="body-1 ma-4">
              {{ $t('index.someStats.megacitiesDescription') }}
            </div>

            <v-btn
              class="mt-4"
              elevation="2"
              color="primary darken-1"
              large
              :to="localePath('/cities')"
            >
              <v-icon left dark>
                mdi-city
              </v-icon>
              {{ $t('index.someStats.megacitiesButton') }}
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="4" xs="12">
          <div class="text-center">
            <div class="text-h5">
              > 10.000
            </div>
            <div class="body-1 ma-4">
              {{ $t('index.someStats.blueDotsDescription') }}
            </div>

            <v-btn
              class="mt-4"
              elevation="2"
              color="primary darken-1"
              large
              :to="localePath('/blue_dots')"
            >
              <v-icon left dark>
                mdi-dots-horizontal-circle
              </v-icon>
              {{ $t('index.someStats.blueDotsButton') }}
            </v-btn>
          </div>
        </v-col>

        <v-col cols="12" md="4" xs="12">
          <div class="text-center">
            <div class="text-h5">
              25
            </div>
            <div class="body-1 ma-4">
              {{ $t('index.someStats.resourcesDescription') }}
            </div>
            <v-btn
              class="mt-4"
              elevation="2"
              color="primary darken-1"
              large
              :to="localePath('/resources')"
            >
              <v-icon left dark>
                mdi-dots-horizontal-circle
              </v-icon>
              {{ $t('index.someStats.resourcesButton') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
      <v-sheet class="py-6">
        <v-row>
          <v-col cols="12" md="12">
            <div class="text-center text-h6 text-sm-h5 text-md-h4 text-lg-h3">
              {{ $t('index.ourPartners.title') }}
            </div>
          </v-col>
          <v-col cols="12" md="6" xs="12">
            <v-row align="center">
              <v-col cols="12" md="4" xs="2" class="my-4 mx-0 pa-0">
                <div>
                  <v-img
                    :src="require('@/assets/agv.png')"
                    max-height="100"
                    contain
                  />
                </div>
              </v-col>
              <v-col cols="12" md="8" xs="10" class="my-4 mx-0 pa-0">
                <div class="text-center">
                  <div class="body-1">
                    {{ $t('index.ourPartners.agvDescription') }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="12" xs="12">
                <div class="text-center">
                  <v-btn
                    elevation="2"
                    color="success darken-1"
                    large
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://discord.gg/dg3PkWGyKB"
                  >
                    <v-icon left dark>
                      mdi-discord
                    </v-icon>
                    {{ $t('index.ourPartners.agvButton') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" md="6" xs="12">
            <v-row align="center">
              <v-col cols="12" md="4" xs="2" class="my-4 mx-0 pa-0">
                <div>
                  <v-img
                    :src="require('@/assets/resources-district.png')"
                    max-height="100"
                    contain
                  />
                </div>
              </v-col>
              <v-col cols="12" md="8" xs="10" class="my-4 mx-0 pa-0">
                <div class="text-center">
                  <div class="body-1">
                    {{ $t('index.ourPartners.RDDescription') }}
                  </div>
                </div>
              </v-col>
              <v-col cols="12" md="12" xs="12">
                <div class="text-center">
                  <v-btn
                    elevation="2"
                    color="success darken-1"
                    large
                    target="_blank"
                    rel="noopener noreferrer"
                    href="https://discord.gg/C2HZ5VF3GN"
                  >
                    <v-icon left dark>
                      mdi-discord
                    </v-icon>
                    {{ $t('index.ourPartners.RDButton') }}
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-sheet>
      <v-row class="my-4">
        <v-col cols="8" class="mx-auto">
          <div class="text-h5">
            {{ $t('index.referalCode.question') }}
          </div>
          <div class="text-subtitle-1" v-html="$t('index.referalCode.message')" />
        </v-col>
      </v-row>
      <v-divider class="ma-10" />
      <v-row class="my-4" justify="space-around">
        <v-col cols="12" md="5" xs="12">
          <div>
            <div class="text-h5 primary--text mb-4">
              Why should you buy resources ?
            </div>
            <div class="body-1 ">
              <blockquote class="text-justify font-italic">
                Phase 2 will allow you to mine resources [...]. If you’re sitting on a literal goldmine, yes, that surely will come in handy soon. But some people may be sitting on a metaphorical one without even realising it for years, until suddenly a formerly undiscovered raw material under their soil becomes the most important element for an exciting new technology, demanded by basically everyone.
              </blockquote>
              <p class="text-right">
                - Shane on Discord
              </p>
            </div>
          </div>
        </v-col>

        <v-col cols="12" md="5" xs="12">
          <div>
            <v-img
              :src="require('@/assets/mining.jpg')"
              max-height="300"
              contain
            />
          </div>
        </v-col>
      </v-row>
      <v-divider class="ma-10" />
      <v-row class="my-4" justify="space-around">
        <v-col cols="12" md="5">
          <div>
            <v-img
              :src="require('@/assets/city.jpg')"
              max-height="300"
              contain
            />
          </div>
        </v-col>
        <v-col cols="12" md="5">
          <div>
            <div class="text-h5 primary--text mb-4">
              Why Megacities are important ?
            </div>
            <div class="body-1 text-justify">
              Megacities are where communities bought their tiles together to construct a common project. They often have a long term vision of the game and therefore are good places to invest as their value should keep increasing over and over. It's also a good way to meet and join new people and construct your Earth2 network.
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: 'Landing',
  head () {
    return {
      title: 'Home'
    }
  }
}
</script>

<style scoped>
svg {
  display: block;
}
</style>

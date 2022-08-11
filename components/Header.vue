<template>
  <v-container fluid class="pa-0">
    <v-navigation-drawer
      v-model="sidebar"
      bottom
      app
    >
      <v-list>
        <v-list-item
          :to="localePath('/')"
        >
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>{{ $t('menu.home') }}</v-list-item-title>
        </v-list-item>
        <!--        <v-list-item-->
        <!--          to="/holobuildings"-->
        <!--        >-->
        <!--          <v-list-item-icon>-->
        <!--            <v-icon>mdi-hospital-building</v-icon>-->
        <!--          </v-list-item-icon>-->

        <!--          <v-list-item-title>HoloBuildings</v-list-item-title>-->
        <!--        </v-list-item>-->
        <v-list-group
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
        >
          <template #activator>
            <v-list-item-title>{{ $t(item.title) }}</v-list-item-title>
          </template>
          <v-list-item
            v-for="(subtitle, i) in item.subtitles"
            :key="i"
            :to="localePath(subtitle.path)"
            link
          >
            <v-list-item-title :v-text="$t(subtitle.subtitle)" />

            <v-list-item-icon>
              <v-icon v-text="subtitle.icon" />
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat>
      <v-toolbar-title>
        <router-link :to="localePath('/')" tag="span" style="cursor: pointer">
          Earth2 Biomes
          <div class="text-caption">
            Referral code <strong>wasp</strong> / Discord: Wasp#1975
          </div>
        </router-link>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          text
          :to="localePath('/')"
        >
          <v-icon left dark>
            mdi-home
          </v-icon>
          {{ $t('menu.home') }}
        </v-btn>
        <!--        <v-btn-->
        <!--          text-->
        <!--          to="/holobuildings"-->
        <!--        >-->
        <!--          <v-icon left dark>-->
        <!--            mdi-hospital-building-->
        <!--          </v-icon>-->
        <!--          HoloBuildings-->
        <!--        </v-btn>-->
        <v-menu
          v-for="item in menuItems"
          :key="item.title"
          offset-y
        >
          <template #activator="{ on, attrs }">
            <v-btn
              text
              v-bind="attrs"
              v-on="on"
            >
              <v-icon left dark>
                {{ item.icon }}
              </v-icon>
              {{ $t(item.title) }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(subtitle, index) in item.subtitles"
              :key="index"
              :to="localePath(subtitle.path)"
            >
              <v-list-item-title>
                <v-icon left dark>
                  {{ subtitle.icon }}
                </v-icon>
                {{ $t(subtitle.subtitle) }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <v-menu offset-y>
          <template #activator="{ on: menu }">
            <v-btn
              icon
              v-on="{...menu }"
            >
              <img
                v-if="currentLanguageIcon"
                :src="currentLanguageIcon"
              >
              <v-icon v-else>
                mdi-earth
              </v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="locale in availableLocales"
              :key="locale.code"
              :to="switchLocalePath(locale.code)"
            >
              <v-list-item-avatar
                tile
                size="24"
              >
                <v-img :src="locale.flagSrc" />
              </v-list-item-avatar>
              <v-list-item-title>{{ locale.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-toolbar-items>

      <span class="hidden-sm-and-up">
        <v-app-bar-nav-icon @click="sidebar = !sidebar" />
      </span>
    </v-app-bar>
  </v-container>
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      sidebar: false,
      menuItems: [
        {
          title: 'menu.cities',
          subtitles: [
            { subtitle: 'menu.cityMap', path: '/cities', icon: 'mdi-map' },
            { subtitle: 'menu.leaderboard', path: '/leaderboard', icon: 'mdi-trophy' }
          ],
          icon: 'mdi-city'
        },
        {
          title: 'menu.resources',
          subtitles: [
            { subtitle: 'menu.resourceMap', path: '/resources', icon: 'mdi-map' },
            { subtitle: 'menu.blueDots', path: '/blue-dots', icon: 'mdi-dots-grid' }
          ],
          icon: 'mdi-earth'
        }
      ]
    }
  },
  computed: {
    availableLocales () {
      return this.$i18n.locales.filter(i => i.code !== this.$i18n.locale)
    },
    currentLanguageIcon () {
      return this.$i18n.locales.filter(i => i.code === this.$i18n.locale)[0]
        .flagSrc
    }
  }
}
</script>

<style scoped>

</style>

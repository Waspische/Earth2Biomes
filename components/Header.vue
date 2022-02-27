<template>
  <v-container fluid class="pa-0">
    <v-navigation-drawer
      v-model="sidebar"
      bottom
      app
    >
      <v-list>
        <v-list-item
          to="/"
        >
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>

          <v-list-item-title>Home</v-list-item-title>
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
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </template>
          <v-list-item
            v-for="(subtitle, i) in item.subtitles"
            :key="i"
            :to="subtitle.path"
            link
          >
            <v-list-item-title v-text="subtitle.subtitle" />

            <v-list-item-icon>
              <v-icon v-text="subtitle.icon" />
            </v-list-item-icon>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          Earth2 Biomes
          <div class="text-caption">
            Referral code <strong>wasp</strong> / Wasp#1975
          </div>
        </router-link>
      </v-toolbar-title>
      <v-spacer />
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          text
          to="/"
        >
          <v-icon left dark>
            mdi-home
          </v-icon>
          Home
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
              {{ item.title }}
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              v-for="(subtitle, index) in item.subtitles"
              :key="index"
              :to="subtitle.path"
            >
              <v-list-item-title>
                <v-icon left dark>
                  {{ subtitle.icon }}
                </v-icon>
                {{ subtitle.subtitle }}
              </v-list-item-title>
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
          title: 'Cities',
          subtitles: [
            { subtitle: 'Map', path: '/cities', icon: 'mdi-map' },
            { subtitle: 'Leaderboard', path: '/leaderboard', icon: 'mdi-trophy' }
          ],
          icon: 'mdi-city'
        },
        {
          title: 'Resources',
          subtitles: [
            { subtitle: 'Map', path: '/resources', icon: 'mdi-map' },
            { subtitle: 'Blue Dots', path: '/blue-dots', icon: 'mdi-dots-grid' }
          ],
          icon: 'mdi-earth'
        }
      ]
    }
  }
}
</script>

<style scoped>

</style>

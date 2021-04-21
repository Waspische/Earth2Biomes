<template>
  <v-container fluid class="pa-0">
    <v-navigation-drawer
      v-model="sidebar"
      bottom
      app
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ item.title }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar app flat>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">
          Earth2 Biomes
          <div class="text-caption">
            Referral code <strong>HABN6K6K3X</strong>
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
        <v-menu
          v-for="item in menuItems"
          :key="item.title"
          offset-y
        >
          <template v-slot:activator="{ on, attrs }">
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
            { subtitle: 'Map', path: '/cities', icon: 'mdi-map' }
            // { subtitle: 'Leaderboard', path: '/cities/leaderboard', icon: 'mdi-trophy' }
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

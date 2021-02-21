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

    <v-app-bar app>
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
          v-for="item in menuItems"
          :key="item.title"
          text
          :to="item.path"
        >
          <v-icon left dark>
            {{ item.icon }}
          </v-icon>
          {{ item.title }}
        </v-btn>
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
        { title: 'Resources', path: '/', icon: 'mdi-earth' },
        { title: 'Cities', path: '/cities', icon: 'mdi-city' }
      ]
    }
  }
}
</script>

<style scoped>

</style>

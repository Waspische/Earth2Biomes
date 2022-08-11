<template>
  <v-footer
    v-if="!$vuetify.breakpoint.xsOnly"
    padless
    absolute
    app
  >
    <v-row
      justify="center"
      no-gutters
    >
      <v-col
        class="primary darken-1 pt-4 text-center white--text"
        cols="12"
        v-html="$t('footer.supportMessage')"
      />
      <v-col
        class="primary darken-1 pb-4 text-center white--text"
        cols="12"
        v-html="$t('footer.contactMessage')"
      />
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer',
  methods: {
    trackFooterClick (link) {
      this.$gtag.event('click', {
        event_category: 'footer',
        event_label: 'link'
      })
    }
  }
}
</script>

<style scoped>
.v-application a {
  color: #ffe18d;
  text-decoration: none; /* no underline */
}

</style>

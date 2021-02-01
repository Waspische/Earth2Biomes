<template>
  <v-snackbar
    v-model="show"
    :timeout="timeout"
  >
    {{ message }}
    <v-btn
      target="_blank"
      rel="noopener noreferrer"
      href="https://app.earth2.io/#thegrid/"
      color="primary"
      text
    >
      <v-icon dark>
        mdi-open-in-new
      </v-icon> Earth2 map
    </v-btn>
    <v-btn
      text
      color="secondary"
      @click.native="show = false"
    >
      Close
    </v-btn>
  </v-snackbar>
</template>

<script>
export default {
  name: 'Snackbar',
  data () {
    return {
      show: false,
      message: '',
      timeout: 4000
    }
  },
  created () {
    this.$store.watch(state => state.snackbar.snack, () => {
      const msg = this.$store.state.snackbar.snack
      if (msg !== '') {
        this.show = true
        this.message = this.$store.state.snackbar.snack
        this.$store.commit('snackbar/setSnack', '')
      }
    })
  }
}
</script>

<style scoped>

</style>

<template>
  <v-footer
    color="primary lighten-1"
    height=""
    padless
    absolute
    app
  >
    <v-row
      justify="center"
      no-gutters
    >
      <v-col
        class="primary darken-1 py-4 text-center white--text"
        cols="12"
      >
        The data comes from openstreetmap.org. If you like this project, support me using the code <strong>19DBDIXSCW</strong> or <a target="_blank" rel="noopener noreferrer" href="https://ko-fi.com/earth2biomes">buy me a coffee ☕️</a>
        <br>
        To submit an idea, you can
        <a href="https://forms.gle/8Ak6HTaVh5hFyf4Q9" target="_blank" rel="noopener noreferrer">
          click here
        </a>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script>
export default {
  name: 'Footer'
}
</script>

<style scoped>
.v-application a {
  color: #ffe18d;
  text-decoration: none; /* no underline */
}

</style>

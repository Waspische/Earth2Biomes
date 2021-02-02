<template>
  <div class="popup-wrapper">
    <v-card
      class="grey darken-1 rounded-lg mx-2"
      max-width="225px"
      outlined
    >
      <v-card-title
        class="pa-2"
      >
        {{ popupName }}
      </v-card-title>
      <v-card-text
        v-if="type === 'quarry'"
        class="pa-0"
      >
        <v-btn
          v-clipboard:copy="geoposition"
          v-clipboard:success="snackTime"
          v-clipboard:error="onCopyError"
          icon
        >
          <v-icon dark>
            mdi-content-copy
          </v-icon>
        </v-btn>
        {{ geoposition }}
      </v-card-text>
      <v-card-text
        v-if="type === 'urban'"
        class="pa-0 justify-center"
      >
        Click to open in Earth2
      </v-card-text>
      <v-card-actions
        v-if="type === 'quarry'"
        class="justify-center"
      >
        <v-btn
          target="_blank"
          rel="noopener noreferrer"
          :href="'https://www.openstreetmap.org/search?query=' + lat + '%2C' + lng "
          small
          color="primary darken-1"
        >
          <v-icon dark>
            mdi-open-in-new
          </v-icon> OpenStreetMap
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>
<script>
import { mapMutations } from 'vuex'

export default {
  name: 'MapPopup',
  props: ['popupName', 'lat', 'lng', 'type'],
  data () {
    return {
      snackbar: false,
      text: 'Position copied in clipboard'
    }
  },
  computed: {
    geoposition () {
      if (this.type === 'quarry') {
        return this.lat.toString().substring(0, 10) + ', ' + this.lng.toString().substring(0, 10)
      }
      return null
    }
  },
  methods: {
    onCopy (e) {
      console.log(e)
    },
    onCopyError (e) {
      console.log(e)
    },
    snackTime (snack) {
      this.setSnack(this.text)
    },
    ...mapMutations({
      setSnack: 'snackbar/setSnack'
    })
  }

}
</script>

<style>

.popup-wrapper {

}

/* Marker tweaks */
/* change background and tip color to green */
/* Marker tweaks */
.mapboxgl-popup-close-button {
  display: none;
}

.mapboxgl-popup-content {
  font: 400 15px/22px 'Source Sans Pro', 'Helvetica Neue', Sans-serif;
  background-color: #757575;
  padding: 0;
  border-radius: 8px;
}
.mapboxgl-popup-tip {
  border: 15px solid transparent;
}
.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
  border-top-color: #757575;
}
.mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
  border-right-color: #757575;
}
.mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
  border-left-color: #757575;
}
.mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
  border-bottom-color: #757575;
}
.mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip {
  border-top-color: #757575;
}
.mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
  border-top-color: #757575;
}
.mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
  border-bottom-color: #757575;
}
.mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
  border-bottom-color: #757575;
}

</style>

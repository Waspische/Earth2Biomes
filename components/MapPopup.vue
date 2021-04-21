<template>
  <div class="popup-wrapper">
    <v-card
      class="rounded-lg mx-2 transparent-card"
      max-width="250px"
      flat
    >
      <v-card-title
        class="pa-0 text-center"
      >
        {{ popupName }}
      </v-card-title>
      <v-card-text
        v-if="type === 'quarry' || type === 'well'"
        class="pa-0 text-center"
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
        class="pb-1 text-center"
      >
        Click for details
      </v-card-text>
      <v-card-actions
        v-if="type === 'quarry' || type === 'well'"
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
      text: 'Position copied in clipboard. It can be unprecised, so look around ;)'
    }
  },
  computed: {
    geoposition () {
      if (this.type === 'quarry' || this.type === 'well') {
        return this.lat.toString().substring(0, 8) + ', ' + this.lng.toString().substring(0, 8)
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
      console.log('snacktime')
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
  background-color: rgba(117,117,117,0.7);
  padding: 0;
  border-radius: 8px;
}
.mapboxgl-popup-tip {
  border: 15px solid transparent;
}
.mapboxgl-popup-anchor-bottom .mapboxgl-popup-tip {
  border-top-color: rgba(117,117,117,0.7);
}
.mapboxgl-popup-anchor-left .mapboxgl-popup-tip {
  border-right-color: rgba(117,117,117,0.7);
}
.mapboxgl-popup-anchor-right .mapboxgl-popup-tip {
  border-left-color: rgba(117,117,117,0.7);
}
.mapboxgl-popup-anchor-top .mapboxgl-popup-tip {
  border-bottom-color: rgba(117,117,117,0.7);
}
.mapboxgl-popup-anchor-bottom-left .mapboxgl-popup-tip {
  border-top-color: rgba(117,117,117,0.7);
}
.mapboxgl-popup-anchor-bottom-right .mapboxgl-popup-tip {
  border-top-color: rgba(117,117,117,0.7);
}
.mapboxgl-popup-anchor-top-right .mapboxgl-popup-tip {
  border-bottom-color: rgba(117,117,117,0.7);
}
.mapboxgl-popup-anchor-top-left .mapboxgl-popup-tip {
  border-bottom-color:rgba(117,117,117,0.7);
}
.transparent-card {
  background-color: rgba(117,117,117,0) !important;
}

</style>

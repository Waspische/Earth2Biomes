import Vue from 'vue'
import VueGtag from 'vue-gtag'

export default ({ app }) => {
  Vue.use(VueGtag, {
    config: { id: 'G-6FF2JVXEK3' },
    appName: 'Earth2Biomes',
    pageTrackerScreenviewEnabled: true
  }, app.router)
}

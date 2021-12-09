<template>
  <v-container fluid>
    <v-snackbar
      v-model="show"
      :timeout="timeout"
      color="info"
    >
      <v-row>
        <v-col cols="12" sm="10">
          {{ message }}
        </v-col>
        <v-col cols="12" sm="2">
          <v-btn
            target="_blank"
            rel="noopener noreferrer"
            href="https://discord.gg/ZvU5Qvqrz6"
            color="secondary"
            text
          >
            <v-icon dark>
              mdi-open-in-new
            </v-icon> Discord
          </v-btn>
        </v-col>
      </v-row>
    </v-snackbar>
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <template v-slot:activator="{ on: on, attrs }">
        <v-btn
          id="cities-dialog-btn"
          color="primary darken-1"
          v-bind="attrs"
          v-on="on"
          class="ml-4 mt-4 v-btn--example"
          elevation="2"
          large
          rounded
          absolute
          bottom
        >
          Check analysis results
        </v-btn>
<!--        <v-btn-->
<!--          id="cities-dialog-btn"-->
<!--          color="primary darken-1"-->
<!--          v-bind="attrs"-->
<!--          v-on="on"-->
<!--          class="ml-4 mt-4 v-btn&#45;&#45;example"-->
<!--          elevation="2"-->
<!--          large-->
<!--          rounded-->
<!--          absolute-->
<!--          bottom-->
<!--        >-->
<!--          Share your jewels location-->
<!--        </v-btn>-->
      </template>
        <v-card>
          <v-card-title>
            <span class="headline">Check analysis results</span>
<!--            <span class="headline">Share your jewels location</span>-->
          </v-card-title>

          <v-card-text>
            <v-row dense>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                The goal is to discover if there are some factors in the location of jewels spawn. Thanks for participating to the experience.
              </v-col>
<!--              <v-col-->
<!--                cols="12"-->
<!--                sm="12"-->
<!--                md="12"-->
<!--              >-->
<!--                Click-->
<!--                <a-->
<!--                  target="_blank"-->
<!--                  rel="noopener noreferrer"-->
<!--                  href="https://app.earth2.io/api/v2/my/jewels/?color=&expires__isnull=true&limit=100&offset=0">-->
<!--                this link-->
<!--              </a> and copy paste the result in discord to Wasp#1975. Their is no personal data here, just jewels locations.<b>It might be a too long message on mobile</b>-->
<!--              </v-col>-->
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                Results are available
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href="https://docs.google.com/spreadsheets/d/1_6E-gurgFdfW-Cd7sJ6F6AdYqis2LNyFe2xVK8rMNhY/edit#gid=43920489">
                   here
                </a>
              </v-col>
              <v-col
                cols="12"
                sm="12"
                md="12"
              >
                <p>Thanks to :</p>
                <span
                  v-for="name in names"
                  :key="name">
                      {{name}},
                </span>
              </v-col>
<!--                  <v-col-->
<!--                    cols="12"-->
<!--                    sm="12"-->
<!--                    md="12"-->
<!--                  >-->
<!--                    <v-text-field-->
<!--                      v-model="editedJewelLocation.profileId"-->
<!--                      label="Profile Id"-->
<!--                    />-->
<!--                  </v-col>-->
<!--                  <v-col-->
<!--                    cols="12"-->
<!--                    sm="12"-->
<!--                    md="12"-->
<!--                  >-->
<!--                    <v-textarea-->
<!--                      v-model="editedJewelLocation.jewels"-->
<!--                      label="Description"-->
<!--                    />-->
<!--                  </v-col>-->
            </v-row>
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn
              color="blue darken-1"
              text
              @click="close"
            >
              Close
            </v-btn>
<!--                <v-btn-->
<!--                  color="primary"-->
<!--                  text-->
<!--                  @click="save"-->
<!--                >-->
<!--                  Save-->
<!--                </v-btn>-->
          </v-card-actions>
        </v-card>
    </v-dialog>
<!--    <v-navigation-drawer-->
<!--      id="features"-->
<!--      v-model="drawer"-->
<!--      :mini-variant.sync="mini"-->
<!--      permanent-->
<!--      width="400"-->
<!--      class="rounded ml-4 mt-4"-->
<!--    >-->
<!--      <v-list-item class="px-2">-->
<!--        <v-list-item-avatar>-->
<!--          <v-btn-->
<!--            icon-->
<!--            @click.stop="mini = !mini"-->
<!--          >-->
<!--            <v-icon>mdi-menu</v-icon>-->
<!--          </v-btn>-->
<!--        </v-list-item-avatar>-->
<!--        <v-list-item-title>Mines</v-list-item-title>-->
<!--        <v-btn-->
<!--          icon-->
<!--          @click.stop="mini = !mini"-->
<!--        >-->
<!--          <v-icon>mdi-chevron-left</v-icon>-->
<!--        </v-btn>-->
<!--      </v-list-item>-->
<!--      <v-divider />-->
<!--      <v-list dense>-->
<!--        <v-list-item-->
<!--          v-for="name in names"-->
<!--          :key="name">-->
<!--          {{name}}-->
<!--        </v-list-item>-->
<!--      </v-list>-->
<!--    </v-navigation-drawer>-->
    <v-row
      id="map-wrapper"
      fluid
      no-gutters
    >
      <v-col
        id="map"
        cols="12"
      />
    </v-row>
  </v-container>
</template>

<script>

import mapboxgl from 'mapbox-gl'
import Vue from 'vue'
import MapPopup from '~/components/MapPopup'

export default {
  name: 'MapboxMap',
  components: {
  },
  data () {
    return {
      drawer: true,
      mini: false,
      show: false,
      message: '',
      timeout: 5000,
      editedJewelLocation: {
        profileId: '',
        jewels: '',
      },
      jewels: [],
      names: [],
      accessToken: 'pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw', // your access token. Needed if you using Mapbox maps
      mapStyle: 'mapbox://styles/mapbox/dark-v10',
      dialog: false,
      jewelsLocation: {
        id: 'jewelsLocation',
        source: 'urban',
        type: 'symbol',
        layout: {
          'icon-image': [
            'coalesce',
            ['image', ['get', 'jewel']],
            ['image', 'rocket-15']
          ],
          // 'icon-image': 'black',
          'icon-size': 0.50,
          'icon-allow-overlap': true,
          'text-font': [
            'Open Sans Bold',
            'Arial Unicode MS Bold'
          ]
        },
        paint: {
          'text-color': '#202',
          'text-halo-color': '#fff',
          'text-halo-width': 2
        }
      },
      jewelsTypes: [
        {
          name: 'black',
          file: 'BlackCrystal.png'
        },
        {
          name: 'blue',
          file: 'BlueCrystal.png'
        },
        {
          name: 'grey',
          file: 'GreyCrystal.png'
        },
        {
          name: 'brown',
          file: 'BrownCrystal.png'
        },
        {
          name: 'ochre',
          file: 'OchreCrystal.png'
        },
        {
          name: 'sandy',
          file: 'SandyCrystal.png'
        },
        {
          name: 'yellow',
          file: 'YellowCrystal.png'
        }
      ]
    }
  },
  watch: {
    dialog (val) {
      val || this.close()
    }
  },
  async mounted () {
    mapboxgl.accessToken = this.accessToken

    // create a new mapbox instance
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.mapStyle,
      zoom: 1, // starting zoom
      sprite: 'mapbox://sprites/mapbox/bright-v8'
    })
    this.map.addControl(new mapboxgl.NavigationControl(), 'top-right')
    this.map.on('load', this.onMapLoad)

    const data = await fetch(
      './data/jewels.json'
    ).then(res => res.json())
    this.names = data.results.filter(jewel => {
      return !!jewel.name
    }).map(jewel => jewel.name)
  },
  methods: {
    loadImages (){
      const vm = this

      return this.jewelsTypes.map( icon => {
      // return a promise per icon
      return new Promise(function(resolve,reject){
        // load the image
        vm.map.loadImage(require('../../assets/' + icon.file), function(error,data){
          // if error reject the promise
          if (error){
            console.log(`Error with ${icon.name}`);
            console.error(error);
            reject(error);
          } else {
            // return the data in the icon
            resolve([icon, data]);
          }
        });
      });
    });

    },
    onMapLoad (event) {
      const vm = this

      Promise
        .all(this.loadImages())
        .then(icons => {
          // Add the icons to the map
          icons.forEach( icon_data => {
            var icon = icon_data[0];
            var data = icon_data[1];
            vm.map.addImage(icon.name, data);
          })
          // Check if images are ready
          console.log(icons.map(icon => vm.map.hasImage(icon[0].name)))

          vm.map.addSource('urban', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: []
            }
          })

          vm.map.addLayer(vm.jewelsLocation)
          // vm.map.on('click', 'jewelsLocation', vm.onCityClick)
          // vm.map.on('mouseenter', 'jewelsLocation', vm.onMouseEnterCity)
          // vm.map.on('mouseleave', 'jewelsLocation', vm.onMouseOutCity)

          // initialize data
          vm.jewels = vm.getJewels()
        });

    },
    async getJewels () {
      // const data = await this.$axios.$get('/cities?size=1000') // todo update back
      // const data = JSON.parse("{\"count\":14,\"unclaimed\":0,\"offset\":0,\"next\":null,\"previous\":null,\"results\":[{\"id\":\"db877e8a-64e2-4f38-a0cb-4fb2d0d21305\",\"landfield\":{\"id\":\"329a668f-4e42-484f-a805-6f7119b298b1\",\"location\":\"Līvbērze, Jelgava, Latvia\",\"description\":\"E-Seoul [16] Sector F\",\"center\":\"23.648501 56.73253\"},\"created\":\"2021-07-03T02:23:36.463515Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"78911fc4-0372-49b3-8c1d-84ce7df3f897\",\"landfield\":{\"id\":\"2fc852fa-deb1-423c-8f0f-a9be55f47027\",\"location\":\"Falkland Islands\",\"description\":\"Sea Lions Colony - Falkland Islands\",\"center\":\"-59.132881 -52.43367\"},\"created\":\"2021-07-03T02:24:55.430169Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"02f0f477-dbba-4548-bc44-6bb6f0f6e21c\",\"landfield\":{\"id\":\"b3ab4c39-207f-474b-ba0b-2e4d9e180b5f\",\"location\":\"Falkland Islands\",\"description\":\"Falkland Islands\",\"center\":\"-59.134169 -52.434036\"},\"created\":\"2021-07-03T02:24:53.560360Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"77851799-c425-439a-a6e2-8cd2c7c18d96\",\"landfield\":{\"id\":\"43fd10e4-9877-43ea-95df-bee7e9a6c6d6\",\"location\":\"Ras al-Khaimah, United Arab Emirates\",\"description\":\"Ras al-Khaimah\",\"center\":\"55.869341 25.638896\"},\"created\":\"2021-07-03T02:24:43.577788Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"9c3cdc7d-3dc7-4e5d-b99f-692e68e2e720\",\"landfield\":{\"id\":\"43fd10e4-9877-43ea-95df-bee7e9a6c6d6\",\"location\":\"Ras al-Khaimah, United Arab Emirates\",\"description\":\"Ras al-Khaimah\",\"center\":\"55.869341 25.638896\"},\"created\":\"2021-07-03T02:24:43.577682Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"8ccb537b-db50-4aed-8f35-83e5ef11abd8\",\"landfield\":{\"id\":\"ccf590a4-adc4-4c29-870d-e13641e6a379\",\"location\":\"Falkland Islands\",\"description\":\"AGV Sea Lion Arena - Stage 2\",\"center\":\"-59.308748 -52.336441\"},\"created\":\"2021-07-03T02:23:30.550694Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"171c340f-eaae-48f0-939c-2cc6e2e843f1\",\"landfield\":{\"id\":\"bac2c5b8-653a-4d5c-8f6b-40648b51edd5\",\"location\":\"Falkland Islands\",\"description\":\"Falkland Islands 6333a518-9102-4cd5-9e1e-131aebede9aa\",\"center\":\"-59.132624 -52.433095\"},\"created\":\"2021-07-03T02:23:50.149870Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"5996666d-033a-41c4-9c22-cba4b995f261\",\"landfield\":{\"id\":\"5834b085-0c68-4e17-bd29-3fbd914d55e1\",\"location\":\"Ra'S Al Khaymah, Ras al-Khaimah, United Arab Emirates\",\"description\":\"🥈 Class 2 RAK Megacity - OIL RESOURCE - Ra'S Al Khaymah\",\"center\":\"55.909252 25.745709\"},\"created\":\"2021-07-03T02:24:31.021864Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"1f71e0a0-bb03-46ba-a925-587cbe7e6f45\",\"landfield\":{\"id\":\"5868aa40-feeb-4d73-99ba-9af3f2ebb9e2\",\"location\":\"Mamoudzou, Mayotte\",\"description\":\"Mamoudzou\",\"center\":\"45.231829 -12.76518\"},\"created\":\"2021-07-03T02:23:49.349360Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"453c7c7d-fd0e-4d7e-92c4-d22085b774ef\",\"landfield\":{\"id\":\"171bee58-3dc3-43e0-be48-43cbfbf3e30b\",\"location\":\"Mayotte\",\"description\":\"Mayotte\",\"center\":\"45.240155 -12.75639\"},\"created\":\"2021-07-03T02:23:48.943910Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"263726f1-f4c9-48d5-823e-a1a8c45e68cb\",\"landfield\":{\"id\":\"90c0e858-944a-4b8f-a7d2-c8c577f49de4\",\"location\":\"Panamá, Panamá, Panama\",\"description\":\"Panamá\",\"center\":\"-79.656887 9.055989\"},\"created\":\"2021-07-03T02:28:48.669813Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"5b2cc25f-ae0e-417d-9657-e3ec98c7508e\",\"landfield\":{\"id\":\"b2d57035-bc85-4e64-bf74-cfe9cbcecd5f\",\"location\":\"Fort-de-France, Martinique\",\"description\":\"Fort-de-France\",\"center\":\"-61.077804 14.606841\"},\"created\":\"2021-07-03T02:23:49.469068Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"beb52fee-e9c6-4327-a45a-72c80f3139df\",\"landfield\":{\"id\":\"47cab7c2-df50-432c-9c1e-25b1c268709e\",\"location\":\"Erongo, Namibia\",\"description\":\"Uranium mine - Erongo\",\"center\":\"14.884157 -21.21522\"},\"created\":\"2021-07-03T02:26:42.232279Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"77a6f91c-8e97-448c-b332-81e751550d9d\",\"landfield\":{\"id\":\"e7c63bed-c486-4fde-9088-16a27c597a4c\",\"location\":\"Mamoudzou, Mayotte\",\"description\":\"Mamoudzou\",\"center\":\"45.23303 -12.762249\"},\"created\":\"2021-07-03T02:23:49.369416Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"f722adad-66ea-4c55-b642-f923eab3ade7\",\"landfield\":{\"id\":\"4cf8b715-a64b-43a9-92f2-4a932252df60\",\"location\":\"Al Jazirah Al Hamra', Ras al-Khaimah, United Arab Emirates\",\"description\":\"[c1] RAK Megalopolis: 💣💯TOP Beach & Golf Resort 6 STAR - big business place\",\"center\":\"55.775785 25.690033\"},\"created\":\"2021-07-03T02:24:41.111749Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"eb9bbc9c-45ed-4e3c-a694-70917a9075e6\",\"landfield\":{\"id\":\"9e8be29c-f190-4ca4-b1f6-c9f1367c844a\",\"location\":\"Shatian Qu, Sha Tin District, Hong Kong\",\"description\":\"[c2] Chinese University of Hong Kong\",\"center\":\"114.206485 22.419121\"},\"created\":\"2021-07-03T02:33:33.739668Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"5ef60e41-598b-4924-b184-42a326c49ef8\",\"landfield\":{\"id\":\"abe93470-0202-4a38-be89-8f6d33b2b8dd\",\"location\":\"Al Jazirah Al Hamra', Ras al-Khaimah, United Arab Emirates\",\"description\":\"[c1] RAK Megalopolis\",\"center\":\"55.7757 25.686784\"},\"created\":\"2021-07-03T02:24:38.395291Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"bcd0fa22-ab50-48ff-8357-0c6e0be3b42d\",\"landfield\":{\"id\":\"138c3f1f-71b7-4042-b322-5304ddfcebd6\",\"location\":\"Stadium Area, Maseru, Maseru, Lesotho\",\"description\":\"[c2] Near Leaderboard Plot\",\"center\":\"27.493029 -29.306385\"},\"created\":\"2021-07-03T02:26:52.971990Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"e0961629-c289-4104-b74a-832afed0c3e1\",\"landfield\":{\"id\":\"0be129b8-db1f-4b61-bc9c-44ac265e6cb2\",\"location\":\"Σωτήρα Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.831783 34.676629\"},\"created\":\"2021-07-03T02:27:27.224892Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"f339e9a2-626a-41a0-a1be-4873130019d6\",\"landfield\":{\"id\":\"679f7ec0-4f81-484c-8913-186d585fc5a0\",\"location\":\"Managua, Nicaragua\",\"description\":\"[c2] AK2 - Eye of Ra\",\"center\":\"-86.332369 12.237688\"},\"created\":\"2021-07-03T02:26:35.695306Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"1da8ba0e-a161-4bd5-add0-72debb251f61\",\"landfield\":{\"id\":\"208e372f-6a51-4ed3-a0bc-409df6815e57\",\"location\":\"Σωτήρα Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.831097 34.671335\"},\"created\":\"2021-07-03T02:27:13.459116Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"2c272ab3-dbd0-4c20-9d32-801c92e41d3b\",\"landfield\":{\"id\":\"eaf4bb42-2406-47ae-94ae-6634f2e8fb44\",\"location\":\"Σωτήρα Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c2] (Sale Plot) 🍑 Megastructure\",\"center\":\"32.841311 34.686864\"},\"created\":\"2021-07-03T02:27:00.357440Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"385f4c99-3d39-4005-bce2-177bbd013bb0\",\"landfield\":{\"id\":\"0bddd6c4-f347-4cd1-9d3b-6298e937d7bf\",\"location\":\"Thirassia, South Aegean, Greece\",\"description\":\"[c1] Greece Properties, Greece\",\"center\":\"25.341683 36.456497\"},\"created\":\"2021-07-03T02:33:25.639056Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"8ea3df99-9dfa-4be2-b25c-876a14a4327a\",\"landfield\":{\"id\":\"77d4b99b-0e70-499a-a095-cf5e0d52d0ab\",\"location\":\"Nyanga, Gabon\",\"description\":\"[c2] 4 The Green 🍑\",\"center\":\"11.186228 -3.761657\"},\"created\":\"2021-07-03T02:24:55.715933Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"ac56e73f-1243-4dcd-956b-ee893b22f839\",\"landfield\":{\"id\":\"5bc69396-969f-4d10-99ac-621ac209c19b\",\"location\":\"Xigong Qu, Sai Kung District, Hong Kong\",\"description\":\"[c2] Hong Kong University of Science and Technology\",\"center\":\"114.265794 22.332849\"},\"created\":\"2021-07-03T02:33:33.893718Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"dbf93c65-445f-4225-8d64-789e90d851c9\",\"landfield\":{\"id\":\"d31a00f2-ba64-4165-9c8c-d63430ca0679\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.495463 25.401027\"},\"created\":\"2021-07-03T02:24:26.416188Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"6a2de083-e808-4371-839d-d924cfed0cd4\",\"landfield\":{\"id\":\"7277d214-e506-4fb5-81da-b9922f75b388\",\"location\":\"Bahan, Yangon, Yangon, Myanmar\",\"description\":\"[c1] 💎 Yangon 💎\",\"center\":\"96.163759 16.794846\"},\"created\":\"2021-07-03T02:32:12.341866Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"0bfb81cb-6668-42f3-bd24-29069819988e\",\"landfield\":{\"id\":\"2c57c16f-565d-4397-abdb-9bdcb8e136dd\",\"location\":\"Erongo, Namibia\",\"description\":\"[c1] Namibia Potential Mine\",\"center\":\"15.030069 -22.452918\"},\"created\":\"2021-07-03T02:32:18.282441Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"81b8db05-098d-4395-84a4-d9bf12a5b737\",\"landfield\":{\"id\":\"b0af340e-bfdd-44e0-900e-6c0421f534cf\",\"location\":\"Zermatt, Valais, Switzerland\",\"description\":\"[c1] Zermatt Woods, Switzerland\",\"center\":\"7.756691 46.019853\"},\"created\":\"2021-07-03T02:33:25.575986Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"878987f7-7377-468e-8d62-11242fd9a79b\",\"landfield\":{\"id\":\"1a37d461-f94b-4c76-a4a2-c51a1cbe0c8e\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.48851 25.40281\"},\"created\":\"2021-07-03T02:24:29.437218Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"0b54f232-b0cb-4ee4-ae50-c7336280d687\",\"landfield\":{\"id\":\"347349a1-0516-42d0-80b9-d23044360c7f\",\"location\":\"Hàng Trống, Quận Hoàn Kiếm, Hanoi, Vietnam\",\"description\":\"[c1] Hanoi Property, Hanoi\",\"center\":\"105.855332 21.02827\"},\"created\":\"2021-07-03T02:33:25.602513Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"3b67618c-7f06-4f2f-9030-d3221fdea5d5\",\"landfield\":{\"id\":\"3a6d2611-f646-4bde-b7d2-d4466369cd9e\",\"location\":\"Fort-de-France, Martinique\",\"description\":\"[c1] Fort-de-France\",\"center\":\"-61.081409 14.606758\"},\"created\":\"2021-07-03T02:23:49.072098Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"faf2bfa8-8075-4965-94f7-c23a37c2e0d6\",\"landfield\":{\"id\":\"63c19956-8996-44a5-98df-3e2c4113fa2f\",\"location\":\"Ia, South Aegean, Greece\",\"description\":\"[c1] Greece Properties, Greece\",\"center\":\"25.380564 36.461399\"},\"created\":\"2021-07-03T02:33:25.643733Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"73e69a8c-eec0-4e1c-8c43-53def39497a3\",\"landfield\":{\"id\":\"cbc69a0b-5187-4917-a6bd-e05b95d92549\",\"location\":\"Karachi, Sindh, Pakistan\",\"description\":\"[c1] Karachi\",\"center\":\"67.085352 24.853497\"},\"created\":\"2021-07-03T02:31:56.403716Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"09b08693-96d8-4026-8a49-2ff3b3ecd8a9\",\"landfield\":{\"id\":\"3c23c19b-7295-4029-8c6c-7a2eb6f0eab6\",\"location\":\"安康, 信義區, Taipei, Taiwan\",\"description\":\"[c1] Taipei Properties, Taiwan\",\"center\":\"121.571359 25.03475\"},\"created\":\"2021-07-03T02:33:25.625253Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"22cb6ce3-09b5-46e2-80e1-6f37dd25fdcb\",\"landfield\":{\"id\":\"3b754f81-79f8-41a2-a99c-a3233f4248f7\",\"location\":\"景新, 信義區, Taipei, Taiwan\",\"description\":\"[c1] Taipei Properties, Taiwan\",\"center\":\"121.565266 25.031094\"},\"created\":\"2021-07-03T02:33:25.629952Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"d137f44c-9ce5-41a1-9c39-89e61a10f45a\",\"landfield\":{\"id\":\"6e17f48f-edb2-46ff-baed-f6572022a42b\",\"location\":\"دسمان, Kuwait City, Kuwait\",\"description\":\"[c1] Kuwait\",\"center\":\"48.00004 29.381128\"},\"created\":\"2021-07-03T02:31:34.843698Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"a2da56c7-5be9-4398-9d13-dd4db73a5350\",\"landfield\":{\"id\":\"d3567d49-b2b4-424e-af9d-d7b2f1cbe951\",\"location\":\"Σωτήρα Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.838221 34.681146\"},\"created\":\"2021-07-03T02:27:27.185101Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"7ac17aa2-4011-40b2-be3a-38f8084446b4\",\"landfield\":{\"id\":\"19527c53-fcf9-4b8f-97f1-64b8888ef62a\",\"location\":\"Vaduz, Vaduz, Liechtenstein\",\"description\":\"[c1] Vaduz Castle, Liechtenstein\",\"center\":\"9.525232 47.138768\"},\"created\":\"2021-07-03T02:33:28.683975Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"aff1ee4f-452c-4266-a366-3263468c3544\",\"landfield\":{\"id\":\"6e17f48f-edb2-46ff-baed-f6572022a42b\",\"location\":\"دسمان, Kuwait City, Kuwait\",\"description\":\"[c1] Kuwait\",\"center\":\"48.00004 29.381128\"},\"created\":\"2021-07-03T02:31:34.843815Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"48344c93-cef8-48cf-b281-ff44713b9294\",\"landfield\":{\"id\":\"42df06b2-6221-4333-8d35-3f1c6f7d001a\",\"location\":\"Επισκοπή Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.837792 34.688486\"},\"created\":\"2021-07-03T02:27:13.576973Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"c87212d1-74a7-4c7c-9eb4-700f7c4d08cf\",\"landfield\":{\"id\":\"5a55486a-ac95-4115-bd7f-fa556b90b2fe\",\"location\":\"Σωτήρα Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.844744 34.674371\"},\"created\":\"2021-07-03T02:27:14.633636Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"9292caa6-7315-4910-9214-cd015f7c4ca6\",\"landfield\":{\"id\":\"61866bd9-5335-4e29-8449-3298c5dd7c42\",\"location\":\"Sai Kung District, Hong Kong\",\"description\":\"[c2] Hong Kong University of Science and Technology\",\"center\":\"114.265794 22.336818\"},\"created\":\"2021-07-03T02:33:33.905126Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"a23ec94a-da05-4d9f-b8d4-097c96537883\",\"landfield\":{\"id\":\"5ac586ae-748d-4d01-9e5c-6eac55b476ba\",\"location\":\"Mueang Phuket, Phuket, Thailand\",\"description\":\"[c1] Beachfront Property (Island), Phuket, Thailand\",\"center\":\"98.369694 7.608403\"},\"created\":\"2021-07-03T02:33:25.606832Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"568cb86e-7674-4c7e-9ffc-4d06c191568b\",\"landfield\":{\"id\":\"2b3fd2a7-1241-4216-9337-bad148c500df\",\"location\":\"Yaren, Boe, Nauru\",\"description\":\"[c1] Nauru International Airport, Nauru {DO NOT SELL!}\",\"center\":\"166.913309 -0.543729\"},\"created\":\"2021-07-03T02:33:25.620686Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"3b5a8cd6-570f-401a-b851-ad386ed4f0c8\",\"landfield\":{\"id\":\"2ee037bc-64f7-4211-b740-bfb6b3cbc5f5\",\"location\":\"Imerovigli, South Aegean, Greece\",\"description\":\"[c1] Greece Properties, Greece\",\"center\":\"25.427428 36.443449\"},\"created\":\"2021-07-03T02:33:25.653215Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"230e445e-bfd1-4dfb-8170-9d7871cc2bc7\",\"landfield\":{\"id\":\"bd3738c9-5988-4f9b-a44c-9dd91ed2baa3\",\"location\":\"Nan Qu, Southern District, Hong Kong\",\"description\":\"[c2] Ocean Park, Hong Kong\",\"center\":\"114.176359 22.246125\"},\"created\":\"2021-07-03T02:33:33.744863Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"0b9bd7b0-1e79-4fa4-8080-f8e79f8307b7\",\"landfield\":{\"id\":\"c40ea1a8-af31-40b0-a864-fcb07b17198c\",\"location\":\"Lidao Qu, Islands District, Hong Kong\",\"description\":\"[c2] HKG\",\"center\":\"113.925133 22.312284\"},\"created\":\"2021-07-03T02:33:33.749887Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"66bde551-817a-4dd4-b004-c3591177520d\",\"landfield\":{\"id\":\"1623ba7d-873c-40ca-8836-165936cb6adb\",\"location\":\"Al Jazirah Al Hamra', Ras al-Khaimah, United Arab Emirates\",\"description\":\"[c2] RAK Megalopolis\",\"center\":\"55.778103 25.685314\"},\"created\":\"2021-07-03T02:24:28.354159Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"a5828a5a-3566-4bc5-997c-0f075bb8a3a4\",\"landfield\":{\"id\":\"1623ba7d-873c-40ca-8836-165936cb6adb\",\"location\":\"Al Jazirah Al Hamra', Ras al-Khaimah, United Arab Emirates\",\"description\":\"[c2] RAK Megalopolis\",\"center\":\"55.778103 25.685314\"},\"created\":\"2021-07-03T02:24:28.354262Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"af2b9f32-5c93-4dac-a21b-3b0eea66d221\",\"landfield\":{\"id\":\"52cee85e-e511-4044-8bbb-feb5c6d08dce\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.481128 25.40436\"},\"created\":\"2021-07-03T02:24:30.091098Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"8c5b9639-0ad0-497e-9edd-f914afdc9fec\",\"landfield\":{\"id\":\"342c418c-256d-4434-aa01-965e77e9d4b5\",\"location\":\"Al Jazirah Al Hamra', Ras al-Khaimah, United Arab Emirates\",\"description\":\"[c2] RAK Megalopolis\",\"center\":\"55.782824 25.683535\"},\"created\":\"2021-07-03T02:24:33.859104Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"cd0007dc-aba2-4c2b-ae91-aa458cbc6606\",\"landfield\":{\"id\":\"f6d8bc40-294f-4785-a2dd-edb8587d47de\",\"location\":\"\",\"description\":\"[c1] 💎 Yangon 💎\",\"center\":\"96.172428 16.796817\"},\"created\":\"2021-07-03T02:32:10.618292Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"ee9b5bb4-5bbf-4a2f-96ea-78d62927fcce\",\"landfield\":{\"id\":\"1a428e86-5283-4579-8832-5c8ff180dc87\",\"location\":\"Mingalartaungnyunt, Yangon, Yangon, Myanmar\",\"description\":\"[c1] 💎 Yangon 💎\",\"center\":\"96.17054 16.790244\"},\"created\":\"2021-07-03T02:32:10.397230Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"bae5ef7a-4fa0-4f81-8d17-34b74ba45b89\",\"landfield\":{\"id\":\"04cd79fc-36a1-41cf-a85f-102efbc55cdd\",\"location\":\"Αυδήμου, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c2] 🍑 West Extension\",\"center\":\"32.770672 34.670488\"},\"created\":\"2021-07-03T02:25:32.397071Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"15e359e4-956e-42a9-922f-4e88f1048ce9\",\"landfield\":{\"id\":\"1a8d4c46-e2b5-4f53-a0be-22fa39d002f4\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.500269 25.398623\"},\"created\":\"2021-07-03T02:24:34.238302Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"144cd341-a683-4b73-95cf-aea157032e21\",\"landfield\":{\"id\":\"5b80f1cd-b51b-4efe-8269-707f1b23988c\",\"location\":\"Σωτήρα Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.842341 34.683687\"},\"created\":\"2021-07-03T02:27:14.718884Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"330017fb-63de-4ff4-a292-9e9352d4db41\",\"landfield\":{\"id\":\"9e8be29c-f190-4ca4-b1f6-c9f1367c844a\",\"location\":\"Shatian Qu, Sha Tin District, Hong Kong\",\"description\":\"[c2] Chinese University of Hong Kong\",\"center\":\"114.206485 22.419121\"},\"created\":\"2021-07-03T02:33:33.739761Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"5387afd9-52da-4098-bfbd-f703ffc0745c\",\"landfield\":{\"id\":\"b0af340e-bfdd-44e0-900e-6c0421f534cf\",\"location\":\"Zermatt, Valais, Switzerland\",\"description\":\"[c1] Zermatt Woods, Switzerland\",\"center\":\"7.756691 46.019853\"},\"created\":\"2021-07-03T02:33:25.576060Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"fe322113-8720-45b9-9be6-c5f8cf1c3e23\",\"landfield\":{\"id\":\"7024ec85-5648-4ed4-9157-9d0de5f91d80\",\"location\":\"Παραμάλι, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c2] Welcome to Akrotiri TRJ :)\",\"center\":\"32.814273 34.677053\"},\"created\":\"2021-07-03T02:23:35.743381Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"d2499c6f-4fa7-4c34-9fd1-c2fa4a9c84ec\",\"landfield\":{\"id\":\"01bb9d93-3d70-483c-9104-7c541c24569e\",\"location\":\"Επισκοπή Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.840195 34.667664\"},\"created\":\"2021-07-03T02:27:14.676208Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"06b067d9-449d-4e03-adbd-c701e4d1affb\",\"landfield\":{\"id\":\"346ca202-3da6-45a1-8767-416e6c6505a5\",\"location\":\"Mamoudzou, Mayotte\",\"description\":\"[c1] Myotte - Mamoudzou 3\",\"center\":\"45.218868 -12.773718\"},\"created\":\"2021-07-03T02:23:49.316621Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"8b9f00a4-c678-4345-b141-0a7f0af252eb\",\"landfield\":{\"id\":\"901a81eb-9f51-4c7d-afce-60d4f20d73dc\",\"location\":\"Επισκοπή Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] (Sale Plot) 🍑 Megastructure\",\"center\":\"32.84852 34.672112\"},\"created\":\"2021-07-03T02:27:02.826139Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"3838894c-d530-48f5-9c5b-d89eeded0732\",\"landfield\":{\"id\":\"31ef67df-bbd5-44e8-8d66-3a063036402d\",\"location\":\"Freetown, Western Area, Sierra Leone\",\"description\":\"[c2] Freetown\",\"center\":\"-13.2829 8.485276\"},\"created\":\"2021-07-03T02:25:35.556718Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"ead3c74f-ee9c-4bfe-bd67-fb382484a6b0\",\"landfield\":{\"id\":\"391e20aa-3706-4533-bcf7-29f867e8aeda\",\"location\":\"Παραμάλι, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c2] 🍑 West Extension\",\"center\":\"32.788267 34.666958\"},\"created\":\"2021-07-03T02:25:45.316011Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"0ac0a834-6d95-42f0-9214-4ed3278f2ad7\",\"landfield\":{\"id\":\"19527c53-fcf9-4b8f-97f1-64b8888ef62a\",\"location\":\"Vaduz, Vaduz, Liechtenstein\",\"description\":\"[c1] Vaduz Castle, Liechtenstein\",\"center\":\"9.525232 47.138768\"},\"created\":\"2021-07-03T02:33:28.683897Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"3eb64069-b409-412e-8a8c-ec181ee7acf1\",\"landfield\":{\"id\":\"26f6c6c1-b8e8-46ff-b26e-1a629420de3a\",\"location\":\"Mueang Phuket, Phuket, Thailand\",\"description\":\"[c1] Beachfront Phuket Property, Phuket, Thailand\",\"center\":\"98.289356 7.858111\"},\"created\":\"2021-07-03T02:33:25.611304Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"59e35e0b-534f-43aa-866f-ed586b9cca4a\",\"landfield\":{\"id\":\"acd96641-f91e-47d5-b666-d015eb98a101\",\"location\":\"Wanzai Qu, Wan Chai District, Hong Kong\",\"description\":\"[c2] 24 Middle Gap Road [Most Expensive Home in HK @ $446 Million], Hong Kong\",\"center\":\"114.170179 22.261536\"},\"created\":\"2021-07-03T02:33:33.729348Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"7026333a-83da-4ab9-a0c4-861ccffb2bf3\",\"landfield\":{\"id\":\"d7e44019-8b12-4220-871f-cad7c6daa093\",\"location\":\"Fontvieille, Monaco, Monaco\",\"description\":\"[c1] The Great Sea Wall of Monaco (BLOCK)\",\"center\":\"7.425127 43.724964\"},\"created\":\"2021-07-03T02:32:31.741293Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"fca0220e-fd50-4620-8a9e-3ea59fc0773f\",\"landfield\":{\"id\":\"e8f3a4d6-0a24-4894-aca3-3c745845fb3e\",\"location\":\"Zhongxi Qu, Central and Western District, Hong Kong\",\"description\":\"[c2] Cathedral Of The Immaculate Conception\",\"center\":\"114.154987 22.278057\"},\"created\":\"2021-07-03T02:33:33.766584Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"563f9c91-e5e4-437d-b7e1-0fca6c69a579\",\"landfield\":{\"id\":\"42df06b2-6221-4333-8d35-3f1c6f7d001a\",\"location\":\"Επισκοπή Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.837792 34.688486\"},\"created\":\"2021-07-03T02:27:13.576876Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"37565012-73e9-48f3-8ee5-d448b0ff0586\",\"landfield\":{\"id\":\"572d5b2c-bd8d-4213-a954-1a02941cf789\",\"location\":\"Lidao Qu, Islands District, Hong Kong\",\"description\":\"[c2] HKG\",\"center\":\"113.922987 22.312046\"},\"created\":\"2021-07-03T02:33:33.754845Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"4fbdfb49-77e0-455f-ab28-634cdae382d9\",\"landfield\":{\"id\":\"d6ec3d43-4838-41a2-9bcf-2c70f8c977c6\",\"location\":\"16th arrondissement of Paris, Paris, France\",\"description\":\"[c1] Prime Paris Land, France\",\"center\":\"2.289619 48.860592\"},\"created\":\"2021-07-03T02:33:25.588961Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"73d5720a-15d0-40e4-895b-ce5ee7b85ac1\",\"landfield\":{\"id\":\"ec425d5d-7157-4932-83ff-ae8d4ba90017\",\"location\":\"Mingalartaungnyunt, Yangon, Yangon, Myanmar\",\"description\":\"[c1] 💎Yangon 💎\",\"center\":\"96.165218 16.790244\"},\"created\":\"2021-07-03T02:32:10.405842Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"7cfbff3a-6c5f-4814-99d4-11a718a9b6d5\",\"landfield\":{\"id\":\"99ae0369-4bbb-45fa-b58d-37983672e10a\",\"location\":\"Genève, Geneva, Switzerland\",\"description\":\"[c1] Geneva Property, Switzerland\",\"center\":\"6.144791 46.200032\"},\"created\":\"2021-07-03T02:33:25.593509Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"f56d47f0-ca20-4c48-b4db-3e56dff40449\",\"landfield\":{\"id\":\"76752223-3726-42db-80cd-ca4a4a69b928\",\"location\":\"Imerovigli, South Aegean, Greece\",\"description\":\"[c1] Greece Properties, Greece\",\"center\":\"25.42511 36.444002\"},\"created\":\"2021-07-03T02:33:25.648528Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"96c0bb99-3835-41b0-a41f-0ab5ba6368da\",\"landfield\":{\"id\":\"f2890ca0-14ce-499b-b276-04c1098700b2\",\"location\":\"Shatian Qu, Sha Tin District, Hong Kong\",\"description\":\"[c2] Chinese University of Hong Kong\",\"center\":\"114.206743 22.421661\"},\"created\":\"2021-07-03T02:33:33.734254Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"118b1c38-750a-4af7-ae1e-11438e2acf7f\",\"landfield\":{\"id\":\"0f5e81d2-d55e-4100-89c8-b416ee5ac933\",\"location\":\"Heard and McDonald Islands\",\"description\":\"[c1] (AK20) Heard and McDonald Islands Claim\",\"center\":\"73.532524 -53.08789\"},\"created\":\"2021-07-03T02:26:52.599771Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"a17385ff-df0a-4645-889c-1c97162af334\",\"landfield\":{\"id\":\"77388c67-c779-43a4-8cd0-c141ad4ea4e5\",\"location\":\"Σωτήρα Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.835389 34.687499\"},\"created\":\"2021-07-03T02:27:13.544191Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"8623cf63-f574-4d49-a487-68daba2e4c70\",\"landfield\":{\"id\":\"d3567d49-b2b4-424e-af9d-d7b2f1cbe951\",\"location\":\"Σωτήρα Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.838221 34.681146\"},\"created\":\"2021-07-03T02:27:27.184985Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"37e46cb3-4765-4de0-beff-1e195e4d12bc\",\"landfield\":{\"id\":\"01056039-323d-4e67-b02c-1f1d00fc5421\",\"location\":\"Western, Solomon Islands\",\"description\":\"[c1] 🥇 Solomon Island Paradise Beach\",\"center\":\"155.578937 -7.415921\"},\"created\":\"2021-07-03T02:29:15.887794Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"c82344d1-289f-47fc-af3e-87e07796d205\",\"landfield\":{\"id\":\"7277d214-e506-4fb5-81da-b9922f75b388\",\"location\":\"Bahan, Yangon, Yangon, Myanmar\",\"description\":\"[c1] 💎 Yangon 💎\",\"center\":\"96.163759 16.794846\"},\"created\":\"2021-07-03T02:32:12.341955Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"1d0bbb64-ad7f-45a2-95ea-1f8e6adb3e83\",\"landfield\":{\"id\":\"28b389d4-3427-4fb2-91e7-08f06ee40063\",\"location\":\"Jongno-gu, Seoul, South Korea\",\"description\":\"[c1] Search for Seoul Center, South Korea (+University)\",\"center\":\"126.994143 37.585806\"},\"created\":\"2021-07-03T02:33:00.878850Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"3ab58f3f-1a92-4892-8234-6127cc9cc500\",\"landfield\":{\"id\":\"28b389d4-3427-4fb2-91e7-08f06ee40063\",\"location\":\"Jongno-gu, Seoul, South Korea\",\"description\":\"[c1] Search for Seoul Center, South Korea (+University)\",\"center\":\"126.994143 37.585806\"},\"created\":\"2021-07-03T02:33:00.878947Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"c1ed2d6e-947c-4f12-9374-94cf1d8cb111\",\"landfield\":{\"id\":\"f2890ca0-14ce-499b-b276-04c1098700b2\",\"location\":\"Shatian Qu, Sha Tin District, Hong Kong\",\"description\":\"[c2] Chinese University of Hong Kong\",\"center\":\"114.206743 22.421661\"},\"created\":\"2021-07-03T02:33:33.734168Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"fa0060f2-ac1d-4caa-afb8-f75ab6fbb5fa\",\"landfield\":{\"id\":\"7103c1d1-6e95-4ad1-9beb-2a0794474092\",\"location\":\"Xigong Qu, Sai Kung District, Hong Kong\",\"description\":\"[c2] Hong Kong University of Science and Technology\",\"center\":\"114.265794 22.33396\"},\"created\":\"2021-07-03T02:33:33.899377Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"fdb8f4bd-2bce-4a6c-9d5b-104d73515c6e\",\"landfield\":{\"id\":\"983e860f-94d9-40e8-a3f0-77f538aafa0c\",\"location\":\"Ακρωτήρι, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c2] 🍑 Megastructure\",\"center\":\"32.971859 34.595346\"},\"created\":\"2021-07-03T02:25:31.980962Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"1a5bcfd5-d896-4372-a98b-72da3bd4b065\",\"landfield\":{\"id\":\"0131a77d-3841-4a4e-8646-ea336aa0da9f\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.503874 25.401647\"},\"created\":\"2021-07-03T02:24:26.355733Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"889ec1e9-bb91-4607-829a-911cb09d14d7\",\"landfield\":{\"id\":\"72f1088b-881c-4c35-9489-cc18c52c19bf\",\"location\":\"Cedeño, Bolívar, Venezuela\",\"description\":\"[c1] Search for Venezuela Center, Venezuela\",\"center\":\"-65.806732 7.620399\"},\"created\":\"2021-07-03T02:32:18.259635Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"eb0beb67-cbe1-45f6-83dd-a8627863fa07\",\"landfield\":{\"id\":\"517a3bd6-d31b-4375-83eb-5f56fee5454a\",\"location\":\"Monaco-Ville, Monaco\",\"description\":\"[c1] The Great Sea Wall of Monaco (BLOCK)\",\"center\":\"7.435341 43.738112\"},\"created\":\"2021-07-03T02:32:31.718548Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"414d7887-110c-46e5-b869-de0c0f9dbfe7\",\"landfield\":{\"id\":\"945fa25e-4691-4c5a-9b9c-06bdb11d767e\",\"location\":\"Xigong Qu, Sai Kung District, Hong Kong\",\"description\":\"[c2] Hong Kong University of Science and Technology\",\"center\":\"114.265794 22.338248\"},\"created\":\"2021-07-03T02:33:33.910715Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"229c96df-a6af-41f3-96f4-d96712057235\",\"landfield\":{\"id\":\"35f2f621-a1db-442b-8fc0-97584f05e66f\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.514689 25.401647\"},\"created\":\"2021-07-03T02:24:26.288047Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"165dc829-91ef-4321-a1ad-c0b711290452\",\"landfield\":{\"id\":\"9d53531b-d530-4d3c-b4e1-ff2fb4c987cf\",\"location\":\"Phú Cường, Huyện Sóc Sơn, Hanoi, Vietnam\",\"description\":\"[c1] Hanoi International Airport, Vietnam\",\"center\":\"105.797739 21.218021\"},\"created\":\"2021-07-03T02:33:25.661729Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"2437d251-3aba-4735-b65c-02c0488cd4a7\",\"landfield\":{\"id\":\"af1344db-73b6-4d93-ab1c-fe974c791120\",\"location\":\"Nan Qu, Southern District, Hong Kong\",\"description\":\"[c2] Ocean Park, Hong Kong\",\"center\":\"114.167519 22.234367\"},\"created\":\"2021-07-03T02:33:31.867921Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"950dc914-2bb0-4b82-b083-b7539bfba2f4\",\"landfield\":{\"id\":\"e5c15afa-1221-417a-a76d-860adf2868a2\",\"location\":\"Yaren, Yaren, Nauru\",\"description\":\"[c1] Nauru International Airport, Nauru {DO NOT SELL!}\",\"center\":\"166.920347 -0.548279\"},\"created\":\"2021-07-03T02:33:33.667964Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"0c416c83-7cb6-4814-998d-e9cc231ffd90\",\"landfield\":{\"id\":\"d6ec3d43-4838-41a2-9bcf-2c70f8c977c6\",\"location\":\"16th arrondissement of Paris, Paris, France\",\"description\":\"[c1] Prime Paris Land, France\",\"center\":\"2.289619 48.860592\"},\"created\":\"2021-07-03T02:33:25.589039Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"5eeb592d-fdc6-4b4b-bb4e-bc5f17b15c1e\",\"landfield\":{\"id\":\"f6ba0e50-4b3d-4619-a3c4-396a54c38f34\",\"location\":\"Recea, Strășeni, Moldova\",\"description\":\"[c1] Moldova\",\"center\":\"28.564539 47.192221\"},\"created\":\"2021-07-03T02:26:46.513569Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"c886eb4a-3c4e-47c7-b3ee-5683b270ac96\",\"landfield\":{\"id\":\"35f2f621-a1db-442b-8fc0-97584f05e66f\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.514689 25.401647\"},\"created\":\"2021-07-03T02:24:26.288127Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"29398f47-d9e8-4958-afa4-90684f094750\",\"landfield\":{\"id\":\"0306a63b-087e-4dbc-8975-1b04ef240924\",\"location\":\"Zürich, Zürich, Switzerland\",\"description\":\"[c1] Prime Zürich Land, Switzerland\",\"center\":\"8.540153 47.380626\"},\"created\":\"2021-07-03T02:33:25.584798Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"751b86d9-e59b-4204-8817-d0541f49228d\",\"landfield\":{\"id\":\"49b07c63-a61a-4ab3-81bb-8ddcf293265f\",\"location\":\"Επισκοπή Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c2] 🍑 Megastructure\",\"center\":\"32.898388 34.652698\"},\"created\":\"2021-07-03T02:25:32.264651Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"6db410c4-2f52-4d52-be1d-3508af23e969\",\"landfield\":{\"id\":\"de71ca15-96c1-4d1a-af01-aa5df87a9251\",\"location\":\"Σωτήρα Λεμεσού, Akrotiri and Dhekelia, Sovereign Base Areas of Akrotiri and Dhekelia\",\"description\":\"[c1] 🍑 Megastructure\",\"center\":\"32.834187 34.68277\"},\"created\":\"2021-07-03T02:27:13.508319Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"0474f67e-bf4b-42e4-8711-623e906e62ab\",\"landfield\":{\"id\":\"5ea5f53a-0ac8-413b-a70a-b13219ecc9f6\",\"location\":\"Falkland Islands\",\"description\":\"[c2] The Global Venture (FI)\",\"center\":\"-59.077778 -52.421999\"},\"created\":\"2021-07-03T02:27:01.499251Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"b0ce9d22-2ea9-4f11-b684-47a6902bbcdc\",\"landfield\":{\"id\":\"5aba2b12-f93d-4403-8fad-cf208d9e47cd\",\"location\":\"Western, Solomon Islands\",\"description\":\"[c2] Minde Megacity\",\"center\":\"157.953787 -8.562604\"},\"created\":\"2021-07-03T02:23:13.609036Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"548f7944-ce29-4d2f-a5b1-165f91e08f23\",\"landfield\":{\"id\":\"9680cdf9-1dfe-4c83-930c-c7227733b363\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.505419 25.398623\"},\"created\":\"2021-07-03T02:24:34.296508Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"d6858571-6499-4a68-81c2-92b461b75578\",\"landfield\":{\"id\":\"b4a46b84-c728-4338-aad0-1aabe55d7459\",\"location\":\"Dagon, Yangon, Yangon, Myanmar\",\"description\":\"[c1] 💎Yangon 💎\",\"center\":\"96.159468 16.790244\"},\"created\":\"2021-07-03T02:32:10.626441Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"ef687c6e-4583-44c6-826d-e13ba64adfdc\",\"landfield\":{\"id\":\"4907f8fe-d026-4b4f-b0a4-8de2a91f61eb\",\"location\":\"Bahan, Yangon, Yangon, Myanmar\",\"description\":\"[c1] 💎 Yangon 💎\",\"center\":\"96.167021 16.798871\"},\"created\":\"2021-07-03T02:32:10.734740Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"515ecd5f-579f-441f-bd25-d69b86ff22b6\",\"landfield\":{\"id\":\"d7860299-4726-42e0-aef3-89f97db53d49\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.477095 25.400717\"},\"created\":\"2021-07-03T02:24:30.325665Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"92906587-f8cb-4f07-8c0a-8ad96f0f9938\",\"landfield\":{\"id\":\"9dc338e4-251b-4b97-aff4-978e9c9b8d68\",\"location\":\"Kathu, Phuket, Thailand\",\"description\":\"[c1] Property Around Bangla Rd, Phuket\",\"center\":\"98.298197 7.893224\"},\"created\":\"2021-07-03T02:33:25.615988Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"9553e041-fb34-4066-883b-e1df3a76c876\",\"landfield\":{\"id\":\"504b7274-892e-41c9-b433-3d06017992f8\",\"location\":\"Caracas, Capital, Venezuela\",\"description\":\"[c1] Search for Caracas Center, Venezuela\",\"center\":\"-66.913948 10.507138\"},\"created\":\"2021-07-03T02:32:18.222377Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"2459e3de-f120-40f0-a884-5bdb25ffa60c\",\"landfield\":{\"id\":\"91faffb7-d4eb-4c0b-8b7b-c78d8e64cc7e\",\"location\":\"Chương Dương Độ, Quận Hoàn Kiếm, Hanoi, Vietnam\",\"description\":\"[c1] Hanoi Property, Hanoi\",\"center\":\"105.860224 21.027949\"},\"created\":\"2021-07-03T02:33:25.597999Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"3bc3f91a-8a4b-417d-a8b5-577bd8704507\",\"landfield\":{\"id\":\"1a37d461-f94b-4c76-a4a2-c51a1cbe0c8e\",\"location\":\"Ajman, Ajman, United Arab Emirates\",\"description\":\"[c2] 👑 of Ajman: Largest Combined Plot\",\"center\":\"55.48851 25.40281\"},\"created\":\"2021-07-03T02:24:29.437311Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"1e0a8202-a140-4d06-93de-224c9433cc90\",\"landfield\":{\"id\":\"e3fda196-5793-4f02-9945-85f90bbeac3a\",\"location\":\"Managua, Nicaragua\",\"description\":\"[c2] AK2 - Eye of Ra (Art)\",\"center\":\"-86.33666 12.230977\"},\"created\":\"2021-07-03T02:26:28.510799Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"036d0973-e16d-4415-802c-1af477b81bd7\",\"landfield\":{\"id\":\"2b1ddb9f-fd0d-4187-9c6e-2b18e755591b\",\"location\":\"Longyearbyen, Svalbard, Svalbard and Jan Mayen\",\"description\":\"C2 Radisson Blue, Longyearbyen, Svalbard \",\"center\":\"15.64745 78.220782\"},\"created\":\"2021-07-03T02:33:20.587076Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"c4a99fc6-978b-4678-8ecb-0a64fe3b6d33\",\"landfield\":{\"id\":\"920cd511-605f-41e8-933b-6ca010e226f2\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C2 Etherea Northern Atoll #1\",\"center\":\"39.427615 16.62435\"},\"created\":\"2021-07-03T02:26:19.998717Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"3f0c7186-dce4-40e7-b2a1-ccd227577efe\",\"landfield\":{\"id\":\"f27f8ccd-2063-4c9d-9148-c49b124d2428\",\"location\":\"???, ???, Fukuoka, Japan\",\"description\":\"C3 Japan Fukuoka Airport! ENTIRE Domestic Terminal - 21m passengers p.a.! \",\"center\":\"130.447283 33.598249\"},\"created\":\"2021-07-03T02:29:18.806111Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"88d85c27-fe62-43d2-898c-6dec65ec7cfe\",\"landfield\":{\"id\":\"283aecc9-d41c-44c9-9421-62ac356b89ed\",\"location\":\"Riga, Latvia\",\"description\":\"C1 750 Prime Old Riga next to TechOps! Great LIT opportunity given AK + SK megacities in Latvia\",\"center\":\"24.106493 56.9629\"},\"created\":\"2021-07-03T02:30:41.493062Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":0,\"tier\":1},{\"id\":\"edf451cb-b388-459b-a553-a90914a46108\",\"landfield\":{\"id\":\"ae9cf6bb-3686-49fd-9209-628bd43db188\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C1 Etherea - Northern Red Sea, off Eritrea\",\"center\":\"39.425984 16.620484\"},\"created\":\"2021-07-03T02:32:10.469608Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"37d4986d-6cac-4d63-ba36-e08f90b0a59e\",\"landfield\":{\"id\":\"6a9b6776-b885-459e-9abe-0460e930258d\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C2 Land on Etherea Northern Atoll #1\",\"center\":\"39.428387 16.624267\"},\"created\":\"2021-07-03T02:26:12.946008Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"65518bf1-d22a-4075-8f63-c41dbbde5f34\",\"landfield\":{\"id\":\"21b6cb97-fbe4-4b0d-91fc-23f1f2f41a4f\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C1 Etherea - Northern Red Sea, off Eritrea\",\"center\":\"39.425983 16.619991\"},\"created\":\"2021-07-03T02:31:53.577565Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"84ff240b-3554-428e-bb59-5ecece86beb1\",\"landfield\":{\"id\":\"b8ea9570-bcbc-4c66-b48f-18ef64f1d33b\",\"location\":\"Kyauktada, Yangon, Yangon, Myanmar\",\"description\":\"C1 Downtown Yangon, Myanmar\",\"center\":\"96.162214 16.770768\"},\"created\":\"2021-07-03T02:28:46.895601Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"19a5a29b-a9c6-475a-907d-98ec56535569\",\"landfield\":{\"id\":\"0f5258b3-b750-4347-8202-4981bb4a1a66\",\"location\":\"Yubei Qu, Chongqing Shi, China\",\"description\":\"C3 Chongqing International Airport, Terminal 3A - 44m passengers p.a.\",\"center\":\"106.652098 29.712879\"},\"created\":\"2021-07-03T02:27:03.673886Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"95f3ffd2-83b2-47ec-98b2-7d569f9b9b7a\",\"landfield\":{\"id\":\"0cc97cb7-5503-48c0-a14c-a07fc07e01fb\",\"location\":\"?????, Beirut, Lebanon\",\"description\":\"C2 Downtown Beirut (by Hippodrome / Museums) [E/R Farm]\",\"center\":\"35.510388 33.879323\"},\"created\":\"2021-07-03T02:27:13.286311Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"fe6586c0-53a6-435b-aac7-cda60f00015e\",\"landfield\":{\"id\":\"fc32f324-1d5d-4566-8040-d98032f2a198\",\"location\":\"Kiruna, Norrbotten, Sweden\",\"description\":\"C1 Kiruna Iron Mine, Sweden\",\"center\":\"20.167379 67.836168\"},\"created\":\"2021-07-03T02:32:30.077929Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"1aaf08e0-c2ba-4228-9673-1d17dadea088\",\"landfield\":{\"id\":\"6d0e7008-af05-4d1a-b944-3e73a1ef8530\",\"location\":\"La Digue and Inner Islands, Seychelles\",\"description\":\"C1 Seychelles #1 beach in world (Anse Source d'Argent)\",\"center\":\"55.829 -4.372514\"},\"created\":\"2021-07-03T02:29:47.290761Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":1,\"tier\":1},{\"id\":\"f94025fd-d361-4663-9d8d-a1095145f850\",\"landfield\":{\"id\":\"17c57309-91cf-40af-9611-89a6889f6bbc\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C2 E for Etherea! Tile Art\",\"center\":\"39.416542 16.615467\"},\"created\":\"2021-07-03T02:26:03.869923Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"ed031082-a400-4772-995a-471e92217a8c\",\"landfield\":{\"id\":\"eef8c522-c7fe-4730-a236-8cb2a0f03cd4\",\"location\":\"Valladolid, Valladolid, Spain\",\"description\":\"C2 Real Valladolid FC! Estadio José Zorrilla ? 1 of 3\",\"center\":\"-4.761371 41.644697\"},\"created\":\"2021-07-03T02:32:19.428421Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"1d71b1fc-8caf-41b1-9033-1391b445c3ae\",\"landfield\":{\"id\":\"fd5febdf-8997-4099-9c83-76b2d8012082\",\"location\":\"Pandan, Kuala Lumpur, Malaysia\",\"description\":\"C1 Bukit Bintang\",\"center\":\"101.712713 3.145059\"},\"created\":\"2021-07-03T02:31:48.024813Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"e2a5dfda-f76d-4af4-b4d4-edde63728af5\",\"landfield\":{\"id\":\"291f179f-104c-41c7-90b4-8c1712f0f8ad\",\"location\":\"Riga, Latvia\",\"description\":\"C1 Famous Kronvalda Park - Old Town Riga! 4.7* on Google \",\"center\":\"24.102802 56.956068\"},\"created\":\"2021-07-03T02:30:18.011303Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":2,\"tier\":1},{\"id\":\"9ac97df9-b812-4f95-9f2a-9b312ecd2259\",\"landfield\":{\"id\":\"e068fd4c-4bce-4cae-b33d-f6828d8fb488\",\"location\":\"Fort-de-France, Martinique\",\"description\":\"C1 Downtown Fort-de-France, Martinique \",\"center\":\"-61.069565 14.603851\"},\"created\":\"2021-07-03T02:23:49.491558Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"ae01ab58-9be0-4ac5-86ac-8b57bab45404\",\"landfield\":{\"id\":\"65c7a7eb-83bc-4f7f-8268-aab3525fb62a\",\"location\":\"Saint-Denis, Reunion\",\"description\":\"C1 Downtown Saint-Denis, Reunion\",\"center\":\"55.446624 -20.877258\"},\"created\":\"2021-07-03T02:23:49.708087Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"01fe7599-0cbf-4baa-9a17-79af1c8d9e92\",\"landfield\":{\"id\":\"6ed11ffa-cd67-40c4-979a-24f9c75632e8\",\"location\":\"Saint-Denis, Reunion\",\"description\":\"C1 Downtown Saint-Denis, Reunion\",\"center\":\"55.454349 -20.877178\"},\"created\":\"2021-07-03T02:23:49.720827Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"5b63e3f5-cdb2-4949-a5cd-ea84078ef528\",\"landfield\":{\"id\":\"e69e5f73-57d0-430b-bda9-8000a5505f3b\",\"location\":\"\",\"description\":\"C1 Downtown Yangon\",\"center\":\"96.162385 16.77159\"},\"created\":\"2021-07-03T02:29:27.004646Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"db412649-c171-4ef4-b858-5919d64e7c82\",\"landfield\":{\"id\":\"6bb73b24-b566-4e60-ba5a-6fe8070095af\",\"location\":\"Saint Anne, Alderney, Guernsey\",\"description\":\"C1 Fort Clonque, Saint Anne, Channel Islands\",\"center\":\"-2.231083 49.713548\"},\"created\":\"2021-07-03T02:31:42.381501Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"d18f5315-c903-4e1b-ba8d-0df359df8ca9\",\"landfield\":{\"id\":\"8a2295b2-d1e3-44ab-9a52-2dd072571151\",\"location\":\"Vakaga, Central African Republic\",\"description\":\"Tri Point #68 of 171\",\"center\":\"22.877655 10.920629\"},\"created\":\"2021-07-03T02:32:38.462437Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":3,\"tier\":1},{\"id\":\"68d083ce-04e1-4e75-9959-6d183bb02f5f\",\"landfield\":{\"id\":\"faee48fb-3b2a-4afb-9bc1-e918846ca601\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C1 Etherea\",\"center\":\"39.430618 16.618839\"},\"created\":\"2021-07-03T02:30:44.184059Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"6d308e61-cce3-4f43-8229-a9f731d549b7\",\"landfield\":{\"id\":\"9e5a2f9d-fd1e-444a-a683-5c4016dfe837\",\"location\":\"Bitola, North Macedonia\",\"description\":\"C1 North Macedonia! Great LIT opportunity \",\"center\":\"21.31176 40.887303\"},\"created\":\"2021-07-03T02:29:29.990953Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"807692d0-355f-42b6-927f-fed0893af521\",\"landfield\":{\"id\":\"6309df29-e09c-4712-ba6b-dcab356fa44d\",\"location\":\"Busanjin-gu, Busan, South Korea\",\"description\":\"Famous Busan Citizen Park! Great AR potential. \",\"center\":\"129.059229 35.169107\"},\"created\":\"2021-07-03T02:31:54.684115Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"625f6eeb-9591-49fe-8d7e-4fb2c4aaa463\",\"landfield\":{\"id\":\"e7165ffd-934d-4909-b3f1-97fd03dd1aed\",\"location\":\"Quito, Pichincha, Ecuador\",\"description\":\"C2 Central Quito (includes Parque Cumanda Arts / Sports Centre) [E/R Farm]\",\"center\":\"-78.511047 -0.228137\"},\"created\":\"2021-07-03T02:30:04.832782Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"cba5c69d-e7bb-4a61-9595-6d4f838eef90\",\"landfield\":{\"id\":\"51c6847c-6c3b-48fe-87bd-9c83460548d3\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C2 Land on Etherea Northern Atoll #1\",\"center\":\"39.427958 16.626241\"},\"created\":\"2021-07-03T02:26:12.989616Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"57297234-00df-4164-98bc-fd2a31790d15\",\"landfield\":{\"id\":\"6acb1e7c-7cd0-4bd8-97a9-ee1eb342bd93\",\"location\":\"\",\"description\":\"Lucky 88.8888 x 8.888 ??! ????\",\"center\":\"88.888836 8.888633\"},\"created\":\"2021-07-03T02:30:26.270940Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"0e0bc497-c705-4a9d-8a41-7a27ae2c40e4\",\"landfield\":{\"id\":\"d95eae25-e5e4-4a60-937d-ddf6dab3f73e\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C2 Etherea\",\"center\":\"39.426327 16.621059\"},\"created\":\"2021-07-03T02:26:22.865349Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":4,\"tier\":1},{\"id\":\"49ef1a15-7261-4a8f-9e39-e05a569b3099\",\"landfield\":{\"id\":\"e7d2eb9d-0376-44d1-a13e-9c20367415c5\",\"location\":\"Hongkou Qu, Shanghai Shi, China\",\"description\":\"C2 Shanghai Downtown Waterfront, Hongkou Qu\",\"center\":\"121.489907 31.247076\"},\"created\":\"2021-07-03T02:32:58.306856Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"ff423d3b-b4ac-4954-ad7e-0be920f5719f\",\"landfield\":{\"id\":\"f98741d3-7c16-485d-95f2-3078a2fb3457\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C1 Etherea\",\"center\":\"39.430103 16.618921\"},\"created\":\"2021-07-03T02:30:44.807016Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"8b3131f6-db92-4ea4-b774-5bbc5815a2cd\",\"landfield\":{\"id\":\"5ac4d42e-9233-4f21-b57f-acd2f5375fa2\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C1 Etherea\",\"center\":\"39.424696 16.619332\"},\"created\":\"2021-07-03T02:30:44.949856Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"9a04b7a9-f5f0-4a95-b9e3-33475854708d\",\"landfield\":{\"id\":\"d6aff1e7-2e14-489c-a202-3965d40a5910\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C2 Land on Etherea Northern Atoll #1\",\"center\":\"39.426928 16.625583\"},\"created\":\"2021-07-03T02:26:12.976961Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"cfcb1a87-4b7d-45b2-9042-d2ff024ad789\",\"landfield\":{\"id\":\"72ea5de6-3d52-4e3d-9770-28efbda6252c\",\"location\":\"Saint-Denis, Reunion\",\"description\":\"C1 Downtown Saint-Denis, Reunion\",\"center\":\"55.451088 -20.878301\"},\"created\":\"2021-07-03T02:23:49.725177Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"3dba7c5d-59c6-40ca-a2fd-f2189d929bbd\",\"landfield\":{\"id\":\"3ca8a301-88ef-45b7-a76a-df8b04d50529\",\"location\":\"Saint-Denis, Reunion\",\"description\":\"C1 Downtown Saint-Denis, Reunion\",\"center\":\"55.447226 -20.880145\"},\"created\":\"2021-07-03T02:23:49.712308Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"cb00e8dc-6f5a-4906-aedb-be481ee1dee1\",\"landfield\":{\"id\":\"842c3142-0b35-4d33-a826-15660ca9a305\",\"location\":\"Ljubljana, Ljubljana, Slovenia\",\"description\":\"C1 Ljubljana Old Town by Castle! [E/R Farm]\",\"center\":\"14.507275 46.050421\"},\"created\":\"2021-07-03T02:32:31.365447Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"a157d16b-e611-4e54-9925-89954bcf2e53\",\"landfield\":{\"id\":\"e691b6c4-7c29-457d-8752-6a6f6da6206b\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C2 Etherea Western Atoll #1\",\"center\":\"39.418602 16.623773\"},\"created\":\"2021-07-03T02:26:19.975611Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"8f5f1d3c-942f-4edc-b8a3-c606134c4c4f\",\"landfield\":{\"id\":\"035f353e-25f0-406a-96a6-06a9fc054a3d\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C1 Etherea\",\"center\":\"39.424954 16.620072\"},\"created\":\"2021-07-03T02:29:18.944581Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":5,\"tier\":1},{\"id\":\"cbe77f12-1ea6-44f2-b0c0-efb664a0da0e\",\"landfield\":{\"id\":\"80226550-f92d-4be5-9651-b31b9b29f601\",\"location\":\"Saint-Denis, Reunion\",\"description\":\"C1 Downtown Saint-Denis, Reunion\",\"center\":\"55.450745 -20.881027\"},\"created\":\"2021-07-03T02:23:49.716426Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"44d3cb82-8868-42cb-9ce3-9933be7f5c43\",\"landfield\":{\"id\":\"53db36f8-c3d8-46fd-bf34-dd6da11f9595\",\"location\":\"Brzegi Górne, Powiat Bieszczadzki, Zakarpattia, Slovakia\",\"description\":\"Tri Point #20 of 171\",\"center\":\"22.565575 49.088033\"},\"created\":\"2021-07-03T02:32:40.183568Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"4436ae79-2d18-4dc1-ac80-831bd6efd3ef\",\"landfield\":{\"id\":\"e58fac57-9fe7-47aa-8ba3-f2bb4825caf4\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C2 Land on Etherea Northern Atoll #1\",\"center\":\"39.425983 16.623362\"},\"created\":\"2021-07-03T02:26:12.933186Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"7019fe4d-1f09-463e-85d6-af9289abe83d\",\"landfield\":{\"id\":\"ae98f9d4-0529-4b69-ab33-d0b9355a2270\",\"location\":\"Ora? Otopeni, Ilfov, Romania\",\"description\":\"C1 Henri Coanda (Otopeni) Airport, Main Terminal, Romania - 15M Passengers\",\"center\":\"26.077595 44.570048\"},\"created\":\"2021-07-03T02:33:04.785781Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"d5b8d0f4-ceb5-4376-bcb8-bf6f73e82402\",\"landfield\":{\"id\":\"a6d4cfba-9dfd-47ab-8bd0-9ff047914036\",\"location\":\"Managua, Nicaragua\",\"description\":\"C2 Eye of Ra (Managua) \",\"center\":\"-86.361465 12.248257\"},\"created\":\"2021-07-03T02:25:37.834640Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"0b3abff8-5d51-430b-8e31-8a8902f4dd9f\",\"landfield\":{\"id\":\"18f30400-7f06-4ec2-a90d-80df3611320e\",\"location\":\"Cô Giang, Qu?n 1, Ho Chi Minh City, Vietnam\",\"description\":\"C1 Downtown HCM City (Cô Giang)\",\"center\":\"106.692867 10.760293\"},\"created\":\"2021-07-03T02:31:49.354399Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"33b7d366-1c60-4b46-88a3-28f5716405c3\",\"landfield\":{\"id\":\"338d13cd-2540-4b70-96b9-e2af684c1079\",\"location\":\"Kuala Lumpur, Malaysia\",\"description\":\"C1 Kuala Lumpur\",\"center\":\"101.706361 3.149172\"},\"created\":\"2021-07-03T02:32:32.177211Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"d1ffd922-74e9-4469-8e77-dde3803f80eb\",\"landfield\":{\"id\":\"d70337d7-919e-4ca5-9658-c79eeb92dc5b\",\"location\":\"Northern Red Sea, Eritrea\",\"description\":\"C2 Land on Etherea Northern Atoll #1\",\"center\":\"39.429159 16.623362\"},\"created\":\"2021-07-03T02:26:12.920450Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1},{\"id\":\"c2a6a81d-416f-489e-8783-1c556ac07df9\",\"landfield\":{\"id\":\"dabdd638-b4e5-4a4c-9e89-846423e05588\",\"location\":\"Mamoudzou, Mayotte\",\"description\":\"C1 Downtown Mamoudzou, Mayotte\",\"center\":\"45.236463 -12.783679\"},\"created\":\"2021-07-03T02:23:49.519869Z\",\"expires\":null,\"is_crafted\":false,\"size\":0,\"color\":6,\"tier\":1}]}")
      const data = await fetch(
        './data/jewels.json'
      ).then(res => res.json())
      const places = data.results.map(place => (
        {
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [place.landfield.center.split(' ')[0], place.landfield.center.split(' ')[1]]
          },
          properties: {
            ...place,
            jewel: this.colorToString(place)
          }
        }
      ))
      this.map.getSource('urban').setData({
        type: 'FeatureCollection',
        features: places
      })
      return places
    },
    colorToString (place) {
      return place.color === 0
        ? 'blue'
        : place.color === 1
          ? 'black'
          : place.color === 2
            ? 'brown'
            : place.color === 3
              ? 'ochre'
              : place.color === 4
                ? 'grey'
                : place.color === 5
                  ? 'sandy'
                  : place.color === 6
                    ? 'yellow'
                    : null
    },
    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedCity = Object.assign({}, this.defaultCity)
        this.editedIndex = -1
      })
    },
    async save () {
      const cityContribution = {}
      cityContribution.city = this.editedCity
      cityContribution.id = null
      try {
        const res = await this.$axios.$post('/city-contributions', cityContribution)

        // Success 🎉
        const data = res.data
        console.log(data)
        this.show = true
        this.message = 'Thank you for your contribution ! I\'ll review it as soon as possible. You can follow confirmed cities on Discord.'
        this.close()
      } catch (error) {
        // Error 😨
        if (error.response) {
          /*
           * The request was made and the server responded with a
           * status code that falls out of the range of 2xx
           */
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.headers)
        } else if (error.request) {
          /*
           * The request was made but no response was received, `error.request`
           * is an instance of XMLHttpRequest in the browser and an instance
           * of http.ClientRequest in Node.js
           */
          console.log(error.request)
        } else {
          // Something happened in setting up the request and triggered an Error
          console.log('Error', error.message)
        }
        console.log(error)
      }
    },
    onCityClick (e) {
      const currentFeature = e.features[0]
      const cityId = currentFeature.properties.id
      console.log(currentFeature)
      this.$router.push('/cities/' + cityId)
    },
    onMouseEnterCity (e) {
      this.map.getCanvas().style.cursor = 'pointer'
      const currentFeature = e.features[0]
      const name = (currentFeature.properties.cityName === undefined) ? '' : currentFeature.properties.cityName
      const coordinates = e.features[0].geometry.coordinates.slice()

      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360
      }
      const popupContent = new Vue({
        ...MapPopup,
        parent: this,
        propsData: {
          popupName: name,
          type: 'urban'
        }
      }).$mount()

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(coordinates)
        .setDOMContent(popupContent.$el)
        .addTo(this.map)
    },
    // Change it back to a pointer when it leaves.
    onMouseOutCity () {
      this.map.getCanvas().style.cursor = ''
      const popUps = document.getElementsByClassName('mapboxgl-popup')
      /** Check if there is already a popup on the map and if so, remove it */
      if (popUps[0]) { popUps[0].remove() };
    }
  },
  head () {
    return {
      title: 'Jewels'
    }
  }
}
</script>

<style scoped>

#map-wrapper{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
}

.v-btn--example {
  bottom: 0;
  position: absolute;
  margin: 0 0 16px 16px;
  z-index: 4;
  left: 50%;
  transform:translateX(-50%);
}

#features {
  position: relative;
  z-index: 3;
  max-height: 650px;
  overflow-y: auto;
}
</style>

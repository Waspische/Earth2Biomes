<template>
  <v-card class="mt-4">
    <v-card-text class="subtitle-2 text--secondary py-0 text-wrap">
      {{ $t('city.updateMessage') }}
    </v-card-text>
    <v-data-table :headers="propertiesForSaleHeaders" :items="normalizedProperties" :items-per-page="10">
      <template #item.discount="{ item }">
        <span :class="discountColor(getDiscount(item))">{{ item.discount | formatNumber }}%</span>
      </template>
      <template #item.buy="{ item }">
        <v-btn
          small
          color="primary darken-1"
          min-width="0"
          target="_blank"
          rel="noopener noreferrer"
          :href="item.propertyUrl"
        >
          {{ $t('city.buyButton') }}
        </v-btn>
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
export default {
  name: 'PropertiesForSale',
  filters: {
    formatNumber (number) {
      return new Intl.NumberFormat().format(Math.trunc(number))
    }
  },
  props: {
    propertiesForSale: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      propertiesForSaleHeaders: [
        {
          text: 'Description',
          align: 'start',
          value: 'description',
          width: '40%'
        },
        {
          text: 'Tile count',
          value: 'tileCount',
          width: '10%'
        },
        {
          text: 'New land price',
          value: 'newLandPrice',
          width: '15%'
        },
        {
          text: 'Price',
          value: 'price',
          width: '10%'
        },
        {
          text: 'Discount',
          value: 'discount',
          width: '15%'
        },
        {
          text: 'Class',
          value: 'tileClass',
          width: '5%'
        },
        {
          text: '',
          value: 'buy',
          sortable: false,
          width: '5%'
        }
      ]
    }
  },
  computed: {
    normalizedProperties () {
      return this.propertiesForSale.map((prop) => {
        return {
          ...prop,
          discount: this.getDiscount(prop),
          newLandPrice: this.getNewLandPrice(prop),
          propertyUrl: 'https://app.earth2.io/#thegrid/' + prop.propertyId
        }
      })
    }
  },
  methods: {
    discountColor (discount) {
      let color = 'red--text'
      if (discount <= 0) {
        color = 'green--text'
      }
      return color
    },
    getDiscount (property) {
      const discount = (((property.tradingValue * property.tileCount) - property.price) / (property.tradingValue * property.tileCount)) * 100 * -1
      return discount === Infinity ? 10000 : this.toFixed(discount, 2)
    },
    getNewLandPrice (property) {
      return this.toFixed(property.tradingValue * property.tileCount, 2)
    },
    toFixed (num, fixed) {
      const re = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?')
      return num.toString().match(re)[0]
    }
  }
}
</script>

<style scoped>

</style>

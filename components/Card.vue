<template>
  <div class="card-wrapper">
    <div id="card">
      <div class="card-header">
        <a href="#" class="backlink" style="display: none;">
          <i class="material-icons">subdirectory_arrow_left</i>&nbsp;&nbsp;
          <span />
        </a>
        <h1 class="title" @click="printSelected()">
          Biomes
        </h1>
      </div>
      <div class="maps">
        <a class="maplink active" @click="addSelected('Gold')">
          <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="spinner">
            <circle
              cx="8"
              cy="8"
              r="7"
              fill="none"
              stroke-width="2"
              stroke="#fff"
              class="path"
            /> <circle
              cx="8"
              cy="8"
              r="3"
              fill="#fff"
              stroke-width="0"
              class="path"
            /></svg>
          <span>Gold</span>
        </a>
        <a class="maplink" @click="addSelected('Clay')">
          <svg width="16px" height="16px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" class="spinner">
            <circle
              cx="8"
              cy="8"
              r="3"
              fill="#fff"
              stroke-width="0"
              class="path"
            /></svg>
          <span>Clay</span>
        </a>
      </div>
      <div class="card-footer" />
    </div>
  </div>
</template>

<script>

export default {
  name: 'Card',
  async fetch () {
    // this.mountains = await fetch(
    //   '~'
    // ).then(res => res.json())
  },
  data () {
    return {
      mountains: []
    }
  },
  computed: {
  },
  methods: {
  }
}
</script>

<style scoped>
.card-wrapper {
  width: 370px;
  position: relative;
  top: 0;
  right: 0;
  z-index: 3
}

#card {
  box-shadow: 0 5px 25px rgba(0, 0, 0, .08);
  background: var(--v-primary-base);
  margin: 20px 0 0 20px;
  -webkit-transition: height 1s;
  transition: height 1s
}

#card .card-header {
  padding: 25px 40px 30px;
  position: relative
}

#card .title {
  margin: 0;
  padding: 0;
  font-size: 32px
}

#card .card-footer {
  padding: 0 30px 20px
}

a.maplink {
  display: block;
  padding: 20px 40px 20px 90px;
  color: var(--v-text-base);
  text-decoration: none;
  position: relative;
  -webkit-transition: background-color .25s ease-out;
  transition: background-color .25s ease-out
}

a.maplink .spinner {
  position: absolute;
  top: 22px;
  left: 45px
}

a.maplink.active {
  background: var(--v-secondary-base);
  border-left: 4px solid var(--v-secondary-base);
  position: relative;
  left: -4px;
  padding-left: 90px;
  color: var(--v-text-base);
  width: 354px;
  box-sizing: border-box
}

a.maplink:hover {
  text-decoration: underline;
  cursor: pointer
}

a.maplink:first-child {
  border-top: 1px solid #eceff1
}

a.maplink:first-child.active {
  border-top: none;
  margin-top: 1px
}
</style>

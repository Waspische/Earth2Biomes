(window.webpackJsonp=window.webpackJsonp||[]).push([[5],{333:function(e,o,t){var content=t(349);"string"==typeof content&&(content=[[e.i,content,""]]),content.locals&&(e.exports=content.locals);(0,t(30).default)("162aac52",content,!0,{sourceMap:!1})},348:function(e,o,t){"use strict";t(333)},349:function(e,o,t){(o=t(29)(!1)).push([e.i,"#map[data-v-2bdc5d7e],.map-loader[data-v-2bdc5d7e]{position:absolute;top:0;left:0;bottom:0;right:0;width:100%;height:100%}. #menu-wrapper[data-v-2bdc5d7e]{position:relative;top:0;left:0;z-index:3}#map-wrapper[data-v-2bdc5d7e]{position:absolute;top:0;left:0;width:100%;height:100%;z-index:2}",""]),e.exports=o},397:function(e,o,t){"use strict";t.r(o);t(39),t(66);var n=t(12),r=t(326),c=t.n(r),l={name:"MapboxMap",components:{},data:function(){return{biomes:[{name:"Quarries",landuses:[{name:"Gold",fileName:"goldMines.json",color:"#FFD700"},{name:"Clay",fileName:"clayMines.json",color:"#D4C59C"},{name:"Sand",fileName:"sandMines.json",color:"#c2b280"},{name:"Peat",fileName:"peatMines.json",color:"#766D52"},{name:"Coal",fileName:"clayMines.json",color:"#36454f"}]}],selectedLanduses:[],accessToken:"pk.eyJ1Ijoid2FzcGlzY2hlIiwiYSI6ImNrazBidGRsNzBmdmIyeHJyYThjZG0wYzYifQ.qZQp-6ddFiyakTvvyCv8Gw",mapStyle:"mapbox://styles/mapbox/light-v9",geoJsonSource:"./data/goldMines.json",sourceId:"goldMines",minesBoundary:{id:"minesBoundary",source:"carte",type:"fill",paint:{"fill-color":"#B42222","fill-opacity":.8},filter:["==","$type","Polygon"]},minesLocation:{id:"minesLocation",source:"carte",type:"circle",paint:{"circle-radius":6,"circle-color":"#B42222"},filter:["==","$type","Point"]},minesLocationStroke:{id:"minesLocation-stroke",type:"line",source:"carte",minzoom:0,maxzoom:14,layout:{visibility:"visible","line-join":"round","line-cap":"round"},paint:{"line-width":8,"line-color":"#90CAF9"}}}},mounted:function(){c.a.accessToken="pk.eyJ1IjoiYWlzaHdlcnlhIiwiYSI6ImNrYzVyYXBlNzBrZGgzMG8wc3FtZjU5NDAifQ.u4azaXjkh41xSMC1NJLhTw",this.map=new c.a.Map({container:"map",style:this.mapStyle}),this.map.addControl(new c.a.NavigationControl,"top-right"),this.map.on("load",this.onMapLoad),this.map.on("zoom",this.onZoom)},methods:{onMapLoad:function(e){var o=this;return Object(n.a)(regeneratorRuntime.mark((function e(){return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.map.addSource("carte",{data:o.geoJsonSource,type:"geojson"});case 2:o.map.addLayer(o.minesBoundary),o.map.addLayer(o.minesLocation),o.map.addLayer(o.minesLocationStroke);case 5:case"end":return e.stop()}}),e)})))()},onZoom:function(){console.log(this.map.getZoom())}}},d=(t(348),t(48)),component=Object(d.a)(l,(function(){var e=this.$createElement;this._self._c;return this._m(0)}),[function(){var e=this.$createElement,o=this._self._c||e;return o("div",{attrs:{id:"map-wrapper",fluid:"","fill-height":"",width:"700px"}},[o("div",{attrs:{id:"map"}})])}],!1,null,"2bdc5d7e",null);o.default=component.exports}}]);
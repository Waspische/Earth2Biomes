(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{471:function(t,e,r){"use strict";r.d(e,"a",(function(){return l})),r.d(e,"b",(function(){return d})),r.d(e,"c",(function(){return h}));var n=r(474),o=r(0),l=Object(o.i)("v-card__actions"),c=Object(o.i)("v-card__subtitle"),d=Object(o.i)("v-card__text"),h=Object(o.i)("v-card__title");n.a},474:function(t,e,r){"use strict";r(10),r(7),r(8),r(3),r(16),r(9),r(17);var n=r(2),o=(r(28),r(245),r(246),r(482),r(244)),l=r(478),c=r(98),d=r(11);function h(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function v(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?h(Object(source),!0).forEach((function(e){Object(n.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):h(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}e.a=Object(d.a)(l.a,c.a,o.a).extend({name:"v-card",props:{flat:Boolean,hover:Boolean,img:String,link:Boolean,loaderHeight:{type:[Number,String],default:4},raised:Boolean},computed:{classes:function(){return v(v({"v-card":!0},c.a.options.computed.classes.call(this)),{},{"v-card--flat":this.flat,"v-card--hover":this.hover,"v-card--link":this.isClickable,"v-card--loading":this.loading,"v-card--disabled":this.disabled,"v-card--raised":this.raised},o.a.options.computed.classes.call(this))},styles:function(){var style=v({},o.a.options.computed.styles.call(this));return this.img&&(style.background='url("'.concat(this.img,'") center center / cover no-repeat')),style}},methods:{genProgress:function(){var t=l.a.options.methods.genProgress.call(this);return t?this.$createElement("div",{staticClass:"v-card__progress",key:"progress"},[t]):null}},render:function(t){var e=this.generateRouteLink(),r=e.tag,data=e.data;return data.style=this.styles,this.isClickable&&(data.attrs=data.attrs||{},data.attrs.tabindex=0),t(r,this.setBackgroundColor(this.color,data),[this.genProgress(),this.$slots.default])}})},478:function(t,e,r){"use strict";r(28);var n=r(1),o=(r(10),r(7),r(8),r(3),r(16),r(9),r(17),r(2)),l=(r(141),r(484),r(247)),c=r(142),d=r(41),h=r(102),v=r(252),m=r(32),f=r(0),_=r(11);function y(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}var x=Object(_.a)(d.a,Object(h.b)(["absolute","fixed","top","bottom"]),v.a,m.a).extend({name:"v-progress-linear",directives:{intersect:c.a},props:{active:{type:Boolean,default:!0},backgroundColor:{type:String,default:null},backgroundOpacity:{type:[Number,String],default:null},bufferValue:{type:[Number,String],default:100},color:{type:String,default:"primary"},height:{type:[Number,String],default:4},indeterminate:Boolean,query:Boolean,reverse:Boolean,rounded:Boolean,stream:Boolean,striped:Boolean,value:{type:[Number,String],default:0}},data:function(){return{internalLazyValue:this.value||0,isVisible:!0}},computed:{__cachedBackground:function(){return this.$createElement("div",this.setBackgroundColor(this.backgroundColor||this.color,{staticClass:"v-progress-linear__background",style:this.backgroundStyle}))},__cachedBar:function(){return this.$createElement(this.computedTransition,[this.__cachedBarType])},__cachedBarType:function(){return this.indeterminate?this.__cachedIndeterminate:this.__cachedDeterminate},__cachedBuffer:function(){return this.$createElement("div",{staticClass:"v-progress-linear__buffer",style:this.styles})},__cachedDeterminate:function(){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__determinate",style:{width:Object(f.h)(this.normalizedValue,"%")}}))},__cachedIndeterminate:function(){return this.$createElement("div",{staticClass:"v-progress-linear__indeterminate",class:{"v-progress-linear__indeterminate--active":this.active}},[this.genProgressBar("long"),this.genProgressBar("short")])},__cachedStream:function(){return this.stream?this.$createElement("div",this.setTextColor(this.color,{staticClass:"v-progress-linear__stream",style:{width:Object(f.h)(100-this.normalizedBuffer,"%")}})):null},backgroundStyle:function(){var t;return t={opacity:null==this.backgroundOpacity?this.backgroundColor?1:.3:parseFloat(this.backgroundOpacity)},Object(o.a)(t,this.isReversed?"right":"left",Object(f.h)(this.normalizedValue,"%")),Object(o.a)(t,"width",Object(f.h)(Math.max(0,this.normalizedBuffer-this.normalizedValue),"%")),t},classes:function(){return function(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?y(Object(source),!0).forEach((function(e){Object(o.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):y(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}({"v-progress-linear--absolute":this.absolute,"v-progress-linear--fixed":this.fixed,"v-progress-linear--query":this.query,"v-progress-linear--reactive":this.reactive,"v-progress-linear--reverse":this.isReversed,"v-progress-linear--rounded":this.rounded,"v-progress-linear--striped":this.striped,"v-progress-linear--visible":this.isVisible},this.themeClasses)},computedTransition:function(){return this.indeterminate?l.d:l.e},isReversed:function(){return this.$vuetify.rtl!==this.reverse},normalizedBuffer:function(){return this.normalize(this.bufferValue)},normalizedValue:function(){return this.normalize(this.internalLazyValue)},reactive:function(){return Boolean(this.$listeners.change)},styles:function(){var t={};return this.active||(t.height=0),this.indeterminate||100===parseFloat(this.normalizedBuffer)||(t.width=Object(f.h)(this.normalizedBuffer,"%")),t}},methods:{genContent:function(){var slot=Object(f.s)(this,"default",{value:this.internalLazyValue});return slot?this.$createElement("div",{staticClass:"v-progress-linear__content"},slot):null},genListeners:function(){var t=this.$listeners;return this.reactive&&(t.click=this.onClick),t},genProgressBar:function(t){return this.$createElement("div",this.setBackgroundColor(this.color,{staticClass:"v-progress-linear__indeterminate",class:Object(o.a)({},t,!0)}))},onClick:function(t){if(this.reactive){var e=this.$el.getBoundingClientRect().width;this.internalValue=t.offsetX/e*100}},onObserve:function(t,e,r){this.isVisible=r},normalize:function(t){return t<0?0:t>100?100:parseFloat(t)}},render:function(t){return t("div",{staticClass:"v-progress-linear",attrs:{role:"progressbar","aria-valuemin":0,"aria-valuemax":this.normalizedBuffer,"aria-valuenow":this.indeterminate?void 0:this.normalizedValue},class:this.classes,directives:[{name:"intersect",value:this.onObserve}],style:{bottom:this.bottom?0:void 0,height:this.active?Object(f.h)(this.height):0,top:this.top?0:void 0},on:this.genListeners()},[this.__cachedStream,this.__cachedBackground,this.__cachedBuffer,this.__cachedBar,this.genContent()])}}),k=x;e.a=n.a.extend().extend({name:"loadable",props:{loading:{type:[Boolean,String],default:!1},loaderHeight:{type:[Number,String],default:2}},methods:{genProgress:function(){return!1===this.loading?null:this.$slots.progress||this.$createElement(k,{props:{absolute:!0,color:!0===this.loading||""===this.loading?this.color||"primary":this.loading,height:this.loaderHeight,indeterminate:!0}})}}})},482:function(t,e,r){var content=r(483);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(23).default)("e23b7040",content,!1,{sourceMap:!1})},483:function(t,e,r){var n=r(22)(!1);n.push([t.i,'.theme--light.v-card{background-color:#fff;color:rgba(0,0,0,.87)}.theme--light.v-card>.v-card__subtitle,.theme--light.v-card>.v-card__text{color:rgba(0,0,0,.6)}.theme--dark.v-card{background-color:#1e1e1e;color:#fff}.theme--dark.v-card>.v-card__subtitle,.theme--dark.v-card>.v-card__text{color:hsla(0,0%,100%,.7)}.v-sheet.v-card{border-radius:4px}.v-sheet.v-card:not(.v-sheet--outlined){box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}.v-sheet.v-card.v-sheet--shaped{border-radius:24px 4px}.v-card{border-width:thin;display:block;max-width:100%;outline:none;text-decoration:none;transition-property:box-shadow,opacity;word-wrap:break-word;position:relative;white-space:normal}.v-card>.v-card__progress+:not(.v-btn):not(.v-chip):not(.v-avatar),.v-card>:first-child:not(.v-btn):not(.v-chip):not(.v-avatar){border-top-left-radius:inherit;border-top-right-radius:inherit}.v-card>:last-child:not(.v-btn):not(.v-chip):not(.v-avatar){border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.v-card__progress{top:0;left:0;right:0;overflow:hidden}.v-card__subtitle+.v-card__text{padding-top:0}.v-card__subtitle,.v-card__text{font-size:.875rem;font-weight:400;line-height:1.375rem;letter-spacing:.0071428571em}.v-card__subtitle,.v-card__text,.v-card__title{padding:16px}.v-card__title{align-items:center;display:flex;flex-wrap:wrap;font-size:1.25rem;font-weight:500;letter-spacing:.0125em;line-height:2rem;word-break:break-all}.v-card__title+.v-card__subtitle,.v-card__title+.v-card__text{padding-top:0}.v-card__title+.v-card__subtitle{margin-top:-16px}.v-card__text{width:100%}.v-card__actions{align-items:center;display:flex;padding:8px}.v-card__actions>.v-btn.v-btn{padding:0 8px}.v-application--is-ltr .v-card__actions>.v-btn.v-btn+.v-btn{margin-left:8px}.v-application--is-ltr .v-card__actions>.v-btn.v-btn .v-icon--left{margin-left:4px}.v-application--is-ltr .v-card__actions>.v-btn.v-btn .v-icon--right{margin-right:4px}.v-application--is-rtl .v-card__actions>.v-btn.v-btn+.v-btn{margin-right:8px}.v-application--is-rtl .v-card__actions>.v-btn.v-btn .v-icon--left{margin-right:4px}.v-application--is-rtl .v-card__actions>.v-btn.v-btn .v-icon--right{margin-left:4px}.v-card--flat{box-shadow:0 0 0 0 rgba(0,0,0,.2),0 0 0 0 rgba(0,0,0,.14),0 0 0 0 rgba(0,0,0,.12)!important}.v-sheet.v-card--hover{cursor:pointer;transition:box-shadow .4s cubic-bezier(.25,.8,.25,1)}.v-sheet.v-card--hover:focus,.v-sheet.v-card--hover:hover{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}.v-card--link,.v-card--link .v-chip{cursor:pointer}.v-card--link:focus:before{opacity:.08}.v-card--link:before{background:currentColor;bottom:0;content:"";left:0;opacity:0;pointer-events:none;position:absolute;right:0;top:0;transition:opacity .2s}.v-card--disabled{pointer-events:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.v-card--disabled>:not(.v-card__progress){opacity:.6;transition:inherit}.v-card--loading{overflow:hidden}.v-card--raised{box-shadow:0 5px 5px -3px rgba(0,0,0,.2),0 8px 10px 1px rgba(0,0,0,.14),0 3px 14px 2px rgba(0,0,0,.12)}',""]),t.exports=n},484:function(t,e,r){var content=r(485);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(23).default)("cf87dc84",content,!1,{sourceMap:!1})},485:function(t,e,r){var n=r(22)(!1);n.push([t.i,".theme--light.v-progress-linear{color:rgba(0,0,0,.87)}.theme--dark.v-progress-linear{color:#fff}.v-progress-linear{background:transparent;overflow:hidden;position:relative;transition:.2s cubic-bezier(.4,0,.6,1);width:100%}.v-progress-linear__buffer{height:inherit;left:0;position:absolute;top:0;transition:inherit;width:100%}.v-progress-linear--reverse .v-progress-linear__buffer{left:auto;right:0}.v-progress-linear__background{bottom:0;left:0;position:absolute;top:0;transition:inherit}.v-progress-linear--reverse .v-progress-linear__background{left:auto;right:0}.v-progress-linear__content{align-items:center;display:flex;height:100%;left:0;justify-content:center;position:absolute;top:0;width:100%}.v-progress-linear--reverse .v-progress-linear__content{left:auto;right:0}.v-progress-linear__determinate{height:inherit;left:0;position:absolute;transition:inherit}.v-progress-linear--reverse .v-progress-linear__determinate{left:auto;right:0}.v-progress-linear .v-progress-linear__indeterminate .long,.v-progress-linear .v-progress-linear__indeterminate .short{-webkit-animation-play-state:paused;animation-play-state:paused;background-color:inherit;bottom:0;height:inherit;left:0;position:absolute;right:auto;top:0;width:auto;will-change:left,right}.v-progress-linear .v-progress-linear__indeterminate--active .long{-webkit-animation-name:indeterminate-ltr;animation-name:indeterminate-ltr;-webkit-animation-duration:2.2s;animation-duration:2.2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.v-progress-linear .v-progress-linear__indeterminate--active .short{-webkit-animation-name:indeterminate-short-ltr;animation-name:indeterminate-short-ltr;-webkit-animation-duration:2.2s;animation-duration:2.2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.v-progress-linear--reverse .v-progress-linear__indeterminate .long,.v-progress-linear--reverse .v-progress-linear__indeterminate .short{left:auto;right:0}.v-progress-linear--reverse .v-progress-linear__indeterminate--active .long{-webkit-animation-name:indeterminate-rtl;animation-name:indeterminate-rtl}.v-progress-linear--reverse .v-progress-linear__indeterminate--active .short{-webkit-animation-name:indeterminate-short-rtl;animation-name:indeterminate-short-rtl}.v-progress-linear__stream{-webkit-animation:stream-ltr .25s linear infinite;animation:stream-ltr .25s linear infinite;-webkit-animation-play-state:paused;animation-play-state:paused;border-color:currentColor;border-top:4px dotted;bottom:0;left:auto;right:-8px;opacity:.3;pointer-events:none;position:absolute;top:calc(50% - 2px);transition:inherit}.v-progress-linear--reverse .v-progress-linear__stream{-webkit-animation:stream-rtl .25s linear infinite;animation:stream-rtl .25s linear infinite;left:-8px;right:auto}.v-progress-linear__wrapper{overflow:hidden;position:relative;transition:inherit}.v-progress-linear--absolute,.v-progress-linear--fixed{left:0;z-index:1}.v-progress-linear--absolute{position:absolute}.v-progress-linear--fixed{position:fixed}.v-progress-linear--reactive .v-progress-linear__content{pointer-events:none}.v-progress-linear--rounded{border-radius:4px}.v-progress-linear--striped .v-progress-linear__determinate{background-image:linear-gradient(135deg,hsla(0,0%,100%,.25) 25%,transparent 0,transparent 50%,hsla(0,0%,100%,.25) 0,hsla(0,0%,100%,.25) 75%,transparent 0,transparent);background-size:40px 40px;background-repeat:repeat}.v-progress-linear--query .v-progress-linear__indeterminate--active .long{-webkit-animation-name:query-ltr;animation-name:query-ltr;-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.v-progress-linear--query .v-progress-linear__indeterminate--active .short{-webkit-animation-name:query-short-ltr;animation-name:query-short-ltr;-webkit-animation-duration:2s;animation-duration:2s;-webkit-animation-iteration-count:infinite;animation-iteration-count:infinite}.v-progress-linear--query.v-progress-linear--reverse .v-progress-linear__indeterminate--active .long{-webkit-animation-name:query-rtl;animation-name:query-rtl}.v-progress-linear--query.v-progress-linear--reverse .v-progress-linear__indeterminate--active .short{-webkit-animation-name:query-short-rtl;animation-name:query-short-rtl}.v-progress-linear--visible .v-progress-linear__indeterminate--active .long,.v-progress-linear--visible .v-progress-linear__indeterminate--active .short,.v-progress-linear--visible .v-progress-linear__stream{-webkit-animation-play-state:running;animation-play-state:running}@-webkit-keyframes indeterminate-ltr{0%{left:-90%;right:100%}60%{left:-90%;right:100%}to{left:100%;right:-35%}}@keyframes indeterminate-ltr{0%{left:-90%;right:100%}60%{left:-90%;right:100%}to{left:100%;right:-35%}}@-webkit-keyframes indeterminate-rtl{0%{left:100%;right:-90%}60%{left:100%;right:-90%}to{left:-35%;right:100%}}@keyframes indeterminate-rtl{0%{left:100%;right:-90%}60%{left:100%;right:-90%}to{left:-35%;right:100%}}@-webkit-keyframes indeterminate-short-ltr{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@keyframes indeterminate-short-ltr{0%{left:-200%;right:100%}60%{left:107%;right:-8%}to{left:107%;right:-8%}}@-webkit-keyframes indeterminate-short-rtl{0%{left:100%;right:-200%}60%{left:-8%;right:107%}to{left:-8%;right:107%}}@keyframes indeterminate-short-rtl{0%{left:100%;right:-200%}60%{left:-8%;right:107%}to{left:-8%;right:107%}}@-webkit-keyframes query-ltr{0%{right:-90%;left:100%}60%{right:-90%;left:100%}to{right:100%;left:-35%}}@keyframes query-ltr{0%{right:-90%;left:100%}60%{right:-90%;left:100%}to{right:100%;left:-35%}}@-webkit-keyframes query-rtl{0%{right:100%;left:-90%}60%{right:100%;left:-90%}to{right:-35%;left:100%}}@keyframes query-rtl{0%{right:100%;left:-90%}60%{right:100%;left:-90%}to{right:-35%;left:100%}}@-webkit-keyframes query-short-ltr{0%{right:-200%;left:100%}60%{right:107%;left:-8%}to{right:107%;left:-8%}}@keyframes query-short-ltr{0%{right:-200%;left:100%}60%{right:107%;left:-8%}to{right:107%;left:-8%}}@-webkit-keyframes query-short-rtl{0%{right:100%;left:-200%}60%{right:-8%;left:107%}to{right:-8%;left:107%}}@keyframes query-short-rtl{0%{right:100%;left:-200%}60%{right:-8%;left:107%}to{right:-8%;left:107%}}@-webkit-keyframes stream-ltr{to{transform:translateX(-8px)}}@keyframes stream-ltr{to{transform:translateX(-8px)}}@-webkit-keyframes stream-rtl{to{transform:translateX(8px)}}@keyframes stream-rtl{to{transform:translateX(8px)}}",""]),t.exports=n},505:function(t,e,r){var content=r(524);content.__esModule&&(content=content.default),"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(23).default)("589bf5b6",content,!1,{sourceMap:!1})},523:function(t,e,r){"use strict";r(505)},524:function(t,e,r){var n=r(22)(!1);n.push([t.i,"svg.apexcharts-svg[data-v-63a9aab1]{background:transparent!important}.v-application a[data-v-63a9aab1]{color:#fff;text-decoration:none}",""]),t.exports=n},547:function(t,e,r){"use strict";r.r(e);r(477);var n=r(521),o={name:"CityStats",components:{apexchart:r.n(n).a},filters:{formatNumber:function(t){return(new Intl.NumberFormat).format(Math.trunc(t))}},props:["city","cityStats"],data:function(){return{lineChartOption:{chart:{height:"100%",type:"area",sparkline:{enabled:!0},toolbar:{show:!1},animations:{enabled:!0,easing:"easeinout",speed:800,animateGradually:{enabled:!0,delay:150},dynamicAnimation:{enabled:!0,speed:350}}},legend:{show:!1},dataLabels:{enabled:!1},stroke:{curve:"smooth"},grid:{show:!1},xaxis:{type:"datetime",labels:{show:!1},axisBorder:{show:!1},axisTicks:{show:!1}},yaxis:{labels:{show:!1},axisBorder:{show:!1},axisTicks:{show:!1}},tooltip:{theme:"dark",x:{format:"dd/MM/yy HH:mm"}},noData:{text:"Loading..."}},classDistributionChartOptions:{chart:{height:"100%",type:"pie"},labels:["Class 1","Class 2","Class 3","Class 4","Class 5","No class"],dataLabels:{formatter:function(t,e){var r=e.seriesIndex;e.dataPointIndex;return e.w.config.labels[r]+":  "+Math.trunc(t)+"%"}},animations:{enabled:!0,easing:"easeinout",speed:800,animateGradually:{enabled:!0,delay:150},dynamicAnimation:{enabled:!0,speed:350}},legend:{show:!1},theme:{palette:"palette2"},stroke:{colors:["#1E1E1E"]},noData:{text:"Loading..."}},tierDistributionChartOptions:{chart:{height:"100%",type:"pie"},labels:["Tier 1","Tier 2"],dataLabels:{formatter:function(t,e){var r=e.seriesIndex;e.dataPointIndex;return e.w.config.labels[r]+":  "+Math.trunc(t)+"%"}},animations:{enabled:!0,easing:"easeinout",speed:800,animateGradually:{enabled:!0,delay:150},dynamicAnimation:{enabled:!0,speed:350}},legend:{show:!1},theme:{palette:"palette2"},stroke:{colors:["#1E1E1E"]},noData:{text:"Loading..."}},tilesSoldLastNumber:"",tilesSoldSeries:null,playersSeries:null,playersLastNumber:null}},computed:{hasData:function(){return""!==this.tilesSoldLastNumber}},mounted:function(){this.tilesSoldSeries=[{name:"Number of tiles",data:this.cityStats.tileNumberSoldData}],this.playersSeries=[{name:"Number of players",data:this.cityStats.playerNumberData}],this.tilesSoldLastNumber=this.cityStats.tileNumberSoldData[this.cityStats.tileNumberSoldData.length-1].y,this.playersLastNumber=this.cityStats.playerNumberData[this.cityStats.playerNumberData.length-1].y},methods:{playerColor:function(t){var e="grey";return 0===t?e="green":1===t?e="orange":2===t&&(e="red"),e},playerLink:function(t){return"https://app.earth2.io/#profile/"+t.playerId}}},l=(r(523),r(72)),c=r(77),d=r.n(c),h=r(250),v=r(474),m=r(471),f=r(465),_=r(228),y=r(135),x=r(96),k=r(467),component=Object(l.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("v-row",[r("v-col",{attrs:{cols:"12",md:"12"}}),t._v(" "),r("v-col",{staticClass:"d-flex",staticStyle:{"flex-direction":"column"},attrs:{cols:"12",md:"6",sm:"6"}},[r("v-card",{staticClass:"mb-2"},[r("v-card-title",[t._v(t._s(t.$t("city.numberOfTiles")))]),t._v(" "),t.hasData?[r("v-card-text",{staticClass:"text-center text-h4 text--primary pb-0"},[t._v("\n          "+t._s(t._f("formatNumber")(t.tilesSoldLastNumber))+"\n        ")]),t._v(" "),r("apexchart",{attrs:{type:"area",height:"60",options:t.lineChartOption,series:t.tilesSoldSeries}})]:[r("v-card-text",{staticClass:"text-center text--primary pb-2"},[t._v("\n          "+t._s(t.$t("city.noDataYet"))+"\n        ")])]],2),t._v(" "),r("v-card",{staticClass:"mt-2"},[r("v-card-title",[t._v(t._s(t.$t("city.numberOfPlayers")))]),t._v(" "),t.hasData?[r("v-card-text",{staticClass:"text-center text-h4 text--primary pb-0"},[t._v("\n          "+t._s(t._f("formatNumber")(t.playersLastNumber))+"\n        ")]),t._v(" "),r("apexchart",{attrs:{type:"area",height:"60",options:t.lineChartOption,series:t.playersSeries}})]:[r("v-card-text",{staticClass:"text-center text--primary pb-2"},[t._v("\n          "+t._s(t.$t("city.noDatayet"))+"\n        ")])]],2),t._v(" "),r("v-row",{staticClass:"mt-2"},[r("v-col",{staticClass:"d-flex",attrs:{cols:"12",md:"6",sm:"6"}},[r("v-card",{staticClass:"flex-grow-1"},[r("v-card-title",[t._v(t._s(t.$t("city.classDistribution")))]),t._v(" "),t.hasData?[r("div",{staticStyle:{"align-self":"center"}},[r("apexchart",{attrs:{type:"pie",height:"220",options:t.classDistributionChartOptions,series:t.cityStats.classDistributionFrom1to5}})],1)]:[r("v-card-text",{staticClass:"text-center text--primary pb-2"},[t._v("\n              "+t._s(t.$t("city.noDataYet"))+"\n            ")])]],2)],1),t._v(" "),r("v-col",{staticClass:"d-flex",attrs:{cols:"12",md:"6",sm:"6"}},[r("v-card",{staticClass:"flex-grow-1"},[r("v-card-title",[t._v(t._s(t.$t("city.tierDistribution")))]),t._v(" "),t.hasData?[r("div",{staticStyle:{"align-self":"center"}},[r("apexchart",{attrs:{type:"pie",height:"220",options:t.tierDistributionChartOptions,series:t.cityStats.tierDistribution}})],1)]:[r("v-card-text",{staticClass:"text-center text--primary pb-2"},[t._v("\n              "+t._s(t.$t("city.noDataYet"))+"\n            ")])]],2)],1)],1)],1),t._v(" "),r("v-col",{staticClass:"d-flex",attrs:{cols:"12",md:"6",sm:"6"}},[r("v-card",{staticClass:"flex-grow-1"},[r("v-card-title",[t._v(t._s(t.$t("city.top10Players")))]),t._v(" "),t.hasData?t._l(t.cityStats.top10Players,(function(e,n){return r("v-list",{key:e.title,staticClass:"py-1",attrs:{dense:""}},[r("v-list-item",[r("v-btn",{attrs:{color:t.playerColor(n),icon:"",outlined:""}},[t._v("\n              "+t._s(n+1)+"\n            ")]),t._v(" "),r("v-list-item-content",{staticClass:"ml-3"},[r("a",{attrs:{href:t.playerLink(e),target:"_blank",rel:"noopener noreferrer"}},[t._v("\n                "+t._s(e.username)+"\n              ")]),t._v(" "),r("span",{staticClass:"grey--text"},[t._v(" "+t._s(t._f("formatNumber")(e.tileNumber))+" tiles")])])],1)],1)})):[r("v-card-text",{staticClass:"text-center text--primary pb-2"},[t._v("\n          "+t._s(t.$t("city.noPlayerInfo"))+"\n        ")])]],2)],1)],1)}),[],!1,null,"63a9aab1",null);e.default=component.exports;d()(component,{VBtn:h.a,VCard:v.a,VCardText:m.b,VCardTitle:m.c,VCol:f.a,VList:_.a,VListItem:y.a,VListItemContent:x.a,VRow:k.a})}}]);
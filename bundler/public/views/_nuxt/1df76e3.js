(window.webpackJsonp=window.webpackJsonp||[]).push([[10],{1011:function(t,e,n){"use strict";n.r(e);var r={props:{value:{type:Object,default:function(){return{}}}},data:function(){return{myChart:null,option:{tooltip:{trigger:"axis",axisPointer:{type:"shadow"}},xAxis:{type:"category",name:"月份",data:[]},yAxis:{type:"value",name:"提交量",axisLabel:{formatter:"{value} 次"}},series:[{name:"提交次数",data:[],type:"line"}]}}},computed:{},created:function(){},watch:{value:function(t){this.option.xAxis.data=t.title,this.option.series[0].data=t.data,this.myChart.setOption(this.option)}},mounted:function(){this.myChart=this.$echarts.init(document.getElementById("line-charts")),this.myChart.setOption(this.option);var t=this;window.onresize=function(){t.myChart.resize()}}},o=n(51),component=Object(o.a)(r,(function(){var t=this.$createElement;this._self._c;return this._m(0)}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("div",{staticStyle:{width:"100%",height:"400px"},attrs:{id:"line-charts"}})])}],!1,null,"4ebb0dfa",null);e.default=component.exports},1012:function(t,e,n){"use strict";n.r(e);var r={props:{value:{type:Array,default:function(){return[]}}},data:function(){return{myChart:null,option:{legend:{},tooltip:{},color:["#19be6b","#ed4014","#c5c8ce"],dataset:{source:[]},xAxis:{type:"category",name:"月份"},yAxis:{type:"value",name:"提交量"},series:[{type:"bar"},{type:"bar"},{type:"bar"}]}}},computed:{},created:function(){},watch:{value:function(t){this.value.length>0&&(this.option.dataset.source=this.value,this.myChart.setOption(this.option))}},mounted:function(){this.myChart=this.$echarts.init(document.getElementById("bar-charts")),this.myChart.setOption(this.option);var t=this;window.onresize=function(){t.myChart.resize()}}},o=n(51),component=Object(o.a)(r,(function(){var t=this.$createElement;this._self._c;return this._m(0)}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("div",{staticStyle:{width:"100%",height:"400px"},attrs:{id:"bar-charts"}})])}],!1,null,"8e3b5c32",null);e.default=component.exports},1137:function(t,e,n){"use strict";var r=n(798);n.n(r).a},1138:function(t,e,n){(e=n(89)(!1)).push([t.i,".title[data-v-1e39e89e]{padding:16px;font-size:16px}",""]),t.exports=e},1173:function(t,e,n){"use strict";n.r(e);n(91),n(121),n(92),n(94);var r=n(21),o=n(1011),c=n(1012),l=n(228),h=n(229),d={components:{lineChart:o.default,barChart:c.default},props:{},data:function(){return{sumData:[],personData:{}}},computed:{},created:function(){},mounted:function(){this.getStatistics(),this.getPersonStatistics()},methods:{getStatistics:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,data,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.get(h.a.BUNDLER_STATISTICS);case 2:n=e.sent,r=n.data,data=void 0===r?[]:r,o=[["product","成功","失败","取消"]],t.getLastAllMonth(6).forEach((function(t){var e=t.slice(4,7),n=data[t]||{};o.push(["".concat(e,"月"),n.success||0,n.fail||0,n.cancel||0])})),t.sumData=o;case 9:case"end":return e.stop()}}),e)})))()},getPersonStatistics:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,data,o;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,l.a.get(h.a.BUNDLER_STATISTICS_PERSON,{params:{person:"Dilomen"}});case 2:n=e.sent,r=n.data,data=void 0===r?[]:r,o={title:[],data:[]},t.getLastAllMonth(12).forEach((function(t){var e=t.slice(4,7)+"月",n=data[t];o.title.push(e),o.data.push(n||0)})),t.personData=o;case 9:case"end":return e.stop()}}),e)})))()},getLastAllMonth:function(t){for(var e=[],n=(new Date).getFullYear(),r=(new Date).getMonth()+1,i=0;i<t;i++)r<=0&&(r=12,--n),e.push(n+(r<10?"0":"")+r),--r;return e.reverse(),e}}},f=(n(1137),n(51)),component=Object(f.a)(d,(function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",[n("Row",[n("Col",{staticStyle:{padding:"16px"},attrs:{span:"24"}},[n("Card",[n("p",{staticClass:"title"},[t._v("最近6个月的提交统计")]),t._v(" "),n("bar-chart",{attrs:{value:t.sumData}})],1)],1)],1),t._v(" "),n("Row",[n("Col",{staticStyle:{padding:"16px"},attrs:{span:"12"}},[n("Card",[n("div",[n("p",{staticClass:"title"},[t._v("最近12个月的个人提交统计")]),t._v(" "),n("line-chart",{attrs:{value:t.personData}})],1)])],1),t._v(" "),n("Col",{staticStyle:{padding:"16px"},attrs:{span:"12"}},[n("Card",[t._v("\n      XX统计\n    ")])],1)],1)],1)}),[],!1,null,"1e39e89e",null);e.default=component.exports;installComponents(component,{BarChart:n(1012).default,LineChart:n(1011).default})},798:function(t,e,n){var content=n(1138);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,n(90).default)("f9de05a0",content,!0,{sourceMap:!1})}}]);
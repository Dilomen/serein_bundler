(window.webpackJsonp=window.webpackJsonp||[]).push([[8],{896:function(t,e,n){"use strict";n.r(e);var r={props:{value:{type:Array,default:function(){return[]}}},data:function(){return{myChart:null,option:{legend:{},tooltip:{},color:["#19be6b","#ed4014","#c5c8ce"],dataset:{source:[]},xAxis:{type:"category"},yAxis:{},series:[{type:"bar"},{type:"bar"},{type:"bar"}]}}},computed:{},created:function(){},watch:{value:function(t){this.value.length>0&&(this.option.dataset.source=this.value,this.myChart.setOption(this.option))}},mounted:function(){this.myChart=this.$echarts.init(document.getElementById("line-charts")),this.myChart.setOption(this.option);var t=this;window.onresize=function(){t.myChart.resize()}}},c=n(51),component=Object(c.a)(r,(function(){var t=this.$createElement;this._self._c;return this._m(0)}),[function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("div",{staticStyle:{width:"100%",height:"400px"},attrs:{id:"line-charts"}})])}],!1,null,"54554736",null);e.default=component.exports},938:function(t,e,n){"use strict";n.r(e);n(90),n(121),n(167),n(91),n(92);var r=n(21),c=n(896),o=n(228),l=n(229),h={components:{lineChart:c.default},props:{},data:function(){return{sumData:[]}},computed:{},created:function(){},mounted:function(){this.getData()},methods:{getData:function(){var t=this;return Object(r.a)(regeneratorRuntime.mark((function e(){var n,r,data,c;return regeneratorRuntime.wrap((function(e){for(;;)switch(e.prev=e.next){case 0:return e.next=2,o.a.get(l.a.BUNDLER_STATISTICS);case 2:n=e.sent,r=n.data,data=void 0===r?[]:r,c=[["product","成功","失败","取消"]],Object.keys(data).forEach((function(t){var e=data[t],n=t.slice(4,7);c.push(["".concat(n,"月"),e.success,e.fail,e.cancel])})),t.sumData=c;case 8:case"end":return e.stop()}}),e)})))()}}},d=n(51),component=Object(d.a)(h,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("Row",[e("Col",{staticStyle:{padding:"16px"},attrs:{span:"24"}},[e("Card",[e("p",{staticStyle:{padding:"16px"}},[this._v("最近6个月的提交统计")]),this._v(" "),e("line-chart",{attrs:{value:this.sumData}})],1)],1)],1),this._v(" "),e("Row",[e("Col",{staticStyle:{padding:"16px"},attrs:{span:"12"}},[e("Card",[e("div",[this._v("\n        XX统计\n      ")])])],1),this._v(" "),e("Col",{staticStyle:{padding:"16px"},attrs:{span:"12"}},[e("Card",[this._v("\n      YY统计\n    ")])],1)],1)],1)}),[],!1,null,"586f3ef7",null);e.default=component.exports;installComponents(component,{LineChart:n(896).default})}}]);
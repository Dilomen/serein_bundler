(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{1133:function(t,e,r){"use strict";var o=r(796);r.n(o).a},1134:function(t,e,r){(e=r(89)(!1)).push([t.i,".expand-btn[data-v-1429f244]{padding:5px 0;margin:0 20px;border-top:1px solid #dcdee2}",""]),t.exports=e},1135:function(t,e,r){"use strict";var o=r(797);r.n(o).a},1136:function(t,e,r){(e=r(89)(!1)).push([t.i,".expand-btn[data-v-f1b9974c]{padding:5px 0;margin:0 30px;border-top:1px solid #dcdee2}.table-wrap[data-v-f1b9974c]{margin:0 30px;height:100%}",""]),t.exports=e},1169:function(t,e,r){"use strict";r.r(e);var o={props:{},data:function(){return{searchForm:{}}},computed:{},created:function(){},mounted:function(){},methods:{}},n=(r(1133),r(51)),l=Object(n.a)(o,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",{staticClass:"search-box"},[r("Form",{ref:"formInline",attrs:{model:t.searchForm,"label-width":80,inline:""}},[r("FormItem",{attrs:{label:"项目名称"}},[r("Input",{staticStyle:{width:"200px"},model:{value:t.searchForm.projectName,callback:function(e){t.$set(t.searchForm,"projectName",e)},expression:"searchForm.projectName"}})],1),t._v(" "),r("FormItem",{attrs:{label:"分支名称"}},[r("Input",{staticStyle:{width:"200px"},model:{value:t.searchForm.repositoryName,callback:function(e){t.$set(t.searchForm,"repositoryName",e)},expression:"searchForm.repositoryName"}})],1),t._v(" "),r("FormItem",[r("Button",{attrs:{type:"primary"},on:{click:function(e){return t.handleSubmit(!0)}}},[t._v("查询")]),t._v(" "),r("Button",{on:{click:function(e){return t.handleSubmit(!1)}}},[t._v("重置")])],1)],1)],1),t._v(" "),r("div",{staticClass:"expand-btn"},[r("Button",{attrs:{type:"primary"},on:{click:function(e){return t.handleSubmit(!0)}}},[t._v("新增")])],1)])}),[],!1,null,"1429f244",null).exports,c=(r(93),r(119),r(91),r(230),r(231),r(167),r(92),r(141)),d=r(228),m=r(229);function f(object,t){var e=Object.keys(object);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(object);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(object,t).enumerable}))),e.push.apply(e,r)}return e}function h(t){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?f(Object(source),!0).forEach((function(e){Object(c.a)(t,e,source[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(source)):f(Object(source)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(source,e))}))}return t}var v={props:{},data:function(){var t=this;return{searchForm:{},tableData:[],modalShow:!1,limit:20,current:1,total:0,formLoading:!1,passwordEdit:!0,form:{},rules:{userName:[{required:!0,message:"用户名不得为空",trigger:"blur"}],password:[{validator:function(e,r,o){t.form.id||r?o():o("密码不得为空")},trigger:"blur"}],identity:[{required:!0,message:"身份不得为空"}]},columns:[{title:"用户名",key:"userName"},{title:"真实姓名",key:"realName"},{title:"身份",slot:"identity"},{title:"是否启动",slot:"enabled"},{title:"创建时间",key:"createTime"},{title:"Action",slot:"action",width:150}]}},computed:{query:function(){return h(h({},this.searchForm),{},{limit:this.limit,offset:this.current})}},created:function(){},mounted:function(){this.getData()},methods:{getData:function(){var t=this;d.a.get(m.a.USER_LIST,{params:this.query}).then((function(data){t.tableData=data.data||[],t.total=data.total})).catch((function(t){return console.error(t)}))},handleChangeLimit:function(t){this.limit=t,this.getData()},handleChangePage:function(t){this.current=t,this.getData()},handleReset:function(){this.searchForm={},this.current=1,this.getData()},handleAdd:function(){this.form={},this.passwordEdit=!0,this.modalShow=!0},handleEdit:function(t){this.form=h({},t),this.passwordEdit=!0,this.modalShow=!0},handleSubmit:function(){var t=this;this.$refs.form.validate((function(e){if(e){var r=h({},t.form);(t.form.id?d.a.put(m.a.USER_UPDATE,r):d.a.post(m.a.USER_ADD,r)).then((function(data){1===data.code?(t.getData(),t.modalShow=!1,t.$Message.success(data.msg)):t.$Message.error(data.msg)})).catch((function(t){return console.error(t)}))}}))},handleEditEnabled:function(t,e){var r=this;d.a.delete(m.a.USER_DELETE+"/".concat(t.id),{params:{status:e}}).then((function(data){1===data.code?(r.$Message.success(data.msg),r.getData()):(r.$Message.error(data.msg),t.enabled=1===t.enabled?0:1)})).catch((function(t){return console.error(t)}))}}},y=(r(1135),{props:{},components:{projectSetting:l,userSetting:Object(n.a)(v,(function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",{staticClass:"search-box"},[r("Form",{attrs:{model:t.searchForm,"label-width":80,inline:""}},[r("FormItem",{attrs:{label:"用户名"}},[r("Input",{staticStyle:{width:"200px"},model:{value:t.searchForm.userName,callback:function(e){t.$set(t.searchForm,"userName",e)},expression:"searchForm.userName"}})],1),t._v(" "),r("FormItem",{attrs:{label:"真实姓名"}},[r("Input",{staticStyle:{width:"200px"},model:{value:t.searchForm.realName,callback:function(e){t.$set(t.searchForm,"realName",e)},expression:"searchForm.realName"}})],1),t._v(" "),r("FormItem",[r("Button",{attrs:{type:"primary"},on:{click:t.getData}},[t._v("查询")]),t._v(" "),r("Button",{on:{click:t.handleReset}},[t._v("重置")])],1)],1)],1),t._v(" "),r("div",{staticClass:"expand-btn"},[r("Button",{attrs:{type:"primary"},on:{click:t.handleAdd}},[t._v("新增")])],1),t._v(" "),r("div",{staticClass:"table-wrap"},[r("Table",{attrs:{columns:t.columns,data:t.tableData},scopedSlots:t._u([{key:"identity",fn:function(e){var r=e.row;return[t._v("\n        "+t._s(0===r.identity?"管理员":"开发者")+"\n      ")]}},{key:"enabled",fn:function(e){var o=e.row;return[r("i-switch",{attrs:{size:"default","true-value":1,"false-value":0},on:{"on-change":function(e){return t.handleEditEnabled(o,e)}},model:{value:o.enabled,callback:function(e){t.$set(o,"enabled",e)},expression:"row.enabled"}},[r("span",{attrs:{slot:"open"},slot:"open"},[t._v("开")]),t._v(" "),r("span",{attrs:{slot:"close"},slot:"close"},[t._v("关")])])]}},{key:"action",fn:function(e){var o=e.row;return[r("Button",{staticStyle:{"margin-right":"5px"},attrs:{type:"primary",size:"small"},on:{click:function(e){return t.handleEdit(o)}}},[t._v("编辑")])]}}])}),t._v(" "),r("Page",{attrs:{"class-name":"page",total:t.total,"show-total":"","page-size-opts":[10,15,20,30,50,100],current:t.current,size:"small","show-elevator":"","page-size":t.limit,"show-sizer":""},on:{"on-change":t.handleChangePage,"on-page-size-change":t.handleChangeLimit}})],1),t._v(" "),r("Modal",{attrs:{scrollable:"",title:t.form.id?"修改用户":"新建用户"},model:{value:t.modalShow,callback:function(e){t.modalShow=e},expression:"modalShow"}},[r("Form",{ref:"form",attrs:{model:t.form,rules:t.rules,"label-width":80}},[r("FormItem",{attrs:{label:"用户名",prop:"userName"}},[r("Input",{attrs:{placeholder:"请输入用户名"},model:{value:t.form.userName,callback:function(e){t.$set(t.form,"userName",e)},expression:"form.userName"}})],1),t._v(" "),r("FormItem",{attrs:{label:"真实姓名",prop:"realName"}},[r("Input",{attrs:{placeholder:"请输入真实姓名"},model:{value:t.form.realName,callback:function(e){t.$set(t.form,"realName",e)},expression:"form.realName"}})],1),t._v(" "),r("FormItem",{attrs:{label:"密码",prop:"password"}},[r("div",{staticStyle:{display:"flex"}},[r("Input",{attrs:{disabled:t.passwordEdit&&!!t.form.id,placeholder:"请输入密码"},model:{value:t.form.password,callback:function(e){t.$set(t.form,"password",e)},expression:"form.password"}}),t._v(" "),r("p",{staticStyle:{margin:"0 5px"}}),t._v(" "),t.form.id?r("Button",{on:{click:function(){return t.passwordEdit=!t.passwordEdit}}},[t._v("修改")]):t._e()],1)]),t._v(" "),r("FormItem",{attrs:{label:"身份",prop:"identity"}},[r("Select",{attrs:{placeholder:"请选择身份"},model:{value:t.form.identity,callback:function(e){t.$set(t.form,"identity",e)},expression:"form.identity"}},[r("Option",{attrs:{value:1}},[t._v("开发者")]),t._v(" "),r("Option",{attrs:{value:0}},[t._v("管理员")])],1)],1)],1),t._v(" "),r("div",{attrs:{slot:"footer"},slot:"footer"},[r("Button",{attrs:{type:"text",size:"large"},on:{click:function(){return t.modalShow=!1}}},[t._v("取消")]),t._v(" "),r("Button",{attrs:{type:"primary",size:"large"},on:{click:t.handleSubmit}},[t._v("确定")])],1)],1)],1)}),[],!1,null,"f1b9974c",null).exports},data:function(){return{}},computed:{},created:function(){},mounted:function(){},methods:{}}),w=Object(n.a)(y,(function(){var t=this.$createElement,e=this._self._c||t;return e("div",[e("Tabs",{attrs:{type:"card"}},[e("TabPane",{attrs:{label:"用户管理"}},[e("user-setting")],1),this._v(" "),e("TabPane",{attrs:{label:"项目管理"}},[e("project-setting")],1)],1)],1)}),[],!1,null,"655653f9",null);e.default=w.exports},796:function(t,e,r){var content=r(1134);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(90).default)("2b3c2f6e",content,!0,{sourceMap:!1})},797:function(t,e,r){var content=r(1136);"string"==typeof content&&(content=[[t.i,content,""]]),content.locals&&(t.exports=content.locals);(0,r(90).default)("27002444",content,!0,{sourceMap:!1})}}]);
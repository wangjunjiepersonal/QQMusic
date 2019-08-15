/*
 * index.js
 * vuex的入口js 文件  将vuex的属性与vue的属性进行链接
 * 引入vue 和 vuex  
 * 导入 vuex的相关js文件
 * 将vuex挂载到vue中
 * 将vuex导出
 * 插件：cteatedLogger 每当state改变时 会在测试台打印修改之前的state状态值
 * */
 import Vue from 'vue'
 import Vuex from 'vuex'
 import * as actions from './actions'
 import * as getters from './getters'
 import state from './state'
 import mutations from './mutations'
 import createdLogger from 'vuex/dist/logger'
 
 Vue.use(Vuex)
 
 export default new Vuex.Store({
 	actions,
 	getters,
 	state,
 	mutations
 })

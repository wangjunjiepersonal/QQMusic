// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
/**
 *引入 vue文件
 * 引入app.vue组件
 * 引入babel-polyfill
 * 引入fastclick 并在main.js中实例化fastclick  取消300毫秒延迟
 * */
import 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

import VueLazyLoad from 'vue-lazyload'
Vue.use(VueLazyLoad,{
	loading:require('common/image/default.png')
})

import fastclick from 'fastclick'
fastclick.attach(document.body)

Vue.config.productionTip = false
//在main中全局引入 styles 这样就不用在单独的区域引入文件了、
import 'common/stylus/index.styl'

/* eslint-disable no-new */
new Vue({
  el: '#app',
//ES6的简化写法 和之前挂载app的方式一样
  render: h => h(App),
  router,
  store
})

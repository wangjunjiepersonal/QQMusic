/*
 * 在router文件夹中设置router的组件 然后再main.js中引入
 * */
import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
//引入路由组件
import Recommend from 'components/recommend/recommend.vue'
import Singer from 'components/singer/singer.vue'
import Rank from 'components/rank/rank.vue'
import Search from 'components/search/search.vue'
import singerDetall from 'components/singer-detall/singer-detall.vue'
import Disc from 'components/disc/disc.vue'
import topList from 'components/top-list/top-list.vue'
import User from 'components/user-center/user-center.vue'

//路由异步加载  和上面的 import引用一个道理
//const Recommend = (resolve) => {
//import('components/recommend/recommend').then((module) => {
//  resolve(module)
//})
//}
export default new Router({
routes: [
	{
      path: '/',
      redirect:'/recommend'
    },
    {
      path: '/recommend',
      component: Recommend,
      children:[
      	{
      		path:':id',
      		component: Disc
      	}
      ]
    },
    {
      path: '/singer',
      component: Singer,
      children:[
      	{
      		path: ':id',
      		component: singerDetall
      	}
      ]
    },
    {
      path: '/rank',
      component: Rank,
      children:[
      	{
      		path:':id',
      		component:topList
      	}
      ]
    },
    {
      path: '/search',
      component: Search,
      children:[
      	{
      		path:':id',
      		component: singerDetall
      	}
      ]
    },
    {
    	path:'/user',
    	component:User
    }
]
})

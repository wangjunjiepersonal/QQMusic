<template>
  <div class="singer" ref="singer">
  	<!--歌手列表组件挂载 -->
  	<list-view :data="singers" @select="selectSinger" ref="list"></list-view>
  	<!--歌手详情页路由挂载-->
  	<router-view></router-view>
  </div>
</template>

<script>
	/*
	 * 1.getSingerList 请求歌手列表数据方法
	 * 2.ERR_OK 判断请求的数据code的值 这是一个常量
	 * 3.HOT_NAME 定义的常量 存储热门数据的title
	 * 4.HOT_SIN_LEN 定义的常量 存储热门数据的长度
	 * 5.Singer 格式化歌手数据
	 * 6.listview 歌手的动画组件
	 * 7.vuex状态管理  mapMutations相当于Mutations的语法糖  同样在mothods中进行触发
	 * 8.引入mixin.js方法 优化列表底边栏高度
	 *
	 * */
	import {getSingerList} from 'api/singer.js'
	import {ERR_OK} from 'api/config.js'
	const HOT_NAME = '热门'
	const HOT_SIN_LEN = 10
	import Singer from 'common/js/singer'
	import ListView from 'base/listview/listview'
	import {mapMutations} from 'vuex'
	import {playListMixin} from 'common/js/mixin'
	
	  export default {
//	    插入mixin方法
			mixins:[playListMixin],
	  	data(){
	  		return{
	  			singers:[]
	  		}
	  	},
	  	created(){
	  		this._getSingerList()	
	  	},
	  	methods:{
		  	// mixin的方法   重新设置列表底边栏的值 调用refresh()方法重新计算高度
				handlePlayList(playList){
					const bottom = playList.length > 0 ? '60px' : ''
					this.$refs.singer.style.bottom = bottom
					this.$refs.list.refresh()
				},	
//	  		子组件触发的方法 用来处理路由跳转  传入的singer 就是每个歌手item的值 这个值也传递给了 mutations
	  		selectSinger(singer){
	  			this.$router.push({
	  				path:`/singer/${singer.id}`
	  			})
	  			this.setSinger(singer)
	  		},
	//		获取歌手列表信息 直接通过_normalizeSing 格式化之后的数据
	  		_getSingerList() {
	        getSingerList().then((res) => {
	          if (res.code === ERR_OK) {
	            this.singers = this._normalizeSinger(res.data.list)
//	            console.log(this.singers)	
	          }
	        })
	      },
//	       规范化歌手数据 传入的是this.singers map整合热门歌手数据  key整合排序歌手数据
			_normalizeSinger(list){
//			整合热门歌手 items的值遍历得到  hot是一个集合
				let map = {
					hot:{
						title:HOT_NAME,
						items:[]
					}
				}

				list.forEach((item,index)=>{
					if(index < HOT_SIN_LEN){
						map.hot.items.push(new Singer({
							id:item.Fsinger_mid,
							name:item.Fsinger_name
						}))
					}
//				整合全部歌手 		item.Findex就是那个字母排序			
					const key = item.Findex
					if(!map[key]){
						map[key] = {
							title:key,
							items:[]
						}
					}
					map[key].items.push(new Singer({
							id:item.Fsinger_mid,
							name:item.Fsinger_name
						}))
				})				
//				为了得到有序列表 我们需要处理map中key的的排序  hot 管理特闷  ret 管理正常排序
				let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }
//       对ret中的数据进行排序  这个数据就是字母排列的歌星
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
//      返回hot数组链接的ret数组 合并为一个数组
        return hot.concat(ret)
			},
//			vuex的语法糖 相当于触发mutations.js中的方法 SEI_SINGER是触发的方法
			...mapMutations({
				setSinger:'SET_SINGER'
			})
	  	},
	  	components:{
	  		ListView
	  	}
	  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 87px
    bottom: 0
    width: 100%
</style>

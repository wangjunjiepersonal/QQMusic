<template>
  <div class="rank" ref="rank">
    <scroll :data="topList" class="toplist" ref="toplist">
      <ul>
        <li @click="selectItem(item)" class="item" v-for="item in topList">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl"/>
          </div>
          <ul class="songlist">
            <li class="song" v-for="(song,index) in item.songList">
              <span>{{index + 1}}</span>
              <span>{{song.songname}}-{{song.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!topList.length">
        <loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
	/*
	 * 引入滑动动画组件 scroll
	 * 引入默认等待动画组件 loading
	 * 引入排行榜数据请求方法getTopList
	 * 引入控制请求参数的常量 ERR_OK
	 * 引入优化底边栏方法playlistMixin
	 * 引入mutations 语法糖方法 Mutations 
	 * */
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {getTopList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {playListMixin} from 'common/js/mixin'
	import {mapMutations} from 'vuex'

  export default {
    mixins: [playListMixin],
    created() {
//  	触发获取排行榜数据的方法
      this._getTopList()
    },
    data() {
      return {
//    	设置一个接收排行榜数据的默认值   控制排行是否显示
        topList: [],
        rank:true
      }
    },
    methods:{  	
//  	设置获取排行榜的数据方法
    	_getTopList(){
    		getTopList().then((res)=>{
    			if(res.code === ERR_OK){
    				this.topList = res.data.topList
    			}
    		})
    	},
    			// mixin的方法   重新设置列表底边栏的值 调用refresh()方法重新计算高度
		handlePlayList(playList){
			const bottom = playList.length ? '60px' : ''
			this.$refs.rank.style.bottom = bottom
			this.$refs.toplist.refresh()
		},
//		top-list子路由跳转
		selectItem(item){
			this.$router.push({
          path: `/rank/${item.id}`
      })
//			将组件的信息传递给vuex
			this.setTopList(item)
		},
//		设置vue的方法调用mutations中的方法
		...mapMutations({
			setTopList:'SET_TOP_LIST'
		})
		
    },
    mounted(){
    	this.$refs.toplist.refresh()
    },
    components:{
    	Scroll,
    	Loading
    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
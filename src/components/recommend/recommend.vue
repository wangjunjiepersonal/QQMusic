<template>
  <div class="recommend" ref="recommend">
    <Scroll class="recommend-content" :data="discList" ref="scroll">
    	<div>
    	<div class="slider-wrapper" v-if="recommends.length" >
    		<slider>
    			<div v-for="(item,index) in recommends" :key="index">
    				<a :href="item.linkUrl">
    					<img @load="loadImg":src="item.picUrl" alt="" />
    				</a>
    			</div>
    		</slider>
    	</div>
    	<div class="recommend-list">
    		<h1 class="list-title">热门推荐</h1>
    		<ul>
    			<li v-for="(item,index) in discList" :key="index" class="item" @click="selectItem(item)">
    				<div class="icon">
    					<img class="needclick" v-lazy="item.imgurl" alt="" width="60" height="60"/>
    				</div>
    				<div class="text">
    					<h2 class="name" v-html="item.creator.name"></h2>
    					<p class="desc" v-html="item.dissname"></p>
    				</div>
    			</li>
    		</ul>
    	</div>
    	</div>
    	<div class="loading-container" v-show="!discList.length">
    		<loading></loading>
    	</div>
    </Scroll>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
	/*
	 * 引入
	 * 	1.getRecommend 请求推荐页数据方法
	 * 		1.1getDiscList  请求歌单页数据方法
	 *  2.ERR_OK 判断请求的数据code的值 这是一个常量
	 *  3.Slider 轮播图组件
	 * 	4.Scroll 页面滑动组件
	 *  5.Loading 页面默认动画
	 * 在created中请求数据 请求数据的代码写在 methods中  在created中触发
	 * 引入mixin.js方法 优化列表底边栏高度
	 * 引入vuex中的 mutations方法  修改state中的值
	 * */
	import {getRecommend,getDiscList} from 'api/recommend.js'
	import {ERR_OK} from 'api/config.js'
	import Slider from 'base/slider/slider.vue'
	import Scroll from 'base/scroll/scroll.vue'
	import Loading from 'base/loading/loading.vue'
	import {playListMixin} from 'common/js/mixin'
	import {mapMutations} from 'vuex'
	
	export default{
//	插入mixin方法
		mixins:[playListMixin],
		data(){
			return{
				recommends:[],
				discList:[]
			}
		},
		created(){
			this._getRecommend()
			this._getDiscList()
		},
		methods:{
		// mixin的方法   重新设置列表底边栏的值 调用refresh()方法重新计算高度
				handlePlayList(playList){
					const bottom = playList.length > 0 ? '60px' : ''
					this.$refs.recommend.style.bottom = bottom
					this.$refs.scroll.refresh()
				},		
//			请求轮播图数据方法
			_getRecommend(){
				getRecommend().then((res)=>{
					if (res.code === ERR_OK) {
						this.recommends = res.data.slider
//						console.log(this.recommends)
					}
				})
			},
//			请求歌单列表数据方法
			_getDiscList() {
        getDiscList().then((res) => {
          if (res.code === ERR_OK) {
            this.discList = res.data.list
//          console.log(this.discList)
          }
        })
      },
//    判断图片是否加载完成方法  触发scroll.refresh()方法  设置一个flag标记 来执行一次逻辑就可以 不用判断多张图片
      loadImg(){
      	if (!this.checkloaded) {
      		this.$refs.scroll.refresh()
      		this.checkloaded = true
      	}
      },
//    这是热门歌曲的点击跳转路由  dissid就是歌单的id 
      selectItem(item){
      	this.$router.push({
      		path:`/recommend/${item.dissid}`		
      	})
      	this.setDisc(item)
      },
//   	 通过mapMutations将mutations的方法抽取到组件中 通过设置方法名获取到mutations方法 进行设置
      ...mapMutations({
			setDisc:'SET_DISC'
		})
		},
		components:{
			Slider,
			Scroll,
			Loading
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
<template>
	<div class="music-list">
		<div class="back" @click="back">
			<i class="icon-back"></i>
		</div>
		<h1 class="title" v-html="title"></h1>
		<div class="bg-image" :style="bgStyle" ref="bgImg">
			<div class="play-wrapper">
				<div class="play" v-show="songs.length > 0" ref="playBtn" @click="random">
					<i class="icon-play"></i>
					<span class="text">随机播放全部</span>
				</div>
			</div>
			<div class="filter" ref="filter"></div>
		</div>
		<div class="bg-layer" ref="layers"></div>
		<scroll :data="songs" 
			class="list" 
			@scroll="scroll"
			ref="list" 
			:probe-type="probeType" 
			:listenScroll="listenScroll">
			<div class="song-list-wrapper">
				<song-list :songs="songs" @select="selectItem" :rank="rank"></song-list>
			</div>
			<div class="loading-container" v-show="!songs.length">
				<loading></loading>
			</div>
		</scroll>
	</div>
</template>

<script type="text/ecmascript-6">
	/* 导入 scroll 动画组件
	 * 导入songlist 歌单列表
	 * 定义一个常量 用来控制 layer最大的滚动距离
	 * 定义一个浏览器兼容前缀方法
	 * 定义一个处理的兼容transform的便捷方法
	 * 定义一个处理的兼容backdrop的便捷方法
	 * 引入loading组件
	 * 引入 actions.js语法糖 mapActions
	 * 引入mixin.js方法 优化列表底边栏高度
 	 * */
	import Scroll from 'base/scroll/scroll.vue'
	import songList from 'base/song-list/song-list.vue'
	const RESERVED_HEI = 40
	import {prefixStyle} from 'common/js/dom.js'
	const transform  = prefixStyle('transform')
	const backdrop  = prefixStyle('backdrop')
	import Loading from 'base/loading/loading'
	import {mapActions} from 'vuex'
	import {playListMixin} from 'common/js/mixin'
	
	export default {
//		插入mixin方法
		mixins:[playListMixin],
		/*接收的参数  背景图  歌曲数组 标题 是否显示排行*/
		props:{
			bgImage:{
				type:String,
				default:''
			},
			songs:{
				type:Array,
				default:''
			},
			title:{
				type:String,
				default:''
			},
			rank:{
				type:Boolean,
				default:false
			}
		},
		data(){
			return{
				scrollY:0
			}
		},
		created(){
//			在页面创建的时候 添加两个全局变量  精致scroll的监听和滚动状态
			this.probeType = 3
			this.listenScroll = true
		},
		computed:{
			bgStyle(){
				return `background-image:url(${this.bgImage})`
			}
		},
		mounted(){
//			记录图片的高度并   设置layer滚动最大高度   为下方的歌手列表定位置
			this.imgHeight = this.$refs.bgImg.clientHeight
			this.mintranslateY = - this.imgHeight + RESERVED_HEI
			this.$refs.list.$el.style.top = `${this.imgHeight}px`
		},
		methods:{
			// mixin的方法   重新设置列表底边栏的值 调用refresh()方法重新计算高度
			handlePlayList(playList){
				const bottom = playList.length > 0 ? '60px' : ''
				this.$refs.list.$el.style.bottom = bottom
				this.$refs.list.refresh()
			},
//			滚动监听方法  在滚动的时候 把滚动的距离传递给 scrollY
			scroll(pos){
				this.scrollY = pos.y
			},
//			点击返回上一层路由
			back(){
				this.$router.back()
			},
//			子组件song-list触发的事件 当点击歌曲时派发歌曲的信息和歌曲索引
			/*
			 * 当在music中点击歌曲时 就要开始播放歌曲
			 * 这时要触发vuex中的播放控制对象 
			 * playList 歌曲的列表  点击时播放整个的歌曲列表
			 * sequenceList 播放顺序列表 
			 * currentIndex 点击歌曲的索引值
			 * fullScreen 播放器展开显示大播放器
			 * 调用 actions中写好的selectPlay方法 传入播放器的相关参数
			 * */
			selectItem(item,index){
				this.selectPlay({
					list:this.songs,
					index
				})
			},
//			点击随机播放按钮 触发player中的随机播放事件
			random(){
				console.log(1234)
				this.randomplay({
					list:this.songs
				})
			},
//			vuex中actions的语法糖 定义绑定mutation的相关参数
			...mapActions([
					'selectPlay',
					'randomplay'
				])
		},
		watch:{
//		通过watch监听滚动的距离 取最小高度和滚动高度中最大的  是屏障页$refs.layer 的滚动距离 加判断 确定滚动高度及图片的显示位置
			scrollY(newY){
				let zIndex = 0
				let scale = 1
				let blur = 0
				let translateY = Math.max(this.mintranslateY,newY)
				this.$refs.layers.style[transform] = `translate3d(0,${translateY}px,0)`
//				实现列表下拉时图片放大效果 计算出拉伸比例 然后等比例放大图片
				const percent = Math.abs(newY / this.mintranslateY)
				if(newY>0){
					scale = 1 + percent
					this.$refs.bgImg.style[transform] = `scale(${scale})`
					zIndex = 10
				}else{
					blur = Math.min(20*percent,20)
					this.$refs.filter.style[backdrop] = `blur(${blur}px)`
				}
//				如果滚动到顶部  调整图片的高度 让其高度固定为40px 
				if(newY < this.mintranslateY){
					zIndex = 10
					this.$refs.bgImg.style.paddingTop = 0
					this.$refs.bgImg.style.height = `${RESERVED_HEI}px`
					this.$refs.playBtn.style.display = "none"
				}else{
					this.$refs.bgImg.style.paddingTop = "70%"
					this.$refs.bgImg.style.height = 0 
					this.$refs.playBtn.style.display = ""
				}
				this.$refs.bgImg.style.zIndex = zIndex
			}
		},
		components:{
			Scroll,
			songList,
			Loading
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .music-list
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .title
      position: absolute
      top: 0
      left: 10%
      z-index: 40
      width: 80%
      no-wrap()
      text-align: center
      line-height: 40px
      font-size: $font-size-large
      color: $color-text
    .bg-image 
      position: relative
      width: 100%
      height: 0
      padding-top: 70%
      transform-origin: top
      background-size: cover
      .play-wrapper
        position: absolute
        bottom: 20px
        z-index: 50
        width: 100%
        .play
          box-sizing: border-box
          width: 135px
          padding: 7px 0
          margin: 0 auto
          text-align: center
          border: 1px solid $color-theme
          color: $color-theme
          border-radius: 100px
          font-size: 0
          .icon-play
            display: inline-block
            vertical-align: middle
            margin-right: 6px
            font-size: $font-size-medium-x
          .text
            display: inline-block
            vertical-align: middle
            font-size: $font-size-small
      .filter
        position: absolute
        top: 0
        left: 0
        width: 100%
        height: 100%
        background: rgba(7, 17, 27, 0.4)
    .bg-layer
      position: relative
      height: 100%
      background: $color-background
    .list
      position: fixed
      top: 0
      bottom: 0
      width: 100%
      background: $color-background
      .song-list-wrapper
        padding: 20px 30px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
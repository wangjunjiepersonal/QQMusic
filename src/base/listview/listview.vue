<template>
  <scroll class="listview" 
  	:data="data" 
  	ref="listview" 
  	@scroll="scroll"
  	:probeType="probeType"
  	:listenScroll="listenScroll">
  	<ul>
  		<li v-for="(group,index) in data" class="list-group" :key="index" ref="listGroup">
  			<h2 class="list-group-title">{{group.title}}</h2>
  			<ul>
  				<li v-for="(item,index) in group.items" 
  					class="list-group-item" 
  					:key="index" 
  					@click="selectItem(item)">
  					<img v-lazy="item.avatar" alt="" class="avatar"/>
  					<span class="name">{{item.name}}</span>
  				</li>
  			</ul>
  		</li>
  	</ul>
  	<div class="list-shortcut" 
  		@touchmove.stop.prevent="onShortcutTouchmove"
  		@touchstart="onShortcutTouchStart">
  		<ul>
  			<li v-for="(item,index) in shortcutList" 
  				class="item" 
  				:class="{'current':currentIndex === index}"
  				:key="index" 
  				:data-index="index">{{item}}</li>
  		</ul>
  	</div>
  	<div class="list-fixed" v-show="fixedTitle" ref="fixed">
  		<h1 class="fixed-title">{{fixedTitle}}</h1>
  	</div>
  	<div class="loading-container" v-show="!data.length">
  		<loading></loading>
  	</div>
  </scroll>
</template>

<script type="text/ecmascript-6">
	/*
	 * 组件为开发歌手信息滑动组件
	 * 引入滑动动画组件scroll.vue 并传入动态值data 意思为当传递过来值之后触发scroll自动计算高度
	 * */
  import Scroll from 'base/scroll/scroll.vue'
  import {getData} from 'common/js/dom.js'
  const ANCHOR_HEI = 18
  const TITLE_HEI = 30
  import Loading from 'base/loading/loading.vue'
   
  export default {
  	props:{
  		data:{
  			type:Array,
  			default:[]
  		}
  		
  	},
  	data(){
  			return{
  				//维护pos监测的 纵坐标值  当前显示的索引值    字母区域集合的上限和固定显示字母区域滚动的差值
					scrollY : -1,
					currentIndex : 0,
					diff:-1
  			}
  	},
  	created(){
//		设置一个可以方法全局获取到的空对象  第二个值 监听滚动事件  第三个值group的默认高度  第四个是控制 scroll的实时滚动监听
  		this.touch = {}
  		this.listenScroll = true
  		this.listHeight = []
  		this.probeType = 3
  	},
  	computed:{
//		计算属性 计算右侧列表
			shortcutList(){
				return this.data.map((group)=>{
					return group.title.substr(0,1)
				})
			},
//			计算字母区域集合(group)索引的内容
			fixedTitle(){
				if(this.scrollY>0){return ''}
				return this.data[this.currentIndex]?this.data[this.currentIndex].title:''
			}
  	},
  	methods:{
		/*
		 * 右侧手指滑动事件  要通过event获取手指的距离 还要获取当前元素的index索引
		 * 通过getData（）获取当前元素的index值 通过触摸右侧元素的索引让左侧元素滚动到指定的位置
		 * $refs.listview 找到的是 scroll
		 * $refs.listGroup 找到的是 每个 字母li元素的区块
		 * 通过scrollToElement 滚动到
		 * */		
  		onShortcutTouchStart(e){
  			let anchorIndex = getData(e.target,'index')
//			按下时手指的位置  通过全局方法 touch来获取Y轴的值
  			let firstTouch = e.touches[0]
  			this.touch.y1 = firstTouch.pageY
//			通过全局对象 touch 记录当前点击元素的锚点值 就是索引值 通过点击直接跳到指定位置
  			this.touch.anchorIndex = anchorIndex
  			this._scrollTo(anchorIndex)
  		},
  		/*
  		 * 右侧手指滑动事件 通过滑动右侧元素让左侧元素滑动到预定位置
  		 * 计算初始位置和结束位置的差值 计算滑动距离
  		 * 重新指定anchorIndex 的值  这个值的是歌手元素的索引
  		 * */
  		onShortcutTouchmove(e){
//			在滑动时获取按下时手指的位置  二者相减 获取移动的距离 /单个的高度算出移动了几个元素
  			let firstTouch = e.touches[0]
  			this.touch.y2 = firstTouch.pageY
  			let delta = (this.touch.y2 - this.touch.y1)/ANCHOR_HEI | 0 
  			let anchorIndex = parseInt(this.touch.anchorIndex) + delta 
  			this._scrollTo(anchorIndex)
  		},
//		scroll子组件触发的监听scroll方法 pos是传过来的值
  		scroll(pos){
  			this.scrollY = pos.y
  		},
//		派发方法 向父组件singer派发值  值是每个item元素
  		selectItem(item){
  			this.$emit('select',item)
  		},
//		封装通过scrollTo移动到指定位置的scroll方法    还有就是更新scrollY的高度  以及点击和滑动的边界问题
  		_scrollTo(index){
  			if(!index && index !== 0){return}
  			if(index < 0){
  				index = 0
  			}else if(index > this.listHeight-2){
  				index = this.listHeight-2
  			}
  			this.scrollY = -this.listHeight[index]
  			this.$refs.listview.scrollToElement(this.$refs.listGroup[index],0)
  		},
//		计算左侧每个字母元素集合的高度  group的高度 获取所有的Group高度添加到listHeight数组
  		_calculateHeight(){
  			this.listHeight = []
  			const list = this.$refs.listGroup 			
  			let height = 0
  			this.listHeight.push(height)
  			for(let i = 0;i<list.length;i++){
  				let item = list[i]
  				height += item.clientHeight
  				this.listHeight.push(height)
  			}
  		},
//		向singer暴露接口 
  		refresh(){
  			this.$refs.listview.refresh()
  		}
  	},
  	watch:{
//		监控data的值是否变化 变化之后
  		data(){
  			setTimeout(()=>{
  				this._calculateHeight()
  			},20)
  		},
//		监控scroll滚动的高度
  		scrollY(newY){
//			判断当前坐标在listHeight的哪个区间
  			const listHeight = this.listHeight
//			情况1 当 滚动到顶部 newY > 0 
				if(newY>0){
					this.currentIndex = 0 
					return
				}
//				在中间部分 滚动
  			for(let i = 0;i<listHeight.length;i++){
  				let height1 = listHeight[i]
  				let height2 = listHeight[i+1]
//				如果坐标落在了当前的区间内
  				if(!height2 || (-newY >= height1 && -newY < height2)){
  					this.currentIndex = i
  					this.diff = height2 + newY
  					return 
  				}
  			}
//			当滚动到底部 -newY大于最后一个的元素的上限 意思就是不再滚动
  			this.currentIndex = listHeight - 2
  		},
//		计算顶部固定栏和字母集合区域高度的差值
  		diff(newval){
  			let fixedTop = (newval > 0 && newval < TITLE_HEI) ? newval - TITLE_HEI : 0
  			if(this.fixedTop === fixedTop){return}
  			this.fixedTop = fixedTop 
  			this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
  		}
  	},
  	components:{
  		Scroll,
  		Loading
  	}
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

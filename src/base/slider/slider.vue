<template>
  <div class="slider" ref="slider">
    <div class="slider-group" ref="sliderGroup">
    	<!--slot插槽  当父元素使用时 可以在子元素的slot插槽中插入文字代码等内容-->
      <slot>
      </slot>
    </div>
    <div class="dots">
      <span class="dot" v-for="(item,index) in dots" 
      	:class="{active:currentPageIndex === index}" 
      	:key="index"></span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
	/*
	 * 轮播图组件
	 * 功能 
	 * 	循环轮播  布尔值
	 *  自动轮播  布尔值
	 * 	轮播间隔  数字
	 * 实现
	 * 	通过better-scorll实现轮播
	 *  初始化better-scroll 绑定到dom中
	 *  默认通过mounted钩子函数初始化
	 *  	为保证dom成功渲染 加个定时器
	 * 		在mothods中初始化better-srcoll
	 * 		由于轮播图是横向滚动 所以需要设置宽度 如果是竖向则不用设置
	 *  better-scroll 在滚动完一张会派发事件  表示当前滚动的是第几个元素
	 * */
	import BScroll from 'better-scroll'
	import {addClass} from 'common/js/dom.js'

	
 	export default {
 		props:{
 			loop: {
        type:Boolean,
        default: true
      },
 			autoPlay:{
 				type:Boolean,
 				default:true
 			},
 			interval:{
 				type:Number,
 				default:1000
 			}
 		},
 		data(){
 			return{
// 				两个参数 第一个是下方的小圆点
// 				第二个是默认的初始位置
				dots:[],
				currentPageIndex:0
 			}
 		},
 		mounted(){
       setTimeout(()=>{
	       	this._setSliderWidth()
	       	this._initDots()
	       	this._initSlider()
	       	if(this.autoPlay){
	       		this._play()
	       	}
       },20)
//     设置一个窗口改变事件 监听窗口的大小变化
				window.addEventListener('resize',function(){
					if(!this.slider){
						return
					}
//				重新调用计算宽度的属性 但要去掉重新增加两个宽度的 this.loop
//				重新计算slider的值
					this._setSliderWidth(true)
					this.slider.refresh()
				})
 		},
// 		在页面关闭时清除定时器
 		destroyed(){
 			clearTimeout(timer)
 		},
 		methods:{
// 			获取轮播图区域的宽度  获取当前dom的所有子元素 获取到当前dom的宽度 为单独的每个子元素添加样式类
 			_setSliderWidth(isResize) {
        this.children = this.$refs.sliderGroup.children
        let width = 0
        let sliderWidth = this.$refs.slider.clientWidth
        for (let i = 0; i < this.children.length; i++) {
          let child = this.children[i]
          addClass(child, 'slider-item')
          child.style.width = sliderWidth + 'px'
          width += sliderWidth
        }
        if (this.loop && !isResize) {
          width += 2 * sliderWidth
        }
        this.$refs.sliderGroup.style.width = width + 'px'
      },
      _initDots(){ 
				this.dots = new Array( this.children.length )
			},
// 			初始化slider  意思就是给slider绑定better-scroll样式  横向滚动  禁止惯性  snap 提前为false 循环滚动为true
//				后续better-scroll的 API改变 要将三个参数存储在snap中
			_initSlider(){
				this.slider = new BScroll(this.$refs.slider,{
					scrollX: true,
					scroolY: false,
					momentum: false, //惯性
//					2018/11/28更新 snap设置为对象 里面包含loop方法
					snap: {
						loop: this.loop,
						threshold: 0.3,
						snapSpeed: 400
					}
				})
				this.slider.on('scrollEnd',()=>{
					let pageIndex = this.slider.getCurrentPage().pageX
					
//					2018/11/28更新  this.loop时pageIndex的值不变 不用再减1  
//					if(this.loop){
//						pageIndex -= 1
//					}
					this.currentPageIndex = pageIndex
//					在监听了当前的索引后  翻页时除去之前的定时器重新定义定时器
					if(this.autoPlay){
						clearTimeout(this.timer)
						this._play()
					}
				})
			},
//			自动播放功能功能
			_play(){
				let pageIndex = this.currentPageIndex
//			2018/11/28更新  this.loop时pageIndex的值不变 不用再减1  
					if(this.loop){
						pageIndex +=1
						if(pageIndex ==5){
							pageIndex = 0
						}
					}
					this.timer = setTimeout(()=>{
						this.slider.goToPage(pageIndex,0,400)
					},this.interval)
			}
			 //初始化圆点
			
 		}
 	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
<template>
	<div ref="wrapper">
		<slot></slot>
	</div>
</template>

<script>
	/*
	 * 封装一个滑动列表组件 用来完成部分区域的滑动效果
	 * 组件内只设置slot标签  具体参数通过父组件引用时传入 
	 * 可以传入文本 标签等内容
	 * 传入的标签
	 * probeType 滚动的状态监听\
	 * click     是否可以点击
	 * data      数据   控制动态变化 控制是否可以重新刷新better-scroll是否重新计算宽高
	 * listenScroll  是否监听滚动事件
	 * pullup        是否进行下拉刷新
	 * beforescroll  是否收起键盘
	 * refreshDelay  指定时间让scroll重新计算高度
	 * */
	import BScroll from 'better-scroll'
	export default {
		props:{
			probeType:{
				type:Number,
				default:1
			},
			click:{
				type:Boolean,
				default:true
			},
			data:{
				type:Array,
				default:null
			},
			listenScroll :{
				type:Boolean,
				default:false 
			},
			pullup:{
				type:Boolean,
				default:false
			},
			beforescroll:{
				type:Boolean,
				default:false
			},
			refreshDelay:{
				type:Number,
				default:200
			}
		},
		data(){
			return{

			}
		},
		mounted(){
			setTimeout(()=>{
				this._initScroll()
			},20)
		},
		methods:{
//			初始化better-scroll的方法  以下简称为 scroll
			_initScroll(){
				if(!this.$refs.wrapper){
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper,{
					probeType:this.probeType,
					click :this.click
				})
//				是否监听滚动 会通过on 监听滚动  pos 获取滚动位置  通过 vueMe保存 vue的this  
//				这个方法通过父组件触发 并获得pos的横纵坐标位置
				if(this.listenScroll){
					let vueMe = this
					this.scroll.on('scroll',(pos)=>{
						vueMe.$emit('scroll',pos)
					})
				}
//				通过scroll监听滚动结束事件scrollEnd 如果滚动到底部
				if(this.pullup){
					this.scroll.on('scrollEnd',()=>{
						if(this.scroll.y <= this.scroll.maxScrollY + 50){
							this.$emit('scrollToEnd')
						}
					})
				}
//				通过scroll监听beforescroll 如果滚动则让输入框失去焦点
				if(this.beforescroll){
					this.scroll.on('beforescroll',()=>{
						if(this.scroll.y <= this.scroll.maxScrollY + 50){
							this.$emit('beforescroll')
						}
					})
				}
			},
			enable(){
				this.scroll && this.scroll.enable()
			},
			disable(){
				this.scroll && this.scroll.disable()
			},
//			是否刷新scroll方法  重新计算高度
			refresh(){
				this.scroll && this.scroll.refresh()
			},
//			滚动到指定位置的方法  this.scroll 指向的是 better-scroll实例
//			scrollTo会接收参数 接收的就是滚动的位置 通过apply冒充this.scroll 通过arguments可以获取滚动参数
			scrollTo(){
				this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments)
			},
//			也是滚动方法  滚动到某个地方
			scrollToElement(){
				this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments)
			}
		},
//		通过watch监控data的变化 如果控制刷新srcoll宽高的data发生变化 重新计算宽高
		watch:{
			data(){
				this.refresh()
			}
		}
	}
</script>

<style>
</style>
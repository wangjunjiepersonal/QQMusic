<template>
  <transition name="drop">
    <div class="top-tip" v-show="showFlag" @click.stop="hide">
      <slot></slot>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
	/*
	 * 顶部的弹出提示框组件  通过插槽渲染内容
	 * 接收一个值 是定时计的时间  指的是消失的时间
	 * 
	 * */
  export default {
    props: {
      delay: {
        type: Number,
        default: 2000
      }
    },
    data() {
      return {
//    	控制显示隐藏
        showFlag: false
      }
    },
    methods: {
//  	显示该组件  设置定时器 在 指定时间之后调用隐藏事件hide()
      show() {
        this.showFlag = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.hide()
        }, this.delay)
      },
//    隐藏该组件
      hide() {
        this.showFlag = false
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .top-tip
    position: fixed
    top: 0
    width: 100%
    z-index: 500
    background: $color-dialog-background
    &.drop-enter-active, &.drop-leave-active
      transition: all 0.3s
    &.drop-enter, &.drop-leave-to
      transform: translate3d(0, -100%, 0)
</style>
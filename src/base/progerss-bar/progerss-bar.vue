<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart="progressTouchStart"
           @touchmove="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
	/*
	 * 引入解决css3浏览器兼容性处理方法 {prefixStyle}
	 * 定义小球宽度的常量   = 16
	 * 将transform通过css3浏览器兼容性处理方法 {prefixStyle} 进行处理
	 * */
  import {prefixStyle} from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')

  export default {
//	接收参数  参数是时间比例
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
	/*
	 * 管理touch对象之间的数据通信进行交互使用
	 * touch.initiated  点击时表示初始化完成 
	 * touch.startX     点击时的横向坐标
	 * touch.left       点击时进度条的宽度
	 * */    	
      this.touch = {}
    },
    methods: {
//  	移动端点击事件
      progressTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
//    移动端滑动事件
      progressTouchMove(e) {
//    	不能直接进入move滑动事件
        if (!this.touch.initiated) {
          return
        }
//      获得滑动时相当于初始坐标的偏移距离
        const deltaX = e.touches[0].pageX - this.touch.startX
//      控制拖动的距离  这个距离= 进度条的宽度 + 滑动时相当于初始坐标的偏移距离 限制在 总进度条的宽度范围之内 意思就是滑出总进度条的不算
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd() {
//    	重置点击初始化标识  表示本次点击结束  调用传递给父组件的方法_triggerPercent()
        this.touch.initiated = false
        this._triggerPercent()
      },
//    进度条点击事件      
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        // 这里当我们点击 progressBtn 的时候，e.offsetX 获取不对
        // this._offset(e.offsetX)
        this._triggerPercent()
      },
//    计算出拖动的距离进度传递给player父组件 让父组件修改歌曲进度
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        this.$emit('percentChange', percent)
      },
//    统一处理进度条和小球的偏移距离
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
      }
    },
    watch: {
//  	实时监控传入的值是否有变化并且没有在拖动中时   计算当前按钮的偏移距离 = 传入的时间*（总长度-小球宽度）
      percent(newPercent) {
        if (newPercent >= 0 && !this.touch.initiated) {
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = newPercent * barWidth
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
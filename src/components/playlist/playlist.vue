<template>
  <transition name="list-fade">
    <div class="playlist" @click="hide" v-show="showFlag">
    	<!--歌曲列表添加区域-->
      <div class="list-wrapper" @click.stop>
      	<!--头部区域-->
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="iconMode" @click="changeMode"></i>
            <span class="text">{{modeText}}</span>
            <span class="clear" @click="showConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <!--中部列表区域-->
        <!--//	transition-group 列表过渡效果-->
        <scroll ref="listContent" :data="sequenceList" class="list-content" :refreshDelay="refreshDelay">
          <transition-group name="list" tag="ul">
            <li :key="item.id" ref="listItem" class="item" v-for="(item,index) in sequenceList"
                @click="selectItem(item,index)">
              <i class="current" :class="getCurrentIcon(item)"></i>
              <span class="text">{{item.name}}</span>
              <span @click.stop="toggleFavorite(item)" class="like">
                <i :class="getFavoriteIcon(item)"></i>
              </span>
              <span @click.stop="deleteOne(item)" class="delete">
                <i class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <!--添加歌曲列表点击区域-->
        <div class="list-operate">
          <div @click="addSong" class="add">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div @click="hide" class="list-close">
          <span>关闭</span>
        </div>
      </div>
      <confirm ref="confirm" @confirm="confirmClear" text="是否清空播放列表" confirmBtnText="清空"></confirm>
      <add-song ref="addSong"></add-song>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
	/*
	 * 导入getter映射组件 获取到sequenceList数组 映射到页面中
	 * 导入mutations.js的 SET_CURRENT_INDEX 方法 控制索引
	 * 导入scroll动画组件 使sequenceList数组 映射的dom能够滑动
	 * 导入playMode播放模式js方法 获取当前播放的模式
	 * 导入mapActions 方法 导入其中的deleteSong方法
	 * 导入弹窗确认组件 Confirm 用来拦截用户的操作
	 * 导入控制播放模式方法playMode
	 * 导入存储公共方法的mixin方法
	 * 导入添加列表歌曲AddSong组件 
	 * */
	  import {mapActions,mapMutations} from 'vuex'  
	  import Scroll from 'base/scroll/scroll'
//  import {} from 'vuex'
	  import Confirm from 'base/confirm/confirm'
    import {playMode} from 'common/js/config'
    import {playerMixin} from 'common/js/mixin'
    import AddSong from 'components/add-song/add-song'
    

  export default {
//	导入mixins方法
    mixins: [playerMixin],
    data() {
      return {
      	// 第一个值 控制添加列表的显示隐藏  第二个值 控制scroll重新计算列表的时间
        showFlag: false,
        refreshDelay: 120
      }
    },
    created(){
    },
    computed: {
//  	获取到音乐播放顺序列表 sequenceList  遍历sequenceList到歌曲列表中 currentSong 当前播放歌曲
//  	...mapGetters([
//  		'sequenceList',
//  		'currentSong',
//  		'playList',
//  		'mode'
//  	])
//	    匹配播放顺序显示的文字
      modeText() {
        return this.mode === playMode.sequence ? '顺序播放' : this.mode === playMode.random ? '随机播放' : '单曲循环'
      }
    },
    methods: {
//  	显示该界面调用的方法 当页面展示时 重新计算scroll的高度
      show() {
        this.showFlag = true
        setTimeout(() => {
//      	在列表组件刚显示时 让scroll重新计算高度 通过scrollToCurrent()方法跳转到当前歌曲的位置
          this.$refs.listContent.refresh()
          this.scrollToCurrent(this.currentSong)
        }, 20)
      },
//    隐藏改界面调用的方法
      hide() {
        this.showFlag = false
      },
//    点击显示弹出层 是删除时的操作
      showConfirm() {
        this.$refs.confirm.show()
      },
//    清空添加列表  然后隐藏弹出层 是删除时的操作
      confirmClear() {
        this.deleteSongList()
        this.hide()
      },
//    给当前播放的歌曲添加类样式 表示正在播放  歌曲的id等于播放歌曲的id 添加类样式
      getCurrentIcon(item) {
        if (this.currentSong.id === item.id) {
          return 'icon-play'
        }
        return ''
      },
//    点击其他歌曲时 要给当前歌曲添加类样式 传入两个值 item当前的歌曲项  index歌曲的索引 
//	  判断播放模式 如果歌曲是顺序播放 传入索引 如果是随机播放 找到playlist歌曲的id对应到的当前歌曲id 传递给SET_CURRENT_INDEX方法
      selectItem(item, index) {
      	console.log(this.playList)
        if (this.mode === playMode.random) {
        	
          index = this.playList.findIndex((song) => {
            return song.id === item.id
          })
        }
//      传入当前歌曲的id 并让其处于播放状态
        this.setCurrentIndex(index)
        this.setPlayingState(true)
      },
      //在打开页面时 让当前播放的歌曲保持第一位 找到sequenceList数组中当前播放的歌曲项
      scrollToCurrent(current) {
//    	console.log(this.sequenceList)
        const index = this.sequenceList.findIndex((song) => {
          return current.id === song.id
        })
//      通过scroll组件的scrollToElement方法滚动到 当前拥有歌曲索引的li标签位置
        this.$refs.listContent.scrollToElement(this.$refs.listItem[index], 300)
      },
//    删除播放列表的某一个歌曲元素 如果没有歌曲列表 隐藏添加列表
      deleteOne(item) {
        this.deleteSong(item)
        if (!this.playList.length) {
          this.hide()
        }
        
      },
//    点击开启歌曲添加组件显示
      addSong() {
        this.$refs.addSong.show()
      },
      ...mapActions([
        'deleteSong',
        'deleteSongList'
      ]),
//    导入mutations.js的SET_CURRENT_INDEX方法 控制歌曲索引
      ...mapMutations({
      	'setCurrentIndex':'SET_CURRENT_INDEX',
      	'setPlayingState':'SET_PLAYING_STATE'
      })
    },
    watch: {
//  	当切换歌曲时  如果组件不显示或者歌曲 id 相等 什么都不做 如果切换了歌曲 将切换的歌曲传递给scrollToCurrent方法
      currentSong(newSong, oldSong) {
        if (!this.showFlag || newSong.id === oldSong.id) {
          return
        }
        this.scrollToCurrent(newSong)
      }
    },
    components: {
      Scroll,
      Confirm,
      AddSong
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
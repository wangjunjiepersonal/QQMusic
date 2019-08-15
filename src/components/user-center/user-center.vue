<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back">
        <i class="icon-back"></i>
      </div>
      <!--顶部的tab切换栏区域-->
      <div class="switches-wrapper">
        <switches @switch="switchItem" :switches="switches" :currentIndex="currentIndex"></switches>
      </div>
      <!--随机播放区域-->
      <div ref="playBtn" class="play-btn" @click="random">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <!--播放列表区域-->
      <div class="list-wrapper" ref="listWrapper">
        <scroll ref="favoriteList" class="list-scroll" v-if="currentIndex===0" :data="favoriteList">
          <div class="list-inner">
            <song-list :songs="favoriteList" @select="selectSong"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" class="list-scroll" v-if="currentIndex===1" :data="playHistory">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="selectSong"></song-list>
          </div>
        </scroll>
      </div>
      <!--暂无信息区域-->
      <div class="no-result-wrapper" v-show="noResult">
        <no-result :title="noResultDesc"></no-result>
      </div>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
	/*
	 * 导入顶部tab切换栏区域
	 * 导入scroll滚动动画组件
	 * 导入歌曲列表渲染组件song-list
	 * 导入getters 和  actions 方法
	 * 导入NoResult页面无显示内容时展示no-result组件
	 * 导入song 方法 格式化从
	 * */
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import SongList from 'base/song-list/song-list'
  import {mapGetters, mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'
  import Song from 'common/js/song'
  import {playListMixin} from 'common/js/mixin'
  export default {
    mixins: [playListMixin],
    data() {
      return {
      	// 定义管理tab切换栏的默认值 第一个是显示的当前高亮栏目索引值 第二个是tab栏的文字内容
        currentIndex: 0,
        switches: [
          {
            name: '我喜欢的'
          },
          {
            name: '最近听的'
          }
        ]
      }
    },
    computed: {
//  	计算方法 如果tab的索引为0 意思就是在哪个按钮就判断当前按钮下列表有没有内容 没有内容展示 暂无内容组件的内容
      noResult() {
        if (this.currentIndex === 0) {
          return !this.favoriteList.length
        } else {
          return !this.playHistory.length
        }
      },
//    计算方法 如果在tab的索引为0 意思就是在第一个按钮或者第二个按钮 返回相应的文字内容展示
      noResultDesc() {
        if (this.currentIndex === 0) {
          return '暂无收藏歌曲'
        } else {
          return '你还没有听过歌曲'
        }
      },
//    通过getters将方法映射到组件
      ...mapGetters([
        'favoriteList',
        'playHistory'
      ])
    },
    methods: {
//	     记录图片的高度并   设置layer滚动最大高度   为下方的歌曲列表定位置  控制播放列表的高度 控制收藏列表的高度 重新计算歌曲类别高度
      handlePlaylist(playlist) {
        const bottom = playlist.length > 0 ? '60px' : ''
        this.$refs.listWrapper.style.bottom = bottom
        this.$refs.favoriteList && this.$refs.favoriteList.refresh()
        this.$refs.playList && this.$refs.playList.refresh()
      },
//    tab栏切换时切换高亮栏目 这个是tab切换栏传过来的事件
      switchItem(index) {
        this.currentIndex = index
      },
//    插入歌曲
      selectSong(song) {
        this.insertSong(new Song(song))
      },
//    点击回退上一级
      back() {
        this.$router.back()
      },
//    随机播放按钮事件  如果列表没有歌曲 返回不进行操作
      random() {
        let list = this.currentIndex === 0 ? this.favoriteList : this.playHistory
        if (list.length === 0) {
          return
        }
//      通过map格式化song song就是单个歌曲
        list = list.map((song) => {
          return new Song(song)
        })
//      随机list歌曲的列表
        this.randomPlay({
          list
        })
      },
      ...mapActions([
        'insertSong',
        'randomPlay'
      ])
    },
    components: {
      Switches,
      Scroll,
      SongList,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
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
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
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
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
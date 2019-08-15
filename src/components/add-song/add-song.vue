<template>
  <transition name="slide">
    <div class="add-song" v-show="showFlag" @click.stop>
    	<!--头部展示区域 固定的-->
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="hide">
          <i class="icon-close"></i>
        </div>
      </div>
      <!--输入框展示区域-->
      <div class="search-box-wrapper">
        <search-box ref="searchBox" @query="onQueryChange" placeholder="搜索歌曲"></search-box>
      </div>
      <!--tab切换栏展示区域-->
      <div class="shortcut" v-show="!query">
        <switches :switches="switches" :currentIndex="currentIndex" @switch="switchItem"></switches>
        <div class="list-wrapper">
        	<!--第一个切换栏区域 播放历史列表-->
          <scroll ref="songList" v-if="currentIndex===0" class="list-scroll" :data="playHistory">
            <div class="list-inner">
              <song-list :songs="playHistory" @select="selectSong">
              </song-list>
            </div>
          </scroll>
          <!--第二个切换栏区域 搜索记录列表--> 
          <scroll :refreshDelay="refreshDelay" ref="searchList" v-if="currentIndex===1" class="list-scroll"
                  :data="searchHistory">
            <div class="list-inner">
              <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <!--搜索结果展示-->
      <div class="search-result" v-show="query">
        <suggest :query="query" :showSinger="showSinger" @select="selectSuggest" @listScroll="blurInput"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
	/*
	 * 导入输入框组件search-box 用来实现输入框区域展示
	 * 导入搜索框搜索结果展示组件suggest 用来展示搜索框的搜索内容
	 * 导入mixin中存在的公共方法
	 * 导入tab切换组件switches 切换最近播放和历史记录
	 * 导入scroll列表滚动组件 实现列表滚动动画
	 * 导入getter语法糖 映射playHistory 导入mapActions语法糖 导入方法 insertSong()
	 * 导入song-list组件 渲染歌曲的播放历史
	 * 导入 Song类方法 格式化 song
	 * 导入搜索历史组件search-list
	 * 导入添加歌曲提示组件 top-tip
	 * */
  import SearchBox from 'base/search-box/search-box'
  import Suggest from 'components/suggest/suggest'
  import {searchMixin} from 'common/js/mixin'
  import Switches from 'base/switches/switches'
  import Scroll from 'base/scroll/scroll'
  import {mapGetters, mapActions} from 'vuex'
  import SongList from 'base/song-list/song-list'
  import Song from 'common/js/song'
  import SearchList from 'base/search-list/search-list'
  import TopTip from 'base/top-tip/top-tip'

  export default {
    mixins: [searchMixin],
    data() {
      return {
//    	控制显示隐藏按钮 控制不搜索歌手 控制tab切换组件的高亮索引   控制tab切换组件的文字展示 
        showFlag: false,
        showSinger: false,
        currentIndex: 0,
        songs: [],
        switches: [
          {
            name: '最近播放'
          },
          {
            name: '搜索历史'
          }
        ]
      }
    },
    computed: {
//  	通过getter语法糖将 playHistory映射到组件中
      ...mapGetters([
        'playHistory'
      ])
    },
    methods: {
//  	组件显示事件 在点击添加歌曲后 组件显示后 重新计算scroll的高度让其可以滚动
      show() {
        this.showFlag = true
        setTimeout(() => {
          if (this.currentIndex === 0) {
            this.$refs.songList.refresh()
          } else {
            this.$refs.searchList.refresh()
          }
        }, 20)
      },
//    组件隐藏事件 在点击关闭按钮后 组件隐藏      
      hide() {
        this.showFlag = false
      },
//    在点击了播放历史的歌曲时 将歌曲添加到播放列表中 触发的是 actions中的insertSong方法
//    由于获取的是localstorage中的方法 所以需要通过new Song()进行实例化后使用
//    打开顶部添加歌曲的提示框topTip组件
      selectSong(song, index) {
        if (index !== 0) {
          this.insertSong(new Song(song))
          this.$refs.topTip.show()
        }
      },
//    记录搜索的结果 将来用于添加到搜索记录中
      selectSuggest() {
        this.$refs.topTip.show()
        this.saveSearch()
      },
//    切换tab组件的高亮显示按钮 点击哪个哪个高亮
      switchItem(index) {
        this.currentIndex = index
      },
      ...mapActions([
        'insertSong'
      ])
    },
    components: {
      SearchBox,
      SongList,
      SearchList,
      Scroll,
      Switches,
      TopTip,
      Suggest
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
comoonent<template>
  <div class="search">
    <div class="search-box-wrapper">
    	<!--搜索框区域-->
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!--搜索相关区域-->
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <scroll :refreshDelay="refreshDelay" ref="shortcut" class="shortcut" :data="shortcut">
        <div>
        	<!--热门搜索区域-->
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <!--搜索历史区域-->
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span @click="showConfirm" class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @delete="deleteSearchHistory" @select="addQuery" :searches="searchHistory"></search-list>
          </div>
        </div>
      </scroll>
    </div>
    <!--返回搜索列表区域-->
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest @listScroll="blurInput" @select="saveSearch" ref="suggest" :query="query"></suggest>
    </div>
    <confirm ref="confirm" @confirm="clearSearchHistory" text="是否清空所有搜索历史" confirmBtnText="清空"></confirm>
    <router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
	/*
	 * 引入搜索页面搜索框                   SearchBox
	 * 引入搜索相关数据请求方法        getHotKey
	 * 引入控制请求数据参数               ERR_OK
	 * 引入搜索列表组件                      Suggest 
	 * 引入vuex中的actions    mapActions
	 * 引入渲染搜索历史组件               SearchList
	 * 引入滚动动画组件                       Scroll
	 * 引入弹窗提示组件                      Confirm
	 * 引入小播放器自适应高度方法   playlistMixin         
	 * */
  import SearchBox from 'base/search-box/search-box'
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'
  import Suggest from 'components/suggest/suggest'
  import {mapActions} from 'vuex'
  import SearchList from 'base/search-list/search-list'
  import Scroll from 'base/scroll/scroll'
  import Confirm from 'base/confirm/confirm'
  import {playListMixin, searchMixin} from 'common/js/mixin'
  

  export default {
    mixins: [playListMixin, searchMixin],
    data() {
      return {
//    	接收搜索相关数据的默认值
        hotKey: []
      }
    },
    computed: {
//  	这个值触发scroll的滚动事件  就是传给scroll中的data 让scroll实时计算高度实现滚动
      shortcut() {
        return this.hotKey.concat(this.searchHistory)
      }
    },
    created() {
//  	触发获取相关推荐数据方法
      this._getHotKey()
    },
    methods: {
    	// mixin的方法   重新设置列表底边栏的值 调用refresh()方法重新计算高度  
//  	计算了搜索列表区域的高度 搜索相关区域的高度  
      handlePlaylist(playlist) {
        const bottom = playList.length > 0 ? '60px' : ''
        this.$refs.searchResult.style.bottom = bottom
        this.$refs.suggest.refresh()
        this.$refs.shortcutWrapper.style.bottom = bottom
        this.$refs.shortcut.refresh()
      },
//    控制弹窗的显示  这里是找到弹窗的组件触发其身上的show方法
      showConfirm() {
        this.$refs.confirm.show()
      },
//    设置请求相关推荐数据方法
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
//    将actions中的clearSearchHistory方法映射到组件中
//    如果只是单独的调用actions中的方法 可以直接引用actions中的方法  这里引用的是clearSearchHistory
      ...mapActions([
        'clearSearchHistory'
      ])
    },
    watch: {
//  监控query的变化 如果搜索列表发生了变化 重新通过scroll计算高度 实现滚动
      query(newQuery) {
        if (!newQuery) {
          setTimeout(() => {
            this.$refs.shortcut.refresh()
          }, 20)
        }
      }
    },
    components: {
      SearchBox,
      SearchList,
      Scroll,
      Confirm,
      Suggest
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>
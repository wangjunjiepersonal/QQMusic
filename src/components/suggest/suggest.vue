<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
          :beforeScroll="beforeScroll"
          @scrollToEnd="searchMore"
          @beforeScroll="listScroll"
  >
    <ul class="suggest-list">
      <li @click="selectItem(item)" class="suggest-item" v-for="item in result">
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <!--无搜索结果展示的区域-->
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
	/*
	 * search方法               请求输入框输入数据后服务端返回的检索数据
	 * ERR_OK常量              控制请求数据的参数
	 * TYPE_SINGER常量 区分该条数据是歌曲还是歌手
	 * createSong方法   过滤歌手和歌曲信息
	 * Scroll 组件           使区域滑动
	 * Loading组件           默认加载动画
	 * perpage常量           控制每页的个数
	 * mapMutations, mapActions  axios方法  引用mutations actions 中的方法
	 * NoResult      当没有搜索结果展示时展示的组件
	 * */
  import {search} from 'api/search'
  import {ERR_OK} from 'api/config'
  const TYPE_SINGER = 'singer'
  import {formatterSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  const perpage = 20
  import {mapMutations, mapActions} from 'vuex'
  import NoResult from 'base/no-result/no-result'
  import Singer from 'common/js/singer'

  export default {
  	/*
  	 * showSinger  是否请求歌手信息 
  	 * query       父组件传递进来的检索词 作出相应检索
  	 * */
    props: {
      showSinger: {
        type: Boolean,
        default: true
      },
      query: {
        type: String,
        default: ''
      }
    },
    data() {
    	/*
    	 * 接收请求返回信息默认值  result
    	 * 请求的页数  page
    	 * 是否实现下拉刷新  pullup
    	 * 标识位是否搜索更多  hasMore
    	 * 设置滚动键盘弹起     beforeScroll
    	 * */
      return {
      	result: [],
        page: 1,
        pullup: true,
        hasMore: true,
        beforeScroll: true
      }
    },
    methods: {
//  	调用组件scroll的refresh()方法   这个方法通过父组件进行调用 重新计算高度
      refresh() {
        this.$refs.suggest.refresh()
      },
//    请求服务端抓取检索数据  有两个值 一个是搜索信息  一个是请求页数  一个是否请求歌手  一个是修改scrollTo的位置
      search() {
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },
//    搜索更多 滚动条拉到底部时触发事件  加载更多数据  这个是scroll子组件触发的
      searchMore() {
        if (!this.hasMore) {
          return
        }
//      每请求一次 page自增 请求下一个值  第一次是第一页  第二次是第二页
        this.page++
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
//        	和下拉加载一个道理 需要数据拼接数据 否则会把之前的数据覆盖
            this.result = this.result.concat(this._genResult(res.data))
            this._checkMore(res.data)
          }
        })
      },
//    scroll子组件触发的方法 派发到search组件上
      listScroll() {
        this.$emit('listScroll')
      },
//    跳转子路由方法 虽然是通过search的子路由跳转 但router-view还是爱search上
      selectItem(item) {
//    	如果通过type判断点击的是歌手 跳转到歌手界面 指定好歌手的id和名字
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          })
//        指定跳转路由的地址
          this.$router.push({
            path: `/search/${singer.id}`
          })
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
//      派发事件 传递给父组件当前歌曲的信息历史记录
        this.$emit('select', item)
      },
//    判断type的类型 返回对应是数据类型
      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },
//    控制显示歌手图标还是歌曲图标的方法 判断type类型 返回相应的图标
      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
//    处理返回的数据 返回的数据有两个值 一个是请求的返回歌曲条目   一个是歌手信息
      _genResult(data) {
        let ret = []
        if (data.zhida && data.zhida.singerid) {
//      	如果是有歌手信息 将歌手和判断信息的值添加到数组中
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }
        if (data.song) {
//      	如果有歌曲信息 和歌手信息进行拼接后也添加到数组中
          ret = ret.concat(this._normalizeSongs(data.song.list))
        }
        return ret
      },
//    处理请求回来的数据  和之前处理详情页的数据一样
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
             formatterSong(musicData).then((res) => {
		         ret.push(res);
		     });
          }
        })
        return ret
      },
//    判断有没有多余的请求信息
      _checkMore(data) {
        const song = data.song
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },
//    引用mutations上的方法  这个方法只是简单的传入歌手相关信息的方法
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      
      ...mapActions([
        'insertSong'
      ])
    },
    watch: {
//  	监控query的变化 当query变化时 说明有新的检索词 需要发送检索请求
      query(newQuery) {
        this.search(newQuery)
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
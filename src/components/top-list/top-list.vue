<template>
  <transition name="slide">
    <music-list :rank="rank" :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
	/*该组件和歌手组件的性质一致
	 * 
	 * 可复用music-list组件 
	 * 请求数据的方法 getMusicList
	 * 控制数据请求参数 ERR_OK
	 * 通过getters映射到组件的语法糖mapGetters
	 * 格式化排行榜页面的方法
	 * */
  import musicList from 'components/music-list/music-list.vue'
  import {getMusicList} from 'api/rank'
  import {ERR_OK} from 'api/config'
  import {mapGetters} from 'vuex'
  import {formatterSong} from 'common/js/song';

  export default {
//	在页面创建后 传入指定的标题和背景图
    computed: {
      title() {
        return this.toplist.topTitle
      },
      bgImage() {
//    	嫌默认图丑 返回歌曲第一张图
        if (this.songs.length) {
          return this.songs[0].image
        }
        return ''
      },
//    通过getter的语法糖将state中的值映射到组件中
      ...mapGetters([
        'toplist'
      ])
    },
    data() {
      return {
//    	接收推荐详情页的数据 
        songs: [],
        rank: true
      }
    },
    created() {
//  	执行请求数据方法
      this._getMusicList()
//    console.log(1111)
    },
    methods: {
//  	请求数据方法 请求的是排行榜的详情页
      _getMusicList() {
//    	判断当前有没有从排行榜页面传入id值  没有就 回退上一级路由
        if (!this.toplist.id) {
          this.$router.push('/rank')
          return
        }
        getMusicList(this.toplist.id).then((res) => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSongs(res.songlist)
          }
        })
      },
//    处理请求过来数据的方法
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          const musicData = item.data
          if (musicData.songid && musicData.albummid) {
            formatterSong(musicData).then((res) => {
		              ret.push(res);
		            });
          }
        })
        return ret
      }
    },
    components: {
      musicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s ease

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
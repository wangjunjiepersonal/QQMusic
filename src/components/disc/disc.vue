<template>
  <transition name="slide">
    <music-list :title="title" :bg-image="bgImage" :songs="songs"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
	/*
	 * 这是一个推荐页的路由子组件
	 * 引入MusicList组件 就是歌手详情页的组件 
	 * 引入mapGetters 将state中disc的内容映射到组件中
	 * 引入获取推荐页歌手数据的方法getSongList
	 * 引入控制数据获取的参数 ERR_OK
	 * 引入用来存储添加数据的createSong方法
	 * */
  import MusicList from 'components/music-list/music-list'
  import {mapGetters} from 'vuex'
  import {getSongList} from 'api/recommend'
  import {ERR_OK} from 'api/config' 
  import {formatterSong} from 'common/js/song'

  export default {
    computed: {
//  	歌手的标题
      title() {
        return this.disc.dissname
      },
//    歌手的头像
      bgImage() {
        return this.disc.imgurl
      },
//    将state中disc的内容映射到组件中
      ...mapGetters([
        'disc'
      ])
    },
    data() {
      return {
//    	接收歌曲数据的默认值
        songs: []
      }
    },
    created() {
//    调用请求歌手数据的方法
      this._getSongList()
//    console.log(this.songs)
    },
    methods: {
//  	设置请求歌手数据的方法  在created中获取
      _getSongList() {
//    	console.log(1111)
        if (!this.disc.dissid) {
          this.$router.push('/recommend')
          return
        }
        getSongList(this.disc.dissid).then((res) => {
          if (res.code === ERR_OK) {
          	console.log(res.cdlist[0].songlist)
//          this.songs = this._normalizeSongs(res.cdlist[0].songlist)
            
          }
        })
      },
//    处理请求回来的歌手数据 如果数据有songid属性和albummid属性  将数据添加到存储方法里面 
//	  由于歌曲源地址的改变 这里需要通过formatterSong请求数据才可以得到相关数据
      _normalizeSongs(list) {
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            formatterSong(musicData).then((res) => {
		         arr.push(res);
		    });
          }
        })
        return ret
      }
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
/*
 * maxin方法   
 * 通过vuex的 getters方法将playlist方法映射到组件中
 * 
 * 监控playList的变化  当playList发生变化时 
 * */
import {mapGetters,mapMutations,mapActions} from 'vuex'
export const playListMixin = {
	computed:{
		...mapGetters([
			'playList'
		])
	},
	mounted(){
		this.handlePlayList(this.playList)
		console.log(this.playList)
	},
	avtivated(){
		this.handlePlayList(this.playList)
	},
	watch:{
		playList(newval){
			this.handlePlayList(newval)
		}
	},
	methods:{
		handlePlayList(){
			throw new Error('必须要拥有handlePlayList行为')
		}
	}
}

/*
 * 设置公共的方法  供playlist 和  plater使用
 * */
import {playMode} from 'common/js/config.js'
import {shuffle} from 'common/js/util.js'

export const playerMixin = {
  computed: {
  	//    控制播放的模式  
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
//  添加playlist中的getter方法 映射到需要引用的组件中
    ...mapGetters([
      'sequenceList',
      'playList',
      'currentSong',
      'mode',
      'favoriteList'
    ])
  },
  methods: {
//	点击切换播放器状态方法
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = null
      if (mode === playMode.random) {
        list = shuffle(this.sequenceList)
      } else {
        list = this.sequenceList
      }
      this.resetCurrentIndex(list)
      this.setPlaylist(list)
    },
//  固定currentSong的值
    resetCurrentIndex(list) {
      let index = list.findIndex((item) => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
//  切换歌曲是否为收藏状态  如果已经收藏 点一下就取消收藏 如果没有收藏 就添加到 favoriteList中进行收藏歌曲的操作
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
//  控制收藏按钮的显示 如果歌曲被收藏 返回相应的类名
    getFavoriteIcon(song) {
      if (this.isFavorite(song)) {
        return 'icon-favorite'
      }
      return 'icon-not-favorite'
    },
//  判断歌曲是否已经收藏  判断歌曲有没有在favoriteList中就可以了
    isFavorite(song) {
      const index = this.favoriteList.findIndex((item) => {
        return item.id === song.id
      })
      return index > -1
    },
//  将mutations.js中的方法导入组件  导入到player中
    ...mapMutations({
      setPlayMode: 'SET_PLAY_MODE',
      setPlaylist: 'SET_PLAYLIST',
      setCurrentIndex: 'SET_CURRENT_INDEX',
      setPlayingState: 'SET_PLAYING_STATE'
    }),
    
//  将actions中的方法导入组件 
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

/*
 * 在搜索页面的共享方法
 * */
export const searchMixin = {
  data() {
    return {
//  	定义了绑定默认搜索词query  定义了scroll重新计算高度的时间
      query: '',
      refreshDelay: 120
    }
  },
  computed: {
    ...mapGetters([
//  搜索历史记录信息 在search 和 add-song中都用到
      'searchHistory'
    ])
  },
  methods: {
//	当输入框的值改变时
    onQueryChange(query) {
      this.query = query
    },
//  失去焦点事件 收起手机键盘
    blurInput() {
      this.$refs.searchBox.blur()
    },
//  接收新的query值  映射到搜索框中
    addQuery(query) {
      this.$refs.searchBox.setQuery(query)
    },
//  同步搜索记录 将搜索记录存在vuex中和本地存储中
    saveSearch() {
      this.saveSearchHistory(this.query)
    },
//  将actions中的方法同步到mixin中  一个是添加搜索记录方法 一个是删除搜索记录方法
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}

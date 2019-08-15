<template>
  <div class="player" v-show="playList.length>0">
  	<transition name="normal">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>
        <!--顶部内容展示区-->
        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>
        <!--歌曲展示区-->
        <div class="middle"
        	 @touchstart.prevent="middleTouchStart"
           @touchmove.prevent="middleTouchMove"
           @touchend="middleTouchEnd"
        	>
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
            <!--展示歌词区域-->
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <!--右侧歌曲列表区域-->
          <scroll class="middle-r" ref="lyricList" :data="currentLyric && currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p 
                	ref="lyricLine" 
                	v-for="(line,index) in currentLyric.lines"
                	:key="index"
                	:class="{'current':currentLineNum === index}"
                	class="text">
                	{{line.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <!--底部操作区-->
        <div class="bottom">
        	<!--切换页面区-->
          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow === 'cd'}"></span>
            <span class="dot" :class="{'active':currentShow === 'lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
            	<!--歌曲播放进度条组件-->
              <progressBar :percent="percent" @percentChange="onProgressBarChange"></progressBar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i @click="prev" class="icon-prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i @click="next" class="icon-next"  ></i>
            </div>
            <div class="icon i-right">
              <i class="icon" :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition> 
      <!--小型播放器-->
    <transition name="mini"> 
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image" :class="cdCls">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
        	<progress-circle raduis="raduis" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle> 
        </div>
        <div class="control" @click.stop="showPlayList">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition> 
    <!--歌曲添加列表组件-->
    <playlist ref="playlist"></playlist>
    <!--控制audio 是否已经加载完成  和 路径错误报错 和 播放事件 和 歌曲播放完成事件-->
    <audio ref="audio" 
    	:src="currentSong.url" 
    	@play="ready" 
    	@error="error" 
    	@ended="ended"
    	@timeupdate="updateTime"></audio>
  </div>
</template>
<script type="text/ecmascript-6">
	/*
	 * 导入相关组件
	 * 导入getter的语法糖mapGetters 将vuex中的属性映射到player中
	 * 	导入mutations的语法糖mapMutations 将vuex中的属性映射到player中
	 * 		导入actions中的 方法 
	 * 导入css第三方库 create-keyframe-animation
	 * 导入兼容浏览器css前缀 prefixStyle
	 * 导入播放器进度条组件 progress-bar
	 * 导入播放源圆形进度条组件 ProgressCircle
	 * 导入控制播放三种状态的文件  playmode 
	 * 导入随机数方法shuffle
	 * 导入处理歌词的第三次插件 lyric-parser
	 * 导入动画组件scroll组件
	 * 导入歌曲列表添加PlayList组件
	 * 引入mixin方法 里面保存着公共组件
	 * */
  import {mapGetters,mapMutations,mapActions} from 'vuex'
//import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom.js'
  import progressBar from 'base/progerss-bar/progerss-bar'
  import progressCircle from 'base/ProgressCircle/ProgressCircle'
	import {playMode} from 'common/js/config.js'
//import {shuffle} from 'common/js/util.js'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll.vue'
  import playlist from 'components/playlist/playlist.vue'
  import {playerMixin} from 'common/js/mixin'
  
//格式化浏览器css兼容性前缀 
  const transform  = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')

  
  export default {
//	将mixins传入到组件中
  	mixins:[playerMixin],
  	data(){
  		return{
  			/*
  			 * 控制歌曲是否加载完毕
  			 * 控制播放时间
  			 * 控制播放器圆形进度条的大小
  			 * 接收歌词的默认值
  			 * 控制歌词当前的播放行
  			 * 控制显示cd页面还是歌词页面的切换效果
  			 * 歌词展示
  			 * */	
  			songReady:false,
  			currentTime:0,
  			raduis:32,
  			currentLyric:null,
  			currentLineNum:0,
  			currentShow:'cd',
  			playingLyric:''
  		}
  	},
  	created(){
  		//定义一个空对象 保存touch的滑动事件  实现歌曲cd页面与歌词页面的交互
  		this.touch = {}
//		console.log(this.playList)
  	},
  	methods:{
//		回退按钮back  通过mapMutations修改state中fullScreen的值 
		back(){
			this.setfullScreen(false)
		},
//		通过小型播放器打开大型播放器
		open(){
			this.setfullScreen(true)
		},	
//		管理播放器暂停播放按钮  关联的state值为 playing
		togglePlaying(){
			this.setPlayingState(!this.playing)
//			在歌曲暂停时 暂停歌词动画
			if (this.currentLyric) {
  				this.currentLyric.togglePlay()
  			}
		},
//		获取播放器动画图片尺寸方法  x y scale
		_getPosAndScale(){
//			小图片信息
			const targetWidth = 40
			const paddingLeft = 40
			const paddingBottom = 30
//			大图片信息
			const paddingTop = 80
			const width = window.innerWidth * 0.8
//			移动时的数据
			const scale = targetWidth/width
			const x = -(window.innerWidth / 2 - paddingLeft)
			const y = window.innerHeight - paddingTop - width / 2 - paddingTop
			return {
				x,y,scale
			}
		},
//		实现点击按钮播放上一首歌曲  改变当前歌曲的索引值
		prev(){
			if (!this.songReady) {return}
			let index = this.currentIndex - 1
			if (index === -1) {
				index = this.playList.length-1
			}
			this.setCurrentIndex(index)
			if (!this.playing) {
				this.togglePlaying()
			}
			this.songReady = false
		},
//		实现点击按钮播放下一首歌曲  改变当前歌曲的索引值 如果是最后一首歌 播放第一首 
//    通过mutations中的SET_CURRENT_INDEX修改 state中的 currentIndex  更新playing的状态
//		如果歌曲没有加载完成 直接返回不进行操作  在最后设置为 false 开始缓冲下一首歌
		next(){
			if (!this.songReady) {return}
//			如果只是一首歌 循环播放即可
			if(this.playList.length === 1){
				this.loop()
				return
			}
			let index = this.currentIndex + 1
			if (index === this.playList.length) {
				index = 0
			}
			this.setCurrentIndex(index)
			if (!this.playing) {
				this.togglePlaying()
			}
			this.songReady = false
		},
//		控制歌曲是否已经加载完毕 加载完毕就将该歌曲添加到播放记录中
		ready(){
			this.songReady = true
			this.savePlayHistory(this.currentSong)
		},
//		当歌曲缓冲错误 将songReady 设为 true 以防止切换按钮失效
		error(){
			this.songReady = true
		},
//		audio的默认播放事件 参数是event对象  e.target.currentTime当前播放时间
		updateTime(e){
			this.currentTime = e.target.currentTime
			
		},
//		转化e.target.currentTime的时间戳 为 分秒的形式
		format(interval){
			interval = interval | 0
			const minute = interval / 60 | 0
			const second = this._pad(interval % 60)
			return `${minute}:${second}`
		},
//		给显示的歌曲时间补零
		_pad(num){
			const n = 2
			let len = num.toString().length
			while (len < n){
				num = '0' + num
				len++
			}
			return num
		},
		
//		子组件传递过来的修改歌曲进度的方法 修改歌曲的时间 歌曲的时间= 歌曲的总时长* 歌曲的进度比例
		onProgressBarChange(precent){
			const currentTime = this.currentSong.duration * precent
      this.$refs.audio.currentTime = currentTime
			if (!this.playing) {
				this.togglePlaying()
			}
			if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
		},
		/*
		 * 获取当前的状态   每点击一次改变一次mode  通过mutations.js 的 SET_PLAY_MODE属性进行设置
		 * 判断当前播放模式为 random  通过随机函数重新打乱音乐列表
		 * 判断当前播放模式为 sequence    直接等于原数组即可
		 * 如果改变setPlayList 会影响到currentSong 需要用过一个方法来固定 currentSong的值
		 * */	
//	changeMode(){
//		const mode = (this.mode + 1) % 3
//		this.setPlayMode(mode)
//		let list = null
//		if (mode === playMode.random) {
//			list = shuffle(this.sequenceList)
//		}else{
//			list = this.sequenceList
//		}
//		this.resetCurrentIndex(list)
//		this.setPlayList(list)
//	},
//	固定 currentSong的值  找到当前歌曲对应的索引  触发mutations.js的  SET_CURRENT_INDEX 方法 洗牌
//  保证state.currentIndex 和 playlist的顺序一致
//	resetCurrentIndex(list,song){
//		let index = list.findIndex((item)=>{
//			return item.id === this.currentSong.id
//		})
//		this.setCurrentIndex(index)
//	},
//	歌曲播放完毕 执行next方法切换下一首或者根据判断循环单曲播放
  	ended(){
  		if (this.mode === playMode.loop) {
  			this.loop()
  		}else{
  			this.next()
  		}	
//		循环播放完毕 偏移歌词的展示
  		if (this.currentLyric) {
  				this.currentLyric.seek(0)
  			}
  	},
//	loop循环播放单曲模式 修改radio中的 currentTime就是当前播放时间 设置为 0 让其重新播放
  	loop(){
  		this.$refs.audio.currentTime = 0
  		this.$refs.audio.play()
  	},
//	调取获取歌词的方法 添加判断 如果歌曲在播放时 调用 如果歌曲的歌曲不是当前歌词 返回不做任何事情
		getLyric(){
			this.currentSong.getLyric().then((lyric)=>{
				if(this.currentSong.lyric !== lyric){
					return
				}
				this.currentLyric = new Lyric(lyric,this.handleLyric)
				 if(this.playing){
				 	this.currentLyric.play()
				 }
//				console.log(this.currentLyric.lines)
			}).catch(()=>{
				this.currentLyric = null
				this.playingLyric = ''
				this.currentLineNum = 0
			})
		},
//		触发的当前歌词行  就是歌词当前的播放行 如果播放大于5行 总行数- 5 并滚动到当前位置
		handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt
        console.log(this.playingLyric)
      },
//		当前点击屏幕事件
		middleTouchStart(e) {
        this.touch.initiated = true
        // 用来判断是否是一次移动
        this.touch.moved = false
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
//    当前滑动屏幕事件
      middleTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX        
        const deltaY = touch.pageY - this.touch.startY
//      避免纵向滚动
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        if (!this.touch.moved) {
          this.touch.moved = true
        }
//      歌词区到屏幕右边的静态距离
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
//      console.log(offsetWidth)
//				记录滑动与屏幕的占比
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
//      控制歌词区域的滑动距离
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
//      console.log(this.$refs.lyricList)
        this.$refs.lyricList.$el.style[transitionDuration] = 0
        this.$refs.middleL.style.opacity = 1 - this.touch.percent
        this.$refs.middleL.style[transitionDuration] = 0
      },
//    当前滑动结束事件
      middleTouchEnd() {
        if (!this.touch.moved) {
          return
        }
        let offsetWidth
        let opacity
        
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        this.touch.initiated = false
      },
//    点击小播放器的添加列表组件
      showPlayList(){
      	this.$refs.playlist.show()
      },
      
//		通过mapMutations将mutations的方法抽取到组件中 通过设置方法名获取到mutations方法 进行设置
		...mapMutations({
			setfullScreen:'SET_FULL_SCREEN',
//			setPlayingState:'SET_PLAYING_STATE',
//			setCurrentIndex:'SET_CURRENT_INDEX',
//			setPlayMode:'SET_PLAY_MODE',
//			setPlayList:'SET_PLAYLIST'
		}),
		...mapActions([
			'savePlayHistory'
		])
  	},

  	computed:{
  		/*
  		 * getters       映射控制值 
  		 * fullScreen    播放器是展开还是隐藏  
  		 * playlist      播放列表
  		 * currentSong   歌曲的相关信息  这个信息是通过 music-list传递的
  		 * playing       当前播放状态 布尔值 控制歌曲播放还是暂停
  		 * currentIndex  当前歌曲的索引  控制播放上一首或者下一首
  		 * mode          播放模式  有三种状态 
  		 * sequenceList  音乐播放顺序列表
  		 * */
  		...mapGetters([
  			'fullScreen',
//			'playList',
//			'currentSong',
  			'playing',
  			'currentIndex',
//			'mode',
//			'sequenceList'
  		]),
//		监控playing的变化 添加移除相关类 控制播放暂停按钮
  		playIcon(){
  			return this.playing ? 'icon-pause' : 'icon-play'
  		},
//		监控底部播放器暂定按钮变化
  		miniIcon(){
  			return this.playing ? 'icon-pause-mini' : 'icon-play-mini'	
  		},
//		控制cd旋转类 如果有playing属性 说明播放 给cd添加旋转动画
  		cdCls(){
  			return this.playing ? 'play' : 'play pause'
  		},
//		没有缓冲完成时设置一个显示属性
  		disableCls(){
  			return this.songReady ? '' : 'disable'
  		},
//		计算当前歌曲的时间比例  当前播放的时间/ 歌曲的总时长
			percent() {
        return this.currentTime / this.currentSong.duration
     },
  	},
  	watch:{
//		监控currentSong的变化 当currentSong变化  在获取了播放地址 通过 $nextTick()控制dom更新完毕之后播放 
  		currentSong(newsong,oldsong){
//			如果没有了歌曲 直接返回
  			if(!newsong.id){
  				return
  			}
  			if (newsong.id === oldsong.id) {return} 
//			防止歌词闪动计时器影响动画
  			if (this.currentLyric) {
  				this.currentLyric.stop()
  			}
//			当每次切歌歌曲发生变化时 先清理定时器
  			clearTimeout(this.timer)
  			this.timer = setTimeout(()=>{
  				this.$refs.audio.play()
//				调用获取歌词的方法
					this.getLyric()
  			},1000)
  		},
//		监控playing的布尔值 控制播放状态  调用$nextTick()缓冲audio.play()  如果歌曲的id不变  什么都不做
  		playing(newPlayIng){
  			const audio = this.$refs.audio
  			this.$nextTick(()=>{
  				newPlayIng?audio.play():audio.pause()
  			})
  		}
  	},
  	components: {
      progressBar,
      progressCircle,
      Scroll,
      playlist
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        height: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>
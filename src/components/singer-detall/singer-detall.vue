<template>
	<transition name="slide">
		<music-list :songs="songs" :title="title" :bg-image="bgImage"></music-list>
	</transition>
</template>

<script type="text/javascript">
	/*
	 * 引入getters的语法糖
	 * 引入获取单个歌手详情信息的数据请求
	 * 获取验证信息是否正确的ERR_OK
	 * 获取过滤歌手数据的 song.js
	 * */
	import {mapGetters} from 'vuex'
	import {getSingerDetail} from 'api/singer.js'
	import {ERR_OK} from 'api/config.js'
	import {formatterSong} from 'common/js/song';
	import musicList from 'components/music-list/music-list.vue'
	
	export default {
		data(){
			return {
//				接收歌手详情数据的初始化数组
				songs:[]
			}
		},
		created(){
//			初始化数据请求
			this._getDetail()
		},
		methods:{
//			向服务器请求指定歌手详情 传入的是歌手的id值 这个值保存到state中
			_getDetail(){
//				边界情况
				if(!this.singer.id){
					this.$router.push('/singer')
				}
				getSingerDetail(this.singer.id).then((res) => {
	          		if (res.code === ERR_OK) {
	            this.songs = this._normalizeSongs(res.data.list)
	          }
	        })
			},
//			处理歌手详情数据的方法 在循环里将item的元素通过一个对象接收 
			_normalizeSongs(songList){
	        	const arr = [];
		        songList.forEach((item) => {
		          let {musicData} = item;
		          if (musicData.albumid && musicData.songid) {
		            formatterSong(musicData).then((res) => {
		              arr.push(res);
		            });
		          }
		        });
		        return arr;
		      }
		    },
		computed:{
//			vuex中getter的语法糖  用来映射值
			...mapGetters([
				'singer'
			]),
//			给子组件传入的title组件 值为vuex里面的值
			title(){
				return this.singer.name
			},
//			给子组件传入的bgImage(组件 值为vuex里面的值
			bgImage(){
				return this.singer.avatar
			}
		},
		components:{
			musicList
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	@import "~common/stylus/variable.styl"
	.slide-enter-active,.slide-leave-active
		transition: all 0.5s
	.slide-enter,.slide-leave-to
		transform: translate3d(100%,0,0)		
</style>
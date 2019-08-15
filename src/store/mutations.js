/*
 * mutations.js中 存储的是修改state中值的方法  可以理解为methods 方法
 * mutations.js可以获取到mutation-type.js中的常量并使用
 * 第一个操作是 通过types.SEI_SINGER执行方法 将 state.singer 设置为父路由传入的singer
 * 第二个操作是 通过types.SET_PLAYING_STATE 执行方法 将state.playing 设置为传进来的布尔值
 * 第三个操作是 通过SET_FULL_SCREEN 执行方法 将state.fullScreen 设置为传进来的布尔值
 * 第四个操作是 通过SET_PLAYLIST 执行方法 将state.playlist 设置为传进来的数组
 * 第五个操作是 通过SET_SEQUENCE_LIST 执行方法 将state.sequenceList 设置为传进来的数组
 * 第六个操作是 通过SET_PLAY_MODE 执行方法 将state.mode 设置为传进来的对象格式  用来控制播放格式
 * 第七个操作是 通过SET_CURRENT_INDEX 执行方法 将state.currentIndex 设置为传进来的对象格式 用来控制索引
 * 第八个操作是 通过SET_DISC 执行方法 将state.disc 设置为传进来的对象格式 用来控制传入的数据
 * 第九个操作是 通过SET_TOP_LIST 执行方法 将state.toplist 设置为传进来的对象格式 用来控制传入的数据
 * 第十个操作是 通过SET_SEARCH_HISTORY 执行方法 将state.searchHistory 设置为传进来的数组格式 用来控制搜索记录的值
 * 第十一个操作 通过SET_PLAY_HISTORY 执行方法 将state.playHistory 设置为传进来的数组格式 用来控制歌曲播放记录的值
 * */
import * as types from './mutation-types'

const matutaions = {
	[types.SET_SINGER](state,singer){
		state.singer = singer
	},
	[types.SET_PLAYING_STATE](state,flag){
		state.playing = flag
	},
	[types.SET_FULL_SCREEN](state,flag){
		state.fullScreen = flag
	},
	[types.SET_PLAYLIST](state,list){
		state.playList = list
	},
	[types.SET_SEQUENCE_LIST](state,list){
		state.sequenceList = list
	},
	[types.SET_PLAY_MODE](state,mode){
		state.mode = mode
	},
	[types.SET_CURRENT_INDEX](state,index){
		state.currentIndex = index
	},
	[types.SET_DISC](state,disc){
		state.disc = disc
	},
	[types.SET_TOP_LIST](state,list){
		state.toplist = list
	},
	[types.SET_SEARCH_HISTORY](state,history){
		state.searchHistory = history
	},
	[types.SET_PLAY_HISTORY](state,history){
		state.playHistory = history
	},
	[types.SET_FAVORITE_LIST](state,list){
		state.favoriteList = list
	}
}
export default matutaions 
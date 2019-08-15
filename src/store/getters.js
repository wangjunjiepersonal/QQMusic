/*
 * getter.js  对state数据进行映射处理  其实就是计算属性
 * 这里的都是将计算的值当做  vuex 中 state存储的值
 * */
export const singer = state =>state.singer

export const playing = state =>state.playing

export const fullScreen = state =>state.fullScreen

export const playList = state => state.playList

export const sequenceList = state =>state.sequenceList

export const mode = state =>state.mode

export const currentIndex = state =>state.currentIndex

//这里是通过音乐播放列表的歌曲索引获得当前播放歌曲
export const currentSong = (state) =>{
	return state.playList[state.currentIndex] || {}
}

export const disc = state =>state.disc

export const toplist = state =>state.toplist

export const searchHistory = state =>state.searchHistory

export const playHistory = state =>state.playHistory

export const favoriteList= state =>state.favoriteList
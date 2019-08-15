/*
 * 使用actions.js 一般分为两种情况  一种是进行异步操作 后台交互
 * 一种是多次触发 mutations.js 通过 actions.js来封装处理方法
 * 
 * 引入mutation-types.js 并使用里面的方法
 * 定义一个函数通过 selectPlay 接收两个参数  意思就是通过actions 触发 mutation中的方法
 * 第一个参数  {commit,state} actions.js中自带对象 commit就是触发的意思  state就是state中的值
 * 第一个参数  {list,index} actions.js要修改的内容 这里传入的为 修改的歌曲列表 歌曲的索引
 * 操作
 * 触发SET_SEQUENCE_LIST 方法 传入 list播放顺序列表
 * 触发SET_PLAYLIST 方法 传入 list播放列表
 * 触发SET_CURRENT_INDEX 方法 传入歌曲索引
 * 触发SET_FULL_SCREEN 方法 传入控制的布尔值
 * 触发SET_PLAYING_STATE 方法 传入控制的布尔值
 * */
//引入mutation-types.js
import * as types from './mutation-types' 
//引入存放播放模式的对象
import {playMode} from 'common/js/config.js'
//引入随机数方法
import {shuffle} from 'common/js/util.js'
//引入存储搜索记录方法 删除记录的方法
import {saveSearch, clearSearch, deleteSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache.js'


//定义 findIndex 方法  随条件更改index的值  找出randomList中对应的list[index]索引
	function findIndex(list,song){
		return list.findIndex((item)=>{
			return item.id === song.id
		})
	}

 export const selectPlay = function({commit,state},{list,index}){
 	commit(types.SET_SEQUENCE_LIST,list)
// 	判断当前的播放模式 如果是随机播放  直接更改歌曲的list歌曲顺序  同时还要更改index的值 
//	index的值受两个值限制 一个是随机后的index 一个是当前的index 判断顺序列表里的歌对应随机之后的索引
 	if(state.mode === playMode.random){
 		let randomList = shuffle(list)
 		commit(types.SET_PLAYLIST,randomList)
 		index = findIndex(randomList,list[index])
 	}else{
 		commit(types.SET_PLAYLIST,list)
 	}
 	commit(types.SET_CURRENT_INDEX,index)
 	commit(types.SET_FULL_SCREEN,true) 
 	commit(types.SET_PLAYING_STATE,true)
 }

/*
 * 随机播放方法 也是在music-list中使用
 * 更改播放模式
 * 通过触发 SET_PLAY_MODE方法 传入播放的模式 
 * 触发SET_SEQUENCE_LIST 加入播放列表
 * 通过shuffle()方法随机打乱歌曲索引
 * 触发SET_PLAYLIST方法重新洗牌歌曲列表
 * 触发SET_CURRENT_INDEX 重新修改歌曲索引
 * */
export const randomplay = function({commit},{list}){
	commit(types.SET_PLAY_MODE,playMode.random)
	commit(types.SET_SEQUENCE_LIST,list)
	let randomList = shuffle(list)
	commit(types.SET_PLAYLIST,randomList)
	commit(types.SET_CURRENT_INDEX,0)
	commit(types.SET_FULL_SCREEN,true) 
 	commit(types.SET_PLAYING_STATE,true)
}

/*
 * 点击搜索界面的歌曲后 为当前歌曲列表增加值 如果值已经存在 需要删除之前存储的值
 * 重新设置三个值   playList   sequenceList   currentIndex
 * 记录下当前歌曲
 * 判断列表里是否有准备插入的歌曲
 * 如果没有 添加准备插入的歌曲
 * 索引自增1 将歌曲插入到索引位置
 * 如果已经包含了这首歌
 * 如果当前插入的序号大于列表中的序号
 * 如果小于序号  删除后面的
 * 
 * 修改sequenceList
 * 查看sequenceList中是否包含
 * */
export const insertSong = function({commit,state},song){
	let playList = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	let currentSong = playList[currentIndex]
	let fpIndex = findIndex(playList,song)
	currentIndex += 1
	playList.splice(currentIndex,0,song)
	if(fpIndex > -1){
		if (currentIndex  > fpIndex) {
			playList.splice(fpIndex,1)
			currentIndex -= 1
		}else{
			playList.splice(fpIndex+1,1)
		}
	}
	let currentSIndex = findIndex(sequenceList,currentSong) + 1
	let fsIndex = findIndex(sequenceList,song) 
	sequenceList.splice(sequenceList,0,song)
	if(fpIndex > -1){
		if (currentIndex  > fsIndex) {
			playList.splice(fpIndex,1)
		}else{
			playList.splice(fsIndex+1,1)
		}
	}
//	提交
	commit(types.SET_PLAYLIST,playList) 
 	commit(types.SET_SEQUENCE_LIST,sequenceList)
 	commit(types.SET_CURRENT_INDEX,currentIndex)
 	commit(types.SET_FULL_SCREEN,true) 
 	commit(types.SET_PLAYING_STATE,true)
}

/*
 * 将搜索历史记录存储到本地的localStorage中
 * commit 触发
 * query 存储的值
 * 执行SET_SEARCH_HISTORY 将saveSearch()方法格式化的值存储到searchHistory中
 * */
export const saveSearchHistory = function({commit},query){
	commit(types.SET_SEARCH_HISTORY,saveSearch(query))
}

/*
 * 删除单个搜索历史
 * 由于删除的列表值存储到state中 所以需要通过操作mutations.js进行删除  通过actions进行触发
 * commit 触发
 * query 删除的值
 * 之前以为还要通过mutations.js封装方法
 * 后来想到mutations.js中的SET_SEARCH_HISTORY方法只为searchHistory设置数据 
 * SET_SEARCH_HISTORY方法不参与对数据的修改 数据的修改全在cache.js中
 * */

export const deleteSearchHistory = function({commit},query){
	commit(types.SET_SEARCH_HISTORY,deleteSearch(query))
}

/*
 * 删除全部搜索历史
 * 由于删除的列表值存储到state中 所以需要通过操作mutations.js进行删除  通过actions进行触发
 * commit 触发  由于删除全部的值 所以不用写query
 * 同样不需要操作mutations.js封装方法
 * 因为给mutations.js传入的是一个空数组  可以通过判断为空时不渲染即可
 * */

export const clearSearchHistory = function({commit}){
	commit(types.SET_SEARCH_HISTORY,clearSearch(query))
}

/*
 * 删除一首歌曲
 * 获取playList  sequenceList  currentIndex 的当前状态
 * 找到当前歌曲在playList中的索引值  删除当前歌曲
 * 找到当前歌曲在sequenceList中的索引值  删除当前歌曲
 * 如果当前播放的歌曲在删除的歌曲之后 减一位索引
 * 如果是最后一首歌 也要减一位索引
 * 提交
 * */

export const deleteSong = function({commit,state},song){
	let playList = state.playList.slice()
	let sequenceList = state.sequenceList.slice()
	let currentIndex = state.currentIndex
	let fpIndex = findIndex(playList,song)
	playList.splice(fpIndex,1)
	let spIndex = findIndex(sequenceList,song)
	sequenceList.splice(spIndex,1)
	if(currentIndex > fpIndex || currentIndex === playList.length){
		currentIndex -= 1
	}
	commit(types.SET_PLAYLIST,playList) 
 	commit(types.SET_SEQUENCE_LIST,sequenceList)
 	commit(types.SET_CURRENT_INDEX,currentIndex)
// 	如果列表删完 将歌曲列表滞空 如果没有删完 让歌曲播放
 	if(!playList){
 		commit(types.SET_PLAYING_STATE,false)
 	}else{
 		commit(types.SET_PLAYING_STATE,true)
 	}
 	
}

/*
 * 清空添加列表的操作
 * 直接将列表清空 播放列表清空 歌曲索引设为-1 播放状态为false即可
 * */
export const deleteSongList = function({commit}){
	commit(types.SET_PLAYLIST,[]) 
 	commit(types.SET_SEQUENCE_LIST,[])
 	commit(types.SET_CURRENT_INDEX,-1)
 	commit(types.SET_PLAYING_STATE,false)
}

/*
 * 存储播放歌曲的列表
 * song 就是传入的列表 意思就是当播放的歌曲缓冲完毕后 就加入到了播放历史中
 * */

export const savePlayHistory = function({commit},song){
	commit(types.SET_PLAY_HISTORY,savePlay(song)) 
}

/*
 * 控制个人收藏按钮歌曲
 * save 添加个人收藏歌曲
 * delete 删除个人收藏歌曲
 * */
export const saveFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

export const deleteFavoriteList = function ({commit}, song) {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}

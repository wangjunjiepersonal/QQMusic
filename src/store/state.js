/* 
 * state.js 存放的是数据  作用和 data一样 
 * 第一个对象singer  存储的是歌手的相关信息  
 * 第二个对象playing 音乐是播放还是暂停
 * 第三个对象 fullScreen 播放器是展开还是收起
 * 第四个对象playlist 音乐播放列表
 * 第五个对象sequenceList 音乐播放顺序列表
 * 第六个对象 mode 播放模式  通过 config.js 来控制
 * 第七个对象 currentIndex  歌曲播放的索引
 * 第八个对象 disc 推荐页歌单对象（recommend.vue）
 * 第九个对象 toplist 推荐页歌单对象（rank.vue）
 * 第十个对象 searchHistory 搜索历史默认值 存储的是本地存储的搜索历史记录
 * 第十一个对象 playHistory 歌曲的播放历史 存储的是歌曲播放的历史记录
 * 第十二个对象 favoriteList 喜欢的歌曲列表 存储的是点击了喜欢收藏歌曲的列表值
 * 
 * */

import {playMode} from 'common/js/config.js'
import {loadSearch,loadPlay,loadFavorite} from 'common/js/cache.js'
const state = {
	singer:{},
	playing:false,
	fullScreen:false,
	playList:[],
	sequenceList:[],
	mode:playMode.sequence,
	currentIndex:-1,
	disc:{},
	toplist:{},
	searchHistory:loadSearch(),
	playHistory:loadPlay(),
	favoriteList:loadFavorite()
}
export default state
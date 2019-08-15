/*
 * 优化歌手详情数据的结构
 * 返回一个修饰类    在类的属性constructor中传入相关参数 
 * id 歌手的id
 * mid 歌手的相关id
 * singer 歌手信息
 * name 歌手名字
 * album 专辑名称
 * duration  歌曲长度
 * image 歌曲图片
 * url  请求路径
 * 
 * */
import jsonp from 'common/js/jsonp';
import {getLyric} from 'src/api/song.js';
import {Base64} from 'js-base64';
import {ERR_OK} from 'api/config.js'

export default class Song{
	constructor({id,mid,singer,name,album,duration,image,url}){
		this.id = id 
		this.mid = mid
		this.singer = singer
		this.name = name
		this.album = album
		this.duration = duration
		this.image = image
		this.url = url
	}
	/*
 * 发送请求歌词的数据 
 * 歌词也是song 的一个属性  所以定义在了song类中
 * 在receiveLyric()调用方法时进行判断  如果有
 * */
	getLyric(){
		// 每次currentSong发生变化时执行这个函数就会发送ajax请求，这显然不合理，如下判断
		if( this.lyric ) {  //如果有这个歌词，那么直接返回一个Promise对象
			return Promise.resolve( this.lyric )
		}

		return new Promise((resolve, reject) => {
			getLyric(this.mid).then((res) => {
			if(res.code === ERR_OK){
				this.lyric = Base64.decode( res.lyric )
				//console.log(this.lyric)
				resolve( this.lyric )
			}else{
				reject( 'Lyric error' )
			}
		})
		})
		
	}
}
/*
 * createdSong 工厂方法
 * 处理歌手的相关信息  使用的是 上面写好的 song类方法 
 * */

export async function formatterSong(data){
  return new Song({
    id :data.songid,
    mid :data.songmid,
    singer :formatterSinger(data.singer),
    name :data.songname,
    album :data.albumname,
    duration :data.interval,
    image :`https://y.gtimg.cn/music/photo_new/T002R300x300M000${data.albummid}.jpg?max_age=2592000`,
    url:await getSongURL(data.songmid)
  })
}


function getSongVKey(songMid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
  const data = {
    format: "jsonp",
    inCharset: "utf-8",
    outCharset: "utf-8",
    notice: 0,
    g_tk: 1278911659,
    hostUin: 0,
    platform: "yqq",
    needNewCode: 0,
    cid: 205361747,
    uin: 0,
    songmid: songMid,
    filename: `C400${songMid}.m4a`,
    guid: 3655047200
  };
  const option = {
    param: "callback",
    prefix: "callback"
  };
  return jsonp(url, data, option);
}

function getSongURL(songMid){
  return getSongVKey(songMid).then((data) => {
    return `http://dl.stream.qqmusic.qq.com/C400${songMid}.m4a?vkey=${data.data.items[0].vkey}&guid=3655047200&fromtag=66`;
  });
}


/*
 * 处理 musicData.singer 歌手信息  这是一个对象套数组的写法
 * 需要进行过滤之后再赋值
 * 
 * */
function formatterSinger(singer){
	let ret = []
	if(!singer){
		return ''
	}
	singer.forEach((item)=>{
		ret.push(item.name)
	})
	return ret.join('/')
}



















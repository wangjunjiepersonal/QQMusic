
import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

/*
 * 抓取歌手列表信息
 *  
 * */
export function getSingerList(){
	const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		channel: 'singer',
	    page: 'list',
	    key: 'all_all_all',
	    pagesize: 100,
	    pagenum: 1,
	    hostUin: 0,
	    needNewCode: 0,
	    platform: 'yqq'
	})
	return jsonp( url, data, options )
}

/*
 * 抓取单个的歌手详情信息
 * 抓取单个的歌手信息需要给后台传入歌手的id 
 * */
export function getSingerDetail(singerId){
	const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg'
	// 把公共参数和其他参数合并
	const data = Object.assign( {}, commonParams, {
		singermid: singerId,
		loginUin: 0,
		hostUin: 0,
		g_tk: 5381,
		platform: 'yqq',
		needNewCode: 0,
		format: 'jsonp',
		order:'listen',
		begin:0,
		num:100,
		songstatus:1
	})
	return jsonp( url, data, options )
}


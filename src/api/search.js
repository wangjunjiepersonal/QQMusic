import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'

/*
 * 获取相关搜索的数据
 * */
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}


/*
 * 对输入框输入信息的检索
 * 第一个参数 搜索框输入的值
 * 第二个参数 请求的页数
 * 第三个参数 返回的结果是否包含歌手信息
 * 第四个参数 控制每页的信息
 * */
export function search(query, page, zhida, perpage) {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

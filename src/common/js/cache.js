
/*
 * 保存搜索记录的方法 
 * 不仅可以保存搜索记录 还可以保存播放记录等
 * 
 * */
//导入存储localStorage的插件方法
import storage from 'good-storage'

//搜索列表的key值 和存储的最大条数
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15

//播放历史列表的key值 和存储的最大条数
const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200

//个人收藏歌曲的key值和存储的最大条数
const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200

/*
 * 封装处理最大条数和存储位置的方法
 * 第一个值为存储的数组
 * 第二个值为存储的值
 * 第三个值为比较函数 意思就是是否有重复数据
 * 第四个值为存储的最大值
 * findIndex  查找当前数组是否有某个元素
 * 查找没有相同的值 原样返回 
 * 如果有相同的值 删除当前相同的值 重新插入当前的值 在最前
 * 如果有条数限制 删除最后的值 最开始的记录 最新的记录在最前
 * 
 * */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

//删除localStorage中的数据 arr是数组 compare是比较函数 意思就是数组里面有没有这个值 有的话删除
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

/*
 * 通过localStorage缓存数据
 * key值为SEARCH_KEY  默认值为空数组
 * 将最新添加的数据展示在最前面 意思就是最近的搜索记录显示在最上面
 * 
 * */
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
//	item === query 意思就是添加的值在数组中
    return item === query
  }, SEARCH_MAX_LEN)
//设置localStorage的set方法 key为SEARCH_KEY  值为searches
  storage.set(SEARCH_KEY, searches)
  return searches
}

//删除localStorage中的单个数据
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
//删除全部存储在localStorage中的数据 通过localStorage.remove将key值删除
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

//读取SEARCH_KEY为key的列表中的值
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

/*
 * 通过localStorage缓存数据  缓存的歌曲播放的历史记录
 * key值为PLAY_KEY  默认值为空数组
 * 先通过localStorage读取key值的缓存数据 如果没有就返回空
 * 通过insertArray检查添加的值是否存储在当前数组中
 * 
 * */
export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

//读取当前存储的数组 如果没有读取到就返回空
export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

/*
 * 个人收藏歌曲的 添加 删除 操作 通用
 * 通过localStorage缓存数据  缓存的收藏歌曲的记录
 * key值为FAVORITE_KEY  默认值为空数组
 * 先通过localStorage读取key值的缓存数据 如果没有就返回空
 * 通过insertArray检查添加的值是否存储在当前数组中
 * 
 * */
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
//删除
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

//初始化时读取
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}


/*
 * 封装自己开发的jsonp js文件
 * url 请求的地址
 * data 传递给后台的参数
 * option 请求的相关参数
 * 通过 promist来处理请求
 * 首先检测url是否有问号 意思就是是否传值 如果没有就加上问号 如果有 就用过&符链接data中的数据
 * 
 * 将data中的对象数据拼接到url参数中
 * 用for in循环data中的数据 将其拼接到url中 格式为 url&key=data[key]&key=data[key]
 * */

import originJsonp from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

  return new Promise((resolve, reject) => {
    originJsonp(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

export function param(data) {
  let url = ''
  for (var k in data) {
    let value = data[k] !== undefined ? data[k] : ''
    url += '&' + k + '=' + encodeURIComponent(value)
  }
  return url ? url.substring(1) : ''
}
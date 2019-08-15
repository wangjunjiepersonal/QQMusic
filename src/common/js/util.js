
/*
 * 随机函数 
 * 定义一个辅助函数  返回man min之间的一个数字
 * */
export function shuffle(arr){
	let _arr = arr.slice()
	for (let i = 0; i < _arr.length; i++) {
		let j = getRandom(0,i)
		let t = _arr[i]
		_arr[i] = _arr[j]
		_arr[j] = t 
	}
	return _arr
}

function getRandom(min,max){
	return Math.floor(Math.random() * (max - min + 1) + min)
}
/*
 * 截留方法  对某一个函数做截留 返回一个新的函数 延迟执行要截留的函数
 * 在此处的方法时 当query发生改变时 不能修改一个数就触发方法 而是在等固定的时间后触发方法  以免影响浏览器性能造成浪费
 * func是准备截留的函数方法  delay是时间
 * 通过return返回函数方法 如果有timer就清空定时器重新计算时间
 * */
export function debounce(func, delay) {
  let timer

  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
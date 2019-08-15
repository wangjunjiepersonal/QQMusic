/*
 * com 相关操作
 * 目的 
 * 给轮播图动态的添加类样式
 * addclass 添加类
 * hasClass 是否拥有当前类
 * 首先判断有没有当前class 如果有的话直接返回 trun 或者false
 * 如果没有 给当前类通过 空格进行切割分割数组  然后将新的类添加到newClass中 再通过分割字符串分割成单独的类
 * */

export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
  
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }
	
  let newClass = el.className.split(' ')
  newClass.push(className)
  el.className = newClass.join(' ')
 
}
/*
 * 通过自定义标签获取当前元素的索引值
 * 第一个参数是当前dom元素对象
 * 第二个参数是自定义标签名 data-之类的后缀值  比如当前是 data-index  nama就是index
 * 第三个参数是 一个属性值  用来操作get 或者 set 有值就set添加 没有就get获取
 * 判断val 如果当前 val有值 给当前元素设置val属性并返回 
 * 如果当前val 没有值 返回el元素的name自定义属性
 * */
export function getData(el,name,val){
	const prefix = 'data-'
	const names = prefix + name
	if(val){
		return el.setAttribute(names,val)
	}else{
		return el.getAttribute(names)
	}
}

/*
 * 浏览器兼容性能力检测
 * 检测是哪种浏览器 拼接浏览器的兼容前缀  这样可以少些几个代码
 * */

let elementStyle = document.createElement('div').style

let vendor = (() => {
  let transformNames = {
    webkit: 'webkitTransform',
    Moz: 'MozTransform',
    O: 'OTransform',
    ms: 'msTransform',
    standard: 'transform'
  }

  for (let key in transformNames) {
    if (elementStyle[transformNames[key]] !== undefined) {
      return key
    }
  }

  return false
})()

export function prefixStyle(style) {
  if (vendor === false) {
    return false
  }

  if (vendor === 'standard') {
    return style
  }

  return vendor + style.charAt(0).toUpperCase() + style.substr(1)
}

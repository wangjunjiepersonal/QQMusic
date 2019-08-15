/*
 * 封装一个组合对象的singer类 作用为按需获取歌手的相关信息 
 * 这个类封装三个参数  就是构造函数的属性  ES6中通过constructor创建
 * 一个歌手的id
 * 一个歌手的name
 * 一个歌手头像的img地址
 * 
 * */
export default class Singer {
	constructor({id, name}){
		this.id = id
		this.name = name
		this.avatar = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
	}
}


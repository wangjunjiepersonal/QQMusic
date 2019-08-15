#初夏的雨点 落的太敷衍 
mook-music qq音乐app开发  又称炸鸡音乐App
目录导航
	业务层
	页面
		推荐页面
		歌手页面
		歌手详情页
		播放器页面
		歌单页面
		排行榜页面
		榜单列表页
		搜索页面
		歌曲列表页
		用户中心页
	支撑层
	架构支撑
		基础组件库
		状态管理vuex
		路由vue-router
		服务端通讯 axios/jsonp
		第三方插件
	
开发前
	需要用到 stylus css编译工具
		   axion 异步请求工具
安装三个组件
babel-runtime  es语法转义
fastclick      解决移动端点击300毫秒延迟
	如果和better-scroll 产生冲突 元素无法被点击
	可以为需要点击的元素添加 needclick类 指名该元素需要被点击
babel-polyfill es6的api进行转义 


#基本工作
在main.js中引入  主体
	babel-polyfill   处理es6的语法  现在基本可以不用 
	fastclick        解决移动端点击300毫秒延迟
设置好路由组件
	在router/index.js中设置路由组件 因为一般为spa项目 所以组件都在app.vue中渲染
	注意设置好默认首页的显示 用redirect单独设置

#components   业务组件 存放较大的组件 路由组件
	常用组件
		header   推荐页的头部功能组件	
		tab      推荐页的导航功能组件
		singer-detell 歌手详情页子路由
		music-list 歌手详情页组件
		player    播放器组件
		disc      热门推荐页歌曲详情页
		top-list  排行榜的详情页
		suggest   搜索页面检索搜索信息组件
		playlist  歌曲添加列表组件
		add-song  歌曲添加组件
		user-center  个人中心组件
	路由组件
		Rank      排名组件
		Search    搜索信息组件
		Recommend 热门推荐组件
		Singer    歌手信息组件
		
		
#common  组件 存储通用的js文件
	jsonp.js   封装一个jsonp的请求本地化方式	
	dom.js     封装关于操作dom 的相关方法
	singer.js  封装歌手的相关数据信息
	song.js    封装歌手详情的相关数据信息
	config     项目配置文件
	util.js    随机函数
	mixin.js   js方法  在组件调用时加到组件指定的地方
	cache.js   本地存储搜索历史方法
	
#API 存储数据请求的相关组件和文件
	config.js      存储jsonp请求相关的固定传值
	recommend.js   通过jsonp请求数据 请求的是推荐页的数据
				        第一个函数获取的是轮播图的数据
				        第二个函数获取的是歌单数据
	singer.js      获取歌手页面的信息
	song.js        获取歌曲歌词信息			
	rank.js        获取排行榜相关信息
	search         获取搜索页面相关信息
	
#base 基础组件 存放小组件 功能组件
	slider.vue      轮播图组件
	scroll.vue      滑动组件
	loading.vue     预加载组件  
	listview.vue    歌手滚动列表组件
	loading.vue     等待加载时展示的默认图片
	song-list       歌曲列表组件
	progerss-bar    歌曲进度组件
	ProgressCircle  播放器圆圈进度条显示
	search-box      搜索页面搜索框
	no-result       显示搜索页暂无搜索时的界面
	search-list     搜索记录展示组件
	confirm         弹窗组件
	switches        切换组件
	top-tip         添加歌曲的顶部提示组件
	
#store  vuex的状态管理
	index.js        入口js文件
	state.js        相当于data存储数据
	actions.js      异步操作数据
	mutations.js    操作state中的数据
	mutation-type.js 存放mutations的常量
	getters.js      state的映射  其实就是计算属性
	
----------------------------------------------

#开发流程
	开发推荐页的头部组件
		v-header组件
	开发推荐页的轮播图组件     
		slider组件
	开发推荐页的歌单列表页 
		scroll组件
		添加了vue-lazyload懒加载效果
		添加了数据等待显示动画的loading组件
	开发推荐页的歌单详情页
		将推荐页设置为二级路由  因为下方的歌单列表需要点击 通过歌单的id值作为路由参数传递
		disc.vue为推荐页的二级路由  并通过vuex 来存储歌单的id值通过多组件引用
		@@接接接接口错误@@
	开发歌手列表
		对数据进行了整合 通过lazyload 对图片进行懒加载
		实现左侧歌手与右侧字母排序左右联动效果  通过元素的索引和高度判断进行联动
		实现顶部栏滑动效果 通过判断scrollY的值进行了顶部栏滑动
		通过singer-detall 歌手详情页子路由跳转到歌手详情页
	开发歌手详情页
		通过vuex来进行歌手信息和组件交互的状态管理
		相关操作 
		在state中设置了singer 初始值 
		在matutaions 设置了SEI_SINGER 常量方法 操作为将默认singer值赋值为 子组件listview中传过来带参数的歌手列表信息
		在子组件listview中触发父组件的方法selectSinger中 触发SEI_SINGER方法 将子组件带过来的singer传递给 state中的初始值
		在getters.js中进行了计算 意思就是当singer改变时 这个singer 就是 state中的singer
		这时 singer 就是 listview中 传过来的列表歌手信息了
		然后就是动画滑动操作  比如滑动高度的判定和相应的页面style属性改变	 
	开发播放器页面
		通过vuex管理播放信息  因为歌曲信息可以通过多个组件打开 所以要通过vuex中的state设置多个默认值供多组件共享
		在歌手详情页点击歌曲后 默认开始播放整个歌手的歌曲列表 并将播放属性信息 通过mutations.js触发
		如果在一个动作中多次改变mutations.js 意思就是多次触发 mutations.js中的方法 
		可以封装 actions.js 来封装mutations中多次触发的情况  一次调用mutations中的多个方法
		通过给normal设置vue动画钩子  实现专辑图片的动画效果
		通过css第三方库 create-keyframe-animation 实现css3动画
		通过playing控制大播放器和小播放器的播放按钮变化
		实现cd旋转动画  如果playing为 true 说明播放 添加类 cdCls  给大小播放器都加
		歌曲前进后退功能实现  改变当前歌曲的索引 +1或-1
			在切换下一首歌时 默认为播放状态 这时播放暂停按钮icon也要跟着变化
		如果快速点击切换歌曲按钮 歌曲会因为无法缓冲完毕而报错  这时需要判断歌曲是否已经加载完成 
			只有在加载完成本首歌之后 才可以点击下一首歌
		audio上有两个内置属性 @canplay  @error
			@canplay表示歌曲是否已经缓冲完成
			@error  表示歌曲缓冲错误或者不存在 
			@@timeupdate  表示歌曲播放事件 可以获取到播放时长
			这时可以通过这两个值规定切换歌曲按钮不能点击过快 以及出错时通过@error 跳过对切换按钮的限制
		播放进度条显示  设置公共小组件 progerss-bar 
			进度条实现效果 
				随着音乐播放实现动画效果          
				拖动进度条时 音乐随着进度条的进度播放
				点击进度条时 音乐随着点击的距离进度播放
		播放顺序控制  播放有三种模式 循环 单一 随机
	开发播放器页面获取歌词
		在  webpack.dev.conf.js中定义devServer中的app.get方法模拟请求头请求数据
		在 api/song.js中设置发送请求app.get方法模拟请求的方法
		在common/js/song.js中执行方法 发送请求	          
		通过base64方法转码 转为字符串格式的歌词
		通过第三方库lyric-parser 解析歌词的字符串格式        
			通过该库的 new Lyric类方法 获取到歌词的位置并作出判断
			通过scrollToElement方法将改歌词滚动到相对位置
		实现CD页面与歌词页面的相互切换		          
	页面优化
		在现实小播放器时 增加列表底部的bottom高度 完全显示歌单列表 就是底部增加了60px的高度 将列表都显示出来          
		修改music-list组件  添加mixin方法
		修改singer组件  添加mixin方法
	开发rank排行榜页面
		分为两个组件 rank.vue top-list.vue
		通过api/js/rank.js抓取数据
		抓取数据直接展示到页面即可
		top-list为排行榜点进去的详情页 该组件是rank的子路由组件
		在vuex中定义toplist参数 作用是接收榜单详情页的歌曲详情  作用和music-list一样    
	          然后通过top-list控制music-list控制 song-list 给song-list添加奖杯 
	开发搜索页面
		分为六个组件
		search.vue      主要的搜索组件界面
		suggest.vue     检索搜索信息的组件界面
		search-box.vue  搜索页面的搜索框组件界面
		no-result.vue       搜索暂无信息界面
		search-list.vue     搜索记录展示组件
		confirm.vue         弹窗组件
		先通过 search-box 输入框组件输入检索信息 这个信息是通过 v-model绑定的
		在输入检索信息后 由suggest.vue 组件展示检索的信息
		当没有检索到信息后 调用  no-result 组件暂时暂无信息界面
		search-list.vue主要展示搜索记录界面 包括点击跳转和删除操作
		confirm.vue是一个提示框组件  在删除全部按钮时  调用此组件 完成全部删除操作
	开发歌曲列表添加组件
		playlist.vue 组件 主要的歌曲添加界面
		player.vue   组件 主要是歌曲添加入口 播放器组件
		在点击了player.vue小播放器的添加歌曲列表时 弹出playlist.vue组件  
		点击关闭playlist.vue组件 但由于给playlist.vue组件最外层的盒子添加了关闭事件 导致无论点击盒子的哪部分都会关闭窗口
		这时需要给playlist.vue组件的盒子子内容添加 @click.stop 方法  处理事件冒泡
		获取到vuex中的sequenceList 当前播放列表 渲染到页面中
		给当前播放的 歌曲添加类样式	 切歌的话要给当前播放的歌曲添加类样式  
		判断播放模式 如果是顺序播放 直接将当前索引传递给SET_CURRENT_INDEX方法让其播放
		如果是随机播放 需要从playlist中找到对应的当前播放歌曲的id 让其播放
		如果删除某个歌曲 需要在actions中设置deleteSong方法 修改 歌曲列表 当前播放列表 和歌曲索引
	处理公共部分的方法
		由于在添加列表和player列表中都有相同功能的播放模式切换按钮
		可以通过mixin.js整合为公共方法 通过引用mixin.js进行引用操作
	添加歌曲到添加歌曲列表页面
		add-song组件 专门实现添加歌曲列表的展示
		页面分为两部分 一部分显示最近播放列表 一部分显示搜索记录列表  二者相互切换展示  用到了switches组件
		当输入框存在搜索内容时 展现搜索结果 输入框组件复用search-box组件
		歌曲播放历史通过 vuex中 actions中的savePlayHistory 存储渲染进行增加删除
		播放历史复用search-list组件  该组件为搜索记录展示组件
		
----------------------------------------------
#知识点
jsonp 跨域请求方式
    安装 npm install jsonp  
   	传入三个参数  jsonp(url,data,options)
    	第一个参数	 url 请求的地址
    	第二个参数    data 挂载到url上的数据
    	第三个参数    options 请求相关的参数

axios 模拟接口代理
	在qq音乐案例中 由于请求网址限制 不能直接拿到c.y.qq.com中的值
	可以通过axios中设置header请求头信息  模拟通过c.y.qq.com进行请求 
	这也就可以请求到qq音乐中指定网址请求的数据
	axios.get(url,header:{referer:'https://c.y.qq.com'host:'c.y.qq.com'},parmas:req.query).then()
better-scroll 第三方动画库
	父级开启better-scroll动画库
	如果子级的高度大于父级的高度 才会触发滚动
	
Vue-LazyLode  图片懒加载
	安装 npm install vue-lazyload
	引入 import Vuelazyload from 'vue-lazyload'
	注册  Vue.use(VueLazyLoad,{loading:require('图片地址')})	
		loading 后面跟着的参数是图片懒加载的默认图片
		v-lazy  指定懒加载的图片   一般用来替换 :img属性  
		
 安装 npm install jsonp  
	为了使better-scroll正常运行 要在computed dom创建之后 使用better-scroll动画效果
	默认为竖向动画 如果要设置横向动画 要为设置的元素设置宽度 一般为子元素的长度累加值
good-storage 序列化localStorage的方法库
	由于localStorage数据的存储取出均为字符串形式
	可以通过storage插件来自动序列化数据 更加方便操作

#注意事项
	1.开发轮播图组件遇到的问题
	created数据没有请求回来就要通过请求的数据执行操作 数据操作部分可能没有值
		1.在computed中设置轮播图动画宽度
		2.但由于要通过created异步请求数据
		3.如果created异步请求数据没有回来 
		4.在computed中设置轮播图动画宽度就不会有效 因为要通过请求的数据图片个数计算值
		5.这时要通过给轮播图的样式通过v-if判断是否请求回来值 如果请求回来值 再显示当前样式 这时通过数据计算的部分也已经完成
	
	2.开发scroll 滑动组件时遇到的问题	
	better-scroll在计算属性高度进行滚动动画时，一定要在dom渲染完毕之后再进行计算
	如果在异步请求数据之前完成计算 那异步请求之后数据渲染的部分不会被计算在内导致出现错误
	第一个解决方法 在computed中 dom渲染之后给元素绑定 滑动动画
	或者判断或者异步请求的数据触发dom更新之后 再给元素绑定滑动动画
 		比如 给图片设置onload事件  图片在通过异步数据获取到数据加载图片之后 会触发onload事件 证明图片已经加载完成  可以计算出正确高度
		通过 better-scroll 的refresh()方法 重新计算准备进行动画的dom的高度
		
	3.开发scroll 滑动组件时遇到的问题	
	better-scroll组件和fastclick组件点击问题产生冲突 
	因为fastclick组件会拦截点击事件 如果需要点击元素
	需要在被点击的元素上添加class类 needsclick 提醒fastclick组件该元素是要被点击的
	
	4.开发singer.vue 歌手列表时遇到的问题
	歌手的排行需要两层数组 
	第一层数组展示的是热门歌手的信息
	第二层数组需要通过A-Z字母排列的排列依次展示歌手的信息
	在渲染数据时 需要先整合热门歌手  优先展示
	然后再按照A-Z字母排列整合歌手 依次展示
	
	4.1开发singer.vue 歌手列表时遇到的问题
	实现滑动右侧字母让左侧移动原理
	预先在全局设置了一个空对象 touch 该对象存储了三个值 滑动的起始位置 滑动结束位置 滑动元素的索引值
	在点击右侧按钮时 记录初始位置  通过移动端事件 touchmove 计算滑动结束位置  计算出滑动的距离
	然后用滑动的距离/字母元素的高度  计算出滑动了几个字母的高度 就是滑动了几个索引值 
	将空对象 touch之前存储的 滑动元素的索引值 + 滑动了几个索引值 = 最终滑动的索引值
	左侧列表通过 scrollToElement方法滚动到相应的位置  
	实现滑动左侧让右侧字母高亮原理
	在scroll中设置滚动监听事件  通过scroll子组件的listenScroll触发父组件的scroll方法 获取滚动的详细纵坐标
	计算左侧每个字母元素集合的高度（group） 并集合到 listHeight中
	在列表滚动时  通过watch监控scrollY的变化 确定滚动到哪一个区间（group）
	如果停留在该区间  将该索引匹配的右侧字母的索引添加指定的类 
	
	5.开发歌手详情页
	开发歌手详情页会使用子路由 ":id" 跳转的方式跳转路由   子路由根据id跳转有两种方法  一个是通过:id传值  一个是通过:to 拼接值
	这里采用的是$router.push({path:`/singer/${singer.id}`})方式跳转  等同于:to+拼接字符串
	
	如果子组件代替了html中的元素 在父组件通过refs选取子组件需要改其 style属性时  需要在子组件和style中添加 $el  子组件.$el.style
	
	5.1开发歌手详情页父子组件传值的问题
	如果只是单独的父子组件传值可以通过 props传值  如果涉及多组件传值 可以通过vuex解决  不要为了vuex而vuex
	vuex是使用场景 
	 1.解决多个组件之间的状态共享传值  方便保存公共的数据 
	 2.解决路由之间的复杂属性传递  $route $router vuex
	 
	5.2开发开发歌手详情页之滑动组件
	如果通过$ref.xxx获得某个dom的元素 如果要为其设置style属性 要通过 $ref.xxx.$el.style = xxx  进行设置
	滑动页面时将背景图bgImg遮住的样式实现
	在list和下方歌单list组件之间设置了一层遮罩 layer
	通过监控scrollY的滑动距离 通过css3 属性transform使其滑动 进而遮挡住bgImg
	同时设置了滚动的最大高度 mintranslateY 超过这个高度时 遮罩层layer便不移动
	还有下拉拉大图片 上移高斯模糊等花边效果 均通过判断下拉列表时 scrollY > 0 来进行判断 
	
	5.3开发开发歌手详情页之随机播放全部
	这里用到了vuex中的actions.js方法  因为随机播放全部和state.js中的mode对象关联
	在actions.js方法中定义 randomplay 方法 此方法主要是定义随机播放歌曲
		执行SET_PLAY_MODE的 方法  为random随机模式
		执行SET_SEQUENCE_LIST方法 将歌手的全部歌曲传给sequenceList
		将歌手的全部歌曲 list 随机打乱更改  执行SET_PLAYLIST方法 将打乱的数组传递给playList
		执行SET_CURRENT_INDEX 方法  从打乱数组的第一个开始播放
		执行SET_PLAYING_STATE 播放歌曲
	由于随机播放之后 打乱了playList的数组 所以在点击每个歌曲的item时  歌曲的索引已经是打乱后的数组
	这是需要在通过actions.js方法中的selectPlay进行判断
		selectPlay为music-list组件中传递给state的歌手的相关数据
		由于在music-list组件中触发随机播放按钮  如果当前点击随机播放后
		传递的值要更改两个 一个是playList列表中的数据要经过随机处理  另一个是当前歌曲的索引要改为随机后的当前歌曲索引值
		如果再次点击歌手详情页的歌曲 要找到随机后的当前歌曲索引进行播放  
	
	6.开发播放器页面遇到的问题
	具体为vuex的应用
	首先是语法糖
		getters   具有映射机制 可以将state中存储的值映射到组件中  通过mapGetters
			mapGetters     getters的语法糖  使用为 ...mapGetters([state数据])
		mutations 操作state的方法 在组件中通过 xxx:mutations方法名的方式调用 mutations中的方法
			mapMutations   mutations的语法糖  使用为 ...mapMutations({方法名})
		actions   操作异步数据 或者多次调用mutations的方法时  用来封装mutations中的方法
		    mapActions  actionsmutations的语法糖   使用为 ...mapActions({方法名})	
	在开发歌手详情页时  通过vuex存储了歌手的信息通过其他组件引用
	在开发播放器页面时 通过vuex存储播放器的多个状态属性  这时要用到vuex中的多个方法共同参与
	如果需要一次性使用到mutations中多个方法 可以通过actions封装mutations中的方法 统一使用
	如果单独使用mutations中的某个方法 通过语法糖内 组件方法赋值mutations中的方法 通过this调用组建方法即可
	
	6.1开发播放器页面遇到的问题
	进度条组件的开发
		当开发进度条组件时  需要进度条实现三种状态的改变
		一个是根据当前播放歌曲的进图实现进度条动画
			通过父组件player向子组件progerss-bar.vue传递播放比例值
			播放比例通过 当前播放事件/总播放时间获得
		一个是根据手指拖动进度条的距离 实现歌曲对应时间的播放
			在进度条上监听移动端点击事件 移动端滑动事件 移动端滑动结束事件
			在点击时记录坐标 滑动时记录坐标 二者的差值就是进度条需要偏移的距离
		一个是根据手指点击进度条的距离 实现歌曲对应时间的播放
			原理和手指拖动一样 在点击了固定距离后 通过_triggerPercent() 传递给父元素进行相应的歌曲进度改变
	原型进度条的开发
		给小播放器的开关按钮设置一个圆形进度条  用svg图进行设置
		两个主要属性
			stroke-dasharray   表示svg圆形的周长
			stroke-dashoffset  计算svg图片进度与歌曲进度的映射
			传入的值有两个 一个是控制图片的大小   一个是歌曲的进度 通过 dashOffset计算属性映射给 stroke-dashoffse
	播放模式的控制  三种播放模式   顺序 随机 单一
	通过控制changeMode方法 来控制相应的播放模式
			如果是随机播放 通过 封装的util.js打乱playlist播放歌曲数组
			如果是顺序播放 直接按照playlist播放歌曲数组播放
			有个前提 其中state.currentSong是根据playlist的数组获得的
		          如果要改变playlist播放数组 首先要固定 state.currentSong的值
		          使playlist得列表格式与sequenceList的格式一致 这样歌曲的id不会随意更改
		          其实state.sequenceList是作为播放模式的列表 没有什么卵用 
	播放器cd页面和歌词页面的切换
	通过移动端的touch事件方法判断后进行切换
		 @touchstart  设置一个falg判断先进性了点击事件 计算当前点击时的 X Y 轴坐标
         @touchmove 只有当点击事件触发后 才可以触发move滑动事件  计算滑动后距离点击事件的 X Y 轴坐标差值 意思就是滑动的距离
         	判断一下只有当横向移动时才判断切换滑动  竖向一般为歌词页面滑动 不计算在滑动范围内
         	还要进行两种判断 
         		当左滑时  判断左侧滑动了多少距离(负值) 将右侧的歌词页面向左移动多少距离     在最左侧停止  就是歌曲歌词页面
         		当右滑时 判断右侧滑动了多少距离 (正值) 将左侧的 cd 页面向右移动多少距离    在最预测停止  就是歌曲cd页面
         	还有锁定一个值
         		percent 滑动的距离相对于屏幕宽度的比例 意思就是滑动了页面的百分之多少	
         @touchend 当滑动停止时 判断滑动了距离 
         	从右向左滑动  
         		判断currentShow如果是cd 那就是cd页面  如果percent 大于 10% 就等于进入了歌词页面  currentShow就是 lyric
         		如果没有滑动了20% 将滑动的距离设置为0 意思就是返回原来的位置  
         	从左向右滑动 
         	    就是从歌词页面滑动到cd页面 如果    percent 小于90% 就等于进入了cd页面 currentShow就是 cd
	 			如果没有滑动了80% 将滑动的距离设置为-window.innerwidth 意思就是返回原来的位置  
	7.开发搜索页面遇到的问题
		搜索页面有三个组件构成
			父search组件             搜索页面的主体组件
			子search-box组件   相关搜索热门搜索的展示组件
			子suggest组件          搜索页面的搜索数据列表组件
		组件间交互要点	
		主要是如何将search-box组件搜索框中的数据query传递给其他组件使用
		这里主要是通过子search-box组件将query值传递给父组件search组件  由search组件派发给子suggest组件			
	 	子suggest组件通过query值请求服务端返回数据并渲染页面
	 	将值通过formatterSong方法格式化 拥有相关的数据详情		
	7.1 实现下拉加载功能
		主要是通过scroll组件进行功能扩展 为scroll组件添加 pullup数据
		当scroll组件接收到pullup数据 判断已经滚动到底部 触发父组件suggest组件方法 scrollToEnd
		在父组件suggest组件中下拉请求数据信息  如果数据都请求完毕 不再请求 
		将数据通过concat数组方法进行拼接 这样才可以展示之前的数据和现在的数据 如果直接赋值会覆盖之前的数据
		当query值发生了改变后 重新指定scroll的位置 让其在顶部 显示正常格式的数据（从头开始）
		下拉加载和上拉刷新原理相似 主要是判断scroll.y的位置 如果达到预定位置（位置大于0） 触发父组件的方法实现数据重新请求
	7.2点击搜索结果的某个值
		在搜索结果映射到搜索页面上时 会出现两个值 一个是歌手的列表 一个是歌曲的列表
		歌手的列表 点击后跳转相应歌手界面 要通过vuex中的SET_SINGER方法 传入歌手的信息 以便其他组件使用
		歌曲的列表 点击后为当前歌曲列表增加歌曲 需要修改歌曲列表 如果歌曲已经存在 要删除之前存在的歌曲 需要操作actions方法
	7.3截留函数 如果通过v-model触发方法 那么每修改一个字符 都会触发v-model方法 会造成浏览器性能浪费
		解决：设置一个截留函数 当v-model修改超过200mm之后 再出发v-model方法  这样就不会修改后实时更新 而是在
	7.4搜索结果列表滚动时 收起移动端弹起的键盘
		当给输入框输入值时 会触发移动端的键盘事件 弹起手机键盘
		解决：在滚动搜索结果列表时 	对input设置 blur事件失去焦点 手机键盘就自动收起来了
	7.5搜索历史的实现  因为搜索历史在搜索search组件和添加歌曲组件页面 需要在vuex中进行设置
	         当搜索结果页面点击搜索结果的列表项时  触发 搜索历史 searchHistory的state值
	         将歌曲的信息传递到了SET_SEARCH_HISTORY方法中 修改state.searchHistory的值 该值存储的就是点击的列表项	         		
		通过本地存储localStorage 存储搜索记录 这里用到了 good-storage 序列化插件 方便存储值
		存储值的限制 如果有重复的删除重复的 如果有条数限制 删除最开始的条数  最新的条数在最前面	
		在vuex中actions.js方法中设置 saveSearchHistory方法 
		该方法触发 SET_SEARCH_HISTORY方法 将localStorage序列化后的值传入存储到tate.searchHistory中	
		删除搜索历史
		分为两个部分 一个是删除单个搜索记录 一个是删除全部搜索记录
		由于SET_SEARCH_HISTORY方法只负责将传入的数组值定义给state.searchHistory 
		所以可以通过SET_SEARCH_HISTORY方法代理删除搜索记录操作 
		在cache.js中定义删除单个搜索记录和删除多个搜索记录
			删除单个搜索记录原理为 通过findIndex查找当前数组有没有要删除的值 如果用则通过splice删除
			删除全部搜索记录原理为 通过localStorage.remove方法 直接删除key的全部值
			要删除全部搜索记录 最好做一个确定拦截方法  避免误操作删除全部的搜索记录
	7.6通过mixin对公共方法的封装
		思路：在开发playlist组件时 遇到了和player组件一样的控制播放状态的按钮方法 iconMode
		为了提高开发效率 可以将不同组件中的公共方法通过 mixin.js方法进行封装 然后在不同组件中引用加载
		无论是共享的事件方法 计算方法 vuex中的mutations.js方法 getters中的计算方法 都可以通过mixin.js方法进行共享
		但如果使用了mixin.js实现共享方法 那么在组件中要清除相关的引入插件 方法等代码 以免代码重合报错
		在此开发项目中 可以用过mixin.js实现方法共享
			player组件和playlist组件有公共方法
			search组件和add-song组件有公共方法 
	8.0完结
		创建服务器，可以通过sever创建node服务器进行启动
		路由懒加载	为了实现浏览器节流和减少请求 可以对路由进行异步加载 通过webpack进行操作
		vconsole 微信开发的调试工具 用于移动端的调试
			
#开发心得
	很多小功能都进行了封装化和组件化
		API请求数据的js封装
		common/js 功能js的封装
		baseComponents 功能小型组件的组件化
		
	常见内容为 <slot>的空内容组件  父元素通过slot填内容  这个组件的目的一般用来进行某个区域遍历展示数据或者区域动画
	
	如果想抓取某个元素设置style样式 或者进行操作  最简单的方法是通过 ref="xxx" 对该元素进行抓取
	
	vuex的应用
	1.首先在state.js中定义原始数据  定义的是模块或者组件相关的数据交互默认值
	2.在getter.js中对数据进行映射   根据state中的不同值计算出新的值           和computed中计算属性一样 当数据更新或变化时计算属性
	3.在mutations.js中定义对state中数据修改逻辑 第一个是state 第二个是传入的值
		3.1 在mutation-types.js中定义修改方法的常量  大写字母
	
	vue	本身不难 主要分为数据的遍历渲染 和 事件触发处理
		个人因素：难的是对数据的JS处理  如何得到自己想要的数据格式  以及对象和数组处理数据的做法
		
	
	2018/11/29更新
	新版取消dev-server文件  解决方法为在config/index.js中使用ProxyTable反向代理
	   意思就是在ProxyTable中模拟qq音乐网站请求头信息 不是通过教材上的 dev-server方式请求
	   在recommend.js文件中 还是通过axios带参数的方式请求数据
	   最后在recommend.vue中执行请求事件
	   
	2018/12/03更新
	新版对播放源重新做了限制  添加了新参数  vkey 需要进行获取 
	解决方法
	设置一个 getSongVKey方法请求 vkey的相关数据  带有相关参数
	在 getSongURL 通过getSongVKey请求相关歌手的mid  data是返回值   拼接到url上
	 url必带两个参数 
		songMid  data.songmid 
		vkey     ${data.data.items[0].vkey}   至今不知道怎么获取到vkey		
	返回一个 async关键字的  formatterSong 方法 用来过滤歌手的详细信息
	在singer-detall中引用 formatterSong方法  这是一个异步方法  当url的内容请求到后 做相应处理
	
	2018/12/04
	爆出黄绿色错误  
		Unable to preventDefault inside passive event listener due to target being treated as passive
		译：由于目标被视为被动事件监听器，无法阻止默认设置
		意思就是给移动端事件加了.prevent 阻止默认事件 导致Chrome浏览器报错
	两处错误
	在点击歌手列表页回退按钮时出现  
		解决方法   清除   create-keyframe-animation  疑似动画库在使用addeventlistener时  暂时消失
		所以在开发时省略了 大图小图动画显示
	在歌曲播放完毕拖动滚动条时出现
		解决方法  无

	























<template>
  <div class="song-list">
    <ul>
      <li class="item" v-for="(song, index) in songs" @click="selctItem(song,index)" :key="index">
        <div class="rank" v-show="rank">
          <span :class="getRankCls(index)" v-text="getRankText(index)"></span>
        </div>
        <div class="content">
          <h2 class="name">{{song.name}}</h2>
          <p class="desc">{{getDesc(song)}}</p>
        </div>
      </li>
    </ul>
  </div>
</template>

<script type="text/ecmascript-6">
	export default {
//		接收一个空数组用来遍历  接受排行榜组件传过来的布尔值
		props:{
			songs:{
				type:Array,
				default:[]
			},
			rank:{
				type:Boolean,
				default:false
			}
		},
		methods:{
//			通过方法来过滤数据 原理和 filter一样
			getDesc(song){
				return `${song.singer}.${song.album}`	
			},
			//点击列表的歌曲 实现路由跳转 派发给父组件触发事件 传递的是当前的歌曲信息和索引
			selctItem(item,index){
				this.$emit('select',item,index)
			},
//			控制排行榜是否显示奖杯  如果index索引大于2  就是奖杯 否则就是文字
			getRankCls(index){
				if(index <= 2){
					return `icon icon${index}`
				}else{
					return 'text'
				}
			},
//			控制排行榜内容显示的文字
			getRankText(index){
				if(index > 2){
					return index + 1
				}
			}
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-image('first')
          &.icon1
            bg-image('second')
          &.icon2
            bg-image('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>
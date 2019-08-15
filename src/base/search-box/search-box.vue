<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="query" v-model="query" class="box" :placeholder="placeholder"/>
    <i @click="clear" v-show="query" class="icon-dismiss"></i>
  </div>
</template>

<script type="text/ecmascript-6">
//	截留方法 控制query的实时更新
  import {debounce} from 'common/js/util'

  export default {
  	/*
  	 * placeholder 默认传入的placeholder搜索框文字展示
  	 * */
    props: {
      placeholder: {
        type: String,
        default: '搜索歌曲、歌手'
      }
    },
    data() {
      return {
//    	与搜索框双向绑定的值
        query: ''
      }
    },
    methods: {
//  	清空输入的值  清空双向绑定的值即可
      clear() {
        this.query = ''
      },
//    接收新的query值 映射到搜索框中
      setQuery(query) {
        this.query = query
      },
//    失去焦点方法 等待父元素search通过$refs调用
      blur() {
        this.$refs.query.blur()
      }
    },
    created() {
//  	将双向绑定的值query暴露给其他组件  将query改变时 触发父组件的query方法 将修改的值传递过去  延时执行query的变化
      this.$watch('query', debounce((newQuery) => {
        this.$emit('query', newQuery)
      }, 200))
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
<template>
  <ul class="switches">
    <li class="switch-item" v-for="(item,index) in switches" :class="{'active':currentIndex === index}"
        @click="switchItem(index)">
      <span>{{item.name}} </span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
//  	tab切换的文字展示  是一个数组 一个索引为一个tab 
      switches: {
        type: Array,
        default: []
      },
//    默认显示的索引值 决定哪一个元素为高亮显示
      currentIndex: {
        type: Number,
        default: 0
      }
    },
    methods: {
//  	控制切换显示高亮  派发事件 派发到add-song上
      switchItem(index) {
        this.$emit('switch', index)
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>
<template>
	<div class="app">
		<!--头部组件m-header-->
		<m-header></m-header>
		<!--头部下方tab切换栏-->
		<tab></tab>
		<!--通过keep-alive缓存路由-->
		<keep-alive>
			<router-view></router-view>
		</keep-alive>
		<!--底部播放器组件player-->
		<player></player>
	</div>
</template>

<script type="text/javascript">
	import MHeader from 'components/m-header/m-header.vue'
	import Tab from 'components/tab/tab.vue'
	import player from 'components/player/player.vue'
	export default {
		data(){
	    	return{
	    		
	    	}
	   },
	   components:{
	    		MHeader,
	    		Tab,
	    		player
	    	}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
	/*@import "~common/stylus/variable.styl"
	#app
		color:$color-theme*/
</style>
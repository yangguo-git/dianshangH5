<template>
	<!-- <div class="bottomPart"> -->
		<van-tabbar v-model="active" route>
			<van-tabbar-item replace to="/ui/home" class="iconBox">
				<template #icon="props">
				   <img :src="props.active ? homeIcon.active : homeIcon.inactive" />
				</template>
				<span>首页</span>
			</van-tabbar-item>
			<van-tabbar-item replace to="/ui/part" class="iconBox">
				<template #icon="props">
				   <img :src="props.active ? partIcon.active : partIcon.inactive" />
				</template>
				<span>分类</span>
			</van-tabbar-item>
			<van-tabbar-item replace to="/ui/mine" class="iconBox">
				<template #icon="props">
				   <img :src="props.active ? mineIcon.active : mineIcon.inactive" />
				</template>
				<span>我的</span>
			</van-tabbar-item>
		</van-tabbar>
	<!-- </div> -->
</template>
<script>
	export default {
		data() {
			return {
				active: 0,
				homeIcon:{
					active: require('../assets/images/home2.png'),
                    inactive: require('../assets/images/home1.png'),
				},
				mineIcon:{
					active: require('../assets/images/mine2.png'),
                    inactive: require('../assets/images/mine1.png'),
				},
				partIcon:{
					active: require('../assets/images/part2.png'),
                    inactive: require('../assets/images/part1.png'),
				}
			}
		},
		methods: {

		}
	}
</script>
<style scoped>
</style>

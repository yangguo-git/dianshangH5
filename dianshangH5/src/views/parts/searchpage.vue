<template>
	<div class="searchPage">
		<van-search v-model="searchValue" show-action  autofocus=true  placeholder="请输入商品名称" @search="onSearch" shape="round">
			 <template #left>
				<van-icon name="arrow-left" size="20" @click="backPart" />
			</template>
			 <template #action>
				<span @click="onSearch">搜索</span>
			</template>
		</van-search>
		<div class="goodsShowPart" v-if="isSearch">
			<van-card :price="(items.salePrice/100) | postNum" :title="items.productName" :thumb="items.thumbnailImgUrl" v-for="items in goodList" :key="items.id" @click="goDetails(items.id)">
				<template #tags>
					<van-tag plain type="default">{{items.productSubtitle}}</van-tag>
					<van-tag plain type="default">{{items.intro}}</van-tag>
				</template>
				<template #num>
					<van-icon class="iconfont" class-prefix='icon' name='tianjia' size="18" />
				</template>
			</van-card>
		</div>
		<div v-else class="noProduct">
			<!-- 暂无商品 -->
		</div>
	</div>
</template>
<script>
 import unils from "../../assets/js/common.js"
	export default {
		data() {
			return {
				searchValue: '',
				isSearch:false
			}
		},
		methods: {
			onSearch() {//弹起键盘
			   if(this.searchValue == ''){
				   this.$toast('请入要搜索的商品名称');
			   }else{

			   this.$get('/client/product/list',{
					productName:this.searchValue
				}).then(res=>{
					this.goodList = res.data.data.list;
					if(this.goodList.length > 0){
						this.isSearch = true;
					}else{
						this.isSearch = false;
					}
				})

			   }
               
			},
			backPart() {
				this.$router.push('/ui/part')
			},
			goDetails(id){
				this.$router.push({
					name:'productdetail',
					params:{
						id:id
					}
				})
				//存储ID
				sessionStorage.setItem('proId',id);
			}
		},
		filters:{
			postNum(value){
               return unils.hasDot(value);
			}
		}

	}
</script>
<style scoped>
.icon-tianjia{
	color: #f97c34;
}
.van-hairline--surround::after {
		border: none;
	}
	.goodsShowPart{
		margin-top: 10px;
	}
	.noProduct{
		text-align: center;
		font-size: 40px;
		margin-top: 40px;
	}
</style>

<template>
	<div class="mainPart">
		<header-vue title='分类'></header-vue>
		<div class="partContent">
			<div class="partSearch">
				<van-search  v-model="value" shape="round" placeholder="请输入商品名称" :clearable='isClear' @focus="focusJump" />
			</div>
			<!-- 加载 -->
			<div v-if="isLoading" class="loadingWrap">
                <van-loading type="spinner" size="20px" />
			</div>
			<!-- 加载 -->
			<div class="partBox">
				<div class="sidebarBox">
					<van-sidebar v-model="activeKey" @change="onChange">
						<van-sidebar-item :title="item.categoryName" v-for="item in filterCate" :key="item.id"/>
					</van-sidebar>
				</div>

				<div class="goodsWrap">
					<div class="posiBox" v-for="outItem in goodList" :key="outItem.categoryName">
						<span class="secondTitle">{{outItem.categoryName}}</span>
						<van-card :price="(items.salePrice/100) | postNum" :origin-price="(items.marketPrice/100)|postNum" :title="items.productName" :thumb="items.thumbnailImgUrl" v-for="items in outItem.productList" :key="items.id" @click="goDetails(items.id)">
							<template #tags>
								<van-tag plain type="default">{{items.productSubtitle}}</van-tag>
								<van-tag plain type="default">{{items.intro}}</van-tag>
							</template>
							<template #num>
							<van-icon class="iconfont" class-prefix='icon' name='tianjia' size="18" />
							</template>
						</van-card>
					</div>
				</div>
			</div>

		</div>
		<footer-vue></footer-vue>
	</div>
</template>
<script>
    import wx from 'weixin-js-sdk'
    import unils from "../../assets/js/common.js"
	import Header from '../../components/header'
	import Footer from '../../components/footer'
	export default {
		data() {
			return {
				value: '',
				activeKey: 0,
				isClear: false,
				typeArr:[],
				goodList:[],
				isPartshow:false,
				isLoading:true,
				filterCate:[]
			}
		},
		methods: {
			onChange(index) {
				var clickId = this.filterCate[index].id;
				this.$get('/client/product/categoryQuery',{
						categoryId:clickId
					}).then(res=>{
						this.goodList = res.data.data;
					})
			},
			focusJump() {
				this.$router.push('/ui/searchpage')
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
		components: {
			headerVue: Header,
			footerVue: Footer
		},
		filters:{
			postNum(value){
               return unils.hasDot(value);
			}

		},
		created(){
			//获取分类
			this.$get('/client/product/categoryList').then((response)=> {
				if(response.data.status == 0){
					this.typeArr = response.data.data;
					//分类过滤
					var filterArr = this.typeArr.filter(function(cateItems){
						return cateItems.parentId == '';
					})
					this.filterCate = filterArr;
					var firstTypeId = filterArr[0].id;
					if(this.typeArr.length > 0){
						this.isLoading = false;
						this.isPartshow = true;
					}else{
						this.isLoading = false;
						this.isPartshow = false;
					}
				//获取
				this.$get('/client/product/categoryQuery',{
						categoryId:firstTypeId
					}).then(res=>{
						this.goodList = res.data.data;
					})
					
				}
				
            })
            
		},
		mounted(){
			 wx.hideOptionMenu();
		}
	}
</script>

<style scoped>
.icon-tianjia{
	color: #f97c34;
}
.partContent{
	margin-top: 100px;
}
	.partBox {
		display: flex;
		margin: 15px 10px 0px 0px;
	}
	/* 内容区 */
	.partContent .van-hairline--surround::after {
		border: none;
	}
	.goodsWrap {
		flex: 1;
	}
	.van-card__title {
	font-size: 13px;
}
.loadingWrap{
 text-align: center;
}
.sidebarBox{
  overflow-y: scroll;
}
.goodsWrap{
  overflow-y: scroll;
}
.partBox{
	height: 72vh;
}
.secondTitle{
	font-size: 28px;
	padding:0px 0px 10px 0px;
}
.posiBox{
	display: flex;
	flex-direction: column;
	height: 71vh;
}
</style>

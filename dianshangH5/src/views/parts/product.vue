<template>
	<div>
		<header-vue title='商品详情' isDetail=1></header-vue>
		<van-swipe class="my-swipe swiperTop" indicator-color="white" @change="onChange" :loop='loops'>
			<van-swipe-item v-for="(image,indexs) in swiperList" :key="indexs" @click="picBanner(indexs)">
				    <img :src="image.url">
			</van-swipe-item>
			<template #indicator>
				<div class="custom-indicator">
					{{ current + 1 }}/{{swiperList.length}}
				</div>
			</template>

		</van-swipe>
		<!-- productDetail.coverImgUrl -->
		<ul class="goodSecrac">
			<li>
				<span>¥</span>
				<strong>{{(mainInfo.salePrice/100)| postNum}}</strong>
			</li>
			<li>{{mainInfo.productName}}</li>
			<li>{{mainInfo.intro}}</li>
			<li class="lastBottom">
				<span>
					<strong>已售:</strong>
					<strong>{{mainInfo.sales}}</strong>
				</span>
			</li>
			<li>
			</li>
		</ul>

		<div class="middleCommon">
			<span>
				<em>主体:</em>
				<span>{{mainInfo.productName}}</span>
			</span>
			<span @click="lookDialog">
				<img src="../../assets/images/point.png" alt="" class="iconClass">
			</span>
		</div>
		<!-- 说明 -->
		<div class="middleCommon">
			<span class="lastMing">
				<em>说明</em>
				<strong v-if="mainInfo.showSafeguard">
					<van-icon name="passed" class="rightIcon" />
					<em>七天无理由退货</em>
				</strong>
				<strong v-if="isBaoyou">
					<van-icon name="passed" class="rightIcon" />
					<em>包邮</em>
				</strong>
			</span>
		</div>
		<!-- 详细信息 -->
		<div class="bottomDetail">
			<p>详情</p>
			<div v-html="mainInfo.parameter">
			</div>
		</div>
		<!-- 底部 -->
		<div class="skuContainer">
			<van-sku  v-model="showBase" :initial-sku="skudata.initialSku" :sku="skudata.sku" :hide-stock="isXianshi" :goods="skudata.goods_info"
			 reset-stepper-on-hide reset-selected-sku-on-hide disable-stepper-input :close-on-click-overlay="closeOnClickOverlay"
			 @buy-clicked="onBuyClicked" :show-add-cart-btn="isShowCar" :preview-on-click-image ="isProview" @sku-selected = "changeSelected"/>
			<van-button block @click="nowBuy" round>
				立即购买
			</van-button>
		</div>
        <!--自定义  -->
        <van-action-sheet v-model="isDiyshow" title="标题">
             <div class="content">内容</div>
             <van-button round type="info" size="large">立即购买</van-button>
        </van-action-sheet>
        <!--自定义  -->

	</div>
</template>
<script>
	import {
		ImagePreview
	} from 'vant';
	import Header from '../../components/header'
	import unils from "../../assets/js/common.js"
	import Vue from 'vue'
	export default {
		data() {
			return {
				ImagePreviewShow: false,
				mainInfo: '',
				current: 0,
				loops: false,
				show: false,
				skudata: {
					sku:{
						tree:[],
					    list:[],
					},
					goods_id: '',
					goods_info: {
						title: '',
						picture: ''
					},
					initialSku: {
						
					}
				},
				showBase: false,
				closeOnClickOverlay: true,
				isShowCar: false,
				isClose: false,
				index: 0,
				productDetail: '',
				isBaoyou: false,
				isXianshi: true,
				isDianshow: false,
				sku: '',
				swiperList:[],
				isProview:false,
                alreadyArr:[],
                isDiyshow:false
			}
		},
		methods: {
			changeSelected(ele){
				// console.log(ele.selectedSku)
			},
			picBanner(index) {
				this.ImagePreviewShow = true;
				this.current = index;
			},
			onChange(index) {
				this.current = index;
			},
			onBuyClicked(data) {//点击购买
			    console.log(data);
				var hasChoose = data.selectedSkuComb;
				var getAttr1 = hasChoose.attr1;
				var getAttr2 = hasChoose.attr2;
				var getAttr3 = hasChoose.attr3;
				var saveChoseNormal = '';
				this.biJiaoArr.forEach(function(objs){
					if(objs.productNorm.attr1 == getAttr1){
					   
					   if(objs.productNorm.attr2){
						   if(objs.productNorm.attr2 == getAttr2){
							   saveChoseNormal = objs;
							   if(objs.productNorm.attr3 == getAttr3){
								   saveChoseNormal = objs;
							   }else{
                                   saveChoseNormal = objs;
							   }
						   }
					   }else{
						       saveChoseNormal = objs;
					   }
					}
				})
                //跳转
				this.$router.push({
					name:'confirmOrder',
					params:{
						submitData:data,
						postData:this.productDetail,
						saveChoseNormal:saveChoseNormal
					}
				})
				//存储
				sessionStorage.setItem('submitData',JSON.stringify(data));
				sessionStorage.setItem('postData',JSON.stringify(this.productDetail));
				sessionStorage.setItem('normalData',JSON.stringify(saveChoseNormal));
			},
			lookDialog() {
				this.isDiyshow = true;
			},
			nowBuy() { //点购买
				this.showBase = true;
			}
		},
		filters: {
			postNum(value) {
				return unils.hasDot(value);
			}
		},
		components: {
			headerVue: Header,
		},
		mounted() { //获取详情
			var getParams = this.$route.params;
			var productId;
			if (getParams.id) {
				productId = getParams.id;
			} else {
				var getStore = sessionStorage.getItem('proId');
				productId = getStore;
			}
			//获取
			this.$get('/client/product/productInfo', {
				productId: productId
			}).then((res) => {
				if (res.data.status == 0) {
					this.productDetail = res.data.data;
					//商品信息
					this.mainInfo = res.data.data.productInfo;
					this.swiperList =JSON.parse(this.mainInfo.coverImgUrl);
					//数据
					var arr1 = res.data.data.attrList;//属性列表
					var arr2 = res.data.data.normList;//规格列表
					this.biJiaoArr = arr2;
					var listArr = [];
					var treeArr = [];
					var num = 0;
					arr1.forEach((objs)=> {
						var innerArr = [];
						objs.attrValue.forEach((innerObj)=> {
							if (objs.attrName == innerObj.attrName) {
								innerArr.push({
									id: innerObj.id,
									name: innerObj.attrValue,
									previewImgUrl: this.mainInfo.thumbnailImgUrl
								})
							}

						})

						num++;
						treeArr.push({
							k: objs.attrName,
							v: innerArr,
							k_s: 'attr' + num
						})

					})
					//规格列表 normList
					arr2.forEach(function(objs) {
						listArr.push({
							price: objs.productNorm.price, //价格
							attr1: objs.productNorm.attr1||'',
							attr2: objs.productNorm.attr2||'',
							attr3: objs.productNorm.attr3||'',
							stock_num: objs.productNorm.sku //库存 
						})
					})
					//初始
					var initialData = {
						attr1:listArr[0].attr1 ||0,
						attr2:listArr[0].attr2 ||0,
						attr3:listArr[0].attr3 ||0,
						selectedNum:1
					};
					//数据组合
					var newObjs = {
						sku:{
							tree: treeArr,
							list: listArr,
							price: '0.00'
						}
					}
					
					Vue.set(this.skudata, 'sku', this.sku);
					Vue.set(this.skudata, 'initialSku',initialData);
					Object.assign(this.skudata,newObjs);
				} else {
					this.$toast("获取信息失败")
				}

			})

		}

	}
</script>
<style scoped>
	.swiperTop {
		margin-top: 100px;
	}

	.bottomDetail>p {
		font-size: 40px;
		padding-left: 20px;
	}

	.bottomDetail {
		margin-top: 15px;
		background-color: white;
		overflow-y: scroll;
	}

	.bottomDetail img {
		width: 100%;
		height: 100%;
	}

	.rightIcon {
		color: #f97c34;
		padding-left: 10px;
		font-size: 30px;
	}

	.middleCommon {
		font-size: 28px;
		padding-left: 20px;
		padding-right: 20px;
		display: flex;
		justify-content: space-between;
		margin-bottom: 10px;
		background-color: white;
		margin-top: 10px;
		align-items: center;
		padding-top: 15px;
		padding-bottom: 15px;
	}

	.middleCommon>span {
		display: flex;
		align-items: center;
	}

	.lastBottom {
		display: flex;
		justify-content: space-between;
	}

	.goodSecrac {
		display: flex;
		flex-direction: column;
		background-color: white;
		padding-left: 10px;
		padding-right: 10px;
	}

	/* 轮播图 */
	img {
		width: 100%;
		height: 100%;
		pointer-events: none;
	}

	.custom-indicator {
		position: absolute;
		right: 25px;
		bottom: 55px;
		font-size: 32px;
		padding: 8px 18px 8px 18px;
		border-radius: 115px;
		background: rgba(169, 168, 168, 0.8);
		width: 90px;
		text-align: center;
		color: white;
	}

	.goodSecrac li {
		margin-bottom: 20px;
		margin-left: 10px;
		margin-right: 10px;
	}

	.goodSecrac li:nth-child(1) strong {
		color: red;
		font-size: 50px;
	}

	.goodSecrac li:nth-child(1) span {
		color: red;
		font-size: 30px;
	}

	.goodSecrac li:nth-child(2) {
		color: #323233;
		font-size: 35px;
	}

	.goodSecrac li:nth-child(3) {
		font-size: 28px;
		color: #969799;
	}

	.goodSecrac li:nth-child(4) {
		font-size: 28px;
	}

	/* 添加商品 */
	.skuContainer {
		position: fixed;
		bottom: 0px;
		width: 100%;
	}

	.lastMing {
		justify-content: space-between;
		width: 100%;
	}

	.lastMing strong {
		display: flex;
		align-items: center;
	}

	.van-button--round {
		background: linear-gradient(to right, #fe9930, #f7631f);
		color: white;
		border-color: #fe9930;
	}

	.contentSheet {
		height: 500px;
	}

	.middleCommon .iconClass {
		width: 40px;
	}
    /* 自定义面板 */
.content {
    height: 650px;
  }
</style>

<template>
	<!-- 待付款 -->
	<div class="ordersParts">
		<header-vue title='我的' isDetail=1></header-vue>
		<div class="orderBottom">
			<p class="danTitle">待付款订单</p>
			<div v-if="isLoading" class="loadingWrap">
                <van-loading type="spinner" size="20px" />
			</div>
			<!-- 无订单 -->
			<div v-if="isEmpty" class="emptyOredr">
				暂无相关订单
			</div>
			<div v-if="allOrderList.length > 0">
				<div class="everyOrder" v-for="items in allOrderList" :key="items.id">
					<div class="orderTitles">
						<span>订单编号:</span>
						<span>{{items.orderCode}}</span>
						<span class="orderStatus">{{items.orderStatusStr}}</span>
					</div>
					<div class="goodsWrap" v-for="goods in items.goodsVOList" :key="goods.attrId">
						<van-card :num="goods.count" :price="goods.price" :title="goods.productName" :thumb="goods.thumbnailImgUrl">
							<template #tags>
								<van-tag plain type="default">{{goods.productAttr}}</van-tag>
							</template>
						</van-card>
					</div>
					<!-- 待付款 101-->
					<div class="bottomParts">
						<van-button @click="goDetail(items)" round size="small">查看详情</van-button>
						<van-button @click="payMoney(items)" round class="zhifuBtn" size="small">在线支付</van-button>
					</div>
				</div>
			</div>
			<!-- 到底了 -->
			<div class="receiveBottom" v-if="allOrderList.length>10">
				<p>已经到底了哦</p>
			</div>

		</div>
	</div>
</template>
<script>
	import Header from '../../components/header'
	import wx from 'weixin-js-sdk'
	export default {
		data() {
			return {
				allOrderList: [],
				postUrl:'',
				isLoading:true,
				isEmpty:false

			}
		},
		components: {
			headerVue: Header,
		},
		methods: {
			goAfterSale() {
				this.$router.push("/ui/aftersaleapply")
			},
			goDetail(detailData) {
				this.$router.push({
					name: 'orderDetail',
					params: {
						detailData
					}
				})
			},
			payMoney(detail) {//点击在线支付
				//获取wx配置
				this.$postImg('/order/getJsSdkConfig', {
					url:this.postUrl
				}).then(res => {
					var configObj = res.data.data;
					let {debug,appId,timestamp,nonceStr,signature,jsApiList} = configObj;
						wx.config({
							debug: debug,
							appId: appId, 
							timestamp: timestamp, 
							nonceStr: nonceStr, 
							signature: signature,
							jsApiList: jsApiList 
						});
						//成功
						wx.ready(function(res) {
							console.log("jssdk---");
						});
				})
				var orderObj = {
					orderCode: detail.orderCode,
					productId: detail.goodsVOList[0].productId,
					productNormCode: detail.goodsVOList[0].productNormCode || '',
					productNormId: detail.goodsVOList[0].productNormId,
					totalFee: (detail.totalPrice)
				}
				//调接口 返回支付需要相关数据
				this.$post('/order/pay', orderObj).then(res => {
					if (res.data.status == 0) {
						var getWxabout = res.data.data;
						var thatVm = this;
						wx.chooseWXPay({
							timestamp: getWxabout.timeStamp,
							nonceStr: getWxabout.nonceStr,
							package: getWxabout.wxPackage,
							signType: getWxabout.signType,
							paySign: getWxabout.paySign,
							success: function(res) {
								if(res.errMsg === 'chooseWXPay:ok'){
									thatVm.$router.replace('/ui/waitpay')
								}
							},
							fail: function (res) {// 支付失败回调函数
								thatVm.$toast(res)
							}

						})
					}
				})

			}
		},
		created() { //查询所有订单
			this.$get('/order').then((res) => {
				if (res.data.status == 0) {
					var searchData = res.data.data;
					var fileArr = [];
					searchData.forEach(function(item) {
						if (item.orderStatus == 101) {
							fileArr.push(item);
						}
					})
					this.allOrderList = fileArr;
					if(this.allOrderList.length>0){
						this.isLoading = false;
						this.isEmpty = false;
					}else{
						this.isLoading = false;
						this.isEmpty = true;
					}
				} else {
					this.$toast("获取订单失败")
				}
			})
			//获取
			var getUrl = window.location.href;
			if(!getUrl.match(/\?/)) {
				　location.replace(window.location.href.split('#')[0] + '?' + window.location.hash);
			}
			var turl= getUrl.split("?")[0];
			this.postUrl = turl;
		}
	}
</script>

<style scoped>
	.ordersParts .van-hairline--surround::after {
		border: none;
	}
	.danTitle {
		font-size: 32px;
		color: black;
		padding-left: 20px;
		background: white;
		height: 80px;
		line-height: 80px;
	}

	.orderBottom {
		margin-top: 110px;
	}
	.orderTitles {
		font-size: 30px;
		display: flex;
		justify-content: space-around;
		padding-top: 20px;
		padding-bottom: 10px;
		align-items: center;
	}
	.everyOrder {
		background-color: white;
		margin-bottom: 15px;
	}

	.bottomParts {
		text-align: center;
		border-top: 1px solid #e4e4e4;
		display: flex;
		justify-content: flex-end;
		padding: 25px 0px;
	}

	.bottomParts .van-button {
		width: 80px;
		margin-right: 5px;
	}

	.orderStatus {
		color: #f97c34;
	}

	.zhifuBtn {
		color: #f97c34;
		border-color: #f97c34;
	}

	.van-card__title {
		font-size: 14px;
		padding-bottom: 5px;
	}

	.van-card__num {
		color: black;
		font-size: 14px;
	}

	.emptyOredr {
		text-align: center;
		font-size: 30px;
	}
	.loadingWrap{
		text-align: center;
	}
	.receiveBottom{
		text-align: center;
		width: 100%;
		font-size: 28px;
	}
</style>

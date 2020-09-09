<template>
	<div class="orderDetailwraps">
		<header-vue title='订单详情' isDetail=1></header-vue>
		<div class="firstWrap">
			<ul class="topPart">
				<li>
					<span class="specialShow">订单编号:<strong>{{productList.orderCode}}</strong></span>
					<span>下单时间:<strong>{{productList.orderTime}}</strong></span>
				</li>
				<li class="orderStatus">
					{{productList.orderStatusStr}}
				</li>
			</ul>
			<ul class="middlePart">
				<li>
					<span class="specialShow">收货人:<strong>{{productList.mailName}}</strong></span>
					<span>{{productList.address}}</span>
				</li>
				<li>
					{{productList.mailMobile}}
				</li>
			</ul>
			<div class="goodsWrapdetail">
				<van-card :num="items.count" :price="items.price" :title="items.productName" :thumb="items.thumbnailImgUrl" v-for="items in productList.goodsVOList" :key="items.attrId">
					<template #tags>
						<van-tag plain type="default">{{items.productAttr}}</van-tag>
					</template>
				</van-card>
			</div>
			<ul class="bottomPart">
				<li><span>订单金额</span><strong>¥{{(productList.goodsVOList)[0].subtotal}}</strong></li>
				<li><span>运费</span><strong>¥{{productList.mailCost}}</strong></li>
				<li><span>总金额</span><strong>¥{{productList.totalPrice}}</strong></li>
			</ul>
			<!-- -->
			<div class="allBtns">
                <van-button round size="large" @click="payMoney(productList)" class="zhifuBtn">在线支付</van-button>
			</div>
		</div>
	</div>
</template>
<script>
    import wx from 'weixin-js-sdk'
	import Header from '../../components/header'
	export default {
		data() {
			return {
				productList:[],
				postUrl:''
			}
		},
		methods: {
			payMoney(detail){//支付
			this.$postImg('/order/getJsSdkConfig', {//获取wx配置
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
									thatVm.$router.replace('/ui/allOrder')
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
		components: {
			headerVue: Header,
		},
		created() {//获取详情
			var getParams = this.$route.params;
			var getCode = getParams.orderCode;
		    if(getCode){
				localStorage.setItem("payCode",getCode);
			}
			if(getCode){
				this.$get('client/order/code', {
				   orderCode: getCode
				}).then(res=>{
					this.productList = res.data.data;
					console.log(this.productList);
				})
			}else{
				var storeCode = localStorage.getItem('payCode');
				this.$get('client/order/code', {
				   orderCode: storeCode
				}).then(res=>{
					this.productList = res.data.data;
				})
			}
			//修改url
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
	.waitPay {
		margin-left: 10px;
		margin-right: 10px;
	}

	.waitPay .van-button--default {
		color: white;
		background: linear-gradient(to right, #fe9930, #f7631f);
		height: 45px;
	}

	.waitGet {
		display: flex;
		justify-content: space-between;
		margin: 0px 10px;
	}

	.waitGet .sureBtn {
		color: white;
		background: linear-gradient(to right, #fe9930, #f7631f);
		margin-left: 10px;
	}

	.waitGet .van-button--large {
		height: 40px;
	}

	.hasGet {
		display: flex;
		justify-content: flex-end;
		margin-right: 10px;
	}

	.hasGet .van-button--default {
		height: 35px;
		width: 120px;
	}

	.firstWrap {
		font-size: 30px;
		margin-top: 100px;
	}

	.topPart,
	.middlePart {
		display: flex;
		justify-content: space-between;
		background-color: white;
		padding: 15px 15px;
	}

	.topPart {
		align-items: center;
		margin-bottom: 10px;
	}

	.topPart>li:first-of-type {
		display: flex;
		flex-direction: column;
	}

	.middlePart>li:first-of-type {
		display: flex;
		flex-direction: column;
	}

	.orderStatus {
		color: #f97c34;
	}

	.specialShow {
		color: black;
		padding-bottom: 10px;
	}

	.middlePart {
		margin-bottom: 10px;
	}

	.van-hairline--surround::after {
		border: none;
	}

	.van-card__title {
		font-size: 14px;
		padding-bottom: 5px;
	}

	.van-card__num {
		font-size: 14px;
		color: black;
	}

	.bottomPart {
		margin-top: 10px;
	}

	.bottomPart li {
		background-color: white;
		padding: 15px 10px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 10px;
	}

	.bottomPart li strong {
		color: #f97c34;
	}

	.allBtns {
		position: fixed;
		bottom: 10px;
		width: 100%;
	}
	.zhifuBtn{
    color: #f97c34;
    border-color: #f97c34;
	}
</style>

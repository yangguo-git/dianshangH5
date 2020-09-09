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
			<!-- 不同的订单显示不同的按钮 -->
			<div class="allBtns">
				
			</div>
		</div>
	</div>
</template>
<script>
	import Header from '../../components/header'
	export default {
		data() {
			return {
                productList:[]
			}
		},
		components: {
			headerVue: Header,
		},
		created() {
			//获取详情
			var getParams = this.$route.params;
            var getData = getParams.detailData;
			this.productList = getData;
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
		/* font-size: 33px; */
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
</style>

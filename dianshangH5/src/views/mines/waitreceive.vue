<template>
<!-- 待收货 -->
	<div class="ordersParts">
		<header-vue title='我的' isDetail=1></header-vue>
		<div class="orderBottom">
			<p class="danTitle">待收货订单</p>
			<!-- 无订单 -->
			<div v-if="isLoading" class="loadingWrap">
                <van-loading type="spinner" size="20px" />
			</div>
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
					
					<!-- 待收货 302-->
					<div class="bottomParts">
						<van-button   @click="sureGet(items.orderCode)" round size="small">确认收货</van-button>
						<van-button   @click="goLogisti(items.orderCode)" round size="small">查看物流</van-button>
					</div>
				</div>
			</div>
			<!--到底了  -->
			<div class="receiveBottom" v-if="allOrderList.length>10">
				<p>已经到底了哦</p>
			</div>
			<!-- 确认收货 -->
			<van-dialog v-model="isSure" title="提示" show-cancel-button confirmButtonText="确定"  :before-close="isClosed">
				<div class="loginWrap">
					<p>你确定要收货吗?</p>
			    </div>
		   </van-dialog>
		</div>
	</div>
</template>
<script>
	import Header from '../../components/header'
	export default {
		data() {
			return {
				allOrderList:[],
				isLoading:true,
				isEmpty:false,
				isSure:false,
				sureCode:''
			}
		},
		components: {
			headerVue: Header,
		},
		methods: {
			sureGet(orderCode){
				this.isSure = true;
				this.sureCode = orderCode;
			},
			isClosed(action, done){
				if(action === 'confirm') {
					this.$postImg('/order/receipt', {
						orderCode:this.sureCode
					}).then(res => {
						if(res.data.status == 0){
							this.$toast("确认收货成功");
	                        done()
						}else{
							this.$toast(res.data.msg);
	                        done() //关闭
						}
					})
				} else if(action === 'cancel') {
					done() //关闭
				}
				
			},
			goLogisti(orderCode) {

				this.$router.push({
					name:'logisticdetail',
					params:{
						orderCode
					}
				})
			}
		},
		created(){ //查询
			this.$get('/order').then((res)=> {
				if(res.data.status == 0){
				   var searchData = res.data.data;
				   var fileArr = [];
				   searchData.forEach(function(item){
                       if(item.orderStatus == 303){
						   fileArr.push(item);
					   }
				   })
				   this.allOrderList = fileArr;
				   if(this.allOrderList.length>0){
					   this.isLoading = false;
					   this.isEmpty = false;
				   }else{
					   this.isEmpty = true;
					   this.isLoading = false;
				   }
				}else{
					this.$toast("获取订单失败")
				}
			})
			

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
	.everyOrder{
		background-color: white;
		margin-bottom: 15px;
	}
	.bottomParts{
	 text-align: center;
	 border-top: 1px solid #e4e4e4;
	 display: flex;
	 justify-content: flex-end;
	 padding: 25px 0px;
	}
	.bottomParts .van-button{
		width: 80px;
		margin-right: 5px;
	}
	.orderStatus{
		color: #f97c34;
	}
	.zhifuBtn{
		color:#f97c34 ;
		border-color: #f97c34;
	}
	.van-card__title{
		font-size: 14px;
	    padding-bottom: 5px;
	}
	.van-card__num{
		color: black;
		font-size: 14px;
	}
	.emptyOredr{
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
	.loginWrap{
		text-align: center;
	}
</style>

<template>
	<div class="mineMain">
		<header-vue title='我的'></header-vue>
		<div class="mine-content">
			<div class="mine-login">
					<van-icon name="user-circle-o" />
				<button :disabled="isDisabled">{{initText}}</button>
			</div>
			<div class="myOrder">
				<p class="newOrder">我的订单</p>
				<van-cell title="全部订单" is-link  @click="goAll">
					<template #icon>
						<img src="../../assets/images/quanbudingdan.png" alt="" class="iconClass">
					</template>
				</van-cell>
				<van-cell title="待付款" is-link   @click="goWaitpay">
				<template #icon>
					<img src="../../assets/images/daifukuan.png" alt="" class="iconClass">
					</template>

				</van-cell>
				<van-cell title="待收货" is-link   @click="goWaitreceive">
				<template #icon>
					<img src="../../assets/images/daishouhuo.png" alt="" class="iconClass">
					</template>
				</van-cell>
				<van-cell title="退款/售后" is-link  @click="gorefund">
				<template #icon>
					<img src="../../assets/images/tuikuan.png" alt="" class="iconClass">
					</template>
				</van-cell>
				<div class="adressBox">
					<van-cell title="地址管理" is-link   @click="goAdress">
					<template #icon>
						<img src="../../assets/images/dizhi.png" alt="" class="iconClass">
						</template>
					</van-cell>
				</div>
				
			</div>

		</div>
		<!--底部 -->
		<footer-vue></footer-vue>

	</div>
</template>
<script>
	import Header from '../../components/header'
	import Footer from '../../components/footer'
	import wx from 'weixin-js-sdk'
	export default {
		data() {
			return {
				initText:'张三',
				isDisabled:false,
				uesrName:'',
				password:''
			}
		},
		methods: {
			gorefund(){
				this.$router.push({
					name:'refund',
				})
			},
			goAll(){
				 this.$router.push({
					name:'allOrder',
				})
			},
			goWaitpay(){
                 this.$router.push({
					name:'waitpay',
				})
			},
			goWaitreceive(){
                 this.$router.push({
					name:'waitreceive',
				})
			},
			goAdress(){
				 this.$router.push({
					name:'singleadress',
				})
			}
			
		},
		components: {
			headerVue: Header,
			footerVue: Footer
		},
		created(){
			//获取用户昵称
			var getStorgeUser = localStorage.getItem("userName");
			if(getStorgeUser){
				this.initText = getStorgeUser;
				this.isDisabled = true;
			}else{
				this.initText = '';
				this.isDisabled = false;
			}

		},
		mounted(){
			wx.hideOptionMenu();
		}

	}
</script>

<style scoped>
.adressBox{
	margin-top: 10px;
}
.mine-content{
	margin-top: 100px;
}
.mine-login{
	display: flex;
	align-items: center;
	padding-left: 10px;
	padding-top: 7px;
}
.mine-login>button{
	font-size: 35px;
	padding-left: 15px;
	height: 60px;
	text-align: left;
    border: none;
    background-color: #f6f6f6;
}
.mine-login .van-icon-user-circle-o{
	color: #cccccc;
}
.newOrder{
	font-size: 30px;
	padding-left: 35.5px;
	background: white;
	padding-top: 25px;
	padding-bottom: 25px;
	margin-bottom: 10px;
	margin-top: 10px;
}
.iconClass{
	width: 38px;
	height: 38px;
}
.van-cell--clickable{
    align-items: center;
}
</style>


<template>
	<div>
		<header-vue title='地址管理' isDetail=1 :isNewAdress='isNewAdress'></header-vue>
		<div class="commonPart">
		<ul class="adressList" v-for="item in adressList" :key="item.id">
			<li>
				<span class="addressInfo">
					<em>收货人:</em>
					<strong>{{item.name}}</strong>
				</span>
				<span class="adress">
					{{item.province}}{{item.city}}{{item.district}}{{item.address}}
				</span>
			</li>
			<li>
				{{item.phone}}
			</li>
			<li class="singleSelf">
				<van-icon name="arrow" size="20" @click.stop="addAdress('2',item)"/>
			</li>
		</ul>
		<div class="btnWraps">
			<van-button  size="large" @click="addAdress('1')" round>新增地址</van-button>
		</div>
		</div>
	</div>
</template>
<script>
	import Header from '../../components/header'
	export default {
		data() {
			return {
				adressList:[],
				isNewAdress:1
			}
		},
		components: {
			headerVue: Header,
		},
		methods: {
			addAdress(flag,postdata) {
				//1 新增 2 编辑
				this.$router.push({
		            name: 'editAdress',
					params:{
						flag,postdata
					}
				})
			}
		},
		created(){
			//获取地址
			this.$get('address').then((res)=> {
				if(res.data.status == 0){
				   this.adressList = res.data.data;
				}else{
				   this.$toast("获取信息失败")
				}
			})

		}

	}
</script>

<style scoped>
	.adressList:first-of-type {
		margin-top: 115px;
	}

	.adressList {
		display: flex;
		justify-content: space-between;
		background: white;
		margin-bottom: 20px;
		margin-left: 15px;
		margin-right: 15px;
		padding: 15px 10px;
	}

	.adressList>li {
		font-size: 30px;
		display: flex;
		flex-direction: column;
	}

	.singleSelf {
		align-self: center;
	}
	.adress{
		padding-top: 12px;
	}
	.btnWraps .van-button--default{
		background: linear-gradient(to right,#f97c34,#f97c34);
		color: white;
	}
	.btnWraps{
		margin: 0px 10px;
	}
	.commonPart{
		margin-top: 60px;
	}
</style>

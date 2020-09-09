<template>
	<div class="adressBox">
		<header-vue :title='title' isDetail=1></header-vue>
		<ul>
			<li>
				<van-field v-model="peopleName" label="收货人" placeholder="请填写收货人姓名" />
			</li>
			<li>
				<van-field v-model="peopleTele" type="tel" label="手机号" placeholder="请填写收货人手机号" />
			</li>
			<li class="addWrap">
				<van-field label="所在地区" :value="defaultValue" right-icon="arrow" readonly @click="handel" />
			</li>
			<li>
				<van-field v-model="message" rows="2" autosize label="详细地址" type="textarea" placeholder="街道、楼号门牌号" />
			</li>
		</ul>

		<van-popup v-model="showPicker" round position="bottom">
			<van-area @confirm="onConfirm"  title="标题" :area-list="areaList" :value="showCode"/>
         </van-popup>

		 <div class="btnWraps">
			 <van-button round type="info" @click="deleAdress" v-if="isShow">删除收货地址</van-button>
			 <van-button round  @click="saveAdress">保存收货地址</van-button>
		 </div>

	</div>
</template>
<script>
	import Header from '../../components/header'
	import areaData from '../../modules/area.js';
	export default {
		data() {
			return {
				title: '收货地址',
				text: '',
				message: '',
				showPicker:false,
				peopleName:'',
				peopleTele:'',
				defaultValue:'请选择所在城市',
				receiveData:'',
				areaList:areaData,
				isShow:false,
				showCode:''
			}
		},
		components: {
			headerVue: Header,
		},
		methods: {
			handel() {
				this.showPicker = true;
			},
			onConfirm(prodata) {
				var pinArr = [];
				prodata.forEach(function(items){
					pinArr.push(items.name)
				})
				var lastItems = prodata.pop();//回显
				//显示
				this.defaultValue = pinArr.join("/");
				this.saveAllProvince = pinArr;
				this.showPicker = false;
				this.saveLastItem = lastItems;
			},
			saveAdress(){
				if(this.peopleName == "" || this.peopleTele == "" ||this.message == ""){
					this.$toast("请将信息填写完整");
					return;
				}
				//手机号验证
				var phoneReg = /^1[3456789]\d{9}$/;
				if(!phoneReg.test(this.peopleTele)){
					this.$toast("手机号格式不正确");
					return;
				}
				//区分新增
				var province,city,district,postCode;
				if(this.saveAllProvince){
					if(this.saveAllProvince.length>0){
						province = this.saveAllProvince[0];
						city = this.saveAllProvince[1];
						district = this.saveAllProvince[2];
						postCode = this.saveLastItem.code;
					}
				}else{//编辑
					province = this.saveEditPro;
					city = this.saveEditCity;
					district = this.saveEditPart;
					postCode = this.receiveData.code;
				}
				var adressInfo = {
					name:this.peopleName,
					phone:this.peopleTele,
					detail:this.message,
					province,
					city,
					district,
					code:postCode
				}
				console.log("地址ele",adressInfo);
				if(this.saveFlag != 1){//编
				   adressInfo.id = this.receiveData.id;
				   this.$post('/address/update',adressInfo).then((res) => {
						if (res.data.status == 0) {
							this.$toast("保存成功");
							this.$router.go(-1);
						} 
				   })

				}else{//增
					this.$post('/address/save',adressInfo).then((res) => {
						if (res.data.status == 0) {
						this.$toast("保存成功");
						this.$router.go(-1);
						} 
					})
				}
				
			},
			deleAdress(){
				var deleObj = this.receiveData;
				deleObj.status = 0;
				this.$post('/address/update',deleObj).then((res) => {
					if (res.data.status == 0) {
					   this.$toast("删除成功");
					   this.$router.go(-1);
					} 
				})
			}
		},
		created() {
			let getFlag = this.$route.params.flag;
			let getPostdata = this.$route.params.postdata;
			this.saveFlag = getFlag;
			if (getFlag == 1) {//新
				this.title = "新增收货地址";
			} else if (getFlag == 2) {//编
				this.title = "编辑收货地址";
				this.isShow = true;
				this.receiveData = getPostdata;
				this.peopleName = getPostdata.name;
				this.peopleTele = getPostdata.phone;
				this.message = getPostdata.address;
				this.showCode = getPostdata.code;
				//获取地址相关
				var getProvince = getPostdata.province;
				var getCity = getPostdata.city;
				var getPart = getPostdata.district;
				this.defaultValue = getProvince+"/"+getCity+"/"+getPart;//省市区展示
				this.saveEditPro = getProvince;
				this.saveEditCity = getCity;
				this.saveEditPart = getPart;

			}
		}
	}
</script>
<style scoped>
	.adressBox .van-address-edit {
		margin-top: 45px;
	}

	.adressBox .van-address-edit__buttons {
		display: flex;
		flex-direction: row-reverse;
	}

	.adressBox>ul {
		display: flex;
		flex-direction: column;
	}

	.adressBox {
		margin-top: 100px;
	}
	.addWrap>span:nth-of-type(2) {
		color: #666666;
		width: 253px;
	}

	.addWrap>span:nth-of-type(1) {
		padding-right: 75px;
	}

	.addWrap>span:nth-of-type(3) {
		margin-top: 10px;
	}
	.btnWraps{
		text-align: center;
		width: 100%;
		display: flex;
		margin-top: 30px;
		background-color: white;
		padding: 15px 0px;
	}
	.btnWraps .van-button--default{
		background: linear-gradient(to right,#f97c34,#f97c34);
        color: white;
	}
	.btnWraps .van-button--info{
      background-color: #f6f6f6;
	  color: black;
	  border-color: #f6f6f6;
	}
	.btnWraps button{
		flex: 1;
		margin: 0px 10px;
	}
</style>

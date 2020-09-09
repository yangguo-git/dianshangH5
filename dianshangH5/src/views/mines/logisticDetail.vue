<template>
	<div class="logisticWrap">
		<header-vue title='物流详情' isDetail='1'></header-vue>
		<div class="pressDetail">
			<div>
				<span>运单编号:</span>
				<span class="weiTiao">{{allObjs.no}}</span>
			</div>
			<div>
				<span>承运来源:</span>
				<span>{{allObjs.name}}</span>
			</div>
			<div>
				<span>官方电话:</span>
				<span class="weiTiao">{{allObjs.phone}}</span>
			</div>
		</div>
		<!-- 无物流信息 -->
		<div v-if="logistArr.length == 0" class="emptyLogist">
            <p>暂无物流信息</p>
		</div>
		<!-- 有信息 -->
		<van-steps :active="logistArr.length" direction="vertical"  active-color="#f97c34" v-if="logistArr.length>0">
			
			<van-step v-for="item in logistArr" :key="item.time">
                <span>{{item.content}}</span>
                <p>{{item.time}}</p>
            </van-step>

		</van-steps>

	</div>
</template>
<script>
	import Header from '../../components/header'
	export default {
		data() {
			return {
				logistArr:[],
				allObjs:''
			}
		},
		components: {
			headerVue: Header,
		},
		created(){//获取物流
		var getParams = this.$route.params;
		this.$get('delivery/orderCode',{
			orderCode:getParams.orderCode
		}).then((res)=> {
			if(res.data.status == 0){
				var searchData = res.data.data;
				this.allObjs = searchData;
				this.logistArr = searchData.list;
			}else{
				this.$toast("获取物流信息失败")
			}
		})

		}

	}
</script>
<style scoped>
	.pressDetail {
		display: flex;
		flex-direction: column;
        font-size: 30px;
		margin-top: 100px;
	}
	.pressDetail>div {
		display: flex;
		padding-top: 10px;
		padding-bottom: 10px;
		background-color: white;
		padding-left: 25px;
		align-items: flex-end;
    }
	.van-steps{
		margin-top: 10px;
	}
	.emptyLogist{
		text-align: center;
		font-size: 30px;
	}
</style>

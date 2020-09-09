<template>
    <div class="confirmWrap">
        <header-vue title='确认订单' isDetail=1></header-vue>
        <div class="orderWrap">
            <div class="addressLine" @click="jumpLinks" v-if='!isChooseAdress'>
                <van-cell value="" is-link>
                     <template #icon>
                          <van-icon class="iconfont" class-prefix='icon' name='tianjia' size="20" />
                     </template>
                    <template #title>
                        <span class="custom-title">选择收货地址</span>
                    </template>
                </van-cell>
            </div>
            <!-- 如果选择过收货地址开始 -->
            <div v-if="isChooseAdress">
                <ul class="adressList" @click="jumpLinks">
                    <li>
                        <span class="addressInfo">
                            <em>收货人:</em>
                            <strong>{{chosedress.name}}</strong>
                        </span>
                        <span class="adress">
                            {{chosedress.province}}{{chosedress.city}}{{chosedress.district}}{{chosedress.address}}
                        </span>
                    </li>
                    <li>
                        {{chosedress.phone}}
                    </li>
                    <li class="singleSelf">
                        <van-icon name="arrow" size="20" @click.stop="addAdress('2')"/>
                    </li>
            </ul>
           </div>
           <!-- 如果选择过收货地址结束 -->
            <!-- 商品相关-->
            <div class="goodesOrder">
                <van-card :num="selecttNum" :price="selectPrice/100 | postNum" :title="detailInfo.productName" :thumb="detailInfo.thumbnailImgUrl">
                    <template #tags>
                        <van-tag plain type="default">{{detailInfo.intro}}</van-tag>
                    </template>
                </van-card>
                <ul class="orderAbouts">
                    <li>
                        <strong>购买数量</strong>
                        <div>
                             <van-stepper :disable-input='isDisable' v-model="selecttNum" @plus="addNum" @minus="sunNum" />
                        </div>
                    </li>
                    <li>
                        <strong>商品金额</strong>
                        <span><em>¥</em>{{chooseGoodPrice/100 | postNum}}</span>
                    </li>
                    <li>
                        <strong>运费</strong>
                        <span><em>¥</em>{{initFree}}</span>
                    </li>
                </ul>
             </div>
             <!-- 提交订单 -->
             <div class="submitPart">
                 <div>
                     <span>总金额:</span>
                     <span class="allPrice">
                         <em>¥</em>
                         <strong>{{totalPrice/100 | postNum}}</strong>
                     </span>
                 </div>
                 <van-button round @click="submitOrder">提交订单</van-button>
             </div>
        </div>
    </div>
</template>
<script>
import Header from '../../components/header'
import unils from "../../assets/js/common.js"
export default {
    data(){
        return{
            initFree:0,
            isDisable:true,
            isChooseAdress:false,
            adressList:[],
            detailInfo:'',
            selecttNum:0,
            selectPrice:'',
            saveChoseProduct:''
        }
    },
    methods:{
        addNum(){//增
            this.selecttNum +=1;
        },
        sunNum(){//减
            this.selecttNum-=1;
        },
        submitOrder(){ 
           
            if(!this.isChooseAdress){
               this.$toast("请选择收货地址");
               return
            }else{
               var orderObj = {};
                //地址相关
                var ardessAbout = this.chosedress;
                //提交
                orderObj.mailAddress = ardessAbout.address;//详细地址
                orderObj.mailProvince  = ardessAbout.province;
                orderObj.mailCity  = ardessAbout.city;
                orderObj.mailDistrict  = ardessAbout.district;
                orderObj.count = this.selecttNum;//数量
                orderObj.mailCost = parseFloat(this.initFree);
                orderObj.mailMobile = ardessAbout.phone;
                orderObj.mailName = ardessAbout.name;
                orderObj.productId = this.saveChoseProduct.productNorm.productId;
                orderObj.productNormId = this.saveChoseProduct.productNorm.id;
                orderObj.thumbnailImgUrl = this.saveChoseProduct.productNorm.thumbnailImgUrl;
                orderObj.totalPrice = (this.chooseGoodPrice)/100;//chooseGoodPrice
                orderObj.orderType = 2;
                orderObj.orderName = this.detailInfo.productName;
                orderObj.productName = this.detailInfo.productName;
                orderObj.discountPrice =0;
                console.log("提交订单参数",orderObj);
                this.$post('/order/save',orderObj).then((res) => {
					if (res.data.status == 0) { //跳转详情页
                        this.$router.replace({
                            name:'payorder',
                            params:{
                                orderCode:res.data.data.orderCode
                            }
                        })
					}else{
                        this.$toast(res.data.msg);
                    }
				})
                
            }
        },
        jumpLinks(){
            this.$router.replace({  name: 'allAdress'})
            sessionStorage.setItem("choseNum",this.selecttNum);
        },
        addAdress(){
             this.jumpLinks();
        }
    },
    computed:{
      totalPrice(){//总金额
          var allSum = 0,goodsPrice,mailFree;
          goodsPrice = this.selecttNum * this.selectPrice;//商品价格
          mailFree = this.initFree*100;//运费
          allSum = goodsPrice + mailFree;
          return unils.hasDot(allSum);
      },
      chooseGoodPrice(){//已选商品金额
           var choosePrice = 0;
           choosePrice = this.selecttNum * this.selectPrice;
           return unils.hasDot(choosePrice);
      }

    },
    components: {
		headerVue: Header,
    },
    filters: {
        postNum(value) {
            return unils.hasDot(value);
        }
	},
    created(){
        //获取详情信息
        var getParams = this.$route.params;
        if(getParams.postData && getParams.submitData){
            //商品
            this.detailInfo = getParams.postData.productInfo;
            //选择
            var chooseInfo = getParams.submitData;
            this.selecttNum = chooseInfo.selectedNum;
            this.selectPrice = chooseInfo.selectedSkuComb.price;
            //获取选中信息
            var getChoseDetail = getParams.saveChoseNormal;
            this.saveChoseProduct = getChoseDetail;

        }else{//缓存
            var storeSubmitData = JSON.parse(sessionStorage.getItem('submitData'));
            var storePostData = JSON.parse(sessionStorage.getItem('postData'));
            var storeNormalData = JSON.parse(sessionStorage.getItem('normalData'));
            this.saveChoseProduct = storeNormalData;
            //信息
            this.detailInfo = storePostData.productInfo;
            //价格数量
            this.selecttNum = storeSubmitData.selectedNum;
            this.selectPrice = storeSubmitData.selectedSkuComb.price;
            //获取跳转之前缓存
            var storeNum = sessionStorage.getItem('choseNum');
            this.selecttNum = Number(storeNum);
        }
        //选中地址
        if(getParams.chosedress){
            this.isChooseAdress = true;
            this.chosedress = getParams.chosedress;
            var getstr = getParams.chosedress.province;
            var firStr = getstr.substring(0,2);
            //获取省份
            this.$get('/client/order/province').then((res)=> {
				if(res.data.status == 0){
                    var oldArrs = res.data.data;
                    var locationObj;
                    oldArrs.forEach(function(objs){
                        if(objs.districtName.substring(0,2) == firStr){
                            locationObj = objs;
                        }
                    });
                    //获取运费
                    var locationId = locationObj.districtId;
                    this.$get('/delivery',{districtId:locationId}).then(res=>{
                        var getFree = res.data.data;
                        this.initFree = getFree.transportPrice;
                    })

				}else{
				   this.$toast("获取信息失败")
				}
			})

        }
        
    }
}
</script>


<style scoped>
.submitPart{
    position: fixed;
    bottom: 0px;
    width: 100%;
    background: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0px;
}
.allPrice{
    color: #f97c34;
}
.submitPart>div{
    margin-left: 20px;
}
.submitPart  .van-button--round{
    margin-right: 10px;
}
.allPrice em{
    font-size: 28px;
    padding-left: 5px;
}
.submitPart{
  font-size: 35px;
}
.submitPart .van-button--default{
   background-color: #f97c34;
   color: white;
   height: 35px;
   width: 120px;
}
.van-card{
 margin-bottom: 10px;
}
.orderAbouts{
    display: flex;
    flex-direction: column;
}
.orderAbouts>li{
 display: flex;
 justify-content: space-between;
 margin-bottom: 25px;
 background-color: white;
 align-items: center;
 padding: 20px;
}
.orderAbouts>li:nth-child(2) span{
  color: #f97c34;
  font-size: 30px;
}
.orderAbouts>li:nth-child(3) span{
  color: #f97c34;
  font-size: 30px;
}
.goodesOrder{
margin-top: 25px;
}
/* 内容区 */
.orderWrap .van-card {
    padding: 20px 20px;
}

.orderWrap .van-card__title {
    padding: 10px 0px;
    font-size: 14px;
}

.orderWrap .van-card__bottom {
    padding: 10px 0;
}
.orderWrap .van-hairline--surround::after {
    border: none;
}
.orderWrap .van-card__price {
    font-size: 20px;
    color: red;
}

.orderWrap .van-card__num {
    font-size: 18px;
}
/*  */
.orderWrap{
    margin-top: 100px;
}
.addressLine .icon-tianjia{
  color: #f97c34;
  padding-right: 10px;
}
.addressLine .van-cell{
    padding-top: 15px;
    padding-bottom: 15px;
    font-size: 16px;
}
.orderAbouts li strong{
     font-size: 30px;
}
/* 收货地址 */
.adressList:first-of-type {
		margin-top: 10px;
	}

.adressList {
    display: flex;
    justify-content: space-between;
    background: white;
    margin-bottom: 20px;
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
</style>
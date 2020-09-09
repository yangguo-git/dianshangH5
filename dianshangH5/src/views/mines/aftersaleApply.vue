<template>
	<div class="applyWrap">
		<header-vue title='申请售后' isDetail='1'></header-vue>
        <div class="imgSubmit">
            <van-cell-group>
                <van-field v-model="message" rows="2" :autosize="textareaObj" type="textarea" maxlength="150" placeholder="请输入申请原因" show-word-limit />
            </van-cell-group>
            <div class="uploadArea">
                <van-uploader v-model="fileList" multiple :max-count="3" upload-text="" :after-read="afterRead"  :deletable="isdelete" />
                <span>上传凭证<br>
                (最多3张)
                </span>
            </div>
            <div class="btnWraps">
            <van-button  size="large" round @click="handleSubmit">提交申请</van-button>
            </div>
         </div>
	</div>
</template>
<script>
	import Header from '../../components/header'
	export default {
		data() {
			return {
				message: '',
                fileList: [],
                textareaObj:{
                    maxHeight: 350,
                    minHeight: 220 
                },
                uploadImages:[],
                isdelete:false,
                saveData:''
			}
		},
		components: {
			headerVue: Header,
        },
        methods:{
            afterRead(file){
                var saveThis = this;
                var xhr, formData;
                let queryDetailKey = "https://tchopshop.weein.cn/busi/client/uploadFile/img";
                xhr = new XMLHttpRequest();
                xhr.withCredentials = true;
                xhr.open("POST", queryDetailKey);
                formData = new FormData();
                formData.append("file", file.file);
                xhr.onload = function(e){
                    var json;
                    if (xhr.status != 200) {
                        failure('HTTP Error: ' + xhr.status);
                        return;
                    }
                    json = JSON.parse(this.responseText);
                    //获取返回的图片信息
                    saveThis.uploadImages.push(json.data);
                };
                //添加字段INFOINSIDE
                xhr.setRequestHeader("INFOINSIDE",localStorage.getItem('surUrl'));
                xhr.send(formData);
            },
            handleSubmit(){
                var afterObj = {};
                if(this.message == ''){
                    this.$toast("请输入申请原因");
                }else{
                    var afterObj = {
                        orderCode:this.saveData.orderCode,
                        refundFee:(this.saveData.payPrice)*100,
                        reason:this.message,
                        voucher:this.uploadImages.join(",")
                    };
                    this.$post('/order/applyReturn',afterObj).then((res) => {
                        if (res.data.status == 0) {
                            this.$toast("提交成功");
                            this.uploadImages = [];
                            // this.fileList = [];
                            this.$router.replace({
                             name:'refund'
                           })
                        } 
                    })
                }
            }
        },
        created(){
            var getParams = this.$route.params;
            this.saveData = getParams.detailData;
        }
	}
</script>
<style scoped>
.imgSubmit{
    margin-top: 110px;
}
.van-cell-group{
    margin: 10px;
}
.uploadArea{
    background-color: white;
    margin: 10px 20px;
    display: flex;
    align-items: center;
    padding-top: 20px;
}
.uploadArea>span{
    font-size: 27px;
}
.van-button--default{
   color: white;
   background: linear-gradient(to right,#fe9930,#f7631f);
}


</style>

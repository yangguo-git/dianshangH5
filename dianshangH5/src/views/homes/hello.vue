<template>
    <div>
         
         <button v-on:click="handleClick1">默认传递事件对象</button>

         <button @click="handleClick2(1,2,$event)">传参及传递事件对象</button>

         <!-- .stop 阻止冒泡 -->
         <button v-on:click.stop="handleClick3">阻止冒泡</button>


         <!-- .prevent 阻止事件默认行为 -->
         <button v-on:click.prevent="handleClick4">阻止事件默认行为</button>


         <!-- 事件修饰符也可以串联使用 -->
         <button v-on:click.prevent.stop="handleClick4">测试按钮</button>
         <!-- 按键修饰符 -->
         
         <!-- .enter 回车键 -->
         <input type="text"  v-on:keyup.enter="handleInput"> 

         <!-- .delete 删除键 -->
         <input type="text"  v-on:input.delete="handleInput">

    </div>
   
</template>

<script>
export default {
    data(){
        return{
            msg:"hello vue",
            msg2:'<span>测试</span>',
            isShow:false,
            arr:['lisi','zhangsan','wangwu'],
            className:'box',
            src:'https://xyylcdn.weein.cn/group1/M00/06/BF/rBUgBF8WtdWAKPOrAABgCedJ7gk388.jpg?filename=%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_1000750_gaitubao_367x275_gaitubao_345x275.jpg'
        }
    },
    methods:{
        handleClick1(eve){
            console.log(eve)
        },
        handleClick2(p1,p2,eve){
           console.log(p1,p2,eve)
        },
        handleClick3(){
            console.log('asdasdasd')
        },
        handleInput(){

        }
    }
}
</script>
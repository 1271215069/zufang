<template>
    <div class="Edsz animated fadeIn">
        <div class="edsz-content">
            <p>当前总额度</p>
            <div class="num">
                <input type="text" ref="ed" :value="ednum" disabled="disabled">
                <!-- <span class="iconfont" @click="takeinput">&#xe611;</span> -->
            </div>
            <range class="changenum" v-model="ednum" :max="max" :step="100" @on-change="onChange" ></range>
            <span>（调整以100为单位）</span>
        </div>
         <button @click.prevent="suresz">确认设置</button>
    </div>
</template>
<script>
import { mapActions,mapGetters } from "vuex";
import {Range,Toast } from "vux";
export default {
    name:"Edsz",
    data(){
        return{
            msg:"额度设置",
            ednum:20000,
            eddata:0,
            max:20000
        }
    },
    components:{
        Range ,
        Toast
    },
    methods:{
        ...mapActions(["action"]),
        suresz(){//保存设置的方法
            this.action({
                moduleName:'quota',
                url:'/adminapi/loan/quota',
                method:"post",
                data:{
                    token:this.airforce.login_post.data.token,
                    quota:this.ednum,
                }
            }).then((res)=>{
                if(res.code==200){
                    this.$vux.toast.text(res.message)
                    setTimeout(() => {
                        this.$router.back();
                    }, 2000);
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})
        },
        onChange(){//横拉跳状态改变时触发
           
        }
    },
    created(){
        this.action({
            moduleName:'getquota',
            url:'/Adminapi/loan/getquota',
            method:"post",
            data:{
                token:this.airforce.login_post.data.token,
            }
        }).then((res)=>{
            if(res.code==200){
                this.max=parseInt(res.data.zonquota);
                this.ednum=parseInt(res.data.quota);

            }else{
                this.$vux.toast.text(res.message)
            }
        }).catch((err)=>{})
    },
    computed:{
        ...mapGetters(["airforce"]),
    },
};
</script>
<style lang="less" scoped>
button,
button:focus {
  border: none;
  outline: none;
}
.Edsz {
  .edsz-content {
    background: #fff;
    p{
        text-align: center;
        font-size: 14px;
        line-height: 40px;
        padding-top: 30px;
    }
    .num{
        position: relative;
        padding-bottom: 30px;
        input{
            display: block;
            width: 100%;
            margin: 0 auto;
            // position: absolute;
            // left: 50%;
            // transform: translateX(-50%);
            background: #fff;
            font-weight: initial;
            text-align: center;
            border: none;
            font-size: 40px;
            font-style: "微软雅黑";
        }
        // span{
        //     display: block;
        //     width: 7%;
        //     position: absolute;
        //     top: 50%;
        //     transform: translateY(-50%);
        //     right: 19%;
        //     text-align: center;
        //     color:#108ee9;
        // }
    }
    .changenum{
        display: block;
        width: 60%;
        margin: 0 auto!important;
        padding-bottom: 20px
    }
    span{
        display: block;
        text-align: center;
        padding-bottom: 30px;
        font-size: 14px;
        color: #8b8b8b;
    }
  }
  button {
    display: block;
    width: 90%;
    border-radius: 7px;
    background: #108ee9;
    color: #fff;
    margin: 0 auto;
    margin-top: 30px;
    line-height: 40px;
    font-size: 18px;
  }
}
</style>

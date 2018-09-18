<template>
    <div class="Jq animated fadeIn">
        <div class="Jq-content">
            <x-input class="jq-list" title="借多少" text-align="right" :placeholder="'最多可借'+ed+'元'" type="number" v-model="money" @on-change="getlx"></x-input>
            
            <group class="jq-list" gutter="0">
                <x-address  v-model="zmy" title="怎么用" placeholder="请选择" :list="zmylist" ></x-address>
            </group>
            <group class="jq-list" gutter="0">
                <x-address  v-model="jdj" title="借多久" inline-desc="可提前还款，利息按天计算" placeholder="请选择" :list="jdjlist" @on-hide="getlx"></x-address>
            </group>
            <group class="jq-list" gutter="0">
                <cell title="怎么还" is-link @click.native="gozmh"></cell>
            </group>
            <group class="jq-list" gutter="10">
                <cell title="还款日" value="value">每月{{day}}日<span class="iconfont zs">&#xe64b;</span></cell>
            </group>
            <x-input class="jq-list" title="总利息" text-align="right" v-model="lx" disabled></x-input>
        </div>
        <button @click.prevent="gojq">确定</button>
    </div>
</template>
<script>
import { mapActions,mapGetters } from "vuex";
import {CellBox,XInput,Cell,XAddress,Group  } from "vux"
import { setTimeout } from 'timers';
export default {
    name:"Jq",
    data(){
        return{
            msg:"借钱",
            lx:0,//总利息
            ed:20000,//额度
            money:"",//输入的金额
            zmy:[],
            zmylist:[
                    {name:"个人日常消费",value:'1'},
                    {name:"装修",value:'2'},
                    {name:"旅游",value:'3'},
                    {name:"教育",value:'4'},
                    {name:"医疗",value:'5'},
                ],
            jdj:[],
            jdjlist:[
                {name:"三个月",value:'1'},
                {name:"六个月",value:'2'},
                {name:"九个月",value:'3'},
            ],
            timelong:0,//分期的期数
            monthmoney:0,//月供金额
            day:"",//每月还款日
        }
    },
    components:{
        CellBox ,
        XInput ,
        Cell,
        XAddress,
        Group 
    },

    methods:{
        ...mapActions(["action"]),
        getlx(){//计算利息的方法
            if(this.money!=""&&this.jdj!=""){
                switch(this.jdj[0]){
                    case "1":
                            this.timelong=3;
                            break;
                    case "2":
                            this.timelong=6;
                            break;
                    default:
                            this.timelong=9;
                }
                this.lx =0;
                this.monthmoney=this.money/this.timelong;//获取到每月要付的本金，0.012是月利率
                for(let i=0;i<this.timelong;i++){
                    this.lx +=(this.money- this.monthmoney*i)*0.012;
                }
                this.lx=this.lx.toFixed(2);
            }
        },
        gozmh(){//点击怎么还的方法
            if(this.money==""){this.$vux.toast.text("请输入金额");return false;}
            if(this.jdj==""){this.$vux.toast.text("请选择期数");return false;}
            let zanc=new Object();
            zanc.money=this.money;
            zanc.stage=this.jdj;
            zanc.how=this.zmy;
            localStorage.removeItem('Jq');
            localStorage.setItem("Jq",JSON.stringify(zanc));
            this.$router.push({path: '/Zmh?amount='+this.money+'&timelong='+this.jdj[0]})
        },
        gojq(){//点击确定触发
            if(this.money==""){
                this.$vux.toast.text("请输入借款金额")
                return false;
            }
            if(this.money>this.ed){
                this.$vux.toast.text("借款金额超过可借金额")
                return false;
            }
           if(this.zmy==""){
                this.$vux.toast.text("请选择怎么用")
                return false;
            }
            if(this.jdj==""){
                this.$vux.toast.text("请选择期数")
                return false;
            }
           this.action({
                moduleName:'addloan',
                url:'/adminapi/loan/addloan',
                method:"post",
                data:{
                    token:this.airforce.login_post.data.token,
                    amount:this.money,
                    type:this.zmy[0],
                    borrow_time:this.jdj[0]
                }
           }).then((res)=>{
               if(res.code==200){
                   this.$vux.toast.text("已发送借款申请，请等待审核打款")
                   setTimeout(()=>{
                       this.$router.push("/Jd")
                   },2000)
               }else{
                   this.$vux.toast.text(res.message)
               }
           }).catch((err)=>{})
           
        },
    },
    computed:{
        ...mapGetters(["airforce"]),
    },
    created(){
        let bd=localStorage.getItem("Jq");
        if(!bd==""){
            bd=JSON.parse(bd);
            this.money=bd.money;
            this.jdj=bd.stage;
            this.zmy=bd.how;
        }
        
        
        this.day=new Date().getDate();
        this.action({
            moduleName:'getquota',
            url:'/Adminapi/loan/getquota',
            method:"post",
            data:{
                token:this.airforce.login_post.data.token,
            }
        }).then((res)=>{
            if(res.code==200){
                this.ed=res.data.kquota;
            }else{
                this.$vux.toast.text(res.message)
            }
        }).catch((err)=>{})
    }
}
</script>
<style lang="less" scoped>
 input,input:focus{
     border:none;
     outline:none;
 }
button,
button:focus {
  border: none;
  outline: none;
}
.Jq{
    .Jq-content{
        .jq-list{
            background: #fff; 
            font-size: 17px;
            .zs{
                color: #1296db;
                margin-left: 5px;
            }  
        }
        
    }
    button{
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

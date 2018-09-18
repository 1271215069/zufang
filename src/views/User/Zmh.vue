<template>
    <div class="zmh animated fadeIn">
       <cell-box class="title">
           <div>
               <p>每月等额</p>
               <p>每月还款额度一样</p>
           </div>
            <span class="iconfont">&#xe637;</span>
       </cell-box>
       <cell-box class="subtitle">日利率0.04%，总共应还{{all}}元</cell-box>
       <cell-box class="content">
           <div class="conitem" v-for="(item,index) in list" :key="index">
               <div class="itemtext">
                   <div class="left">{{item.repayment_date}}</div>
                   <div class="spot"></div>
                   <div class="right">
                       <p>该月总付{{item.feng}}元</p>
                       <p>含本金{{item.bj}}元 + 利息{{item.fengli}}元</p>
                   </div>
               </div>
               <div class="itemline"></div>
           </div>
       </cell-box>
       <p class="zs"><span class="iconfont">&#xe64b;</span>年利率=日利率 * 365，要定时还款呦</p>
    </div>    
</template>
<script>
import { mapActions,mapGetters } from "vuex";
import {Group,CellBox,Flow, FlowState, FlowLine} from "vux"
export default {
    name:"Zmh",
    data(){
        return{
            msg:"怎么还",
            list:[],
            all:0
        }
    },
    components:{
        Group,
        CellBox,
        Flow,
        FlowState,
        FlowLine
    },
    methods:{
        ...mapActions(["action"]),
    },
    computed:{
        ...mapGetters(["airforce"]),
    },
    created(){
        let money=this.$route.query.amount;
        let periods=this.$route.query.timelong;
        this.action({
            moduleName:'interest',
            url:'/adminapi/loan/interest',
            method:"post",
            data:{
                token:this.airforce.login_post.data.token,
                amount:money,
                borrow_time:periods
            }
        }).then((res)=>{
            if(res.code==200){
                for(let i=0;i<res.data.length;i++){
                    res.data[i].feng=res.data[i].feng.toFixed(2);
                    res.data[i].fengli=res.data[i].fengli.toFixed(2);
                    res.data[i].bj=(res.data[i].feng-res.data[i].fengli).toFixed(2);
                    this.all+=parseFloat(res.data[i].feng);
                }
                this.all=this.all.toFixed(2);
                this.list=res.data;
            }else{
                this.$vux.toast.text(res.message)
            }
        }).catch((err)=>{})
    }
}
</script>
<style lang="less" scoped>
.zmh{
 .title{
     display: block;
     overflow: hidden;
     background: #fff;
     div{
         float:left;
         p:nth-child(1){
             font-size: 18px;
         }
         p:nth-child(2){
             font-size:14px;
             color:#a4a4a4;
         }
     }
     span{
         float:right;
         font-size:34px;
         line-height: 50px;
         font-size: 26px;
         color: #1887cc;
     }
 }
 .subtitle{
     font-size:16px;
     background: #fff;
 }
 .content{
     background: #fff;
     display: block;
     .conitem{
         .itemtext{
             overflow: hidden;
             position: relative;
             .left{
                 float: left;
                 color: #1887cc;
                 line-height: 20px;
                 width: 20%;
                 text-align: center;
             }
             .spot{
                 float: left;
                 height:5px;
                 width: 5px;
                 border-radius: 50%;
                 background: #1887cc;
                 line-height: 20px;
                 position: absolute;
                 left: 20%;
                 top: 50%;
                 transform: translateY(-50%);
                 transform: translateX(-50%);
             }
             .right{
                 float: left;
                 width: 75%;
                 p{
                     line-height: 20px;
                     padding-left: 10%;
                     font-size: 15px;
                 }
             }
         }
        .itemline{
            height: 50px;
            border-left:1px solid #1887cc;
            margin-left: 20%;
        } 
     }
     .conitem:last-child{
         .itemline{
             display: none;
         }
     }
 }
 .zs{
     padding: 0 15px;
     border-top: 1px solid #D9D9D9;
     font-size: 15px;
     span{
         color: #1887cc;
         margin-right: 2%;
         font-size:16px;
     }
 }
}
</style>

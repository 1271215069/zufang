<template>
    <div class="qhq animated fadeIn">
         <tab class="headtab" v-model="index" bar-active-color='#1b82d2' active-color='#1b82d2' default-color='#a9a7ab'>
            <tab-item :selected="index == 0"  v-for="(item,index) in list" :key="index">{{item.title}}</tab-item>
        </tab>
        <swiper v-model="index" class="tabcontent" :aspect-ratio="3" :show-dots="false" >
            <swiper-item v-for="(item,index) in list" :key="index">
                <div class="none" v-if="item.len">
                    <img :src="require('@/assets/img/User/nocontent.png')">
                    <p>暂无还款</p>
                </div>
                <cell-box v-else class="dd" v-for="(dditem,ddindex) in item.overview" :key="ddindex">
                    <div class="ddcontant" >
                        <div class="text">
                           <P>借款总额:{{dditem.amount}}元 | 总利息:{{dditem.total_interest}}元</P>
                           <p>借款用途：{{dditem.type}}</p>
                           <p>还款日:{{dditem.repayment}} | 共{{dditem.borrow_time}}期 <span>状态：{{dditem.loan_type}}</span> </p>
                        </div>
                        <span :id="dditem.bs+ddindex" v-if="dditem.loan_show" @click.prevent="putdown(dditem,ddindex)" :class="(dditem.bs=='whk')?'whkbtn btn iconfont' : 'yhkbtn btn iconfont'" >&#xe798;</span>
                    </div>
                    <div :class="(dditem.bs=='whk')?'whklist list' : 'yhklist list'" >
                        <cell-box class="listitem" v-for="(subitem,subindex) in dditem.still" :key="subindex">
                            <div class="left">
                                <p>{{subitem.cycle}} 应还{{subitem.amount}}元</p>
                                <p>本月利息：{{subitem.interest}}</p>
                                <p>还款日：{{subitem.repayment_date}}</p>
                            </div>
                            <div class="right">
                                <span v-if="!subitem.status">{{subitem.statusval}}</span>
                                <span v-else class="btn" @click.prevent="hk(subitem,subindex)">{{subitem.statusval}}</span>
                            </div>
                        </cell-box>
                    </div>
                </cell-box>
            </swiper-item>
        </swiper>
    </div>
</template>
<script>
import $ from "jquery";
import { mapActions,mapGetters } from "vuex";
import {CellBox,Cell, Swiper, SwiperItem,Tab, TabItem} from "vux"
export default {
    name:"Qhq",
    data(){
        return{
            msg:"去还钱",
            index:0,//头部tab绑定的下标
            list:[{
                title:"未还款",
                overview:[],
                len:true
            },{
                title:"已还款",
                overview:[],
                len:true
            }],
            btnclass:""
        }
    },
    components:{
        CellBox,
        Cell,
        Tab,
        TabItem,
        Swiper,
        SwiperItem
    },
    methods:{
        ...mapActions(["action"]),
        putdown(k,t){
            switch(k.bs){
                case "whk":
                    if(!$(".whklist").eq(t).is(":hidden")){
                        $(".whklist").eq(t).slideUp();
                        $("#"+k.bs+t).removeClass('cis').addClass('inverse');
                        $("#"+k.bs+t).removeClass('cised').addClass('inversed');
                    }else{
                        console.log($("#"+k.bs+t))
                        $(".whklist").slideUp();
                        $(".whklist").eq(t).slideDown();
                        // $(".whkbtn").removeClass('cis').addClass('inverse');
                        // $(".whkbtn").removeClass('cised').addClass('inversed');
                        $("#"+k.bs+t).removeClass('inverse').addClass('cis');
                        $("#"+k.bs+t).removeClass('inversed').addClass('cised');
                    }
                    break;
                case "yhk":
                    if(!$(".yhklist").eq(t).is(":hidden")){
                        $(".yhklist").eq(t).slideUp();
                        $("#"+k.bs+t).removeClass('cis').addClass('inverse');
                        $("#"+k.bs+t).removeClass('cised').addClass('inversed');
                    }else{
                        $(".yhklist").slideUp();
                        $(".yhklist").eq(t).slideDown();
                        $(".yhkbtn").removeClass('cis').addClass('inverse');
                        $(".yhkbtn").removeClass('cised').addClass('inversed');
                        $("#"+k.bs+t).removeClass('inverse').addClass('cis');
                        $("#"+k.bs+t).removeClass('inversed').addClass('cised');
                    }
                    break;
                default:
                    break;
            }
        },
        hk(item,index){//还款按钮的方法
            this.action({
                moduleName:"doPay",
                url:"/adminapi/Aliwappay/createPay",
                method:"post",
                data:{
                    token:this.airforce.login_post.data.token,
                    sid:item.sid
                }
            }).then((res)=>{
                if(res.code==200){
                    window.location.href=res.data.url;
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})
        }
    },
    computed:{
         ...mapGetters(["airforce"]),
    },
    created(){
        this.action({//获取到未还款的信息
            moduleName:"loanList",
            url:"/adminapi/loan/loanList",
            method:"post",
            data:{
                token:this.airforce.login_post.data.token,
                status:"1"
            }
        }).then((res)=>{
            if(res.code==200){
                for(let i=0;i<res.data.data.length;i++){
                    switch(res.data.data[i].loan_type){
                        case '1':
                            res.data.data[i].loan_type="待审核";
                            res.data.data[i].loan_show=false;
                            break;
                        case '2':
                            res.data.data[i].loan_type="待打款";
                            res.data.data[i].loan_show=false;
                            break;
                        case '3':
                            res.data.data[i].loan_type="审核失败";
                            res.data.data[i].loan_show=false;
                            break;
                        case '4':
                            res.data.data[i].loan_type="已打款";
                            res.data.data[i].loan_show=true;
                            break;
                        default:
                            res.data.data[i].loan_type="未知";
                    }
                    switch(res.data.data[i].borrow_time){
                        case "1":
                            res.data.data[i].borrow_time="3";
                            break;
                        case "2":
                            res.data.data[i].borrow_time="6";
                            break;
                        case "3":
                            res.data.data[i].borrow_time="9";
                            break;
                        default:
                            res.data.data[i].borrow_time="未知";
                    }
                    switch(res.data.data[i].type){
                        case "1":
                            res.data.data[i].type="个人日常消费";
                            break;
                        case "2":
                            res.data.data[i].type="装修";
                            break;
                        case "3":
                            res.data.data[i].type="旅游";
                            break;
                        case "4":
                            res.data.data[i].type="教育";
                            break;
                        case "5":
                            res.data.data[i].type="医疗";
                            break;
                        default:
                            res.data.data[i].type="未知";
                    }
                    let valve=true;
                    for(let l=0;l<res.data.data[i].still.length;l++){
                        if(res.data.data[i].still[l].status=="0"){
                            res.data.data[i].still[l].status=false;
                            res.data.data[i].still[l].statusval="受理中";
                        }else if(res.data.data[i].still[l].status=="3"){
                            res.data.data[i].still[l].status=false;
                            res.data.data[i].still[l].statusval="扣款中";
                        }else if(res.data.data[i].still[l].status=="2"){
                            res.data.data[i].still[l].status=false;
                            res.data.data[i].still[l].statusval="已还款";
                        }else if(res.data.data[i].still[l].status=="1" && valve==false){
                            res.data.data[i].still[l].status=false;
                            res.data.data[i].still[l].statusval="待还款";
                        }else if(res.data.data[i].still[l].status=="1" && valve==true){
                            res.data.data[i].still[l].status=true;
                            res.data.data[i].still[l].statusval="还款";
                            valve=false;
                        }else if(res.data.data[i].still[l].status=="4"){
                            res.data.data[i].still[l].status=false;
                            res.data.data[i].still[l].statusval="失败";
                        }
                    }

                    res.data.data[i].bs="whk";
                }
               
               this.list[0].overview=this.list[0].overview.concat(res.data.data);
               if(this.list[0].overview[0].length!=0){
                   this.list[0].len=false;
               }
            }else{
                this.$vux.toast.text(res.message)
            }
        }).catch((err)=>{})
        this.action({//获取到已还款的信息
            moduleName:"loanList",
            url:"/adminapi/loan/loanList",
            method:"post",
            data:{
                token:this.airforce.login_post.data.token,
                status:"2"
            }
        }).then((res)=>{
            if(res.code==200){
                for(let i=0;i<res.data.data.length;i++){
                    switch(res.data.data[i].loan_type){
                        case '1':
                            res.data.data[i].loan_type="待审核";
                            res.data.data[i].loan_show=false;
                            break;
                        case '2':
                            res.data.data[i].loan_type="待打款";
                            res.data.data[i].loan_show=false;
                            break;
                        case '3':
                            res.data.data[i].loan_type="审核失败";
                            res.data.data[i].loan_show=false;
                            break;
                        case '4':
                            res.data.data[i].loan_type="已打款";
                            res.data.data[i].loan_show=true;
                            break;
                        default:
                            res.data.data[i].loan_type="未知";
                    }
                    switch(res.data.data[i].borrow_time){
                        case "1":
                            res.data.data[i].borrow_time="3";
                            break;
                        case "2":
                            res.data.data[i].borrow_time="6";
                            break;
                        case "3":
                            res.data.data[i].borrow_time="9";
                            break;
                        default:
                            res.data.data[i].borrow_time="未知";
                    }
                    switch(res.data.data[i].type){
                        case "1":
                            res.data.data[i].type="个人日常消费";
                            break;
                        case "2":
                            res.data.data[i].type="装修";
                            break;
                        case "3":
                            res.data.data[i].type="旅游";
                            break;
                        case "4":
                            res.data.data[i].type="教育";
                            break;
                        case "5":
                            res.data.data[i].type="医疗";
                            break;
                        default:
                            res.data.data[i].type="未知";
                    }
                    for(let l=0;l<res.data.data[i].still.length;l++){
                        switch(res.data.data[i].still.status){
                            case "1":
                                res.data.data[i].still[l].status=false;
                                res.data.data[i].still[l].statusval="待还款";
                                break;
                            default:
                                res.data.data[i].still[l].status=false;
                                res.data.data[i].still[l].statusval="已还款";
                        }
                    }
                    res.data.data[i].bs="yhk";
                }
                
               this.list[1].overview=this.list[1].overview.concat(res.data.data);
               if(this.list[1].overview[0].length!=0){
                   this.list[1].len=false;
               }
            }else{
                this.$vux.toast.text(res.message)
            }
        }).catch((err)=>{})
        console.log(this.list)
    }
    
}
</script>
<style lang="less" scoped>

.qhq{
    //background: #fff;
    .headtab{
        position: fixed;
        top: 41px;
        left: 0;
        z-index: 300;
        width: 100%;
    }
    .tabcontent{
        margin-top: 44px;
        .none {
            position: relative;
            top: 100px;
            padding: 120px 0;
            margin: 0 auto;
            z-index: 500;
            img {
                display: block;
                margin: 0 auto;
                width: 30%;
                padding-bottom: 15px;
            }
            p {
                text-align: center;
                font-size: 20px;
                color: #c5c5c5;
            }
        }
        .dd{
            display: block;
            background: #fff;
            .ddcontant{
                width: 100%;
                overflow: hidden;
                position: relative;
                .text{
                    float: left;
                    width: 90%;
                    p{
                        font-size: 16px;
                        line-height: 25px;
                        text-overflow: ellipsis;
                        overflow: hidden;
                        white-space: nowrap;
                    }
                    p:nth-child(3){
                        color: #a4a4a4;
                        font-size: 14px;
                        overflow: hidden;
                       span{
                           float: right;
                       }
                    }
                }
                .btn{
                    display: block;
                    width: 10%;
                    float: right;
                    line-height: 75px;
                    //transform: translateY(-50%);
                    text-align: center;
                    font-size: 26px;
                }
                
            }
            .list{
                display: none;
                .listitem{
                    display: block;
                    overflow: hidden;
                    position: relative;
                    .left{
                        width: 80%;
                        float: left;
                        p:nth-child(1){
                            font-size: 16px;
                        }
                        p:nth-child(2){
                            font-size: 14px;
                            color: #a4a4a4;
                            line-height:20px;
                        }
                        p:nth-child(3){
                            font-size: 14px;
                            color: #a4a4a4;
                            line-height: 20px;
                        }
                    }
                    .right{
                        width: 20%;
                        text-align: center;
                        display: block;
                        position: absolute;
                        right: 0;
                        top: 50%;
                        transform: translateY(-50%);
                        span{
                            color: #a4a4a4;
                            font-size: 15px;
                        }
                        .btn{
                            color: #fff;
                            background: #1b82d2;
                            text-align: center;
                            padding: 3px 5px;
                            border-radius: 3px;
                        }
                    }
                }
            }
        }
    }
}
.cis{
    animation: cis 0.5s infinite;
    animation-iteration-count:1;
}
.cised{
    transform:rotate(180deg);
}
.inverse{
    animation: inverse 0.5s infinite;
    animation-iteration-count:1;
}
.inversed{
    transform:rotate(0deg);
}
@keyframes cis{
    0%{
        transform:rotate(0deg);
    }
    100%{
        transform:rotate(180deg);
    }
}
@keyframes inverse{
    0%{
        transform:rotate(180deg);
    }
    100%{
        transform:rotate(0deg);
    }
}
</style>

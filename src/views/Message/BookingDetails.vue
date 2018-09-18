<template>
    <div class="BookingDetails animated fadeIn">
        <div class="User-header">
            <div class="box">
                <img class="touxiang" :src="defaultImg"/>
            </div>
            <div class="title">{{xqdata.nc}}</div>
            <img class="touxiang_bj" :src="bj"/>
        </div>
        <card :header="{title:'对方信息'}">
            <div slot="content" class="BookingDetails-card-content">
                <flexbox :gutter="0" wrap="wrap">
                    <flexbox-item :span="1/2">
                        <span class="left">姓名：</span>
                        <span class="right">{{xqdata.name}}</span>
                    </flexbox-item>
                    <flexbox-item :span="1/2">
                        <span class="left">角色：</span>
                        <span class="right">预约发起人</span>
                    </flexbox-item>
                    <flexbox-item :span="1/2">
                        <span class="left">信誉：</span>
                        <span class="right cor1">80%</span>
                    </flexbox-item>
                    <flexbox-item :span="1/2">
                        <span class="left">电话：</span>
                        <span class="right cor2">{{xqdata.tel}}</span>
                    </flexbox-item>
                    <flexbox-item :span="12" class="jieshao">
                        个人介绍
                    </flexbox-item>
                </flexbox>
            </div>
        </card>
        <card :header="{title:'预约信息'}">
            <div slot="content" class="BookingDetails-card-content">
                <flexbox :gutter="0" wrap="wrap">
                    <flexbox-item :span="12">
                        <span class="left">预约时间：</span>
                        <span class="right">{{xqdata.time}}</span>
                    </flexbox-item>
                    <flexbox-item :span="12">
                        <span class="left">地点：</span>
                        <span class="right">{{xqdata.dz}}</span>
                    </flexbox-item>
                    <flexbox-item :span="1/2">
                        <span class="left">备注：</span>
                        <span class="right">{{xqdata.bz}}</span>
                    </flexbox-item>
                    <flexbox-item :span="12">
                        <div class="cor3">
                            个人介绍
                        </div>
                    </flexbox-item>
                </flexbox>
            </div>
        </card>
        <div class="footerBtns">
            <flexbox class="footerBtns-flexbox">
                <flexbox-item class="all" v-if="!xqdata.status">{{xqdata.statusval}}</flexbox-item>
                <flexbox-item class="left type1" v-if="xqdata.status" @click.native="jj">拒绝看房</flexbox-item>
                <flexbox-item class="right" v-if="xqdata.status" @click.native="ty">同意看房</flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
    import { Flexbox, FlexboxItem, Card } from 'vux'
    import { mapActions, mapGetters } from 'vuex'
    export default {
        name: "booking-details",
        components:{ Flexbox, FlexboxItem, Card },
        data(){
            return {
                defaultImg: require('@/assets/img/Login/touxiang.png'),
                bj: require('@/assets/img/Login/touxiang_bj.png'),
                zt:false,//底部按钮开关
                xxid:"",//这条消息的ID
                yyid:"",//该预约的id值
                xqdata:{
                    name:"",
                    tel:"",
                    time:"",
                    dz:"",
                    bz:"",
                    nc:"",
                    status:"",//是否是已经点击过按钮，底部按钮开关
                    statusval:""//按钮内容
                }
            }
        },
        methods:{
            ...mapActions(['action']),  
            changesta(t){
                this.action({
                    moduleName:'recodDetail',
                    url:'/adminapi/member/recodDetail',
                    method:"post",
                    data:{
                        token:this.airforce.login_post.data.token,
                        id:t,
                    } 
                }).then((res)=>{
                    
                }).catch((err)=>{
                    this.$vux.toast.text(err)
                })
            },
            jj(){//拒绝看房按钮的方法
                this.action({
                    moduleName:"reject",
                    url:"Bespeaks/reject",
                    method:"post",
                    data:{
                        token:this .airforce.login_post.data.token,
                        id:this.yyid
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
                }).catch((err)=>{
                    this.$vux.toast.text(err)
                })
            },
            ty(){//同意看房按钮的方法
                this.action({
                    moduleName:"affirm",
                    url:"Adminapi/Bespeaks/affirm",
                    method:"post",
                    data:{
                        token:this.airforce.login_post.data.token,
                        id:this.yyid,
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
                }).catch((err)=>{
                    this.$vux.toast.text(err)
                })
            }
        },
         computed:{
            ...mapGetters(['airforce']),
        },
        created(){
            if(this.$route.query.id){//判断是否是从消息列表页跳转过来的
                this.xxid=this.$route.query.id;
                this.changesta(this.xxid);//改变改消息状态为已读
                this.action({
                    moduleName:'recordnews',
                    url:'adminapi/member/recordnews',
                    method:"post",
                    data:{
                        token:this.airforce.login_post.data.token,
                        id:this.xxid.toString(),
                    } 
                }).then((res)=>{
                    if(res.code==200){
                        this.xqdata.name=res.data.o_name;
                        this.xqdata.tel=res.data.o_phone;
                        this.xqdata.time=res.data.room_time;
                        this.xqdata.dz=res.data.address;
                        this.xqdata.bz=res.data.remark;
                        this.xqdata.nc=res.data.nickname;
                        this.yyid=res.data.b_id;
                        this.xqdata.status=res.data.status;
                        switch(this.xqdata.status){
                            case "0":
                                    this.xqdata.status=true;
                                    break;
                            case "1":
                                    this.xqdata.status=false;
                                    this.xqdata.statusval="已接受";
                                    break;
                            case "2":
                                    this.xqdata.status=false;
                                    this.xqdata.statusval="已接受";
                                    break;
                            case "3":
                                    this.xqdata.status=false;
                                    this.xqdata.statusval="已接受";
                                    break;
                            default:
                                    this.xqdata.status=false;
                                    this.xqdata.statusval="已拒绝";
                        }
                    }else{
                        this.$vux.toast.text(res.message)
                    }
                }).catch((err)=>{})
            }else if(this.$route.query.yyid){//判断是否是预约列表页跳转过来的
                let yyid=this.$route.query.yyid;
                this.action({
                    moduleName:'bespeakIndex',
                    url:'adminapi/bespeaks/bespeakIndex',
                    method:"post",
                    data:{
                        token:this.airforce.login_post.data.token,
                        id:yyid,
                    } 
                }).then((res)=>{
                    if(res.code==200){
                        this.xqdata.name=res.data.o_name;
                        this.xqdata.tel=res.data.o_phone;
                        this.xqdata.time=res.data.room_time;
                        this.xqdata.dz=res.data.address;
                        this.xqdata.bz=res.data.remark;
                        this.xqdata.nc=res.data.nickname;
                        this.xqdata.status=res.data.status;
                         switch(this.xqdata.status){
                            case "1":
                                this.xqdata.status=false;
                                this.xqdata.statusval="已完成";
                                break;
                            case "2":
                                this.xqdata.status=false;
                                this.xqdata.statusval="已中断";
                                break;
                            case "3":
                                this.xqdata.status=false;
                                this.xqdata.statusval="已接受";
                                break;
                            case "4":
                                this.xqdata.status=false;
                                this.xqdata.statusval="已拒绝";
                                break;
                            default:
                                this.xqdata.status=false;
                                this.xqdata.statusval="未处理";
                         }
                    }else{
                        this.$vux.toast.text(res.message)
                    }
                }).catch((err)=>{})
            }else{
                return false;
            }
            
            
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/color.less";
.BookingDetails{
    .User-header{
        background-color: @theme-color;
        text-align: center;
        padding-top: 55px;
        position: relative;
        padding-bottom: 10px;
        @zindex:120px;
        @index:15px;
        @s:3.5s;
        @animationOpt:bounce @s infinite ease-in-out;
        @keyframes bounce {
            0%{
                box-shadow:
                        0 0 0 0 @rgba_ffffff_05;
            }
            25%{
                box-shadow:
                        0 0 0 @index/2 @rgba_ffffff_05;
            }
            50%{
                box-shadow:
                        0 0 0 @index/2 @rgba_ffffff_05,
                        0 0 0 @index @rgba_ffffff_05;
            }
            100% {
                box-shadow:0 0 0 0 @rgba_ffffff_05;
            }
        }
        .box{
            color: @cor_ffffff;
            display: inline-block;
            width: @zindex;
            height: @zindex;
            line-height: @zindex;
            border-radius: 100%;
            background-color: @rgba_ffffff_18;
            white-space:nowrap;
            text-overflow:ellipsis;
            -o-text-overflow:ellipsis;
            overflow: hidden;
            animation: @animationOpt;
            -webkit-animation: @animationOpt;
            margin-bottom: @index;
            position: relative;
            z-index: 2;
            .touxiang{
                width: 100%;
                height: 100%;
                border-radius: 100%;
            }
        }
        .title{
            position: relative;
            z-index: 2;
            color: @cor_ffffff;
            font-size: 12px;
        }
        .touxiang_bj{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 1;
        }
    }
    .BookingDetails-card-content{
        padding: @paIndex;
        font-size: 14px;
        .cor1{
            color: @theme-color;
        }
        .cor2{
            color: @cor_ff0000;
        }
        .cor3{
            background-color: @cor_e5e5e5;
            border-radius: 5px;
            padding: 10px;
            margin-top: @maTop;
            border:1px solid @cor_D9D9D9;
        }
        .jieshao{
            color: @cor_a9a7ab;
            margin-top: @maTop;
            padding-top: @maTop;
            position: relative;
            border-top: 1px solid @cor_D9D9D9;
            max-height: 120px;
            overflow-x: hidden;
        }
    }
    .footerBtns{
        @index:50px;
        height:  @index + @maTop;
        .footerBtns-flexbox{
            border-top: 1px solid @theme-color;
            background-color: @cor_ffffff;
            position: fixed;
            left: 0;
            bottom: 0;
            text-align: center;
            line-height:  @index;
            color: @theme-color;
            .all{
                background-color: @theme-color;
                color:#fff;
            }
            .left{
                &.type1{
                    color: @cor_ff0000;
                }
                &:active{
                    background-color: @cor_D9D9D9;
                }
            }
            .right{
                background-color: @theme-color;
                color: @cor_ffffff;
                margin: 0 !important;
                &:active{
                    background-color: @theme-color*0.9;
                }
            }
        }
    }
}
</style>
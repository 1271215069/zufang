<template>
    <div class="User">
        <div class="User-header animated fadeIn">
            <div class="box ">
                <input type="file" ref="sc" @change="updata">
                <!-- <img class="touxiang" :src="defaultImg"/> -->
                <div class="touxiang" :style='"background:url("+defaultImg+") center center / cover no-repeat;"'></div>
            </div>
            <div  class="title">
                <router-link to="/xgzl">{{username}}<span class="iconfont">&#xe64a;</span></router-link>
            </div>
            
            <img class="touxiang_bj" :src="bj"/>
        </div>
        <group class="User-group User-group-top">
            <cell title="房源管理" @cell-font-size="fz"  :is-link="true" link="/HousingResource" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe6be;</span>
            </cell>
            <!-- <cell title="租金管理" @cell-font-size="fz"  :is-link="true" link="/Rents" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe632;</span>
            </cell> -->
            <cell title="银行卡管理" v-if="zsshow" @cell-font-size="fz" :is-link="true"  link="/Wdyhk" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe625;</span>
            </cell>
            <cell title="预约管理" @cell-font-size="fz" :is-link="true" link="/Yygl" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe644;</span>
            </cell>
            <cell title="我的预约" @cell-font-size="fz" :is-link="true" link="/Wdyy" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe635;</span>
            </cell>
        </group>
        <group class="User-group">
            <cell title="维修管理" @cell-font-size="fz" :is-link="true" link="/Wxgl" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe609;</span>
            </cell>
        </group>
        <group class="User-group">
            <cell title="我的收藏" @cell-font-size="fz" :is-link="true" link="/Wdsc" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe624;</span>
            </cell>
            <cell title="会员中心" v-if="zsshow" @cell-font-size="fz" :is-link="true" link="" @click.native="kfz" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe61c;</span>
            </cell>
             <cell title="借贷中心" v-if="zsshow" @cell-font-size="fz" :is-link="true" link="/Jd" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe62d;</span>
            </cell>
        </group>
        <group class="User-group">
            <cell title="设置" @cell-font-size="fz" :is-link="true" link="/Sz" class="User-cell">
                <span slot="icon" class="iconfont icon1">&#xe61f;</span>
            </cell>
        </group>
        <!-- <popup v-model="pp">
            <p style="background:red">687</p>
        </popup> -->
    </div>
</template>

<script>
import '@/utils/utils.js'
import { Group, Cell, Popup} from "vux"
import { mapActions,mapGetters } from "vuex";
    export default {
        name: "user",
        components:{ Group, Cell,Popup },
        data(){
            return {
                defaultImg: require('@/assets/img/Login/touxiang.png'),
                bj: require('@/assets/img/Login/touxiang_bj.png'),
                fz:'14px',
                filehead:{},
                username:"",
                pp:true,
                zsshow:true
            }
        },
        methods:{
            ...mapActions(["action"]),
            kfz(){
                this.$vux.toast.text("拼命开发中...")
            },
            updata(){//头像上传的方法
                this.filehead=this.$refs.sc.files[0];
                let reader=new FileReader();
                reader.readAsDataURL(this.filehead);
                reader.onload = (x)=>{
                let uploaddata={
                                token:this.airforce.login_post.data.token,
                                type:"head",
                                head:this.filehead,
                            };
                    this.action({
                        moduleName: 'uploadimg',
                        method: "post",
                        isFormData:true,
                        url: "adminapi/member/uploadimg",
                        data:uploaddata
                    }).then((res)=>{
                        if(res.code==200){
                            this.defaultImg=res.data.head_pic;
                            this.$vux.toast.text(res.message)
                            this.action({
                                moduleName:"login_post",
                                goods:{
                                    data:{
                                        head_pic:res.data.head_pic
                                    }
                                }
                            })
                        }else{
                            this.$vux.toast.text(res.message)
                        }
                    }).catch((err)=>{})
                }
            },
            sethead(){//设置头像的方法
                if(this.airforce.login_post.data.head_pic=="" || this.airforce.login_post.data.head_pic == null||!this.airforce.login_post.data.head_pic){
                    this.defaultImg=require('@/assets/img/Login/touxiang.png');
                }else{
                    this.defaultImg=this.airforce.login_post.data.head_pic;
                }
           }
        },
        computed:{
            ...mapGetters(['airforce'])
        },
        created(){


            this.action({
                moduleName: 'skr',
                method: "post",
                isFormData:true,
                url: "adminapi/VersionDown/skr",
                //isFormData:true,
                data:{
                    token:this.airforce.login_post.data.token
                }
            }).then((res)=>{
                if(res.code==200){
                    console.log(res)
                    if(res.status==1){
                        this.zsshow=false;
                    }else{
                        this.zsshow=true;
                    }
                }
            }).catch((err)=>{})


            if(!this.airforce.login_post.data.nickname==""){
                this.username=this.airforce.login_post.data.nickname;
            }else if(!this.airforce.login_post.data.name==""){
                this.username=this.airforce.login_post.data.name;
            }else if(!this.airforce.login_post.data.phone==""){
                this.username=this.airforce.login_post.data.phone;
            }
            this.sethead();
        },

    }
</script>

<style scoped lang="less">
@import "../../assets/css/color.less";
.fz{
    font-size: 12px;
}
.User{
    padding-bottom: 50px;
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
            z-index: 501;
            input[type=file]{
                display: block;
                width: 100%;
                height: 100%;
                border-radius: 50%;
                opacity: 0;
                position: absolute;
                top: 0;
                left: 0;
            }
            .touxiang{
                width: 100%;
                height: 100%;
                //border-radius: 100%;
            }
        }
        .title{
            position: relative;
            z-index: 501;
            color: @cor_ffffff;
            font-size: 12px;
            a{
                 position: relative;
                z-index: 502;
                color: @cor_ffffff;
                font-size: 14px;
                span{
                    padding-left: 2%;
                }
            }
        }
        .touxiang_bj{
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            z-index: 500;
        }
    }
    &/deep/ .User-group{
        z-index: 501;
        .vux-no-group-title{
            margin: 0;
            margin-top: @maTop;
            .iconfont{
                margin-right: @maTop;
                font-size: 24px;
                line-height: 30px;
            }
        }
        &.User-group-top{
            .vux-no-group-title{
                margin: 0;
            }
        }
    }
}
</style>
<template>
    <div class="jbdetails animated fadeIn">
        <swiper :list="detaildata.img" :show-desc-mask="false"></swiper> 
        <card :header="{title:'房源信息'}">
            <div slot="content" class="card-content">
                <p>房源标题：{{detaildata.title}}</p>
                <p>房源地址：{{detaildata | location}}</p>
            </div>
        </card>
        <card :header="{title:'竞价人信息'}">
            <div slot="content" class="jjrcard card-content">
                <img :src="detaildata.head_pic" >
                <div class="jjrcontent">
                    <p>竞价人姓名：{{detaildata.name}}</p>
                    <p>竞价人电话：{{detaildata.phone}}</p>
                    <p>出价：{{detaildata.bidding_price}}元</p>
                </div>
            </div>
        </card>
        <a class="btn" :href='"tel:"+detaildata.phone'>
            联系竞价人
        </a>
    </div>
</template>
<script>
import {Swiper,Card  } from "vux"
import { mapActions, mapGetters } from 'vuex'
export default {
    name:"jbdetails",
    data(){
        return{
            detaildata:{}
         }
    },
    components:{
        Swiper ,
        Card ,
    },
    methods:{
        ...mapActions(['action']),
        changesta(t){//改变信息是否已读状态的方法
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
    },
    computed:{
        ...mapGetters(['airforce']),
    },
    created(){
        this.changesta(this.$route.query.id);
        let newsid=this.$route.query.id;
        this.action({
            moduleName:'bid_content',
            url:'/Adminapi/Housesource/bid_content',
            method:"post",
            data:{
                token:this.airforce.login_post.data.token,
                id:newsid
            }
        }).then((res)=>{
            if(res.code==200){
                let list=[];
                for(let i in res.data.img){
                        list.push({img:res.data.img[i]});
                    }
                res.data.img=list;
                if(res.data.head_pic==""||res.data.head_pic==null){
                    res.data.head_pic=require('@/assets/img/Login/touxiang.png');
                }
                this.detaildata=res.data;
            }else{
                this.$vux.toast.text(res.message)
            }
        }).catch((err)=>{})

    }    
}
</script>
<style lang="less" scoped>
.jbdetails{
    .card-content{
        padding: 15px;
        font-size: 14px;
    }
    .jjrcard{
        overflow: hidden;
        img{
            display: block;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            float:left;
        }
        .jjrcontent{
            margin-left: 15px;
            float: left;
            line-height: 20px;
        }
    }
    .btn{
        display: block;
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 50px;
        background: #1b82d2;
        color: #fff;
        text-align: center;
        line-height: 50px;
    }
}
</style>

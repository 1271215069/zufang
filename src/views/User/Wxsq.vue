<template>
    <div class="wxsq animated fadeIn">
        <div class="none" v-if="dslshow">
                <img :src="require('@/assets/img/User/nocontent.png')">
                <p>暂无信息</p>
            </div>
        
            <div  class="content-item" v-for="(item,index) in list" v-else :key="index">
                <cell-box class="tabitem-info">
                    <router-link :to='"/HousingDetails?id="+item.room_id'>
                        <img :src="item.img.img0">
                    </router-link>
                    <router-link :to='"/Wxxq?id="+item.r_id+"&from=not"'>
                        <p>
                            申报人：{{item.name}},{{item.phone}}
                        </p>
                        <p>
                            报修原因：{{item.title}}
                        </p>
                        <p>
                            地址：{{item.address}}
                        </p>
                    </router-link>
                </cell-box>
            </div>
       
    </div>
</template>
<script>
import { mapActions,mapGetters } from "vuex";
import {Scroller,CellBox} from "vux"
export default {
    name:"Wxsq",
    data(){
        return{
             msg:"维修申请",
             pullupConfig:{
                content: '上拉刷新',
                autoRefresh: true,
                downContent: '够啦够啦',
                upContent: '上拉刷新',
                loadingContent: '加载中...',
                clsPrefix: 'pullupConfig-',
            },
            dslshow:false,
            page:1,
            list: []
        }
    },
    components:{
        Scroller,
        CellBox
    },
    methods:{
        ...mapActions(["action"]),
    },
    computed:{
        ...mapGetters(["airforce"]),
    },
    created(){
        this.action({
            moduleName:"repairLists",
            url:"Repair/repairLists",
            method:"post",
            data:
            {
                token:this.airforce.login_post.data.token,
                type:"2",
                status:"0"
            }
        }).then((res)=>{
            if(res.code==200){ 
                this.list=res.data.lists;
                if(this.list.length==0){
                    this.dslshow=true;
                }else{
                    this.dslshow=false;
                }
            }else{
                this.dslshow=true;
                this.$vux.toast.text("res.message")
            }
        }).catch((err)=>{
            // this.$vux.toast.text("err")
        })
    }
}
</script>
<style lang="less" scoped>

.wxsq{
    .none {
        position: relative;
        top: 100px;
        padding: 120px 0;
        margin: 0 auto;
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
    .content-item{
        background: #fff;
            a:nth-child(1){
              width: 35%;
              padding-right: 3%;
              img{
                width: 100%;
                height:88px;
              }
            }
            a:nth-child(2){
               text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              p {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              font-size:14px;
              color:#a9a7ab;
              line-height: 29px;
            }
            }
           
    }
}
</style>

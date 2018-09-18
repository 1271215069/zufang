<template>
    <div class="jsgl animated fadeIn">
        <div class="none" v-if="conshow">
            <img :src="require('@/assets/img/User/nocontent.png')">
            <p>暂无信息</p>
        </div>
        <cell-box class="conitem" v-else link="" v-for="(item,index) in porson" :key="index">
            <div class="left">
                <p>姓名：{{item.name}},{{item.id}}</p>
                <p>类别：{{item.type}}</p>
                <p>联系方式：{{item.phone}}</p>
                <p>工作描述：{{item.describe}}</p>
            </div>
            
            <span class="right" @click.prevent="del(item.id,index)">删除</span>
           
        </cell-box>
    </div>
</template>
<script>
import { mapActions,mapGetters } from 'vuex'
import {CellBox} from "vux"
export default {
    name:"Jsgl",
    data(){
        return{
            msg:"角色管理",
            conshow:false,
            porson:[]
        }
    },
    components:{
        CellBox
    },
    methods:{
      ...mapActions(['action']),
      del(t,k){//点击删除按钮的方法
        let that=this; 
        this.$vux.confirm.show({
            title:"确认删除吗？",
            onConfirm () {//点击确定的方法
                that.action({
                    moduleName:"delRole",
                    url:"Adminapi/Roles/delRole",
                    method:"post",
                    data:
                    {
                        token:that.airforce.login_post.data.token,
                        id:t
                    }
                }).then((res)=>{
                    if(res.code==200){
                        that.$vux.toast.text(res.message);
                        that.porson.splice(k,1);
                        if(that.porson.length==0){
                            that.conshow=true;
                        }   
                    }else{
                        that.$vux.toast.text(res.message)
                    }
                }).catch((err)=>{})
            }
        })
        if(this.porson.length==0){
            this.conshow=true;
        }
      }
    },
    computed:{
         ...mapGetters(["airforce"]),
    },
    mounted(){
      this.action({
          moduleName:'layout',
          goods:{
              clickRight:()=>{
                  this.$router.push("/Addjs")
              }
          }
      })
    },
    created(){
        this.action({
            moduleName:"roleList",
            url:"Adminapi/Roles/roleList",
            method:"post",
            data:
            {
                token:this.airforce.login_post.data.token,
            }
        }).then((res)=>{
            if(res.code==200){
                if(res.data.lists.length==0){
                    this.conshow=true;
                }
                for(let i=0;i<res.data.lists.length;i++){
                    if(res.data.lists[i].type=="1"){
                        res.data.lists[i].type="管道工";
                    }else if(res.data.lists[i].type=="2"){
                        res.data.lists[i].type="泥水工";
                    }else if(res.data.lists[i].type=="3"){
                        res.data.lists[i].type="清洁工";
                    }
                    this.porson.push(res.data.lists[i])
                }
            }else{
                this.conshow=true;
                this.$vux.toast.text(res.message)
            }
        }).catch((res)=>{
            this.$vux.toast.text(err)
        })
    }
}
</script>
<style lang="less" scoped>
.jsgl{
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
    .conitem{
        background: #fff;
        display: block;
        overflow: hidden;
        .left{
            width: 80%;
            font-size: 14px;
            float:left;
            p{
            //   text-overflow: ellipsis;
            //   overflow: hidden;
            //   white-space: nowrap;
            }
        }
        .right{
            display: block;
            text-align: center;
            float: right;
            border: 1px solid #1b82d2;
            color: #1b82d2;
            padding: 1px 12px;
            border-radius: 21px;
            position: absolute;
            top: 50%;
            right: 15px;
            transform:translateY(-50%);
            line-height: 20px;
        }
    }
}
</style>

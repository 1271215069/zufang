<template>
    <div class="xzyhk animated fadeIn">
        <cell class="list-item" :title='item.bank_name+" ( 尾号为"+item.fourbank+" ) "' @click.native="getyhk(item)" v-for="(item,index) in list" :key="index" is-link :link='"/Wszl?bank="+item.bank+"&bankname="+item.bank_name'></cell>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import {Cell} from "vux"
import { setTimeout } from 'timers';
export default {
    name:"xzyhk",
    data(){
        return{
            list:[],
        }
    },
    components:{
        Cell,
    },
    methods:{
        ...mapActions(['action']),
        getyhk(item){
            this.action({
                moduleName:'Wszl',
                goods:{
                    bank:item.bank,
                    bank_name:item.bank_name,
                }
            })
        }
    },
    created(){
        this.action({
            moduleName:'getyhklist',
            url:'/adminapi/member/bankList',
            method:"post",
            data:{
                token:this.airforce.login_post.data.token,
            }
        }).then((res)=>{
            if(res.code==200){
                for(let i=0;i<res.data.length;i++){
                    let len=res.data[i].bank.length;
                    res.data[i].fourbank=res.data[i].bank.substring(len-4, len);
                }
                this.list=this.list.concat(res.data);
                if(this.list.length==0){
                    this.$vux.toast.text("您还没有银行卡，请前去绑定银行卡");
                    setTimeout(()=>{
                        this.$router.push("/Addyhk")
                    },2000)
                }
            }else{
                this.$vux.toast.text(res.message)
                if(this.list.length==0){
                    this.$vux.toast.text("您还没有银行卡，请前去绑定银行卡");
                    setTimeout(()=>{
                        this.$router.push("/Addyhk")
                    },2000)
                }
            }
        }).catch((err)=>{})
    },
    computed:{
        ...mapGetters(['airforce']),
    }
}
</script>
<style lang="less" scoped>
.xzyhk{
    .list-item{
        background: #fff;
    }
}
</style>

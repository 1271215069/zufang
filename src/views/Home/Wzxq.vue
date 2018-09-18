<template>
    <div class="wzxq animated fadeIn">
        <p class="title">{{wzdata.post_title}}</p>
        <p class="from">来源于：{{wzdata.post_source}}</p>
        <!-- <p class="con">
            {{wzdata.post_content}}
        </p> -->
        <div class="context" ref="context">

        </div>
    </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex"
export default {
    name:"",
    data(){
        return{
            wzdata:{},
        }
    },
    methods:{
        ...mapActions(['action']),
        htmlencode(s){  
            var div = document.createElement('div');  
            div.appendChild(document.createTextNode(s));  
            return div.innerHTML;  
        },
        htmldecode(s){  
            var div = document.createElement('div');  
            div.innerHTML = s;  
            return div.innerText || div.textContent;  
        }    
    },
    computed:{
        ...mapGetters(['airforce']),
    },
    created(){
        this.action({
            moduleName:'content',
            method:'post',
            url:'/adminapi/posts/contents',
            data:{
                token:this.airforce.login_post.data.token,
                id:this.$route.query.id,
            }
        }).then((res)=>{
            if(res.code==200){
                this.wzdata=res.data;
                let setdiv = document.createElement('div');
                setdiv.innerHTML=this.wzdata.post_content;
                for(let i=0;i<setdiv.childNodes.length;i++){
                    this.$refs.context.appendChild(setdiv.childNodes[i]);
                }
            }else{
                this.$vux.toast.text(res.message)
            }
        }).catch((err)=>{})
    }
}
</script>
<style lang="less" scoped>
.wzxq{
    //height: 100%;
    //background: #fff;
    .title{
        width: 80%;
        margin: 0 auto;
        text-align: center;
        line-height: 35px;
        font-size: 20px;
    }
    .from{
        text-align: center;
        font-size: 16px;
        color: rgb(169, 167, 171);
    }
    .con{
        text-indent: 28px;
        padding: 10px 15px;
        font-size: 14px;
    }
    .context{
        padding: 10px 15px;
        font-size: 14px!important;
    }
}
</style>

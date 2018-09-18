<template>
    <!-- <transition name="fade">     -->
        <div class="MessageDetails animated fadeIn">
            <h1 class="title">{{MessageDetails.title}}</h1>
            <span class="time">{{MessageDetails.create_at}}</span>
            <hr>
            <div class="contents">
                {{MessageDetails.content}}
            </div>
            <p v-if="show">房东对您所住的{{roomdata|location}}催租啦！！！</p>
        </div>
    <!-- </transition> -->
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'
    export default {
        name: "message-details",
        data(){
            return {
                MessageDetails:{},
                show:false,
                roomdata:{}
            }
        },
        methods:{
            ...mapActions(['action']),
        },
        computed:{
            ...mapGetters(['airforce']),
        },
        mounted(){
            this.$vux.loading.show({
                text: '加载中..'
            });
            try {
                this.action({
                    moduleName:'MessageDetails_post',
                    url:'/adminapi/member/recodDetail',
                    method:'post',
                    data:{
                        token:this.airforce.login_post.data.token,
                        id:this.$router.currentRoute.query.id,
                    }
                }).then(res=>{
                    this.$vux.loading.hide();
                    if(res.code == 200){
                        try {
                            this.MessageDetails = res.data.data;
                        }catch (e){}
                    }
                }).catch(ree=>{
                    this.$vux.loading.hide();
                });
            }catch (e){}
            if(this.$route.query.roomid|!this.$route.query.roomid==null){
                this.action({
                    moduleName:'detail',
                    url:'/adminapi/Housesource/detail',
                    method:'post',
                    data:{
                        token:this.airforce.login_post.data.token,
                        id:this.$route.query.roomid
                    }
                }).then((res)=>{
                    if(res.code==200){
                        this.roomdata=res.data;
                        this.show=true;
                    }else{
                        this.$vux.toast.text(res.message)
                    }
                }).catch((err)=>{})
            }
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/color.less";
.MessageDetails{
    padding: @paIndex;
    .title{
        text-align: center;
        font-size: 18px;
    }
    .time{
        color: @cor_a9a7ab;
        font-size: 12px;
        text-align: right;
        display: block;
    }
    .contents{
        font-size: 14px;
        margin-top: @paIndex;
    }
}
</style>
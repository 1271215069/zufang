<template>
    <div class="message">
        
        <div class="message-tab animated fadeIn">
            <tab :line-width=2 v-model="index">
                <tab-item :selected="index == 0" v-for="(item,index) in tabs" :key="`message-tab${index}`">{{item.title}}</tab-item>
            </tab>
        </div>
        <swiper  ref="swiper" v-model="index" :aspect-ratio="1/2" :show-dots="false" class="message-swiper ">
            <swiper-item :class="(item.list.length == 0)? 'notData iconfont' : ''" v-for="(item, index) in tabs" :key="`message-swiper${index}`">
                <div class="message-swiper-item animated fadeIn">
                    <flexbox @click.native="seeMessage(listItem)" class="message-swiper-item-flexbox" v-for="(listItem,listItemIndex) in item.list" :key="`message-swiper-item${index}${listItemIndex}`">
                        <flexbox-item span="60" class="left">
                                <span :class="`messageType${listItem.type}`">{{listItem.type | MessageType}}</span>
                        </flexbox-item>
                        <flexbox-item class="right">
                            <div class="right-top">
                                <h2>{{listItem.title}}</h2>
                                <span>{{listItem.create_at}}</span>
                            </div>
                            <div class="right-buttom">
                                <h2 v-if="item.title == '未查看'">{{listItem.content}}</h2>
                                <h2 v-else>{{listItem.content}}</h2>
                            </div>
                        </flexbox-item>
                    </flexbox>
                    <div class="buttom"></div>
                </div>
            </swiper-item>
        </swiper>
    </div>
</template>

<script>
    import { Tab, TabItem, Swiper, SwiperItem, Flexbox, FlexboxItem } from 'vux'
    import { mapActions, mapGetters } from 'vuex'
    export default {
        name: "Article",
        components: { Tab, TabItem, Swiper, SwiperItem, Flexbox, FlexboxItem },
        data(){
            return {
                tabs:[
                    {
                        title:'未查看',
                        list:[]
                    },
                    {
                        title:'已查看',
                        list:[]
                    }
                ],
                index: 0,
            }
        },
        methods:{
            ...mapActions(['action']),
            seeMessage(item){
                switch (item.type){
                    case '1':
                        this.$router.push('/MessageDetails?id='+item.id+"&roomid="+item.news_id)
                        break;
                    case '2':
                        this.$router.push('/BookingDetails?id='+item.id)
                        break;
                    case "5":
                        this.$router.push('/HtDetails?id='+item.id)
                        break;
                    case "6":
                        this.$router.push('/JbDetails?id='+item.id)
                        break;
                    default:
                        this.$router.push('/MessageDetails?id='+item.id)
                        break;
                }
            },
            getList(cons={}){
                let conInit = {
                    token:this.airforce.login_post.data.token,
                    status:1,
                };
                this.action({
                    moduleName:'MessageList_post',
                    url:'/adminapi/member/record',
                    method:"post",
                    data:_.merge(conInit,cons)
                }).then(res=>{
                    try {
                        this.tabs[conInit.status-1].list = res.data.data
                    }catch (e){}
                })
            }
        },
        computed:{
            ...mapGetters(['airforce']),
        },
        mounted(){
            //未读
            this.getList();
            // //已读
            this.getList({status:2});
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/color.less";
.message{
    @index:44px;
    &/deep/ .message-tab{
        min-height: @index;
        margin-bottom: @maTop;
        .vux-tab-wrap{
            position: fixed;
            left: 0;
            top:@header_hright;
            width: 100%;
            .vux-tab{
                .vux-tab-item{
                    &.vux-tab-selected{
                        color: @theme-color;
                        border-bottom: 3px solid @theme-color;
                    }
                }
                .vux-tab-ink-bar{
                    background-color: @theme-color;
                }
            }
        }
    }
    &/deep/ .message-swiper{
        .vux-swiper{
            position: fixed;
            height: auto !important;
            min-height: 100% !important;
            width: 100%;
            overflow-x: hidden;
            .message-swiper-item{
                overflow-x: hidden;
                height: 100% !important;
                .buttom{
                    height: @index + @header_hright;
                    margin-top: @maTop;
                }
                .message-swiper-item-flexbox{
                    padding: @maTop @paIndex;
                    background-color: @cor_ffffff;
                    margin-bottom:2px;
                    &:active{
                        background-color: @cor_e5e5e5;
                    }
                    .left{
                        .messageType1{
                            background-color: @cor_a9a7ab;
                            color: @cor_ffffff;
                            width: 50px;
                            height: 50px;
                            line-height: 50px;
                            border-radius: 100%;
                            display: inline-block;
                            text-align: center;
                        }
                        .messageType2{
                            .messageType1;
                            background-color: @cor_c31bd2;
                        }
                        .messageType3{
                            .messageType1;
                            background-color: @cor_1bd182;
                        }
                        .messageType4{
                            .messageType1;
                            background-color: @theme-color;
                        }
                        .messageType5{
                            .messageType1;
                            background-color: @cor_CE0000;
                        }
                        .messageType6{
                            .messageType1;
                            background-color: @cor_6959CD;
                        }
                        .messageType7{
                            .messageType1;
                            background-color: @cor_91c8f2;
                        }
                    }
                    .right{
                        .right-top{
                            overflow: hidden;
                            line-height: 30px;
                            padding-right: @paIndex*2;
                            h2{
                                font-size: 14px;
                                font-weight: initial;
                                color: @cor_a9a7ab;
                                float: left;
                            }
                            span{
                                font-size: 12px;
                                float: right;
                                color: @cor_a9a7ab;
                            }
                        }
                        .right-buttom{
                            overflow: hidden;
                            .textNowrap();
                            h2{
                                font-size: 14px;
                                .textNowrap();
                            }
                        }
                    }
                }
            }
            .notData{
                position: relative;
                &:before{
                    content: '\e62a';
                    position: absolute;
                    left: 0;
                    top: 50px;
                    width: 100%;
                    font-size: 80px;
                    text-align: center;
                    color: @cor_d7e8f4;
                }
                &:after{
                    content: '暂无消息';
                    position: absolute;
                    left: 0;
                    top: 50px + 100px;
                    width: 100%;
                    font-size: 14px;
                    text-align: center;
                    color: @cor_91c8f2;
                }
            }
        }
    }
}
</style>

<template>
    <div :class="`layout-header headerType${airforce.layout.type}`">
        <div :class="`layout-header-Box type${airforce.layout.type} ${scrollBool}`">
            <flexbox class="box">
                <flexbox-item v-if="!airforce.layout.leftShow" :span="leftSpan"></flexbox-item>
                <flexbox-item class="left" v-if="airforce.layout.leftShow"  :span="leftSpan" @click.native="clickLeft">
                    <span class="iconfont" v-if="airforce.layout.searchShow">取消</span>
                    <span class="iconfont" v-else v-html="airforce.layout.left"></span>
                </flexbox-item>
                <flexbox-item class="content" v-if="airforce.layout.type != '3'" @click.native="clickContent">
                    <span class="iconfont" v-html="airforce.layout.title" v-if="scrollBool.length != 0 && airforce.layout.titleShowType"></span>
                    <span class="iconfont" v-html="airforce.layout.title" v-if="!airforce.layout.titleShowType"></span>
                    <x-input placeholder="搜索包含关键字的对应标题" :value="airforce.layout.searchText" @on-change="airforce.change.set($event,'searchText','layout')" v-if="airforce.layout.searchShow && airforce.layout.type == '4'" class="search-x-input" @on-enter="search($event)"></x-input>
                </flexbox-item>
                <flexbox-item  class="right" v-if="airforce.layout.type != '3'" :span="rightSpan" @click.native="clickRight">
                    <span class="iconfont" v-if="airforce.layout.type != '4' && airforce.layout.right.length > 0" v-html="airforce.layout.right" :style="{fontSize:airforce.layout.rightFontSize+'px',transform: 'scale('+airforce.layout.rightFontScale+')'}"></span>
                    <div v-if="airforce.layout.type == '4'">
                        <span class="iconfont searchIcon" v-if="!airforce.layout.searchShow">&#xe61d;</span>
                        <span class="iconfont" v-else>确定</span>
                    </div>
                </flexbox-item>
            </flexbox>
        </div>
    </div>
</template>

<script>
    import { Flexbox, FlexboxItem, XInput, Group, Popover } from  "vux"
    import { mapGetters, mapActions } from  "vuex"
    export default {
        name: "layout-header",
        components:{ Flexbox, FlexboxItem, XInput, Group, Popover },
        data(){
            return {
                scrollBool:'',
                Time:0,
                scrollY:0
            }
        },
        computed:{
            ...mapGetters(['airforce']),
            leftSpan(){
                if(this.airforce.layout.leftSpan){
                    return this.airforce.layout.leftSpan;
                }
                return '50';
            },
            rightSpan(){
                if(this.airforce.layout.rightSpan){
                    return this.airforce.layout.rightSpan;
                }
                return '50';
            }
        },
        methods:{
            ...mapActions(['action']),
            clickLeft(){
                if(!this.airforce.layout.clickLeftBack){
                    this.airforce.layout.clickLeft();
                    return;
                }
                switch (this.airforce.layout.type){
                    case "1":
                        this.$router.back();
                        break;
                    case "5":
                        this.$router.back();
                        break;
                    case "2":
                        this.$router.back();
                        break;
                    case "3":
                        this.$router.back();
                        break;
                    case "4":
                        if(this.airforce.layout.searchShow){
                            this.action({
                                moduleName:'layout',
                                goods:{
                                    searchShow:false
                                }
                            });
                            this.airforce.layout.clickLeft();
                        }else {
                            this.$router.back();
                        }
                        break;
                    default:
                        this.airforce.layout.clickLeft();
                        break
                }
            },
            clickContent(){
                this.airforce.layout.clickContent();
            },
            clickRight(){
                if(this.airforce.layout.right == '&#xe668;' && this.airforce.layout.type != "4"){
                    this.$router.push('/Message');
                    return;
                }
                if(this.airforce.layout.type && this.airforce.layout.type == "4"){
                    if(this.airforce.layout.searchShow){
                        this.action({
                            moduleName:'layout',
                            goods:{
                                searchShow:false
                            }
                        });
                        this.search(this.airforce.layout.searchText);
                    }else {
                        this.action({
                            moduleName:'layout',
                            goods:{
                                searchShow:true
                            }
                        })
                    }
                }
                this.airforce.layout.clickRight();
            },
            search(val){
                this.airforce.layout.search(val);
            },
            calc(){
                this.scrollY = window.scrollY;
                if(window.scrollY <= 5){
                    this.scrollBool = '';
                    return;
                }
                this.scrollBool = 'scrollBool';
            },
            init(){
                this.calc();
                window.addEventListener('touchstart',()=>{
                    this.calc();
                });
                window.addEventListener('touchmove',()=>{
                    this.calc();
                });
                window.addEventListener('touchend',()=>{
                    for(let i = 1 ; i < 100; i++){
                        setTimeout(()=>{
                            this.calc();
                        },30*i);
                    }
                });
            }
        },
        mounted(){
            this.init();
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/color.less";
@keyframes changebac{
   0%{
    background:rgba(27,130,210,0.5);
  }
  100%{
    background:rgba(27,130,210,1);
  }
}
.layout-header{
    @h:@header_hright;
    @index:30px;
    @paIndex:15px;
    &.headerType1,
    &.headerType4,
    &.headerType3{
        height: @h;
    }
    .layout-header-Box{
        background-color: @theme-color;
        color: @cor_ffffff;
        padding: 0 @paIndex;
        position: relative;
        z-index: 688;
        .box{
            line-height: @h;
            .left{
                span{
                    display: inline-block;
                    text-align: center;
                    font-size: 16px;
                }
            }
            .content{
                text-align: center;
                font-size: 18px;
                position: relative;
                .search-x-input{
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    top: 8px;
                    height: @h - 15px;
                    line-height: @h - 15px;
                    font-size: 14px;
                    width: 90%;
                    background-color: @cor_ffffff;
                    padding: 0;
                    border-radius: @h;
                    padding: 0 5px;
                    margin: 0 -5px;
                    color: @cor_000000;
                    &:before{
                        border: none;
                        background-color: transparent;
                    }
                }
            }
            .right{
                .left;
                text-align: right;
                .searchIcon{
                    font-size: 20px;
                    transform: scale(1.4);
                }
            }
        }
        .init(){
            position: fixed;
            width: 100%;
            left: 0;
            top: 0;
            padding: 0;
            .box{
                .left{
                    .iconfont{
                        margin-left: @paIndex;
                    }
                }
                .right{
                    .iconfont{
                        margin-right: @paIndex;
                    }
                }
            }
        }
        &.type1,&.type4{
            .init;
        }
        &.type2{
            .init;
            background:transparent;
            margin-bottom: -@h;
            .box{
                .left{
                    span{
                        width: @index;
                        height: @index;
                        background-color: rgba(0,0,0,0.1);
                        line-height: @index;
                        border-radius: 100%;
                    }
                }
                .right{
                    .left;
                }
            }
        }
        &.type5{
            .init;
            background:linear-gradient(to bottom, rgba(27,130,210,1), transparent);
            margin-bottom: -@h;
            .box{
                .left{
                    span{
                        width: @index;
                        height: @index;
                        background-color: rgba(0,0,0,0.1);
                        line-height: @index;
                        border-radius: 100%;
                    }
                }
                .right{
                    .left;
                }
            }
        }
        &.type3{
            .init;
            background-color: transparent;
            color: @cor_000000;
        }
        &.scrollBool{
            animation:changebac 1s ease;
            animation-iteration-count:1;
            //background-color: @theme-color;
            background: rgba(27,130,210,1);
            color: @cor_ffffff;
        }
    }
}
</style>
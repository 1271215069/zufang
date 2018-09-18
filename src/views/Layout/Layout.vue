<template>
    <div class="Layout">
        <layout-header v-if="airforce.layout.headerShow"></layout-header>
        <div :class="`layoutMain ${(airforce.layout.footerShow)? 'layoutMainType1' : ''}`">
            <router-view  id="ssda"/>
        </div>
        <layou-footer v-if="airforce.layout.footerShow"></layou-footer>
    </div>
</template>

<script>
    import LayoutHeader from './LayoutHeader.vue'
    import LayouFooter from './LayouFooter.vue'
    import { mapGetters } from "vuex"
    export default {
        name: "layout",
        components:{ LayoutHeader, LayouFooter },
        computed:{
            ...mapGetters(['airforce']),
            routerlist(){
                return this.$route.path;
            }
        },
        // watch:{
        //     routerlist(val){
        //         let winHeight=window.innerHeight;
        //         let content=document.getElementById('ssda');
        //         content.style.setProperty('height',winHeight+"px",'important');
        //         console.log(content.style)
        //     }
        // },
        created(){
            // console.log(document.body.clientHeight,"clientHeight")
            // console.log(document.body.offsetHeight,"offsetHeight")
            // console.log(document.body.scrollHeight,"scrollHeight")
            // console.log(document)

            // console.log(window.innerHeight,'innerHeight')
            // let winHeight=window.innerHeight;
            // console.log(document.getElementsByClassName('ssda')[0].style.height)
            // let content=document.getElementsByClassName('ssda')[0];
            // content.style.height=winHeight+'px';
        }
    }
</script>   

<style scoped lang="less">
.Layout{
    .ssda{
        //height: 627px;
        // position: absolute;
        // z-index: 501;
    }
    .fadeInLeft{
        height: 10000px;
        // .vux-tab-wrap{
        //     z-index: -100;
        // }
    }
    .touchPoint{
        height: 10000px;
    }
    .fadeInDown1{
        height: 10000px;
        .filters-flexbox-box{
             z-index: -100!important;
        }
    }
    .fadeInRight{
       .fadeInLeft;
    }
    .fadeOutDown1{
        .fadeInDown1;
    }
    .layoutMain{
        &.layoutMainType1{
            padding-bottom: 80px;
        }
    }
}

</style>
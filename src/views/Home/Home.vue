<template>
    <div class="Home">
        <x-address class="Home-x-address" title="title" :show="show" @on-hide="locHide" v-model="value" :list="ChinaAddressV4Data " :raw-value="true" :hide-district="false"></x-address>
        
        <swiper class="animated fadeInDown" dots-position="center" height="200px" :auto=true>
            <swiper-item class="Home-banner" @click.native="goxq(item)" v-for="(item,index) in headbanner" :key="index" :style='"background:url("+item.url+");background-repeat:no-repeat;background-position:center;background-size: cover;"'></swiper-item>
        </swiper>
		<div></div>
        <div id="demo" style="display:none"></div>
        <div class="Home-flexbox-top">
            <flexbox class="Home-flexbox-topBox">
                <flexbox-item @click.native="goroom(1)">
                    <div class="iconfont Icon1">&#xe628;</div>
                    <span class="text">附近房源</span>
                </flexbox-item>
                <flexbox-item @click.native="goroom(2)">
                    <div class="iconfont Icon2">&#xe67f;</div>
                    <span class="text">整租</span>
                </flexbox-item>
                <flexbox-item @click.native="goroom(3)">
                    <div class="iconfont Icon3">&#xe61b;</div>
                    <span class="text">合租</span>
                </flexbox-item>
                <!-- <flexbox-item>
                    <div class="iconfont Icon4">&#xe68a;</div>
                    <span class="text">品牌公寓</span>
                </flexbox-item> -->
                <flexbox-item @click.native="goroom(4)">
                    <div class="iconfont Icon5">&#xe623;</div>
                    <span class="text">业主委托</span>
                </flexbox-item>
            </flexbox>
        </div>
        <z-scroller class="animated fadeInLeft" title="房东圈" :width="140" :height="70" type="1" :list="midbanner"></z-scroller>
        <div class="mid-banner animated zoomIn" :style='"background:url("+endbanner+");background-size:cover;background-repeat:no-repeat;background-position:center;"'>
            <img :src="endbanner" alt="">
        </div>
        <!-- <z-scroller title="房东圈" :height="140" type="2" :list="list1"></z-scroller> -->
        <z-scroller class="animated fadeInRight" title="推荐房源" :width="160" :height="120" type="3" :list="list1"></z-scroller>
        <divider>我是有底线的</divider>
    </div>
</template>

<script>

    import Public from "@/store/public.js"
    import { ZScroller } from "@/components"
    import { XAddress, ChinaAddressV4Data, Countup, Flexbox, FlexboxItem, XImg, Divider,Swiper,SwiperItem  } from 'vux'
    import { mapActions, mapGetters } from "vuex"
    import { setTimeout } from 'timers';
    export default {
        name: "home",
        components:{ XAddress, Countup, Flexbox, FlexboxItem, ZScroller, XImg, Divider,Swiper ,SwiperItem },
        data(){
            return {
                ChinaAddressV4Data:ChinaAddressV4Data,
                value:[],
                show:false,
                income:false,
                hub:{},//获取的当前地址信息
                headbanner:[],
                midbanner:[],
                endbanner:"",
                list1:[],
                vuegConfig:{
                    forwardAnim:'fadeInDown1',
                    backAnim:'fadeOutDown1'
                },
                adressobj:{},
                lng:0,
                lat:0,
            }
        },
        methods:{
            ...mapActions(['action']),
            goxq(item){//点击banner前往消息详情
                this.$router.push("/Wzxq?id="+item.id)
            },
            goroom(t){
                if(t==1){
                    let search = {};
                    search.city=this.airforce.location.city;
                    search.citycode=this.airforce.location.citycode;
                    search.province=this.airforce.location.province;
                    search.provincecode=this.airforce.location.provincevode;
                    search.district=this.airforce.location.district;
                    search.districtcode=this.airforce.location.districtcode;
                    this.$router.push("/HousingSearch?search="+search)
                }else if(t==2){
                    this.$router.push("/HousingSearch?search=整租")
                }else if(t==3){
                    this.$router.push("/HousingSearch?search=合租")
                }else if(t==4){
                    this.$router.push("/HousingSearchWorry")
                }
            },
            locHide(){
                this.show = false;
                try {
                    console.log(JSON.stringify(this.value))
                    let val = this.value.map(e=>{
                        var findObj = _.find(ChinaAddressV4Data,{value:e});
                        //console.log(JSON.stringify(findObj))
                        if(findObj){
                            return findObj;
                        }
                        return {};
                    });

                    console.log(JSON.stringify(val),"wd")
                    if(val.length == 3){
                        if(val[1].name == "市辖区"){
                            val[1].name = val[0].name;
                        }
                        if(val[1].name == "县"){
                            val[1].name = val[0].name + "/" + val[1].name ;
                        }
                        this.action({
                            moduleName:'layout',
                            goods:{
                                title:`${val[1].name}&#xe628;`
                            },
                        });
                        this.action({
                            moduleName:'location',
                            goods:{
                                province:val[0].name,
                                provincecode:val[0].value,
                                city:val[1].name,
                                citycode:val[1].value,
                                district:val[2].name,
                                districtcode:val[2].value,
                            },
                        });
                        //alert(JSON.stringify(this.airforce.location))
                    };
                }catch (e){}
                //console.log(this.value)
            }
        },
        computed:{
            ...mapGetters(['airforce'])
        },
        mounted(){
            let that=this;
            function hbgetlaca(){
                that.$getPlus(()=>{
                    plus.geolocation.getCurrentPosition(function(p){
                        //alert(JSON.stringify(p))
                        if(p.coords.longitude){
                            that.lng=p.coords.longitude.toFixed(6);
                            that.lat=p.coords.latitude.toFixed(6);
                            var mapdata={
                                key:"1f089a27256f0d06e6fdaf9f97f36989",
                                location:that.lng+","+that.lat,
                                output:"JSON"
                            }
                            //alert(JSON.stringify(mapdata))
                            that.action({//通过高德地图接口把经纬度转换成地址
                                moduleName: 'getmapcode',
                                method: "post",
                                // headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'},
                                fullUrl: "https://restapi.amap.com/v3/geocode/regeo",
                                params:mapdata,
                            }).then((res)=>{
                                //alert(JSON.stringify(res)+"5487845")
                                if(res.status == '1' && res.info == 'OK'){
                                    if(!that.airforce.location){
                                        that.adressobj=res.regeocode.addressComponent;
                                        if(res.regeocode.addressComponent.city){
                                            var city = _.find(ChinaAddressV4Data,{name:that.adressobj.city})
                                            if(city){
                                                that.adressobj.citycode=city.value;
                                            }
                                            var province=_.find(ChinaAddressV4Data,{name:that.adressobj.province})
                                            if(province){
                                                that.adressobj.provincecode=province.value;
                                            }
                                            var district=_.find(ChinaAddressV4Data,{name:that.adressobj.district})
                                            if(district){
                                                that.adressobj.districtcode=district.value;
                                            }
                                            that.action({
                                                    moduleName:'location',
                                                    goods:that.adressobj,
                                                });
                                            that.action({
                                                    moduleName:'layout',
                                                    goods:{
                                                        title:`${that.adressobj.city}&#xe628;`
                                                    },
                                                });
                                        }
                                        that.action({
                                                moduleName:'addressCode',
                                                goods:{
                                                    code:that.adressobj
                                                }
                                            })
                                    }else{
                                        that.action({
                                                moduleName:'layout',
                                                goods:{
                                                    title:`${that.airforce.location.city}&#xe628;`
                                                },
                                            });
                                    }

                                }else{
                                    that.$vux.toast.text("无法获取当前位置,请手动定位")
                                }
                            }).catch((err)=>{})
                        }else{
                             that.$vux.toast.text("无法获取当前位置,请手动定位")
                        }
                        
                    },function(e){
                        that.$vux.toast.text("请打开手机定位或允许APP获取位置信息")
                    })
                })
            }
            hbgetlaca();
            // return false;








        //     var x=document.getElementById("demo");

        //     function getLocation(){
        //         if (navigator.geolocation) {
        //             //alert('有geolocation');
        //             navigator.geolocation.getCurrentPosition(showPosition,showError);
        //         }else{
        //             //alert('无geolocation');
        //             x.innerHTML="Geolocation is not supported by this browser.";
        //             that.$vux.toast.text("当前设备不支持自动定位")
        //         }
        //     }

        //     function showPosition(position) {//成功的回调
        //         alert(JSON.stringify(position))
        //         //that.lng=position.coords.longitude.toFixed(6)+","+position.coords.latitude.toFixed(6);
        //                 if(!that.airforce.location){
        //                     that.adressobj=position.address;
        //                     if(position.address.city){
        //                         var city = _.find(ChinaAddressV4Data,{name:that.adressobj.city})
        //                         if(city){
        //                             that.adressobj.citycode=city.value;
        //                         }
        //                         var province=_.find(ChinaAddressV4Data,{name:that.adressobj.province})
        //                         if(province){
        //                             that.adressobj.provincecode=province.value;
        //                         }
        //                         var district=_.find(ChinaAddressV4Data,{name:that.adressobj.district})
        //                         if(district){
        //                             that.adressobj.districtcode=district.value;
        //                         }
        //                         that.action({
        //                                 moduleName:'location',
        //                                 goods:that.adressobj,
        //                             });
        //                         that.action({
        //                                 moduleName:'layout',
        //                                 goods:{
        //                                     title:`${that.adressobj.city}&#xe628;`
        //                                 },
        //                             });
        //                     }
        //                     that.action({
        //                             moduleName:'addressCode',
        //                             goods:{
        //                                 code:that.adressobj
        //                             }
        //                         })
        //                 }else{
        //                     that.action({
        //                             moduleName:'layout',
        //                             goods:{
        //                                 title:`${that.airforce.location.city}&#xe628;`
        //                             },
        //                         });
        //                 }
        //     }
        //     function showError(error){//失败的回调
        //         switch(error.code){
        //             case error.PERMISSION_DENIED:
        //             x.innerHTML="User denied the request for Geolocation."
        //             that.$vux.toast.text("获取定位失败，User denied the request for Geolocation.")
        //             break;
        //             case error.POSITION_UNAVAILABLE:
        //             x.innerHTML="Location information is unavailable."
        //             that.$vux.toast.text("获取定位失败，Location information is unavailable")
        //             break;
        //             case error.TIMEOUT:
        //             x.innerHTML="The request to get user location timed out."
        //             that.$vux.toast.text("获取定位失败，The request to get user location timed out")
        //             break;
        //             case error.UNKNOWN_ERROR:
        //             x.innerHTML="An unknown error occurred."
        //             that.$vux.toast.text("获取定位失败，An unknown error occurred")
        //             break;
        //         }
        //     }
        //    getLocation();//通过h5获取当前位置

            


            
            
            
        
            






            this.action({
                moduleName:'layout',
                goods:{
                    clickContent:()=>{
                        this.show = true;
                    },
                    clickLeftBack:false,
                    clickLeft:()=>{
                        this.$router.push("/User");
                    }
                },
            });
            //以下3个为获取广告文章Banner的请求
            this.action({
                moduleName:'bannerlists',
                method:'post',
                url:'/adminapi/posts/lists',
                data:{
                    token:this.airforce.login_post.data.token,
                    id:"1"
                }
            }).then((res)=>{
                if(res.code==200){
                    for(let i=0;i<res.data.length;i++){
                        let dataobj={};
                        dataobj.url=res.data[i].smeta;
                        dataobj.id=res.data[i].id;
                        this.headbanner.push(dataobj);
                    }
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})

            this.action({
                moduleName:'midlists',
                method:'post',
                url:'/adminapi/posts/lists',
                data:{
                    token:this.airforce.login_post.data.token,
                    id:"2"
                }
            }).then((res)=>{
                if(res.code==200){
                    for(let i=0;i<res.data.length;i++){
                        let midobj={};
                        midobj.img=res.data[i].smeta;
                        midobj.id=res.data[i].id;
                        this.midbanner.push(midobj);
                    }
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})

            this.action({
                moduleName:'endlists',
                method:'post',
                url:'/adminapi/posts/lists',
                data:{
                    token:this.airforce.login_post.data.token,
                    id:"3"
                }
            }).then((res)=>{
                if(res.code==200){
                    let smeta=res.data[0].smeta;
                    this.endbanner=smeta;
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})
            //请求推荐房源的接口
            this.action({
                moduleName:'lists',
                method:'post',
                url:'/adminapi/Housesource/lists',
                data:{
                    token:this.airforce.login_post.data.token,
                    onwer_id:this.airforce.login_post.data.id,
                    recommend:"66666"
                }
            }).then((res)=>{
                if(res.code==200){
                    for(let i=0;i<res.data.data.length;i++){
                        let roomdata={};
                            let arr=[];
                        if(res.data.data[i].img instanceof Array){
                            arr = res.data.data[i].img;
                        }else{
                            for(let j in res.data.data[i].img){
                                arr.push( res.data.data[i].img[j] );
                            }
                        }
                        if(arr.length > 0){
                            roomdata.img=arr[0];
                        }
                        roomdata.money=parseInt(res.data.data[i].pice);
                        roomdata.location=res.data.data[i].areacode;
                        roomdata.name=res.data.data[i].projname;
                        roomdata.type=res.data.data[i].room +"室"+res.data.data[i].hall+"厅"+res.data.data[i].wc+"卫"+res.data.data[i].kitchen+"厨";
                        roomdata.id=res.data.data[i].id;
                        roomdata.collect=res.data.data[i].collect;
                        roomdata.o_id=res.data.data[i].o_id;
                        roomdata.datatype="room";
                        this.list1.push(roomdata);
                    }
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/color.less";
.Home{

    .Home-x-address{
        display: none;
    }
    &/deep/ .vux-slider{
        margin-top: 10px;
        .vux-swiper{
            .Home-banner{
                width: 90%;
                // margin: 0 5%;
                margin: 0 auto;
                border-radius: 15px;
                height: 200px;
                left: 5%;
                // left: 50%;
                // transform: rotateX(-50%);
                // background-repeat: no-repeat;
                // background-position: center;
                // background-size: cover;
            }
        }
    }
    
    .Home-header{
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
            padding: 5px;
            background-color: @rgba_ffffff_18;
            white-space:nowrap;
            text-overflow:ellipsis;
            -o-text-overflow:ellipsis;
            overflow: hidden;
            animation: @animationOpt;
            -webkit-animation: @animationOpt;
            margin-bottom: @index;
            .box-countup{
                font-size: 18px;
                font-weight: bold;
            }
        }
        .Home-header-flexbox{
            font-size: 12px;
            line-height: 18px;
            color: @cor_ffffff;
            i{
                display: inline-block;
                @index:12px;
                width: @index;
                height: @index;
                position: relative;
                top: 2px;
            }
            .left{
                text-align: right;
                i{
                    background-color: @cor_57a2dd;
                }
            }
            .right{
                i{
                    background-color: @cor_176eb0;
                }
            }
        }
    }
    .vux-slider{
        z-index: 400;
    }
    .Home-flexbox-top{
        padding: 0 @paIndex;
        background-color: @cor_ffffff;
        .Home-flexbox-topBox{
            text-align: center;
            padding: 10px 0;
            margin-top: @maTop;
            .iconfont{
                @index:40px;
                width: @index;
                height: @index;
                margin: auto;
                line-height: @index;
                background-color: #ff8871;
                border-radius: 100%;
                color: @cor_ffffff;
                font-size: 20px;
                &.Icon1{
                    font-size: 25px;
                }
                &.Icon2{
                    background-color: #79b2ff;
                    font-size: 25px;
                }
                &.Icon3{
                    background-color: #ffbb5f;
                }
                &.Icon4{
                    background-color: #f794f7;
                }
                &.Icon5{
                    background-color: #71cbd2;
                }
            }
            .text{
                font-size: 12px;
            }
        }
    }
    .mid-banner{
        width: 90%;
        margin: 10px auto;
        margin-top: 15px;
        height: 70px;;
        border-radius: 10px;
        overflow: hidden;
        img{
            display: block;
            width: 100%;
            height: 100%;
        }
    }
}
</style>
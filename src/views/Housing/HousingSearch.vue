<template>
    <div class="HousingSearch ">
        <z-filters ref="zFilters" :filters="filtersInit" :bs="searchquery" @on-change="filtersChange">
            <x-button @click.native="clearFilters">清除筛选</x-button>
        </z-filters>
        <scroller class="animated fadeInLeft house-scroller" :pullupConfig="pullupConfig" lock-x height="-140" ref="scroller"  :scroll-bottom-offst="200" :use-pullup="true" @on-pullup-loading="pullup()">
            <z-housing-card :list="cardList"></z-housing-card>
        </scroller>
    </div>
</template>

<script>
    import { Flexbox, FlexboxItem, XAddress, ChinaAddressV4Data, Divider, Scroller, XButton } from 'vux'
    import { mapActions, mapGetters } from 'vuex'
    import { ZFilters, ZHousingCard } from '@/components'
    import { HousingFitment } from '@/data/index.json'
import { setTimeout } from 'timers';
    export default {
        name: "housing-search",
        components:{ ZFilters,ZHousingCard, Flexbox, FlexboxItem, XAddress, Divider, Scroller, XButton},
        data(){
            return {
                filtersInit:[
                    {
                        field:'area',
                        name:'地区',
                        index:2,
                        list:ChinaAddressV4Data,
                    },
                    {
                        field:'rent',
                        name:'租金',
                        index:0,
                        list:[
                            // parent
                            {value:'1000以下',key:'1'},
                            {value:'1000-2000',key:'2'},
                            {value:'2001-5000',key:'3'},
                            {value:'5001-8000',key:'4'},
                            {value:'8001-10000',key:'5'},
                            {value:'10000以上',key:'6'},
                        ],
                        type:1,
                        showText:false,
                    },
                    {
                        field:'sort',
                        name:'装修',
                        index:0,
                        list:HousingFitment,
                    },
                    {
                        field:'mode',
                        name:'出租',
                        index:0,
                        list:[
                            {name:"整租",value:'1'},
                            {name:"合租",value:'2'}
                        ]
                    },
                    {
                        field:'more',
                        name:"选择",
                        type:2
                    }
                ],
                pullupConfig:{
                    content: '上拉刷新',
                    autoRefresh: true,
                    downContent: '放开我',
                    upContent: '上拉刷新',
                    loadingContent: '加载中...',
                    clsPrefix: 'pullupConfig-',
                },
                pageIndex:1,
                HousesourceLists:[],
                cons:null,
                searchquery:"",
                vuegConfig:{
                    forwardAnim:'fadeInDown1',
                    backAnim:'fadeOutDown1'
                }
            }
        },
        methods:{
            ...mapActions(['action']),
            reset(){//搜索点击取消的方法
                this.action({
                    moduleName:'layout',
                    goods:{
                        searchText:""
                    }
                })
                this.action({
                    moduleName:'filters',
                    goods:null
                })
                this.action({
                    moduleName:'filters',
                    goods:{}
                })
                this.HousesourceLists  = [];
                this.pageIndex  = 1;
                this.getList();
                this.resetpull();
            },
            getsearch(){//搜索点击确定的方法
                //this.clearFilters();
                this.HousesourceLists=[];
                let otherdata={};
                otherdata.title=this.airforce.layout.searchText;
                otherdata.page="1";
                otherdata.size="1000"
                this.getList(otherdata);
                this.resetpull();
            },
            resetpull(){//重置下拉的方法
                this.$refs.scroller.pullup.pluginDisable();//删除下拉主题
                this.$refs.scroller.pullup.userConfig.upContent = "上拉刷新";//重新配置下拉文字
                this.$refs.scroller.pullup.render();//重新加载新的主体
                this.$refs.scroller.donePullup();//重启下拉事件监听
                this.$refs.scroller.reset({top:0});//恢复下拉位置

            },
            search(val){
                // this.clearFilters();
            },
            filtersChange(d){
              this.HousesourceLists  = [];
              this.pageIndex  = 1;
              this.cons = d;
              this.pullup();
              this.lahawa();
              this.resetpull();
            },
            lahawa(){//根据filters内的筛选条件来获得数据的方法
                let d=this.airforce.filters;
                let con={};
                if(d.rent_select){
                    let rentarr=d.rent_select.value.split("-");
                    con.rentMin=rentarr[0];
                    con.rentMax=rentarr[1];
                }
                if(d.mode_select){
                    con.mode=d.mode_select.value;
                }
                if(d.sort_select){
                    con.fitment=parseInt(d.sort_select.value);
                }
                if(d.area){
                    con.citycode=d.area[0];
                    con.district=d.area[1];
                    con.areacode=d.area[2];
                }
                this.HousesourceLists=[];
                this.pageIndex=1;
                this.getList(con);
            },
            clearFilters(){//点击清除筛选的方法
                this.HousesourceLists  = [];
                this.cons  = null;
                this.pageIndex  = 1;
                this.$refs.zFilters.moreBoxHide();
                this.$refs.zFilters.xAddressVal = [];
                this.$refs.zFilters.filtersMenu[0].name = "地区";
                this.$refs.zFilters.filtersMenu[2].name = "装修";
                this.$refs.zFilters.filtersMenu[3].name = "出租";
                this.action({
                    moduleName:'filters',
                    goods:null
                })
                this.action({
                    moduleName:'filters',
                    goods:{}
                })
                this.HousesourceLists  = [];
                this.pageIndex  = 1;
                this.getList();
                // console.log("22")
                // if(this.airforce.filters={}){
                    //this.$root.$children[0].reload();
                // }
                this.resetpull();
            },
            getList(cons = {}){
                return this.action({
                    moduleName:'getHousesourceLists_post',
                    method:'post',
                    url:'/adminapi/Housesource/lists',
                    data:_.merge({
                        token:this.airforce.login_post.data.token,
                        status:'2',
                        size:10,
                        page:this.pageIndex,
                        onwer_id:this.airforce.login_post.data.id
                        
                    },cons)
                }).then(res=>{
                    if(res.code == 200){
                        this.pageIndex += 1;
                    };
                    //console.log(this.pageIndex)
                    try {
                        this.HousesourceLists = this.HousesourceLists.concat(res.data.data);
                    }catch (e){}
                    //console.log(this.HousesourceLists)
                    return res;
                });
            },
            pullup(){
                let config = {};
                if(this.cons){
                    try {
                        config = {
                            citycode:this.cons.area[0],
                            district:this.cons.area[1],
                            areacode:this.cons.area[2],
                        };
                    }catch (e){};
                    try {
                        config.fitment = this.cons.sort[0];
                    }catch (e){};
                    try {
                        config.mode = this.cons.mode[0];
                    }catch (e){};
                    try {
                        let rents = this.cons.rent_select.value.split('-');
                        if(rents[0] == "1000以下"){
                            rents = ['0.001','1000']
                        };
                        if(rents[0] == "10000以上"){
                            rents = ['10000']
                        };
                        config.rentMin = rents[0];
                        config.rentMax = rents[1];
                    }catch (e){};
                }
                var obj = this.$refs['scroller'];
                if(this.pageIndex>1){
                    this.getList(config).then(res=>{
                        this.$nextTick(() => {
                            try {
                                if(res.data.data.length == 0){
                                    const pullup = obj.pullup;
                                    pullup.userConfig.content = "到底啦";
                                    pullup.userConfig.upContent = "到底啦";
                                    pullup.xscroll.off("scrollend", pullup._scrollEndHandler, pullup);
                                    pullup.xscroll.off("scroll", pullup._scrollHandler, pullup);
                                    pullup.xscroll.off("pan", pullup._panHandler, pullup);
                                    pullup.xscroll.boundry.resetBottom();
                                    pullup.__isRender = false;
                                    pullup._evtBinded = false;
                                };
                            }catch (e){}
                                obj.donePullup();
                            });
                        }).catch(()=>{
                            try {
                                obj.donePullup();
                            }catch (e){}
                        });
                }
            }
        },
        computed:{
            ...mapGetters(['airforce']),
            cardList(){
                try {
                    const list = JSON.parse(JSON.stringify(this.HousesourceLists));
                    return list.map(e=>{
                        try {
                            e.size = e.area;
                            e.MaxSize=e.area;
                            e.type=`${e.room}室${e.hall}厅${e.wc}卫`;
                            e.style=e.fitment;
                            e.price=e.pice;
                            e.direction=e.foward;
                            if(e.mode == "1"){
                                e.lable=["整租"];
                            }
                            if(e.mode == "2"){
                                e.lable=["合租"];
                            }
                        }catch (e){}
                        try {
                            e.location=_.find(ChinaAddressV4Data,{value:e.areacode}).name;
                            if(typeof e.img == 'object'){
                                e.imgList = e.img;
                                var img = null;
                                for(let  k in e.img){
                                    img = e.img[k];
                                    break;
                                }
                                e.img =img;
                            }
                        }catch (e){}
                        return e;
                    });
                }catch (e){}
                return [];
            },
            
        }, 
        mounted(){
            window.t = this.$refs.scroller;
            
            this.action({
                    moduleName:'filters',
                    goods:null
                })
            this.action({
                moduleName:'filters',
                goods:{}
            })
            this.HousesourceLists=[];
            
            if(this.$route.query.search){
                let con={};
                switch (this.$route.query.search) {
                    case "整租":
                        con.mode="1";
                        this.cons={};
                        this.cons.mode="1";
                        this.action({
                            moduleName:'filters',
                            goods:{
                                mode_select:{
                                    name:"整租",
                                    value:"1",
                                },
                                mode:["1"]
                            }
                        })
                        this.$refs.zFilters.filtersMenu[3].name = this.airforce.filters.mode_select.name;
                        this.cons.mode=[1];//提供分页数据
                        this.cons.mode_select={
                            name:"整租",
                            value:"1"
                        }
                        this.HousesourceLists  = [];//提供初始第一页数据
                        this.pageIndex  = 1;
                        this.lahawa();
                        break;
                    case "合租":
                        con.mode="2";
                        this.cons={};
                        this.cons.mode="2";
                        this.action({
                            moduleName:'filters',
                            goods:{
                                mode_select:{
                                    name:"合租",
                                    value:"2",
                                },
                                mode:["2"]
                            }
                        })
                        this.$refs.zFilters.filtersMenu[3].name = this.airforce.filters.mode_select.name;
                        this.cons.mode=[2];//提供分页数据
                        this.cons.mode_select={
                            name:"合租",
                            value:"2"
                        }
                        this.HousesourceLists  = [];//提供初始第一页数据
                        this.pageIndex  = 1;
                        this.lahawa();
                        break;
                    default:
                        if(this.airforce.location){
                            con.district=this.airforce.location.citycode;
                            con.cityCode=this.airforce.location.provincecode;
                            con.areacode=this.airforce.location.districtcode;
                            let addressCode=this.airforce.location.citycode;
                            let shenCode=this.airforce.location.provincecode;
                            let quCode=this.airforce.location.districtcode;
                            // this.cons.area[0]=this.airforce.location.cityCode;
                            // this.cons.area[1]=this.airforce.location.provinceCode
                            
                            this.searchquery="44";
                            this.action({
                                moduleName:'filters',
                                goods:{
                                    area:[shenCode,addressCode,quCode],
                                    area_select:{
                                        name:this.airforce.location.district,
                                        parent:addressCode,
                                        value:this.airforce.location.districtcode
                                    }
                                }
                            })
                            this.$refs.zFilters.filtersMenu[0].name = this.airforce.filters.area_select.name;

                            this.cons.area=[shenCode,addressCode,quCode];//提供分页数据
                            this.cons.area_select={
                                        name:this.airforce.location.district,
                                        parent:addressCode,
                                        value:this.airforce.location.districtcode
                                    }
                            this.HousesourceLists  = [];//提供初始第一页数据
                            this.pageIndex  = 1;
                            this.lahawa();
                        }
                        break;
                }
                //this.getList(con);
            }else{
                this.HousesourceLists=[];
                this.pageIndex=1;
                this.action({
                    moduleName:'layout',
                    goods:{
                        search:val=>{-
                            this.search(val);
                        }
                    }
                });
                this.getList();
            }
            this.action({
                moduleName:'layout',
                goods:{
                    clickRight:()=>{
                        if(this.airforce.layout.searchShow==false){
                            this.getsearch();
                        }
                    },
                    clickLeft:()=>{
                        if(this.airforce.layout.searchShow==false){
                            this.reset();
                        }
                    }
                }
            })
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/color.less";
.HousingSearch{
    &/deep/ .message-tab{
        .vux-tab-wrap{
            z-index:1;
        }
    }
}
</style>
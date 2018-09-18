<template>
    <div class="HousingAddFocus animated fadeIn">
        <group class="HousingAddFocus-group">
            <area-select title="地区" placeholder="详细地址" module-name="Housing" fieldName="HousingArea" :value="(airforce.Housing.HousingArea)? airforce.Housing.HousingArea.valueSelect : null" :is-link="true"></area-select>
        </group>
        <group class="HousingAddFocus-group">
            <x-input :value="airforce.Housing.projname" @on-change="airforce.change.set($event,'projname','Housing')" title="小区" text-align="right" placeholder="如，幸福公寓，幸福小区"></x-input>
            <flexbox>
                <flexbox-item>
                    <x-input :value="airforce.Housing.build" @on-change="airforce.change.set($event,'build','Housing')" title="幢" text-align="right" placeholder="几幢"></x-input>
                </flexbox-item>
                <flexbox-item>
                    <x-input :value="airforce.Housing.unit" @on-change="airforce.change.set($event,'unit','Housing')" title="单元" text-align="right" placeholder="几单元"></x-input>
                </flexbox-item>
            </flexbox>
            <z-x-dialog module-name="Housing" fieldName="index" title="楼层" placeholder="楼层数量" alert="选择楼层"></z-x-dialog>

            
            <z-popup class="zpop" module-name="Housing_popup" fieldName="HousingIndex" title="房源" placeholder="单层房源数量" alert="选择楼层单间" :list="(airforce.Housing.index)? airforce.Housing.index : []"></z-popup>
            
            
            <!-- <div class="ZPopup">
                <cell :class="`z-popup-cell ${(value > 0)? 'select' : ''}`" title="房源" :value="value" :is-link="true" @click.native="onShow"></cell>
                <popup v-model="popupShow" class="HousingSelect">
                    <div class="popupBox">
                        <div class="title"><span>选择楼层单间</span><x-button class="HousingSwlect-btn" @click.native="close">确定</x-button></div>
                        <ul class="list">
                            <li class="list-item" v-for="(listItem,listIndex) in list" :key='listIndex'>
                                <z-popup-item :index="listItem" @on-change="onChange"></z-popup-item>
                            </li>
                        </ul>
                    </div>
                </popup>
            </div> -->
            
            <x-input :value="airforce.Housing.comarea" @on-change="airforce.change.set($event,'comarea','Housing')" title="分组" text-align="right" placeholder="如：高新区、市区、商圈名"></x-input>
        </group>
        <group class="HousingAddFocus-group" title="其他信息">
            <x-input :value="airforce.Housing.name" @on-change="airforce.change.set($event,'name','Housing')" title="姓名" text-align="right" placeholder="房源人姓名"></x-input>
            <x-input :value="airforce.Housing.phone" @on-change="airforce.change.set($event,'phone','Housing')" title="联系方式" text-align="right" placeholder="房源人联系方式"></x-input>
            <x-address style="display: none" v-model="xAddressVal" title="title" @on-hide="hideArea" :show="showXAddress" :list="list"></x-address>
            <cell title="房源展现渠道" class="HousingAddFocus-cell-x-address " :value="airforce.Housing.channelShow" @click.native="onShowXaddres" :is-link="true"></cell>
           
        </group>
        <images-upload :alert="true" :isxhr="false" @imagechanged="imagechanged" :type="2" class="HousingAddFocus-upload"></images-upload>
        <div class="x-button-type1">
            <x-button @click.native="submit">提交</x-button>
        </div>
    </div>  
</template>

<script>
    import { Group, Cell, XInput, XAddress, XButton, XDialog, Popup, Flexbox, FlexboxItem, Checker, CheckerItem } from 'vux'
    import { ImagesUpload, AreaSelect, ZXDialog, ZPopup,ZPopupItem } from '@/components'
    //import ZPopupItem from './z-popup-item.vue'
    import { mapGetters, mapActions } from 'vuex'
    import { channelList } from '@/data/index.json'
    export default {
        name: "housing-add-focus",
        components:{ Group, Cell, XInput, ImagesUpload, XAddress, AreaSelect, XButton, XDialog, ZXDialog, Popup, Flexbox, FlexboxItem, Checker, CheckerItem, ZPopup,ZPopupItem },
        data(){
            return {
                xAddressVal:['0'],
                showXAddress:false,
                list:channelList,
                popupShow:false,
                popupSelectData:{},
                placeholder:"单层房源数量",
                fieldName:"HousingIndex",
                moName:"Housing_popup"
            }
        },
        methods:{
            ...mapActions(['action']),
            // onShow(){
            //     this.popupShow = true;
            // },
            // close(){
            //     this.popupShow = false;
            // },
            // onChange(val,key){
            //     this.popupSelectData[key] = null;
            //     this.popupSelectData = _.merge(this.popupSelectData,val);
            // },
            // setData(){
            //     this.action({
            //         moduleName:this.moName,
            //         goods:_.set({},this.fieldName,null)
            //     });
            //     this.action({
            //         moduleName:this.mName,
            //         goods:_.set({},this.fieldName,this.popupSelectData)
            //     });
            // },
            AreaInit(){
                let xAddressVal = _.find(this.list,{value:this.xAddressVal[0]});
                if(xAddressVal){
                    this.action({
                        moduleName:'Housing',
                        goods:{
                            channelShow:xAddressVal.name,
                            channelSelect:xAddressVal,
                        }
                    });
                };
            },
            hideArea(bol){
                this.showXAddress = false;
                this.AreaInit();
            },
            onShowXaddres(){
                this.showXAddress = true;
            },
            imagechanged(e){
                if(this.airforce.Housing.img){
                    this.action({
                        moduleName:'Housing',
                        goods:{
                            img:[...this.airforce.Housing.img,e],
                        }
                    });
                    return;
                }
                this.action({
                    moduleName:'Housing',
                    goods:{
                        img:[e],
                    }
                });
            },
            submit(){
                if(!this.airforce.Housing.HousingArea){
                    this.$vux.toast.text('请选择【地区】');
                    return;
                }
                if(this.$utils.is_S(this.airforce.Housing.projname)){
                    this.$vux.toast.text('【小区】不能为空');
                    return;
                }
                if(this.$utils.is_S(this.airforce.Housing.build)){
                    this.$vux.toast.text('请输入房源【幢】数');
                    return;
                }
                if(this.$utils.is_S(this.airforce.Housing.unit)){
                    this.$vux.toast.text('请输入房源【单元】数');
                    return;
                }
                if(this.$utils.is_S(this.airforce.Housing.index) || this.airforce.Housing.index.length == 0){
                    this.$vux.toast.text('【楼层】不能为空');
                    return;
                }
                if(this.$utils.is_S(this.airforce.Housing_popup) || this.$utils.is_S(this.airforce.Housing_popup.HousingIndex)){
                    this.$vux.toast.text('【房源】不能为空');
                    return;
                }
                let HousingIndex = this.airforce.Housing_popup.HousingIndex;
                let HousingIndexMax = 0;
                for(var i in HousingIndex){
                    HousingIndexMax += HousingIndex[i].length;
                }
                if(HousingIndexMax == 0){
                    this.$vux.toast.text('【房源】不能为空');
                    return;
                }
                if(this.$utils.is_S(this.airforce.Housing.name)){
                    this.$vux.toast.text('【姓名】不能为空');
                    return;
                }
                if(this.$utils.is_S(this.airforce.Housing.phone)){
                    this.$vux.toast.text('【联系方式】不能为空');
                    return;
                }
                if(!this.$utils.isPhone(this.airforce.Housing.phone)){
                    this.$vux.toast.text('【联系方式】手机号码错误');
                    return;
                }
                if(this.$utils.is_S(this.airforce.Housing.channelShow)){
                    this.$vux.toast.text('【房源展现渠道】不能为空');
                    return;
                }
                let data = _.merge({
                    token:this.airforce.login_post.data.token,
                    o_id:this.airforce.login_post.data.id,
                },{
                    citycode:this.airforce.Housing.HousingArea.provinces.value,
                    district:this.airforce.Housing.HousingArea.city.value,
                    areacode:this.airforce.Housing.HousingArea.area.value,
                    address:this.airforce.Housing.HousingArea.address,
                    projname:this.airforce.Housing.projname,
                    build:this.airforce.Housing.build,
                    unit:this.airforce.Housing.unit,
                    isStr:true,
                    room_data:JSON.stringify(HousingIndex),
                    hs_name:this.airforce.Housing.name,
                    hs_phone:this.airforce.Housing.phone,
                    qudaoshow:this.airforce.Housing.channelSelect.value,
                    comarea:this.airforce.Housing.comarea || ''
                });
                if(this.airforce.Housing.img){
                    for(let i = 0 ; i < this.airforce.Housing.img.length ; i++){
                        data[`img[${i}]`] = this.airforce.Housing.img[i];
                    }
                };
                this.action({
                    moduleName:'Housesource_create_post',
                    url:'/adminapi/Housesource/create',
                    method:'post',
                    isFormData:true,
                    data:data
                }).then(res=>{
                    if(res.code != 200){
                        this.$vux.toast.text(res.message);
                        return;
                    };
                    this.action({
                        moduleName:'Housing',
                        goods:{
                            img:null
                        }
                    });
                    this.action({
                        moduleName:'Housing',
                        goods:{
                            img:[]
                        }
                    });
                    this.$vux.toast.text("新增成功");
                    this.$router.push("/HousingResource");
                }).catch(err=>{
                    this.action({
                        moduleName:'Housing',
                        goods:{
                            img:null
                        }
                    });
                    this.action({
                        moduleName:'Housing',
                        goods:{
                            img:[]
                        }
                    });
                    this.$vux.toast.text(err)
                })
            }
        },
        computed:{
            ...mapGetters(['airforce']),
            // value(){
            //     if(this.airforce[this.mName] && this.airforce[this.mName][this.fieldName]){
            //         let data = this.airforce[this.mName][this.fieldName];
            //         let index = 0;
            //         for(let  k in data){
            //             if(data[k].length > 0){
            //                 index += data[k].length;
            //             };
            //         };
            //         if(index > 0){
            //             return index;
            //         }
            //         return this.placeholder;
            //     }
            //     return this.placeholder;
            // }
        },
        watch:{
            // popupShow(val){
            //     if(!val){
            //         this.setData();
            //     }
            // },
            // list(val){
            //     let keys = Object.keys(this.popupSelectData);
            //     keys.forEach(e=>{
            //         if(val.indexOf(parseInt(e)) < 0 ){
            //             delete this.popupSelectData[e];
            //         }
            //     });
            //     this.setData();
            // }
        },
        mounted(){
            this.AreaInit();
        },
        created(){
             if(this.airforce.login_post.data.id_card==""||this.airforce.login_post.data.id_card==null||this.airforce.login_post.data.name==""||this.airforce.login_post.data.name==null){
                    this.$vux.toast.text("请先完善资料");
                    setTimeout(()=>{
                        this.$router.push("/Xgzl")
                    },2000)
                }
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/color.less";
.HousingAddFocus{
    &/deep/ .HousingAddFocus-group{
        .vux-no-group-title{
            margin: 0;
            margin-bottom: @maTop;
        }
        .ZPopup{
            &/deep/ .z-popup-cell{
                position: relative;
                &:after{
                    content: "";
                    position: absolute;
                    left: 0;
                    top: 0;
                    right: 0;
                    border-top: 1px solid #D9D9D9;
                    color: #D9D9D9;
                    -webkit-transform-origin: 0 0;
                    transform-origin: 0 0;
                    -webkit-transform: scaleY(0.5);
                    transform: scaleY(0.5);
                    left: 15px;
                }
                &.select{
                    .weui-cell__ft{
                        color: @cor_000000;
                    }
                }
            }
            &/deep/ .HousingSelect{
                @r:20px;
                border-radius: @r @r 0 0;
                overflow: hidden;
                background-color: @themeBj-color;
                min-height: 80%;
                .popupBox{
                    .title{
                        @index:40px;
                        line-height: @index;
                        background-color: @theme-color;
                        color: @cor_ffffff;
                        padding:0 @paIndex;
                        overflow: hidden;
                        &:before{
                            content: '';
                            position: absolute;
                            line-height: 0;
                            top: @index/3;
                            height: @index/3;
                            width: 4px;
                            background-color: @cor_ffffff;
                        }
                        span{
                            margin-left: @maTop;
                        }
                        .HousingSwlect-btn{
                            @index2:14px;
                            width: auto;
                            line-height: @index - @index2;
                            font-size: 12px;
                            padding: 0 @maTop;
                            float: right;
                            margin-top: @index2/2;
                            color: @theme-color;
                        }
                    }
                    .list{
                        .list-item{
                            margin-bottom: 2px;
                        }
                    }
                }
            }
        }
    }
    &/deep/ .HousingAddFocus-upload{
        .imagesUpload{
            background-color: transparent;
            padding: 0 @paIndex;
         }
    }
    .x-button-type1{
        .weui-btn{
            border-radius: 50px;
        }
    }
    &/deep/ .HousingAddFocus-cell-x-address{
        .weui-cell__ft{
            color: @cor_000000;
        }
    }
    
}


// .zpop{
//     &/deep/ .vux-popup-dialog{
//         z-index: 501;
        
//     }
// }
</style>
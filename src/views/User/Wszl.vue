<template>
    <div class="wszl animated fadeIn">
        <div class="element">
            <div class="eleleft"><label for="name">姓名：</label></div>
            <div class="eleright"><input type="text" id="name" v-model="updata.name" placeholder="请输入姓名"></div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="phone">电话：</label></div>
            <div class="eleright"><input type="text" id="phone" v-model="updata.phone" placeholder="请输入电话"></div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="adress">家庭住址：</label></div>
            <div class="eleright"><input type="text" id="adress" v-model="updata.home_address" placeholder="请输入家庭住址"></div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="occupation">职业：</label></div>
            <div class="eleright"><input type="text" id="occupation" v-model="updata.profession" placeholder="请输入职业，如文员，学生"></div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="ocname">单位名称：</label></div>
            <div class="eleright"><input type="text" id="ocname" v-model="updata.company" placeholder="请输入单位名称"></div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="ocadress">单位地址：</label></div>
            <div class="eleright"><input type="text" id="ocadress" v-model="updata.company_address" placeholder="请输入单位地址"></div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="ocadress">月收入：</label></div>
            <div class="eleright"><input type="text" id="ocadress" v-model="updata.income" placeholder="请输入月收入"></div>
            <div class="suffix">元/月</div>
        </div>
         <div class="element">
            <div class="eleleft"><label for="id_card">身份证：</label></div>
            <div class="eleright"><input type="text" id="id_card" v-model="updata.id_card" placeholder="请输入身份证"></div>
        </div>
        <div class="uppic">
            <p>上传手持身份证照片：</p>
            <p class="careful">注：需上传清晰的手持身份证正反面照片</p>
            <!-- <images-upload :alert="true" :isxhr="false" @imagechanged="imagechanged" :type="2" class="HousingAddFocus-upload"></images-upload> -->
            <div class="upleft">
                <p>身份证正面</p>
                <div class="box">
                    <input @change="getbaseleft" ref="zmleft" type="file" accept="image/jpg,image/jpeg,image/png,image/gif">
                    <img :src="leftimg">
                </div>
            </div>
            <div class="upright">
                <p>身份证背面</p>
                <div class="box">
                    <input @change="getbaseright" ref="fmright" type="file" accept="image/jpg,image/jpeg,image/png,image/gif">
                    <img :src="rightimg">
                </div>
            </div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="qqname">直系亲属姓名：</label></div>
            <div class="eleright"><input type="text" id="qqname" v-model="updata.family_name" placeholder="请输入直系亲属姓名"></div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="qqphone">直系亲属电话：</label></div>
            <div class="eleright"><input type="text" id="qqphone" v-model="updata.family_phone" placeholder="请输入直系亲属电话"></div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="jjname">紧急联系人姓名：</label></div>
            <div class="eleright"><input type="text" id="qqname" v-model="updata.friend_name" placeholder="请输入紧急联系人姓名"></div>
        </div>
        <div class="element">
            <div class="eleleft"><label for="qqphone">紧急联系人电话：</label></div>
            <div class="eleright"><input type="text" id="jjphone" v-model="updata.friend_phone" placeholder="请输入紧急联系人电话"></div>
        </div>
        <div class="yhk">
            <p>请选择到账银行卡：</p>
            <p>注：打款及到期扣款都为选择的银行卡</p>
            <group gutter=0>
                <cell-box @click.native="setcon" is-link >{{bank}}</cell-box>
            </group>
            <p>* 以上信息都为必填项</p>
        </div>
        <button @click.prevent="save" class="btn">保存</button>
    </div>
</template>
<script>
import {CellBox,Group} from "vux"
import {ImagesUpload} from "@/components"
import { mapGetters, mapActions } from 'vuex'
import { setTimeout } from 'timers';
export default {
    name:"",
    data(){
        return{
            updata:{
                token:"",
                name:"",
                phone:"",
                home_address:"",
                profession:"",
                company:"",
                company_address:"",
                income:"",
                family_name:"",
                family_phone:"",
                friend_name:"",
                friend_phone:"",
                id_card:"",
                bank_name:"",
                bank:""
            },
            imglist:[],
            leftimg:require('@/assets/img/Housing/upload.png'),
            rightimg:require('@/assets/img/Housing/upload.png'),
            bank:"选择银行卡"
        }
    },
    components:{
        ImagesUpload,
        CellBox,
        Group
    },
    methods:{
        ...mapActions(['action']),
        getbaseleft(){//本地展示图片
            let file=this.$refs.zmleft.files[0];
            this.updata.card_face=file;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let imgFile; 
            let that=this;
            reader.onload=(e)=>{
                imgFile =e.target.result;
                this.leftimg=imgFile;
                that.action({
                    moduleName:'Wszl',
                    goods:{
                        card_facefile:file,
                        card_face:imgFile
                    }
                })
            }
        },
        getbaseright(){//本地展示图片
            let file=this.$refs.fmright.files[0];
            this.updata.card_back=file;
            let reader = new FileReader();
            reader.readAsDataURL(file);
            let imgFile; 
            let that=this;
            reader.onload=(e)=>{
                imgFile =e.target.result; 
                this.rightimg=imgFile;
                that.action({
                    moduleName:'Wszl',
                    goods:{
                        card_backfile:file,
                        card_back:imgFile
                    }
                })
            } 
        },
        setcon(){//跳转前保存数据到vuex
            this.action({
                moduleName:'Wszl',
                goods:{
                    name:this.updata.name,
                    phone:this.updata.phone,
                    home_address:this.updata.home_address,
                    profession:this.updata.profession,
                    company:this.updata.company,
                    company_address:this.updata.company_address,
                    income:this.updata.income,
                    id_card:this.updata.id_card,
                    family_name:this.updata.family_name,
                    family_phone:this.updata.family_phone,
                    friend_name:this.updata.friend_name,
                    friend_phone:this.updata.friend_phone,
                }
            })
            this.$router.push("/Xzyhk")
        },
        save(){//保存的方法
            if(this.updata.name==""){
                this.$vux.toast.text("姓名不能为空")
                return false;
            }
            if(this.updata.phone==""){
                this.$vux.toast.text("电话不能为空")
                return false;
            }
            if(!this.$utils.isPhone(this.updata.phone)){
                this.$vux.toast.text("电话号码格式不正确")
                return false;
            }
            if(this.updata.home_address==""){
                this.$vux.toast.text("家庭住址不能为空")
                return false;
            }
            if(this.updata.profession==""){
                this.$vux.toast.text("职业不能为空")
                return false;
            }
            if(this.updata.company==""){
                this.$vux.toast.text("单位名称不能为空")
                return false;
            }
            if(this.updata.company_address==""){
                this.$vux.toast.text("单位地址不能为空")
                return false;
            }
            if(this.updata.income==""){
                this.$vux.toast.text("月收入不能为空")
                return false;
            }
            if(this.updata.id_card==""){
                this.$vux.toast.text("身份证不能为空")
                return false;
            }
            if(!this.$utils.isIdCard(this.updata.id_card)){
                this.$vux.toast.text("身份证格式不正确")
                return false;
            }
            // if(!this.updata.card_face||this.updata.card_face==""||this.airforce.Wszl.card_face==""){
            //     this.$vux.toast.text("请上传身份证正面照")
            //     return false;
            // }
            //  if(!this.updata.card_back||this.updata.card_back==""||this.airforce.Wszl.card_back==""){
            //     this.$vux.toast.text("请上传身份证背面照")
            //     return false;
            // }
            if(this.updata.family_name==""){
                this.$vux.toast.text("直系亲属姓名不能为空")
                return false;
            }
            if(this.updata.family_phone==""){
                this.$vux.toast.text("直系亲属电话不能为空")
                return false;
            }
            if(!this.$utils.isPhone(this.updata.family_phone)){
                this.$vux.toast.text("直系亲属号码格式不正确")
                return false;
            }
            if(this.updata.friend_name==""){
                this.$vux.toast.text("紧急联系人姓名不能为空")
                return false;
            }
            if(this.updata.friend_phone==""){
                this.$vux.toast.text("紧急联系人电话不能为空")
                return false;
            }
            if(!this.$utils.isPhone(this.updata.friend_phone)){
                this.$vux.toast.text("紧急联系人号码格式不正确")
                return false;
            }
            if(!this.updata.bank||this.updata.bank==""||!this.updata.bank_name||this.updata.bank_name==""){
                this.$vux.toast.text("请选择到账银行卡")
                return false;
            }
            this.updata.token=this.airforce.login_post.data.token;
            this.action({
                moduleName:'writeMessage',
                url:'/adminapi/member/writeMessage',
                method:"post",
                isFormData: true,
                data:this.updata
            }).then((res)=>{
                if(res.code==200){
                    this.$vux.toast.text("修改成功");
                    setTimeout(()=>{
                        this.$router.push("/Jd");
                    },2000)
                }else{
                    this.$vux.toast.text(res.message)
                    this.updata.card_img=this.updata.card_img.split(',')
                }
            }).catch((err)=>{})
        }
    },
    computed:{
        ...mapGetters(['airforce']),
    },
    created(){
        // if(!this.$route.query.bank==""||!this.$route.query.bankname==""||!this.$route.query.bankname==null||!this.$route.query.bank==null){//获取到选择的银行卡信息
        //     let bank=this.$route.query.bank;
        //     let bankname=this.$route.query.bankname;
        //     this.updata.bank_name=bankname;
        //     this.updata.bank=bank;
        //     this.bank=bankname+" "+bank;
        // }
        if(this.airforce.Wszl){//返回已存或已输入的信息
            this.updata.token=this.airforce.login_post.data.token,
            this.updata.name=this.airforce.Wszl.name;
            this.updata.phone=this.airforce.Wszl.phone;
            this.updata.home_address=this.airforce.Wszl.home_address;
            this.updata.profession=this.airforce.Wszl.profession;
            this.updata.company=this.airforce.Wszl.company;
            this.updata.company_address=this.airforce.Wszl.company_address;
            this.updata.income=this.airforce.Wszl.income;
            this.updata.id_card=this.airforce.Wszl.id_card;
            this.updata.family_name=this.airforce.Wszl.family_name;
            this.updata.family_phone=this.airforce.Wszl.family_phone;
            this.updata.friend_name=this.airforce.Wszl.friend_name;
            this.updata.friend_phone=this.airforce.Wszl.friend_phone;
            this.updata.bank_name=this.airforce.Wszl.bank_name;
            this.updata.bank=this.airforce.Wszl.bank;
            // if(this.$route.query.bank){
            //     this.bank=this.$route.query.bankname+" "+this.$route.query.bank;
            // }else 
            if(this.updata.bank!=null){
                this.bank=this.updata.bank_name+" "+this.updata.bank;
            }
            if(!this.airforce.Wszl.card_back==""){
                this.rightimg=this.airforce.Wszl.card_back;
            }
            if(!this.airforce.Wszl.card_face==""){
                this.leftimg=this.airforce.Wszl.card_face;
            }
            this.updata.card_face=this.airforce.Wszl.card_facefile;
            this.updata.card_back=this.airforce.Wszl.card_backfile;
        }
    }
}
</script>
<style lang="less" scoped>
.wszl{
    .element{
        display: flex;
        align-items:center; 
        background: #fff;
        padding: 10px 15px;
        font-size: 16px;
        border-top:1px solid #D9D9D9;
        .eleleft{
            label{
                display: block;
                float: left;
                height: 20px;
                line-height: 20px;
            }
        }
        .eleright{
            flex:1;
            input,input:focus{
                width: 100%;
                height: 20px;
                border: none;
                outline: none;
                text-align: right;
                font-size: 14px;
            }
        }
        .suffix{
            padding-left: 5px;
        }
    }
    .yhk{
        font-size: 16px;
        background: #fff;
        padding: 10px 15px;
        p:nth-child(2){
            font-size: 14px;
            color: #EE2C2C;
        }
        p:nth-child(4){
            font-size: 14px;
            color: #a9a7ab;
        }
    }
    .uppic{
        background: #fff;
        padding: 10px 15px;
        font-size: 16px;
        border-top:1px solid #D9D9D9;
        overflow: hidden;
        .careful{
            font-size: 14px;
            color:#EE2C2C;
        }
        .upleft,.upright{
            float: left;
            width: 50%;
            margin-top: 15px;
            p{
                font-size: 14px;
                text-align: center;
            }
            .box{
                position: relative;
                width: 100%;
                height: 100px;
                padding: 20px 0;
                input{
                    width: 100px;
                    height: 100px;
                    display: block;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 101;
                    opacity: 0;
                }
                img{
                    width: 100px;
                    height: 100px;
                    display: block;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index:100;
                }
            }
        }
    }
    .btn,.btn:focus{
        width: 70%;
        background: #1b82d2;
        color: #fff;
        font-size: 16px;
        display: block;
        line-height: 30px;
        margin: 15px auto;
        border-radius:15px; 
        border: none;
        outline: none;
        margin-top: 30px;
    }
}
</style>

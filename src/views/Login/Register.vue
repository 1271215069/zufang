<template>
    <div class="Register">
        <h2 class="title">{{airforce.layout.title}}</h2>
        <group class="login-group">
            <x-input placeholder="手机号" class="login-x-input" :value="airforce[fieldType].phone" @on-change="airforce.change.set($event,'phone',fieldType)"></x-input>
            <z-input placeholder="短信验证码" class="login-x-input" class-name="Register-z-input" :value="airforce[fieldType].code" @change="airforce.change.set($event,'code',fieldType)" @click="getCode" :disabled-btn="airforce[fieldType].disabledBtn" :field-name="fieldType"></z-input>
            <x-input placeholder="设置一个密码" class="login-x-input"  type="password" :value="airforce[fieldType].password" @on-change="airforce.change.set($event,'password',fieldType)"></x-input>
            <x-button class="login-x-button" @click.native="register">{{btnName}}</x-button>
        </group>
    </div>
</template>

<script>
    import { Group, XInput, XButton } from 'vux'
    import { mapGetters, mapActions } from 'vuex'
    import { ZInput } from "@/components"
    export default {
        name: "register",
        components:{ Group, XInput, ZInput, XButton },
        props:{
            fieldType:{
                type:String,
                default:"register"
            },
            btnName:{
                type:String,
                default:"提交"
            },
        },
        computed:{
            ...mapGetters(['airforce']),
        },
        methods:{
            ...mapActions(['action']),
            getCode(next){
                if(!this.airforce[this.fieldType].phone || this.$utils.is_S(this.airforce[this.fieldType].phone)){
                    this.$vux.toast.text("【手机号】不能为空");
                    return;
                }
                if(!this.$utils.isPhone(this.airforce[this.fieldType].phone)){
                    this.$vux.toast.text("【手机号】格式错误");
                    return;
                }
                this.action({
                    moduleName:"getcode",
                    url:'adminapi/member/getcode',
                    method:'post',
                    isFormData:true,
                    data:{
                        phone:this.airforce[this.fieldType].phone
                    }
                }).then(res=>{
                    if(res.code != 200){
                        this.$vux.toast.text(res.message);
                        return;
                    }
                    // this.action({
                    //     moduleName:this.fieldType,
                    //     goods:{
                    //         code:res.data.code_name
                    //     }
                    // });
                    
                }).catch(err=>{
                    this.$vux.toast.text(err);
                });
                next({
                    fieldName:this.fieldType
                });
            },
            register(){
                if(!this.airforce[this.fieldType].phone || this.$utils.is_S(this.airforce[this.fieldType].phone)){
                    this.$vux.toast.text("【手机号】不能为空");
                    return;
                }
                if(!this.$utils.isPhone(this.airforce[this.fieldType].phone)){
                    this.$vux.toast.text("【手机号】格式错误");
                    return;
                }
                if(!this.airforce[this.fieldType].code || this.$utils.is_S(this.airforce[this.fieldType].code)){
                    this.$vux.toast.text("【短信验证码】不能为空");
                    return;
                }
                if(!this.airforce[this.fieldType].password || this.$utils.is_S(this.airforce[this.fieldType].password)){
                    this.$vux.toast.text("【密码】不能为空");
                    return;
                }
                if(this.airforce[this.fieldType].password.length < 6){
                    this.$vux.toast.text("【密码】长度至少为6位及以上字符");
                    return;
                }
                switch (this.fieldType){
                    case 'ForgetPwd':
                        this.$vux.loading.show({text: '加载中..'});
                        //忘记密码
                        this.action({
                            moduleName:'ForgetPwd_post',
                            url:'adminapi/member/forgetpwd',
                            isFormData:true,
                            method:'post',
                            data:this.airforce[this.fieldType]
                        }).then(res=>{
                            if(res.code != 200){
                                this.$vux.toast.text(res.message);
                                return;
                            }
                            this.$vux.toast.text("重置成功");
                            this.$router.push("/Login");
                        }).catch(err=>{
                            this.$vux.toast.text(err);
                        });
                        break;
                    default:
                        this.$vux.loading.show({text: '加载中..'});
                        //新手注册
                        this.action({
                            moduleName:'register_post',
                            url:'adminapi/member/register',
                            isFormData:true,
                            method:'post',
                            data:this.airforce[this.fieldType]
                        }).then(res=>{
                            if(res.code != 200){
                                this.$vux.toast.text(res.message);
                                return;
                            }
                            this.$vux.toast.text("注册成功");
                            this.$router.push("/Login");
                        }).catch(err=>{
                            this.$vux.toast.text(err);
                        });
                        break;
                }

            }
        }
    }
</script>

<style scoped lang="less">
@import "../../assets/css/color.less";
.Register{
    padding: 0 30px;
    .title{
        font-family: "微软雅黑";
        margin-bottom: 50px;
    }
    .login-group{
        &/deep/ .login-x-input{
            background-color: transparent !important;
            border-bottom: 1px solid @cor_e5e5e5;
            margin-bottom: 0 !important;
            padding-left: 0;
             .Register-z-input{
                padding-left: 0;
            }
            .z-input-x-button{
                top: 0;
                right: 0;
                height: 100%;
                border-left: 1px solid @cor_e5e5e5;
                color:  @theme-color;
            }
        }
    }
}
</style>
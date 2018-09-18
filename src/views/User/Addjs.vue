<template>
    <div class="addjs animated fadeIn">
        <group gutter="0">
            <x-input type="text" v-model="wxname" title="姓名" placeholder="维修工姓名" placeholder-align="right" text-align="right"></x-input>
        </group>
        <group gutter="10">
          <popup-picker title="职能分类" :data="typelist" v-model="wxtype" @on-change="changetype"></popup-picker>
        </group>
        <group gutter="0">
            <x-input type="tel" v-model="phone" title="联系方式" placeholder="维修工联系方式" placeholder-align="right" text-align="right"></x-input>
        </group>
        <group gutter="0" class="ms">
            <x-textarea title="职能描述" v-model="ms" inline-desc="描述该维修工的业务范围等详细描述" :height=200 show-counter :max=200></x-textarea>
        </group>
        <button @click.prevent="addper">添加</button>
    </div>    
</template>
<script>
import { XInput,Group,PopupPicker,CellBox ,XTextarea } from "vux"
import { mapActions,mapGetters } from "vuex";
import { setTimeout } from 'timers';
export default {
    name:"Addjs",
    data(){
        return{
            msg:"添加角色",
            typelist:[["管道工","泥水工","清洁工"]],
            wxtype:["管道工"],
            ms:"",
            typevalue:"1",//维修工分类的值
            wxname:"",
            phone:"",
        }
    },
    methods:{
        ...mapActions(["action"]),
        addper(){//点击添加按钮的方法
            if(this.wxname==""){
                this.$vux.toast.text("请输入维修人员姓名");
                return false;
            }
            if(this.phone==""){
                this.$vux.toast.text("请输入维修人员联系方式");
                return false;
            }
            if(this.ms==""){
                this.$vux.toast.text("请填写职能描述");
                return false;
            }
            this.action({
                moduleName:"createRole",
                url:"Adminapi/Roles/createRole",
                method:"post",
                data:
                {
                    token:this.airforce.login_post.data.token,
                    type:this.typevalue,
                    name:this.wxname,
                    phone:this.phone,
                    describe:this.ms
                }
            }).then((res)=>{
                if(res.code==200){
                    this.$vux.toast.text(res.message);
                     setTimeout(()=>{
                        this.$router.back();
                    },2000)
                }else{
                    this.$vux.toast.text(res.message);
                }
            }).catch((err)=>{
                this.$vux.toast.text(err);
            })
        },
        changetype(){//维修工分类值改变时的方法
            if(this.wxtype[0]=="管道工"){
                this.typevalue="1";
            }else if(this.wxtype[0]=="泥水工"){
                this.typevalue="2";
            }else if(this.wxtype[0]=="清洁工"){
                this.typevalue="3";
            }
        }
    },
    components:{
        XInput,
        Group,
        PopupPicker,
        CellBox,
        XTextarea 
    },
     computed:{
    ...mapGetters(["airforce"]),
  },
}
</script>
<style lang="less" scoped>
.addjs{
    
    &/deep/ .ms{
        .weui-cells,.vux-no-group-title{
            .weui-cell,.vux-x-textarea{
                display: block;
            }
        }
    }
    
    button,button:focus{
        display: block;
        border:none;
        outline: none;
        width: 80%;
        margin: 0 auto;
        margin-top: 60px;
        background: #1b82d2;
        border-radius: 20px;
        color: #fff;
        line-height: 40px;
        font-size: 17px;
    }
}
</style>

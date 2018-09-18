<template>
  <div class="Xgzl animated fadeIn">
      <group class="zg-group" gutter=0>
          <x-input title="昵称" v-model="nc" text-align="right" ></x-input>
      </group>
      <group class="zg-group" gutter=0>
          <x-input title="姓名" v-model="xm" text-align="right" ></x-input>
      </group>
       <group class="zg-group" gutter=0>
         <x-input title="性别" disabled></x-input>
          <checker v-model="checkerxb" class="xg-checker" default-item-class="mr" selected-item-class="xz" >
              <checker-item class="xg-checkeritem" :value="item.key" v-for="(item,index) in sex" :key="index" >{{item.vaule}}</checker-item>
           </checker> 
      </group>
      <group class="zg-group" gutter=0>
          <x-input title="年龄" v-model="nl" type='number' text-align="right" ></x-input>
      </group>
      <!-- <group class="zg-group" gutter=0>
         <x-input title="身份" disabled></x-input>
          <checker v-model="checkersf" class="xg-checker" default-item-class="mr" selected-item-class="xz">
              <checker-item class="xg-checkeritem" :value="item.key" v-for="(item,index) in sf" :key="index" >{{item.vaule}}</checker-item>
           </checker> 
      </group> -->
      <group class="zg-group" gutter=0>
          <x-input title="身份证" v-model="sfz" text-align="right" ></x-input>
      </group>
      <button @click.prevent='save'>保存</button>
     
  </div>
</template>
<script>
import {
  ButtonTab,
  ButtonTabItem,
  Group,
  XInput,
  Checker,
  CheckerItem,
  Toast 
} from "vux";
import {mapGetters,mapActions} from "vuex"
import { setTimeout } from 'timers';
export default {
  name: "User",
  data() {
    return {
      msg: "完善资料",
      formdata:{},
      nc: "",
      ncyz:/^[\w\u4e00-\u9fa5]{1,8}$/,
      xm:"",
      xmyz: /^[\u4e00-\u9fa5a-zA-Z]/,
      nl: "",
      sfz: "",
      sfzyz:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/,
      sfdata:"",
      xb:"",
      sex: [//性别按钮的循环体
        {
          key: "0",
          vaule: "未知"
        },
        {
          key: "1",
          vaule: "男"
        },
        {
          key: "2",
          vaule: "女"
        }
      ],
      //性别的默认选项
      checkerxb:"0",
      sf: [//身份按钮的循环体
        {
          key: "1",
          vaule: "租客"
        },
        {
          key: "2",
          vaule: "房东"
        }
      ],
      //身份的默认选项
       checkersf:"2",
       
    };
  },
  components: {
    ButtonTab,
    ButtonTabItem,
    Group,
    XInput,
    Checker,
    CheckerItem,
    Toast 
  },
  methods: {
    ...mapActions(["action"]),
    save(){
      if(!this.ncyz.test(this.nc)){
        this.$vux.toast.text("请输入1到8位的中文，字母，数字或下划线昵称")
        return false
      }
      if(!this.xmyz.test(this.xm)){
        this.$vux.toast.text("请输入中文或字母的名称")
        return false
      }
      if(this.nl==""){
        this.$vux.toast.text("请输入年龄")
        return false
      }
      if(!this.sfzyz.test(this.sfz)){
        this.$vux.toast.text("身份证输入不合法")
        return false
      }
      if(this.checkersf==""){
        this.$vux.toast.text("请选择身份")
        return false
      }
     if(this.checkerxb==""){
        this.$vux.toast.text("请选择性别")
        return false
      }
      this.formdata.token=this.airforce.login_post.data.token;
      this.formdata.id_card=this.sfz;
      this.formdata.status=1;
      this.formdata.age=this.nl;
      this.formdata.gender=parseInt(this.checkerxb);
      this.formdata.name=this.xm;
      this.formdata.nickname=this.nc;  
      this.action({
          moduleName:"Xgzl",
          url:"adminapi/member/prefect",
          method:'post',
          isFormData: true,
          data:this.formdata,
      }).then(res=>{
        if(res.code==200){
          this.$vux.toast.show({
            type:"text",
            text:"保存成功"
          });
          this.action({
            moduleName:"login_post",
             goods:{
                  data:{
                      status:this.checkersf,
                      age:this.formdata.age,
                      gender:this.checkerxb,
                      name:this.formdata.name,
                      nickname:this.formdata.nickname,
                      id_card:this.formdata.id_card
                  }
              }
          })
          setTimeout(()=>{
            this.$router.back();
          },2000)
        }else{
           this.$vux.toast.show({
            type:"text",
            text:res.message
          });
        }
      }).catch(err=>{
        this.$vux.toast.show({
            type:"text",
            text:err
          });
      })
    }
  },
  computed:{
    ...mapGetters(["airforce"]),
  },
  created(){//更新信息
    this.nc=this.airforce.login_post.data.nickname;
    this.xm=this.airforce.login_post.data.name;
    this.nl=this.airforce.login_post.data.age;
    this.sfz=this.airforce.login_post.data.id_card;
    this.checkerxb=this.airforce.login_post.data.gender;
    this.checkersf=this.airforce.login_post.data.status;
  }
};
</script>
<style lang="less" scoped>

.Xgzl {
  .zg-group {
    position: relative;

    .xg-checker{
      position: absolute;
      top: 50%;
      right: 15px;
      transform: translateY(-50%);
      border-radius: 7px;
      overflow: hidden;
      line-height: 30px;
      .xg-checkeritem{
        display: block;
        float: left;
        width: 30px;
        text-align: center;
        padding: 0 5px;
      }
    }
    
    // &/deep/ .weui-cells {
    //   position: relative;
    //   .vux-checker-box {
    //     display: block;
    //     width: 30%;
    //     position: absolute;
    //     top: 0;
    //     right: 0;
    //   }
    // }
  }
  button {
    display: block;
    width: 70%;
    color: #fff;
    background: #d01716;
    text-align: center;
    margin: 10px auto;
    margin-top: 50px;
    border-radius: 20px;
    line-height: 35px;
  }
}
button,
button:focus {
  border: none;
  outline: none;
}
input[placeholder]{
  font-size: 14px!important;
}
.mr {
  color: black;
  font-size: 14px;
  background-color: rgb(242, 240, 245);
}
.xz {
  background: #1b82d2;
  font-size: 14px;
  color: #fff;
}
</style>

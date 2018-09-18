<template>
  <div class="Wxadd animated fadeIn">
    <group gutter="0">
      <x-input type="text" disabled title="申报人" text-align="right" v-model="name"></x-input>
    </group>
    <group gutter="0">
      <x-input type="tel" disabled title="联系方式" text-align="right" v-model="tel"></x-input>
    </group>
    <group gutter="0">
      <x-input type="text" disabled title="地址" text-align="right" v-model="dz"></x-input>
    </group>
     <group gutter=0>
        <popup-picker title="选择维修人员" v-if="btnshow" ref="xx" :data="wxglist" v-model="wxg" placeholder="请选择维修工"  :show-name=true></popup-picker>
      </group>
      <group gutter="0">
      <x-input type="text" disabled title="维修人员" v-if="!btnshow" text-align="right" v-model="wxgxq"></x-input>
    </group>
      <group gutter="0" class="ms">
        <x-textarea title="职能描述" inline-desc="描述该维修工的业务范围等详细描述" :height=200 disabled v-model="ms"></x-textarea>
      </group>
      <span class="btn" v-if="btnshow" @click="save">保存并确认</span>
  </div>
</template>
<script>
import { mapActions,mapGetters } from "vuex";
import { Tab, TabItem, CellBox, Group, Popup, Radio,Toast ,PopupPicker,XInput,XTextarea} from "vux";
import { setTimeout } from 'timers';
export default {
  name: "Wxxq",
  data() {
    return {
      msg: "维修详情",
      wxglist: [[]],
      wxg:[{name:"请选择维修工",value:"无"}],
      name:"林祥柯",
      tel:"15958123761",
      dz:"御景水岸花园15幢901室",
      ms:"这是描述内容",
      wxgxq:"",
      wxid:"",
      btnshow:true,//控制按钮显示的开关
    };
  },
  components: {
    Tab,
    TabItem,
    CellBox,
    Radio,
    Group,
    Popup,
    PopupPicker ,
    XInput,
    XTextarea
  },
  methods: {
    ...mapActions(["action"]),
    save() {//保存并推送的方法
      if(this.wxg[0].value=="无"){
        this.$vux.toast.text("请选择维修工");
        return false;
      }
      let wxgid=this.wxg[0];
      let ddid=this.$route.query.id;
      this.action({
        moduleName:"affirm",
        url:"Adminapi/Repair/affirm",
        method:"post",
        data:
        {
            token:this.airforce.login_post.data.token,
            id:ddid,
            role_id:wxgid
        }
      }).then((res)=>{
        if(res.code==200){
          this.$vux.toast.text(res.message)
          setTimeout(()=>{this.$router.back()},2000)
        }else{
          this.$vux.toast.text(res.message)
        }
      }).catch((err)=>{})
    },
  },
  computed:{
    ...mapGetters(["airforce"]),
  },
  created(){
    this.wxid=this.$route.query.id;
    let bs=this.$route.query.from;
    this.action({//渲染页面基本信息
      moduleName:"repairIndex",
      url:"adminapi/repair/repairIndex",
      method:"post",
      data:
      {
          token:this.airforce.login_post.data.token,
          id:this.wxid,
      }
    }).then((res)=>{
      if(res.code==200){
         this.name=res.data.o_name;
          this.tel=res.data.o_phone;
          this.dz=res.data.address;
          this.ms=res.data.content;
        if(bs=="not"){//判断是从申请列表过来的
          return false;
        }else if(bs=="already"){//判断是从维修列表过来的
          this.btnshow=false;
          switch(res.data.role_type){
            case "1":
              res.data.role_type="管道工";
              break;
            case "2":
              res.data.role_type="泥水工";
              break;
            case "3":
              res.data.role_type="清洁工";
              break;
            default:
              res.data.role_type="未知工种";
          }
          this.wxgxq =res.data.role_name+"("+res.data.role_type+")"+res.data.role_phone;
          // try{
          //   this.wxg = [_.find(this.wxglist[0],{name:delectData}).value];
          // }catch(e){}
          //this.$refs.xx.setAttribute("disabled","true");
        }else{
          this.$vux.toast.text("参数不足")
        }
      }else{
        this.$vux.toast.text(res.message)
      }
    }).catch((err)=>{})

    this.action({//渲染维修工列表
      moduleName:"roleList",
      url:"Adminapi/Roles/roleList",
      method:"post",
      data:
      {
          token:this.airforce.login_post.data.token,
      }
    }).then((res)=>{
      if(res.code==200){
        for(let i=0;i<res.data.lists.length;i++){
          switch(res.data.lists[i].type){
            case "1":
              res.data.lists[i].type="管道工";
              break;
            case "2":
              res.data.lists[i].type="泥水工";
              break;
            case "3":
              res.data.lists[i].type="清洁工";
              break;
            default:
              res.data.lists[i].type="未知工种";
          }
          let item=new Object;
          item.name=res.data.lists[i].name+"("+res.data.lists[i].type+")"+res.data.lists[i].phone;
          item.value=res.data.lists[i].id;
          this.wxglist[0].push(item);
        }
        if( this.wxglist[0].length==0){
          this.$vux.toast.text("请先去添加维修工")
          
        }
      }else{
        this.$vux.toast.text(res.message)
      }
    }).catch((err)=>{})
  },
};
</script>
<style lang="less" scoped>
.Wxadd {
   &/deep/ .ms{
        .weui-cells,.vux-no-group-title{
            .weui-cell,.vux-x-textarea{
              display: block;
              .weui-cell__bd{
                textarea{
                  background: #fff!important;
                }
              }
            }
        }
    }
  .btn {
    display: block;
    width: 70%;
    color: #fff;
    background: #d01716;
    text-align: center;
    margin: 30px auto;
    border-radius: 20px;
    line-height: 35px;
  }
}
</style>

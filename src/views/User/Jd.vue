<template>
    <div class="jd animated fadeIn">
        <div class="jd-content">
            <p>可借的钱（元）</p>
            <p><span>{{now}}</span></p>
            <p>总额度</p>
            <p>{{all}}  <span class="changed" @click.prevent="goed">修改额度</span> </p>
        </div>
        <group gutter="0" class="jd-group">
            <cell class="jd-cell">
                <marquee class="jd-marquee">
                        <marquee-item class="jd-marquee-item" v-for="i in 5" :key="i" ><span class="iconfont">&#xe657;</span>日利率0.04%（1万用一天利息只需4元）</marquee-item>
                </marquee>
            </cell>
        </group>
        <div class="btn">
          <button @click.prevent="gorepay">去还钱</button>
          <button @click.prevent="takemoney">去借钱</button>
        </div>
        
    </div>
</template>
<script>
import { Group, Cell, Marquee, MarqueeItem } from "vux";
import {mapActions,mapGetters} from "vuex"
import { setTimeout } from 'timers';
export default {
  name: "Jd",
  data() {
    return {
      msg: "租房借贷",
      now: 20000,
      all: 20000,
      bankcon:{}
    };
  },
  components: {
    Group,
    Cell,
    Marquee,
    MarqueeItem
  },
  methods: {
      ...mapActions(["action"]),
    goed(){
      this.$router.push("/Edsz")
    },
    takemoney() {
      this.action({
        moduleName:'isMessage',
        url:'/adminapi/member/isMessage',
        method:"post",
        data:{
            token:this.airforce.login_post.data.token,
        }
      }).then((res)=>{
        if(res.code==200){
          this.action({
            moduleName:"Wszl",
            goods:{
              name:res.data.owner.name,
              phone:res.data.owner.phone,
              home_address:res.data.owner.home_address,
              profession:res.data.owner.profession,
              company:res.data.owner.company,
              company_address:res.data.owner.company_address,
              income:res.data.owner.income,
              id_card:res.data.owner.id_card,
              card_face:res.data.owner.card_face,
              card_back:res.data.owner.card_back,
              family_name:res.data.owner.family_name,
              family_phone:res.data.owner.family_phone,
              friend_name:res.data.owner.friend_name,
              friend_phone:res.data.owner.friend_phone,
              bank_name:res.data.owner.bank_name,
              bank:res.data.owner.bank
            }
          })
          if(res.data.ismessage=="false"){
            this.$vux.toast.text("请完善资料")
            setTimeout(()=>{
              this.$router.push("/Wszl?bank="+this.airforce.Wszl.bank+"&bankname="+this.airforce.Wszl.bank_name)
            },2000)
          }else{
            localStorage.removeItem('Jq');
            this.$router.push("/Jq");
          }
        }else{
          this.$vux.toast.text(res.message)
        }
      }).catch((err)=>{})
      
    },
    gorepay(){
      this.$router.push("/Qhq");
    }
  },
  created() {
    this.action({
        moduleName:'getquota',
        url:'/Adminapi/loan/getquota',
        method:"post",
        data:{
            token:this.airforce.login_post.data.token,
        }
    }).then((res)=>{
      if(res.code==200){
        this.all=res.data.quota;
        this.now=res.data.kquota;
      }else{
        this.$vux.toast.text(res.message)
      }
    }).catch((err)=>{})
    this.now = parseFloat(this.now).toLocaleString();
    this.all = parseFloat(this.all).toLocaleString();
  },
  mounted(){
    this.action({
        moduleName:'isMessage',
        url:'/adminapi/member/isMessage',
        method:"post",
        data:{
            token:this.airforce.login_post.data.token,
        }
      }).then((res)=>{
        if(res.code==200){
          this.action({
              moduleName:"Wszl",
              goods:{
                name:res.data.owner.name,
                phone:res.data.owner.phone,
                home_address:res.data.owner.home_address,
                profession:res.data.owner.profession,
                company:res.data.owner.company,
                company_address:res.data.owner.company_address,
                income:res.data.owner.income,
                id_card:res.data.owner.id_card,
                card_face:res.data.owner.card_face,
                card_back:res.data.owner.card_back,
                family_name:res.data.owner.family_name,
                family_phone:res.data.owner.family_phone,
                friend_name:res.data.owner.friend_name,
                friend_phone:res.data.owner.friend_phone,
                bank_name:res.data.owner.bank_name,
                bank:res.data.owner.bank
              }
            })
        }else{
          this.$vux.toast.text(res.message)
        }
      }).catch((err)=>{})
      this.action({
          moduleName:'layout',
          goods:{
              clickRight:()=>{
                  this.$router.push('/Wszl')
              }
          }       
      })
  },
  computed:{
    ...mapGetters(["airforce"]),
  }
};
</script>
<style lang="less" scoped>
button,
button:focus {
  border: none;
  outline: none;
}
.jd {
  .jd-content {
    background: #108ee9;
    box-sizing: border-box;
    padding: 20px 10%;
    p {
      color: #fff;
      overflow: hidden;
      .changed{
        float: right;
        font-size: 12px;
        box-sizing: border-box;
        border: 1px solid #fff;
        line-height: 25px;
        padding: 0 7px;
        border-radius: 15px;
      }
    }
    p:nth-child(1) {
      font-size: 14px;
      margin-bottom: 10px;
    }
    p:nth-child(2) {
      span {
        font-size: 60px;
        line-height: 60px;
        color: #fff;
        border-bottom: 1px dotted #fff;
        font-weight: 300;
      }
    }
    p:nth-child(3) {
      font-size: 14px;
      margin-top: 25px;
    }
    p:nth-child(4) {
      font-size: 18px;
      line-height: 30px;
      overflow: hidden;
    }
  }
  .jd-group {
    .jd-cell {
      background: #26a4ff;
      &/deep/ .vux-cell-primary{
          flex:0;
      }
      &/deep/ .weui-cell__ft {
        text-align: left;
        .jd-marquee {
          .jd-marquee-item {
            color: #fff;
            line-height: 24px;
            font-size: 14px;
          }
        }
      }
    }
  }
  .btn{
    overflow: hidden;
      button {
      display: block;
      width:40%;
      border-radius: 7px;
      margin-top: 30px;
      line-height: 40px;
      font-size: 16px;
    }
    button:nth-child(1){
      float:left;
      background: #fff;
      margin-left: 7%;
    }
    button:nth-child(2){
      float:right;
      background: #108ee9;
      color: #fff;
      margin-right: 7%;
    }
  }

}
</style>

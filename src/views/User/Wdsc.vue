<template>
  <div class="Wdsc animated fadeIn">
      <swipeout>
          <div class="none" v-if="nonehave">
              <img :src="require('@/assets/img/User/nocontent.png')">
              <p>暂无收藏</p>
          </div>
          <swipeout-item transition-mode="follow"  v-for="(item,index) in sclist" :key="index">
              <div slot="right-menu">
                  <swipeout-button type="default">取消</swipeout-button>
                  <swipeout-button @click.native="onButtonClick(item,index)" type="warn">删除</swipeout-button>
              </div>
              <div slot="content">
                  <router-link :to='"/HousingDetails?id="+item.r_id' class="sc-item">
                        <div class="scitem-img">
                            <img :src="item.img.img0" alt="">
                        </div>
                        <div class="scitem-info">
                            <h1>{{item.title}}</h1>
                            <p>
                                <span>{{item.room}}室{{item.hall}}厅{{item.wc}}卫</span>
                                <span> | {{item.fitment}}</span>
                                <span> | {{item.projname}}</span>
                            </p>
                           
                            <div>
                                <h2 class="wz">{{item.pice}}<span>元/月</span></h2>
                                <span class="cz">{{item.mode}}</span>
                            </div>
                        </div>
                    </router-link>
              </div>
          </swipeout-item>
      </swipeout>
      
  </div>
</template>
<script>
import { mapActions,mapGetters } from "vuex";
import {CellBox,Group,Swipeout, SwipeoutItem, SwipeoutButton} from "vux"
export default {
  name:"Wdsc",
  data(){
      return{
          msg:"我的收藏",
          sclist:[],
          nonehave:false,
      }
  },
  components:{
      CellBox,
      Group,
      Swipeout,
    SwipeoutItem,
    SwipeoutButton
  },
  methods:{
      ...mapActions(["action"]),
      onButtonClick(t,i){
          this.action({
            moduleName:"delcollect",
            url:"/adminapi/rents/delcollect",
            method:"post",
            data:{
                token:this.airforce.login_post.data.token,
                id:t.r_id
            }
          }).then((res)=>{
              if(res.code==200){
                  this.$vux.toast.text(res.message)
                  this.sclist.splice(i,1)
                  if(this.sclist.length==0){
                        this.nonehave=true;
                    }
              }else{
                  this.$vux.toast.text(res.message)
              }
          }).catch((err)=>{})
      }
  },
  computed:{
      ...mapGetters(["airforce"]),
  },
  created(){
      this.action({
        moduleName:"listCollect",
        url:"/adminapi/rents/listCollect",
        method:"post",
        data:{
            token:this.airforce.login_post.data.token,
        }
      }).then((res)=>{
          if(res.code==200){
              for(let i=0;i<res.data.data.length;i++){
                  switch(res.data.data[i].mode){
                      case "1":
                        res.data.data[i].mode="整租";
                        break;
                      case "2":
                        res.data.data[i].mode="合租";
                        break;
                      default:
                        res.data.data[i].mode="短租";
                  }
                  switch(res.data.data[i].fitment){
                      case "1":
                        res.data.data[i].fitment="简装";
                        break;
                      case "2":
                        res.data.data[i].fitment="精装";
                        break;
                      case "3":
                        res.data.data[i].fitment="豪华装";
                        break;
                      case "4":
                        res.data.data[i].fitment="中等装";
                        break;
                      default:
                        res.data.data[i].fitment="毛坯";
                  }
              }
              this.sclist=this.sclist.concat(res.data.data);
          }else{
              this.$vux.toast.text(res.message)
          }
          if(this.sclist.length==0){
              this.nonehave=true;
          }
      }).catch((err)=>{})
  }
}
</script>
<style lang="less" scoped>
.Wdsc{
    .none {
        position: relative;
        top: 100px;
        padding: 120px 0;
        margin: 0 auto;
        img {
        display: block;
        margin: 0 auto;
        width: 30%;
        padding-bottom: 15px;
        }
        p {
        text-align: center;
        font-size: 20px;
        color: #c5c5c5;
        }
    }
    .sc-item{
        background: #fff;
        display: block;
        overflow: hidden;
        box-sizing: border-box;
        padding: 10px 15px;
        .scitem-img{
            width: 30%;
            float: left;
            img{
                width: 100%;
                height: 100px;
                display: block;
            }
        }
        .scitem-info{
            width: 65%;
            float: right;
            margin-top: 5px;
            h1{
                font-size: 16px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
                font-weight: 500;
                }
            p{
                font-size: 12px;
                color:#a9a7ab;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }
            // h2{
            //     margin-top: 7px;
            //     color:#ff0000;
            //     font-size: 18px;
            //     font-weight:initial;
            //     text-overflow: ellipsis;
            //     overflow: hidden;
            //     white-space: nowrap;
            
            //     span{
            //         font-size: 12px;
            //     }
            // }
            div{
                overflow: hidden;
                margin-top: 20px;
                .cz{
                    font-size: 12px;
                    float: right;
                    display: block;
                    color: #1b82d2;
                    padding: 0 4px;
                    border: 1px solid #1b82d2;
                    border-radius: 4px;
                    line-height: 25px;
                }
                .wz{
                    font-size: 18px;
                    width: 65%;
                    line-height:25px;
                    color: #ff0000;
                    float: left;
                     span{
                        font-size: 12px;
                        color: #2a2a2a;
                        padding-left: 3%;
                    }
                }
            }
        }
    }
}
</style>

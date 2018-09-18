<template>
  <div class="Yysq animated fadeIn">
      <div class="none" v-if="have">
          <img :src="require('@/assets/img/User/nocontent.png')">
          <p>暂无预约申请</p>
      </div>
      <scroller v-else :use-pullup=true :bounce=true :lock-x=true :pullup-config=pullupConfig :scroll-bottom-offset=110 @on-scroll-bottom="getmore">
        
        <div>
        <cell-box class="content-item" v-for="(item,index) in sqlist" :key="index">
            <div class="content-itemtop">
                  <router-link class="headimg" :to="{path:'/HousingDetails',query:{id:item.r_id}}">
                      <img :src="item.img.img0">
                  </router-link>
                  <router-link class="information" to="">
                  <p>房东：{{item.l_name}}</p>
                  <p>预约时间：{{item.room_time}}</p>
                  <p>联系电话：{{item.l_phone}}</p>
                  <p>状态：{{item.b_status}}</p>
              </router-link>
              <div class="more">
                  <span class="iconfont" @click="morebtn(index)">&#xe630;</span>
              </div>
            </div>
              <div class="btnlist">
                <ul >
                  <li @click="del(item.b_id,index)">
                    <span class="iconfont">&#xe62e;</span>
                    <span>删除记录</span>
                  </li>
                </ul>
              </div>       
          </cell-box>
          </div>
      </scroller>

  </div>
</template>
<script>
import $ from "jquery";
import { CellBox, Confirm,Toast,Scroller} from "vux";
import { mapActions,mapGetters } from "vuex";
export default {
  name: "Wdyy",
  data() {
    return {
      msg: "我的预约",
      sqlist: [],
      have: false,
      pullupConfig:{
        content: '上拉刷新',
        autoRefresh: true,
        downContent: '够啦够啦',
        upContent: '上拉刷新',
        loadingContent: '加载中...',
        clsPrefix: 'pullupConfig-',
      },
      sqloadswitch:true,
      sqpage:1,
    };
  },
  components: {
    CellBox,
    Confirm ,
    Toast,
    Scroller
  },
  methods: {
    ...mapActions(["action"]),
    goht(){
      this.$router.push("/Ht")
    },
    morebtn(t) {
      if ($(".btnlist").eq(t).is(":hidden")) {
        $(".btnlist").slideUp();
        $(".btnlist").eq(t).slideDown();
        $(".more").removeClass('cis').addClass('inverse');
        $(".more").removeClass('cised').addClass('inversed');
        $(".more").eq(t).removeClass('inverse').addClass('cis');
        $(".more").eq(t).removeClass('inversed').addClass('cised');
      } else {
        $(".btnlist").eq(t).slideUp();
        $(".more").eq(t).removeClass('cis').addClass('inverse');
        $(".more").eq(t).removeClass('cised').addClass('inversed');
      }
    },
    makeshow(t,k){
        this.show=true;
        this.jjbindex=t;
        this.jjindex=k;
    },
    del(k,t){
      let that=this;
     this.$vux.confirm.show({
       title:"确定删除咩?",
       onConfirm(){
         that.action({
            moduleName:"delete",
            url:"Adminapi/Bespeaks/delete",
            method:"post",
            data:
            {
              token:that.airforce.login_post.data.token,
              id:k,
            }
         }).then((res)=>{
           if(res.code==200){
             that.$vux.toast.text(res.message);
             that.sqlist.splice(t,1);
             if(that.sqlist.length==0){
               that.have=true;
             }
           }else{
             that.$vux.toast.text(res.message)
           }
         }).catch((err)=>{
           that.$vux.toast.text(err)
         })
       }
     })
    },
    getmore(){//下拉加载的方法
      if(this.sqloadswitch==true){
        this.sqloadswitch=false;
        this.action({
          moduleName:"lists",
          url:"Adminapi/Bespeaks/lists",
          method:"post",
          data:
          {
            token:this.airforce.login_post.data.token,
            type:"2",
            page:this.sqpage.toString(),
            pagesize:"9",
            status:"0"
          }
        }).then((res)=>{
          if(res.code==200){
              for(let i=0;i<res.data.lists.length;i++){
                if(res.data.lists[i].b_status=="0"){
                  res.data.lists[i].b_status="待受理";
                  res.data.lists[i].zf=false;
                }else if(res.data.lists[i].b_status=="1"){
                  res.data.lists[i].b_status="已完成";
                  res.data.lists[i].zf=true;
                }else if(res.data.lists[i].b_status=="2"){
                  res.data.lists[i].b_status="已中断";
                  res.data.lists[i].zf=false;
                }else if(res.data.lists[i].b_status=="3"){
                  res.data.lists[i].b_status="进行中";
                  res.data.lists[i].zf=false;
                }else if(res.data.lists[i].b_status=="4"){
                  res.data.lists[i].b_status="被拒绝";
                  res.data.lists[i].zf=false;
                }
                this.sqlist.push(res.data.lists[i]);
              }
              if(res.data.lists.length<9){
                this.$vux.toast.text("没有更多数据了呦")
                this.sqloadswitch=false;
              }else{
                this.sqloadswitch=true;
              }
              this.sqpage++;
          }else{
            this.$vux.toast.text(res.message)
          }
        }).catch((err)=>{
          this.$vux.toast.text(err)
        })
      }else{
        return false;
      }
    }
  },
  computed:{
     ...mapGetters(["airforce"]),
  },
  created(){
     this.action({//页面进入初始渲染待进行列表
      moduleName:"lists",
      url:"adminapi/Bespeaks/lists",
      method:"post",
      data:
      {
        token:this.airforce.login_post.data.token,
        type:"1",
        page:this.sqpage.toString(),
        pagesize:"9",
      }
    }).then(res=>{
      if(res.code==200){
        for(let i=0;i<res.data.lists.length;i++){
          if(res.data.lists[i].b_status=="0"){
            res.data.lists[i].b_status="待受理";
            res.data.lists[i].zf=false;
          }else if(res.data.lists[i].b_status=="1"){
            res.data.lists[i].b_status="已完成";
            res.data.lists[i].zf=true;
          }else if(res.data.lists[i].b_status=="2"){
            res.data.lists[i].b_status="已中断";
            res.data.lists[i].zf=false;
          }else if(res.data.lists[i].b_status=="3"){
            res.data.lists[i].b_status="进行中";
            res.data.lists[i].zf=false;
          }else if(res.data.lists[i].b_status=="4"){
            res.data.lists[i].b_status="被拒绝";
            res.data.lists[i].zf=false;
          }
          if(res.data.lists[i].img==null){
            res.data.lists[i].img="";
          }
        }
        this.sqlist=this.sqlist.concat(res.data.lists);
         if(this.sqlist.length==0){
            this.have=true;
          }else if(res.data.lists.length<9){
            this.sqloadswitch=false;
          }
          this.sqpage++;
      }else{
        this.sqloadswitch=false;
        this.have=true;
        this.$vux.toast.text(res.message);
      }
    }).catch(err=>{
        this.have=true;
    })
  }
};
</script>
<style lang="less" scoped>
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
.Yysq {
  .content-item {
    background: #fff;
    display: block;
    .content-itemtop {
      overflow: hidden;
      .headimg {
        width: 30%;
        display: block;
        padding-right: 3%;
        float: left;
        img {
          width: 100%;
          height: 88px;
          display: block;
        }
      }
      .information {
        width: 59%;
        display: block;
        float: left;
        p {
            line-height: 22px;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          font-size: 14px;
        }
      }
      .more {
        width: 8%;
        float: right;
        text-align: center;
        span{
          font-size: 18px;
          line-height: 88px;
        }
      }
    }
  }
  .btnlist {
    display: none;
    ul {
      width: 100%;
      padding-top: 10px;
      display: flex;
      justify-content: space-around;
      // display:none;

      li {
        display: inline-block;
        span {
          display: block;
          text-align: center;
          font-size:14px;
        }
         span:nth-child(1) {
            font-size: 16px;
          }
      }
    }
  }
}
.cis{
    animation: cis 0.5s infinite;
    animation-iteration-count:1;
}
.cised{
    transform:rotate(180deg);
}
.inverse{
    animation: inverse 0.5s infinite;
    animation-iteration-count:1;
}
.inversed{
    transform:rotate(0deg);
}
@keyframes cis{
    0%{
        transform:rotate(0deg);
    }
    100%{
        transform:rotate(180deg);
    }
}
@keyframes inverse{
    0%{
        transform:rotate(180deg);
    }
    100%{
        transform:rotate(0deg);
    }
}
</style>

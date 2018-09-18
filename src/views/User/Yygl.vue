<template>
  <div class="Wdyy animated fadeIn">
      <tab class="headtab" v-model="index" bar-active-color='#1b82d2' active-color='#1b82d2' default-color='#a9a7ab'>
            <tab-item :selected="index == 0"  v-for="(item,index) in tabs" :key="index">{{item.title}}</tab-item>
        </tab>
        <swiper v-model="index" class="tabcontent" :aspect-ratio="1/2" :show-dots="false" >
          <swiper-item v-for="(item,index) in tabs" :key="index">
            <div  class="none" v-if="item.len">
              <img :src="require('@/assets/img/User/nocontent.png')">
              <p>暂无预约</p>
            </div>
            <scroller   v-else :use-pullup=true :bounce=true :lock-x=true :pullup-config=pullupConfig :scroll-bottom-offset=108 @on-scroll-bottom="getmore(index)">
            <div class="tabcontent-item">
                <cell-box class="yyitem" v-for="(listItem,listIndex) in item.list" :key="listIndex" >
                    <div class="content-itemtop">
                        <router-link class="headimg" :to="{path:'/HousingDetails',query:{id:listItem.r_id}}">
                            <img :src="listItem.img.img0">
                        </router-link>
                         <router-link class="information" :to='"/BookingDetails?yyid="+listItem.b_id'>
                            <p>预约人：{{listItem.name}}</p>
                            <p>预约时间：{{listItem.room_time}}</p>
                            <p>地址：{{listItem.address}}</p>
                            <p>{{listItem.forn}}{{listItem.remark}}</p>
                        </router-link>
                        <div :class="(listItem.bs=='djx')?'djxmore more' : 'more'" v-if="listItem.bs=='djx'" @click="morebtn(listIndex,listItem)">
                            <span class="iconfont">&#xe630;</span>
                        </div>
                        <div :class="(listItem.bs=='jxz')?'jxzmore more' : 'more'" v-if="listItem.bs=='jxz'" @click="morebtn(listIndex,listItem)">
                            <span class="iconfont">&#xe630;</span>
                        </div>
                        <div :class="(listItem.bs=='ls')?'lsmore more' : 'more'" v-if="listItem.bs=='ls'" @click="morebtn(listIndex,listItem)">
                            <span class="iconfont">&#xe630;</span>
                        </div>
                    </div>
                    <div :class="(listItem.bs=='djx')?'djxbtnlist yybtnlist' : 'yybtnlist'" v-if="listItem.bs=='djx'">
                        <ul>
                            <li>
                              <a :href='"tel:"+listItem.phone'>
                                <span class="iconfont">&#xe612;</span>
                                <span>联系预约</span>
                                </a>
                            </li>
                            <li @click="djxmake(listItem.b_id,listIndex)">
                                <span class="iconfont">&#xe6bc;</span>
                                <span>中断预约</span>
                            </li>
                             <li @click="qrwc(listItem.b_id,listIndex)">
                                <span class="iconfont">&#xe6bc;</span>
                                <span>完成预约</span>
                            </li>
                        </ul>
                    </div>
                    <div :class="(listItem.bs=='jxz')?'jxzbtnlist yybtnlist' : 'yybtnlist'" v-if="listItem.bs=='jxz'">
                        <ul>
                            <li>
                              <a :href='"tel:"+listItem.phone'>
                                <span class="iconfont">&#xe612;</span>
                                <span>联系预约</span>
                                </a>
                            </li>
                            <li @click="jxzmake(listItem.b_id,listIndex)">
                                <span class="iconfont">&#xe62e;</span>
                                <span>删除记录</span>
                            </li>
                        </ul>
                    </div>
                     <div :class="(listItem.bs=='ls')?'lsbtnlist yybtnlist' : 'yybtnlist'" v-if="listItem.bs=='ls'">
                        <ul>
                            <li @click="lsmake(listItem.b_id,listIndex)">
                                <span class="iconfont">&#xe6f2;</span>
                                <span>删除记录</span>
                            </li>
                        </ul>
                    </div>
              </cell-box>
            </div>
           </scroller>
          </swiper-item>
          
        </swiper>
        <confirm v-model="storage.show" title="确定完成吗？" @on-confirm="onConfirm"></confirm>
        <actionsheet v-model="djxshow" :menus="dslmenus"  @on-click-menu-ok="dslsure"></actionsheet>
        <actionsheet v-model="jxzshow" :menus="jxzmenus"  @on-click-menu-ok="jxzsure"></actionsheet>
        <actionsheet v-model="lsshow" :menus="lsmenus" @on-click-menu-ok="lssure"></actionsheet>
  </div>
</template>
<script>
import $ from "jquery";
import { Tab, TabItem, CellBox, Actionsheet, Swiper, SwiperItem,Scroller,Confirm} from "vux";
import { mapActions,mapGetters } from "vuex";
import { error } from 'util';
import { setTimeout } from 'timers';
export default {
  name: "Yygl",
  data() {
    return {
      msg: "预约管理",
      // vuegConfig:{
      //   forwardAnim:'fadeInLeft',
      //   backAnim:'fadeInLeft',
      //   disable:false
      // },
      djxloadswitch:true,//加载开关
      yzdloadswitch:true,
      lsloadswitch:true,
      sqloadswitch:true,
      djxpage:1,//加载页码数
      yzdpage:1,
      lspage:1,
      sqpage:1,
      tabs: [
        {
          title: "待进行",
          list: [],
          len:false,//这是控制每个swiper有无内容显示的
        },
        {
          title: "已中断",
          list: [],
          len:false
        },
        {
          title: "已完成",
          list: [],
          len:false
        },
      ],
      djxshow: false,
      jxzshow: false,
      lsshow: false,
      dslmenus: [
        { label: "确定中断预约吗？", type: "info" },
        { label: "确定啦", type: "warn", value: "ok" },
        { label: "再考虑考虑", type: "default" }
      ],
      jxzmenus: [
        { label: "确定删除记录吗？", type: "info" },
        { label: "确定啦", type: "warn", value: "ok" },
        { label: "再考虑考虑", type: "default" }
      ],
      lsmenus: [
        { label: "确定删除记录吗？", type: "info" },
        { label: "确定啦", type: "warn", value: "ok" },
        { label: "再考虑考虑", type: "default" }
      ],
      index: 0,
      pullupConfig:{
        content: '上拉刷新',
        autoRefresh: true,
        downContent: '够啦够啦',
        upContent: '上拉刷新',
        loadingContent: '加载中...',
        clsPrefix: 'pullupConfig-',
      },
      storage:{
        show:false,
        qryyid:"",
        qryyindex:0,
        yzddelid:"",
        yzddelindex:0,
        ywcdelid:"",
        ywcdelindex:0
      }
    };
  },
  components: {
    Tab,
    TabItem,
    CellBox,
    Actionsheet,
    Swiper,
    SwiperItem,
    Scroller ,
    Confirm
  },
  methods: {
    ...mapActions(["action"]),
    morebtn(listIndex,listItem){//点击下拉按钮下拉
      switch(listItem.bs){
          case "djx":
            if(!$(".djxbtnlist").eq(listIndex).is(":hidden")){
              $(".djxbtnlist").eq(listIndex).slideUp();
              $(".djxmore").eq(listIndex).removeClass('cis').addClass('inverse');
              $(".djxmore").eq(listIndex).removeClass('cised').addClass('inversed');
            }else{
              $(".djxbtnlist").slideUp();
              $(".djxbtnlist").eq(listIndex).slideDown();
              $(".djxmore").removeClass('cis').addClass('inverse');
              $(".djxmore").removeClass('cised').addClass('inversed');
              $(".djxmore").eq(listIndex).removeClass('inverse').addClass('cis');
              $(".djxmore").eq(listIndex).removeClass('inversed').addClass('cised');
            }
            break;
          case "jxz":
            if(!$(".jxzbtnlist").eq(listIndex).is(":hidden")){
              $(".jxzbtnlist").eq(listIndex).slideUp();
              $(".jxzmore").eq(listIndex).removeClass('cis').addClass('inverse');
              $(".jxzmore").eq(listIndex).removeClass('cised').addClass('inversed');
            }else{
              $(".jxzbtnlist").slideUp();
              $(".jxzbtnlist").eq(listIndex).slideDown();
              $(".jxzmore").removeClass('cis').addClass('inverse');
              $(".jxzmore").removeClass('cised').addClass('inversed');
              $(".jxzmore").eq(listIndex).removeClass('inverse').addClass('cis');
              $(".jxzmore").eq(listIndex).removeClass('inversed').addClass('cised');
            }
            break;
          case "ls":
            if(!$(".lsbtnlist").eq(listIndex).is(":hidden")){
              $(".lsbtnlist").eq(listIndex).slideUp();
              $(".lsmore").eq(listIndex).removeClass('cis').addClass('inverse');
              $(".lsmore").eq(listIndex).removeClass('cised').addClass('inversed');
            }else{
              $(".lsbtnlist").slideUp();
              $(".lsbtnlist").eq(listIndex).slideDown();
              $(".lsmore").removeClass('cis').addClass('inverse');
              $(".lsmore").removeClass('cised').addClass('inversed');
              $(".lsmore").eq(listIndex).removeClass('inverse').addClass('cis');
              $(".lsmore").eq(listIndex).removeClass('inversed').addClass('cised');
            }
            break;
          default:
            break;
        }
    },
    djxmake(id,index) {//点击中断预约调出弹窗
      this.djxshow = true;
      this.storage.zdyyid=id;
      this.storage.zdyyindex=index;
    },
    jxzmake(id,index) {//点击删除已中断调出弹窗
      this.jxzshow = true;
      this.storage.yzddelid=id;
      this.storage.yzddelindex=index;
    },
    lsmake(id,index){
      this.lsshow = true;
      this.storage.ywcdelid=id;
      this.storage.ywcdelindex=index;
    },
    dslsure(){ //点击中断预约的方法
      this.action({
        moduleName:"blackout",
        url:"Adminapi/Bespeaks/blackout",
        method:"post",
        data:
        {
          token:this.airforce.login_post.data.token,
          id:this.storage.zdyyid
        }
      }).then((res)=>{
        if(res.code==200){
          this.$vux.toast.text(res.message);
          this.tabs[0].list[this.storage.zdyyindex].bs="jxz";
          this.tabs[1].list.push(this.tabs[0].list[this.storage.zdyyindex]);
          this.tabs[1].len=false;
          this.tabs[0].list.splice(this.storage.zdyyindex,1);
          if(this.tabs[0].list.length==0){
            this.tabs[0].len=true;
          }
        }else{
          this.$vux.toast.text(res.message)
        }
      }).catch((err)=>{
        this.$vux.toast.text(err)
      })
    },
    jxzsure() {//点击删除已中断的方法
      this.action({
        moduleName:"delete",
        url:"Adminapi/Bespeaks/delete",
        method:"post",
        data:
        {
          token:this.airforce.login_post.data.token,
          id:this.storage.yzddelid
        }
      }).then((res)=>{
        if(res.code==200){
          this.$vux.toast.text(res.message)
          this.tabs[1].list.splice(this.storage.yzddelindex,1);
          if(this.tabs[1].list.length==0){
            this.tabs[1].len=true;
          }
        }else{
          this.$vux.toast.text(res.message)
        }
      }).catch((err)=>{
        this.$vux.toast.text(err)
      })
    },
    lssure() {//点击删除已完成的方法
      this.action({
        moduleName:"delete",
        url:"Adminapi/Bespeaks/delete",
        method:"post",
        data:
        {
          token:this.airforce.login_post.data.token,
          id:this.storage.ywcdelid
        }
      }).then((res)=>{
        if(res.code==200){
          this.$vux.toast.text(res.message)
          this.tabs[2].list.splice(this.storage.ywcdelindex,1);
          if(this.tabs[2].list.length==0){
            this.tabs[2].len=true;
          }
        }else{
          this.$vux.toast.text(res.message)
        }
      }).catch((err)=>{
        this.$vux.toast.text(err)
      })
    },
    qrwc(id,index){//点击完成预约按钮调出弹窗
      this.storage.show=true;
      this.storage.qryyid=id;
      this.storage.qryyindex=index;
    },
    onConfirm(){//点击完成预约的方法
      this.action({
        moduleName:"over",
        url:"Bespeaks/over",
        method:"post",
        data:
        {
          token:this.airforce.login_post.data.token,
          id:this.storage.qryyid
        }
      }).then((res)=>{
        if(res.code==200){
          this.$vux.toast.text(res.message);
          this.tabs[0].list[this.storage.qryyindex].bs="ls";
          this.tabs[2].list.push(this.tabs[0].list[this.storage.qryyindex]);
          this.tabs[2].len=false;
          this.tabs[0].list.splice(this.storage.qryyindex,1);
          if(this.tabs[0].list.length==0){
            this.tabs[0].len=true;
          }
        }else{
          this.$vux.toast.text(res.message)
        }
      }).catch((err)=>{
        this.$vux.toast.text(err)
      })
    },
    getmore(i){//下拉触发
      if(i==0){//判断下拉触发的是待进行
        if(this.djxloadswitch==true){
          this.djxloadswitch=false;
          this.action({
            moduleName:"Wdyyxl",
            url:"adminapi/Bespeaks/lists",
            method:"post",
            data:
            {
              token:this.airforce.login_post.data.token,
              type:"2",
              page:this.djxpage.toString(),
              pagesize:"9",
              status:"3"
            }
          }).then((res)=>{
            if(res.code==200){
              for(let i=0;i<res.data.lists.length;i++){
                res.data.lists[i].bs="djx";
                res.data.lists[i].forn="备注";
                this.tabs[0].list.push(res.data.lists[i]);
              }
              if(res.data.lists.length<9){
                this.djxloadswitch=false;
                this.$vux.toast.text("没有更多数据了呦")
              }else{
                this.djxloadswitch=true;
              }
              this.djxpage++;
            }else{
              this.$vux.toast.text(res.message);
            }
          }).catch((err)=>{
              //this.$vux.toast.text(err);
          })
        }else{
          return false;
        }
      }else if(i==1){//已中断的下拉申请
        if(this.yzdloadswitch==true){
          this.yzdloadswitch=false;
          this.action({
              moduleName:"Wdyyxl",
              url:"adminapi/Bespeaks/lists",
              method:"post",
              data:
              {
                token:this.airforce.login_post.data.token,
                type:"2",
                page:this.djxpage.toString(),
                pagesize:"9",
                status:"2"
              }
          }).then((res)=>{
            if(res.code==200){
              for(let i=0;i<res.data.lists.length;i++){
                res.data.lists[i].bs="jxz";
                res.data.lists[i].forn="备注";
                this.tabs[1].list.push(res.data.lists[i]);
              }
              if(res.data.lists.length<9){
                this.yzdloadswitch=false;
                this.$vux.toast.text("没有更多数据了呦")
              }else{
                this.yzdloadswitch=true;
              }
              this.yzdpage++;
            }else{
               this.$vux.toast.text(res.message);
            }
          }).catch((err)=>{
              //this.$vux.toast.text(err);
          })
        }else{
          return false;
        }
      }else if(i==2){//已完成的下拉申请
        if(this.lsloadswitch==true){
          this.lsloadswitch=false;
          this.action({
              moduleName:"Wdyyxl",
              url:"adminapi/Bespeaks/lists",
              method:"post",
              data:
              {
                token:this.airforce.login_post.data.token,
                type:"2",
                page:this.djxpage.toString(),
                pagesize:"9",
                status:"1"
              }
          }).then((res)=>{
            if(res.code==200){
              for(let i=0;i<res.data.lists.length;i++){
                res.data.lists[i].bs="ls";
                res.data.lists[i].forn="备注";
                this.tabs[2].list.push(res.data.lists[i]);
              }
              if(res.data.lists.length<9){
                this.lsloadswitch=false;
                this.$vux.toast.text("没有更多数据了呦")
              }else{
                this.lsloadswitch=true;
              }
              this.lspage++;
            }else{
               this.$vux.toast.text(res.message);
            }
          }).catch((err)=>{
            //this.$vux.toast.text(err);
          })
        }else{
          return false;
        }
      }
    }
  },
  computed:{
    ...mapGetters(["airforce"]),
  },
  created(){
   
    //$(".content-itemtop .more").addClass('cisd');
    this.action({//页面进入初始渲染已完成列表
      moduleName:"Wdyy",
      url:"adminapi/Bespeaks/lists",
      method:"post",
      data:
      {
        token:this.airforce.login_post.data.token,
        type:"2",
        page:this.djxpage.toString(),
        pagesize:"9",
        status:"1"
      }
    }).then(res=>{
      if(res.code==200){
        for(let i=0;i<res.data.lists.length;i++){//把得到的数据循环添加属性后添加到对应的数组内
          res.data.lists[i].bs="ls";
          res.data.lists[i].forn="备注：";
          this.tabs[2].list.push(res.data.lists[i]);
        }
        if(this.tabs[2].list.length==0){//当获取完数据得到的数组长度为0时，显示没有数据
          this.tabs[2].len=true;
        }else if(res.data.lists.length<9){//当获取完数据得到的数组长度小于请求的长度时，关闭上拉加载开关
          this.lsloadswitch=false;
        }
        this.lspage++;
      }else{
        this.tabs[2].len=true;
      }
    }).catch(err=>{
        this.tabs[2].len=true;
        //this.$vux.toast.text(err);
    })

     this.action({//页面进入初始渲染已中断列表
      moduleName:"Wdyy",
      url:"adminapi/Bespeaks/lists",
      method:"post",
      data:
      {
        token:this.airforce.login_post.data.token,
        type:"2",
        page:this.yzdpage.toString(),
        pagesize:"9",
        status:"2"
      }
    }).then(res=>{
      if(res.code==200){
        for(let i=0;i<res.data.lists.length;i++){
          res.data.lists[i].bs="jxz";
          res.data.lists[i].forn="备注:";
          this.tabs[1].list.push(res.data.lists[i]);
        }
        if(this.tabs[1].list.length==0){
          this.tabs[1].len=true;
        }else if(res.data.lists.length<9){
          this.yzdloadswitch=false;
        }
        this.yzdpage++;
      }else{
        this.tabs[1].len=true;
      }
    }).catch(err=>{
        this.tabs[1].len=true;
        //this.$vux.toast.text(err);
    })

     this.action({//页面进入初始渲染待进行列表
      moduleName:"Wdyy",
      url:"adminapi/Bespeaks/lists",
      method:"post",
      data:
      {
        token:this.airforce.login_post.data.token,
        type:"2",
        page:this.lspage.toString(),
        pagesize:"9",
        status:"3"
      }
    }).then(res=>{
      if(res.code==200){  
        for(let i=0;i<res.data.lists.length;i++){
          res.data.lists[i].bs="djx";
          res.data.lists[i].forn="备注:";
          this.tabs[0].list.push(res.data.lists[i]);
        }
        if(this.tabs[0].list.length==0){
          this.tabs[0].len=true;
        }else if(res.data.lists.length<9){
          this.djxloadswitch=true;
        }
        this.djxpage++;
      }else{
        this.tabs[0].len=true;
      }
    }).catch(err=>{
      this.tabs[0].len=true;
        //this.$vux.toast.text(err);
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
.Wdyy {
  .headtab {
    position: fixed;
    left: 0;
    top: 41px;
    width: 100%;
    z-index: 10;
  }
  &/deep/ .tabcontent,.vux-slider {
    margin-top: 44px;
    overflow: visible;
    display: block;
    .vux-swiper {
       height: auto!important;
       min-height: 100% !important;
       width: 100%;
       overflow: visible;
      .vux-swiper-item {
        height: 100%;
        .tabcontent-item {//在这里
          // display: none;
          .yyitem {
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
                .infor-top {
                  overflow: hidden;
                  font-size: 14px;
                  span {
                    float: left;
                  }
                  div {
                    float: right;
                    span {
                      color: #d01716;
                    }
                  }
                }
                p {
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
                
                span {
                  font-size: 18px;
                  line-height: 88px;
                  
                }
              }
            }
            .yybtnlist {
              display: none;
              ul {
                width: 100%;
                padding-top: 10px;
                display: flex;
                justify-content: space-around;
                // display:none;
                li {
                  display: inline-block;
                  a {
                    display: block;
                  }
                  span {
                    display: block;
                    text-align: center;
                    font-size: 14px;
                  }
                  span:nth-child(1) {
                    font-size: 16px;
                  }
                }
              }
            }
          }
          .yyitem:nth-child(1){
            .yybtnlist{
              //display: block;
            }
            // .content-itemtop{
            //   .more{
            //      transform: rotate(180deg);
            //   }
            // }
          }
        }
      }
    }

    .djx {
      display: block;
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

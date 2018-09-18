<template>
  <div id="app" ref="appView">
    <loading v-model="isLoading" text="加载中..."></loading>
    <transition>
        <!-- :name="transitionName" -->
        <router-view v-if="isRouterAlive"/>
    </transition>
  </div>
</template>

<script>
import { Loading } from 'vux'
import { mapState, mapActions, mapGetters } from 'vuex'
import Hammer from 'hammerjs'
export default {
  name: 'App',
  components:{ Loading },
  data () {
      return {
          isRouterAlive: true,
          transitionName:"",
      }
  },
  methods: {
      reload () {
          this.isRouterAlive = false
          this.$nextTick(() => (this.isRouterAlive = true))
      },
      //路由返回处理(滑动屏幕操作)
      mnotWhiteListBack(event){
          var  callback = new Function();
          if(typeof event == "function"){
              callback = event;
          };
          //白名单
          const whiteList = ["Home","HousingSearch","User","Login","HousingResource","HousingDetails","Wxgl","Yygl","HtDetails","Wdzj","Message","Wdsc","Qhq","Ht","JbDetails","Article"];
          if(!whiteList.some(title=>{return title == this.airforce.layout.menuName; })){
              this.$router.back();
          }else {
              callback();
          };
      },
      //路由返回处理(返回键操作)
      notWhiteListBack(event){
          var  callback = new Function();
          if(typeof event == "function"){
              callback = event;
          };
          //白名单
          const whiteList = ["Home","HousingSearch","User","HousingSearchWorry","Login"];
          if(!whiteList.some(title=>{return title == this.airforce.layout.menuName; })){
              this.$router.back();
          }else {
              callback();
          };
      },
  },
  computed: {
      ...mapGetters(['airforce']),
      ...mapState({
          isLoading: state => state.vux.isLoading,
      })
  },
  created(){
      this.$vux._this = this;
      window.VUX = this.$vux
  },
  mounted(){
      //滑动返回上一页
      var h = new Hammer(this.$refs.appView);
      h.on('swiperight',(e) =>{
          this.mnotWhiteListBack(e);
      });


      var time = setInterval(()=>{
          //检测版本更新
          if(window.checkUpdate){
              window.checkUpdate({
                  bool:true,
                  callback:()=>{
                      this.action({
                          moduleName:"app_info",
                          goods:{
                              isNewV:true,
                          }
                      });
                      this.$vux.confirm.show({
                          title:"软件更新提示",
                          content:"【更新】优化了一些细节",
                          confirmText:"马上更新",
                          cancelText:"稍后更新",
                          onCancel:()=>{
                          },
                          onConfirm:()=> {
                              this.update = true;
                              setTimeout(()=>{
                                  this.update = false;
                              },500);
                          }
                      })
                  }
              });
              //监听安卓返回键
              if(window.backListener && window.backListener.start){
                  window.backListener.start(()=> {
                      this.notWhiteListBack(()=>{
                          if(this.confirmBack > 0){
                              plus.runtime.quit();
                              return;
                          };
                          this.$vux.toast.show({
                              text:"再次点击退出",
                              type:"text",
                              width:"auto",
                              position:"bottom",
                          });
                          this.confirmBack += 1;
                          setTimeout(()=>{
                              this.confirmBack = 0;
                          },2500);
                      });
                  });
              };
              clearInterval(time);
          }
      },200);
      setTimeout(()=>{
          clearInterval(time);
      },10000);
  },
  watch:{
    //   $route(to,from){
    //       if(to.meta.index>from.meta.index){
    //           this.transitionName = 'slide-left';
    //           console.log("前进")
    //           console.log(to.meta.index,"当前页面index")
    //       }else{
    //           this.transitionName = 'slide-right';
    //           console.log("后退")
    //           console.log(to.meta.index,"当前页面index")
    //       }
    //   }
  }
}
</script>
<style lang="less">
@import '~vux/src/styles/reset.less';
@import './assets/css/animate.min.less';
#app{
    .animated{
        -webkit-animation-fill-mode:backwards;animation-fill-mode:backwards
    }
}

@import './assets/css/publicCeset.less';
@import './assets/fonts/iconfont.css';


@font-face {
    font-family: 'iconfont';
    src: url('./assets/fonts/iconfont.eot');
    src:url('./assets/fonts/iconfont.eot?#iefix') format('embedded-opentype'),
    url('./assets/fonts/iconfont.woff') format('woff'),
    url('./assets/fonts/iconfont.ttf') format('truetype'),
    url('./assets/fonts/iconfont.svg#iconfont') format('svg');
}

// @Nb:"font_644715_jyd0soeioyfogvi";
// @font-face {
//   font-family: 'iconfont';
//   src: url('//at.alicdn.com/t/@{N b}.eot');
//   src: url('//at.alicdn.com/t/@{Nb}.eot?#iefix') format('embedded-opentype'),
//   url('//at.alicdn.com/t/@{Nb}.woff') format('woff'),
//   url('//at.alicdn.com/t/@{Nb}.ttf') format('truetype'),
//   url('//at.alicdn.com/t/@{Nb}.svg#iconfont') format('svg');
// }

.iconfont{
  font-family: 'iconfont';
}

.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
  will-change: transform;
  transition: all 500ms;
  position: absolute;
}
.slide-right-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
</style>

// 入口
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
// 引入plus封装
import '@/assets/js/plus.js'
import plusVue from "plus-vue"
Vue.use(plusVue);
// 注册过滤器
import * as filters from './filters/index'
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 页面切换loading加载动画
store.registerModule('vux', {
  state: {
    isLoading: false
  },
  mutations: {
    updateLoadingStatus (state, payload) {
      state.isLoading = payload.isLoading
    }
  }
});

router.beforeEach(function (to, from, next) {
  // 初始化Layou布局参数
  store.commit('AIRFORCE_DO', {
    data: {
      moduleName: 'layout',
      goods: _.merge({
          //头部左边内容
          left:'&#xe60a;',
          //头部左边宽度
          leftSpan:'50',
          //是否显示左边
          leftShow:true,
          //头部标题
          title: to.name || '',
          //头部标题是否动态显示，当滚动距离不等于0时候显示，默认不启用，建议配置Type字段为2时使用
          titleShowType: false,
          //头部右边内容
          right:'&#xe668;',
          //头部右边宽度
          rightSpan:'50',
          //头部右边字体大小，单位px，类型数字【建议最大值maxIndex:20,】
          rightFontSize:16,
          //头部右边字体缩放大小
          rightFontScale:1,
          //是否显示头部
          headerShow:true,
          //是否显示尾部
          footerShow:true,
          //布局视图类型
          layoutMainType:'',
          //头部类型【1-4】
          type:'1',
          //是否启用路由返回
          clickLeftBack:true,
          //头部左边点击事件(前提:clickLeftBack字段必须为false或【type字段为不存在的类型，该设置方法不推荐使用】)
          clickLeft:new Function(),
          //头部标题点击事件
          clickContent:new Function(),
          //头部右边点击事件
          clickRight:new Function(),
          //body背景颜色
          bodyColor:"#f2f0f5",
          //主菜单默认选择对象，参考尾部组件数据的name字段
          menuName:null,
          //todo ====头部索索参数（前提：头部type类型必须是【4】）====start
          //是否显示头部搜索
          searchShow:false,
          //搜索确认或回车事件
          search:new Function(),
          //搜索内容
          searchText:'',
          //todo ====================end
      }, to.meta)
    }
  });
  try {
      //重置位置
      if (window.scrollTo) {
          window.scrollTo({
              y: 0
          });
          if(document.querySelector){
              var html = document.querySelector("html");
              html.scrollTop = 0;
          }
      }

  }catch (e){}
  //设置body背景颜色
  document.body.style.backgroundColor = store.state.airforce.layout.bodyColor;
  try {
    // 写入登入数据
    if (!store.state.airforce.login_post && localStorage.login_post) {
      store.commit('AIRFORCE_DO', {
        data: {
          moduleName: 'login_post',
          goods: JSON.parse(localStorage.login_post)
        }
      })
    }
  } catch (e) {}
  // XInput数据双向绑定兼容
  store.commit('AIRFORCE_DO', {
    data: {
      moduleName: 'change',
      goods: {
        set: (e, a, moduleName) => {
            if(moduleName){
                store.commit('AIRFORCE_DO', {
                    data: {
                        moduleName: moduleName,
                        goods: _.set({}, a, e)
                    }
                })
            }else {
                store.commit('AIRFORCE_DO', {
                    data: {
                        moduleName: a,
                        goods:e
                    }
                })
            }
        }
      }
    }
  })
  // 显示加载动画
  store.commit('updateLoadingStatus', {isLoading: true})
  // 白名单路由
  const whiteList = ['/Login', '/Register', '/ForgetPwd','/AccountAppeal']
  // 判断是否登陆及相关跳转
  if (store.state.airforce.login_post && store.state.airforce.login_post.code == 200) {
    if (to.path === '/Login') { // 已登陆时自动跳转首页
        next('/')
    } else {
        next() // 直接进入
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
    //重定向页面配置重写
      store.commit('AIRFORCE_DO', {
          data: {
              moduleName: 'layout',
              goods:from.meta
          }
      });
      //关闭加载
      store.commit('updateLoadingStatus', {isLoading: false})
      next('/Login'); // 否则全部重定向到登录页
    }
  }
})

router.afterEach(function (to) {
  // 隐藏加载动画
    store.commit('updateLoadingStatus', {isLoading: false})
})

Vue.config.productionTip = false
// 弹出层引入
import { AlertPlugin, ToastPlugin, ConfirmPlugin, DatetimePlugin, LoadingPlugin  } from 'vux'
Vue.use(AlertPlugin)
Vue.use(ToastPlugin)
Vue.use(ConfirmPlugin)
Vue.use(DatetimePlugin)
Vue.use(LoadingPlugin)


//utilts工具引入
import UtilsPlugin from "./utils/index"
Vue.use(UtilsPlugin)
  
Vue.use(router)
/* 实例化 */
// const plusList = ['/Home']
new Vue({
  el: '#app',
  router,
  store,
    data(){return {a:2}},
  components: { App },
  template: '<App/>',
  // computed:{
  //   wrouter(){
  //     return this.$route.path;
  //   }
  // },
  // watch:{
  //   wrouter(val){
  //     for(let i=0;i<plusList.length;i++){
  //       if(val==plusList[i]){
  //         doc.addEventListener('plusready', plusReady, false);
  //       }else{
  //         return false;
  //       }
  //     }
  //   }
  // }
})
//
// function goback(){
//   Vue.$router.back();
// }
// console.log(document.startBack)
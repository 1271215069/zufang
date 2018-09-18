import Vue from 'vue'
import Router from 'vue-router'

import utils from '@/utils/utils.js'

Vue.use(Router);

export default new Router({
    routes: [
        // { path: '/', redirect: 'Register'},
        // todo Dome
        utils.importVueInit('Dome/Dome','/Dome','Dome'),

        utils.importVueInit({
            name: 'Layout/Layout',
            path: '/',
            component: require("@/views/Layout/Layout.vue").default,
            redirect: '/Home',
            children: [
                // todo 登陆
                utils.importVueInit('Login/Login','/Login','登录',{
                    meta:{
                        footerShow:false,
                        headerShow:false,
                        menuName:'Login'
                    }
                }),
                // todo 注册
                utils.importVueInit('Login/Register','/Register','注册',{
                    meta:{
                        type:'3',
                        footerShow:false,
                    }
                }),
                // todo 忘记密码
                utils.importVueInit('Login/ForgetPwd','/ForgetPwd','重置密码',{
                    meta:{
                        type:'3',
                        footerShow:false,
                    }
                }),
                // todo 账号申诉
                utils.importVueInit('Login/AccountAppeal','/AccountAppeal','账号申诉',{
                    meta:{
                        type:'3',
                        footerShow:false,
                    }
                }),
                // todo 首页
                utils.importVueInit('Home/Home','/Home','首页',{
                    meta:{
                        type:'5',
                        left:'&#xe633;',
                        title:"位置&#xe628;",
                        menuName:'Home'
                    }
                }),
                //文章详情
                utils.importVueInit('Home/Wzxq','/Wzxq','详情',{
                    meta:{
                        //type:'2',
                        //left:'&#xe633;',
                        //title:"位置&#xe628;",
                        //menuName:'Home'
                        right:"",
                        footerShow:false,
                    }
                }),

                //todo 房源管理
                utils.importVueInit('Housing/HousingResource','/HousingResource','房源管理',{
                    meta:{
                        right:'新增房源',
                        rightSpan:'100',
                        leftSpan:'100',
                        footerShow:false,
                        menuName:'HousingResource',
                    }
                }),
                utils.importVueInit('Housing/Zyzl','/Zyzl','租约总览',{
                    meta:{
                        right:'',
                        footerShow:false,
                        menuName:'Zyzl',
                    }
                }),
                utils.importVueInit('Housing/Zjxx','/Zjxx','租金信息',{
                    meta:{
                        right:'',
                        footerShow:false,
                        menuName:'Zjxx',
                    }
                }),
                //todo 房源搜索
                utils.importVueInit('Housing/HousingSearch','/HousingSearch','房源搜索',{
                    meta:{
                        menuName:'HousingSearch',
                        type:'4',
                        left:'',
                        right:""
                    }
                }),
                 //todo 急租大厅
                 utils.importVueInit('Housing/HousingSearchWorry','/HousingSearchWorry','竞标大厅',{
                    meta:{

                        menuName:'HousingSearch',
                        //type:'4',
                        left:'',
                        right:"",
                        menuName:"HousingSearchWorry"
                    }
                }),
                //todo 房源详情
                utils.importVueInit('Housing/HousingDetails','/HousingDetails','房源详情',{
                    meta:{
                        type:'2',
                        footerShow:false,
                        titleShowType:true,
                        menuName:'HousingDetails',
                        
                    }
                }),
                //todo 房源竞价
                utils.importVueInit('Housing/HousingDetailsWorry','/HousingDetailsWorry','房源竞价',{
                    meta:{
                        type:'2',
                        footerShow:false,
                        titleShowType:true,
                        menuName:'HousingDetails',
                    }
                }),
                //todo 房源修改
                utils.importVueInit('Housing/HousingEditor','/HousingEditor','房源修改',{
                    meta:{
                        footerShow:false,
                        right:'',
                    }
                }),
                //todo 申请入驻
                utils.importVueInit('Housing/ApplyEntering','/ApplyEntering','申请入驻',{
                    meta:{
                        footerShow:false,
                        right:''
                    }
                }),
                //todo 新增房源
                utils.importVueInit('Housing/HousingAddFocus','/HousingAddFocus','新增房源',{
                    meta:{
                        footerShow:false,
                        right:'',
                    }
                }),
                //todo 新增独立房源
                utils.importVueInit('Housing/HousingAddScatter','/HousingAddScatter','新增独立房源',{
                    meta:{
                        footerShow:false,
                        right:'',
                    }
                }),
                //合同消息详情
                utils.importVueInit('Message/HtDetails','/HtDetails','确认合同',{
                    meta:{
                        right:'',
                        footerShow:false,
                        menuName:"HtDetails"
                    }
                }),
                //todo 消息列表
                utils.importVueInit('Message/Message','/Message','消息列表',{
                    meta:{
                        footerShow:false,
                        right:'',
                        menuName:'Message',
                    }
                }),
                //todo 消息详情
                utils.importVueInit('Message/MessageDetails','/MessageDetails','消息详情',{
                    meta:{
                        footerShow:false,
                        right:'',
                    }
                }),
                utils.importVueInit('Message/JbDetails','/JbDetails','竞标详情',{
                    meta:{
                        footerShow:false,
                        right:'',
                        menuName:"JbDetails"
                    }
                }),
                //todo 预约详情
                utils.importVueInit('Message/BookingDetails','/BookingDetails','预约查看',{
                    meta:{
                        footerShow:false,
                        type:'2',
                        right:''
                    }
                }),
                //收租
                utils.importVueInit('Rents/Rents','/Rents','收租',{
                    meta:{
                        menuName:'Rents',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('Rents/Wdzj','/Wdzj','我的租金',{
                    meta:{
                        right:'',
                        footerShow:false,
                        menuName:'Wdzj',
                    }
                }),
                utils.importVueInit('Rents/Tx','/Tx','提现',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('Rents/Xzyhk','/Xzyhk','选择银行卡',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                //todo 个人中心
                utils.importVueInit('User/User','/User','个人中心',{
                    meta:{
                        type:'2',
                        menuName:'User',
                        index:1,
                        leftShow:false,
                        //leftSpan:"0",
                        
                    }
                }),
                utils.importVueInit('User/Wxxq','/Wxxq','维修详情',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Wxsq','/Wxsq','维修申请',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Jsgl','/Jsgl','角色管理',{
                    meta:{
                        right:'&#xe6b9;',
                        rightFontSize:20,
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Addjs','/Addjs','添加角色',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Zhgl','/Zhgl','租户管理',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Wxgl','/Wxgl','维修管理',{
                    meta:{
                         right:'',
                        footerShow:false,
                        menuName:"Wxgl"
                    }
                }),
                utils.importVueInit('User/Yygl','/Yygl','预约管理',{
                    meta:{
                        footerShow:false,
                        menuName:"Yygl"
                    }
                }),
                utils.importVueInit('User/Wdyy','/Wdyy','我的预约',{
                    meta:{
                         right:'',
                        footerShow:false,
                        menuName:"Wdyy"
                    }
                }),
                utils.importVueInit('User/Ht','/Ht','编辑合同',{
                    meta:{
                         right:'',
                        footerShow:false,
                        menuName:"Ht"
                    }
                }),
                utils.importVueInit('User/Yyxq','/Yyxq','预约详情',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Wdyhk','/Wdyhk','我的银行卡',{
                    meta:{
                        right:'&#xe6b9;',
                        rightFontSize:20,
                        footerShow:false,
                        index:2
                    }
                }),
                utils.importVueInit('User/Addyhk','/Addyhk','添加银行卡',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Sz','/Sz','设置',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Xgmm','/Xgmm','修改密码',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/About','/About','关于',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Wdsc','/Wdsc','我的收藏',{
                    meta:{
                        right:'',
                        footerShow:false,
                        menuName:"Wdsc"
                    }
                }),
                utils.importVueInit('User/Xgzl','/Xgzl','完善资料',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Jd','/Jd','租房借贷',{
                    meta:{
                        right:'修改资料',
                        rightFontSize:14,
                        rightSpan:"100",
                        leftSpan:"100",
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Edsz','/Edsz','额度设置',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Jq','/Jq','借钱',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Wszl','/Wszl','完善借贷资料',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Zmh','/Zmh','怎么还',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('User/Qhq','/Qhq','去还钱',{
                    meta:{
                        right:'',
                        footerShow:false,
                        menuName:"Qhq"
                    }
                }),
                utils.importVueInit('User/try','/try','签名',{
                    meta:{
                        right:'',
                        footerShow:false,
                    }
                }),
                utils.importVueInit('Dome/Article','/Article','信息中心',{
                    meta:{
                        right:'',
                        leftShow:false,
                        menuName:"Article"
                    }
                }),
            ]
        }),
    ]
})

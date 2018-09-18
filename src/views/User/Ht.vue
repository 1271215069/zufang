<template>
    <div class="ht animated fadeIn">
        <div class="htcontent" ref="htcontent" >
            <p class="title">个人租房合同</p>
            <p>出租方：（以下简称甲方）{{htdata.o_name}}</p>
            <p>承租方：（以下简称乙方）{{htdata.bdname}}</p>
            <p>甲、乙双方就房屋租赁事宜，达成如下协议：</p>
            <p>一、甲方将位于{{dzcode | location}}{{room_number}}室的房屋出租给乙方居住使用，租赁期限自
                <input type="text" @change.prevent="getendtime" v-model="startyear">年<input type="text" @change.prevent="getendtime" v-model="startmonth">月<input type="text" @change.prevent="getendtime" v-model="startday">日 至 {{endday}} ，计{{htdata.lease_time}}个月。</p>
            <p>二、本房屋月租金为人民币{{htdata.pice}}元，按月结算，每月{{startday}}日，乙方向甲方支付{{htdata.pice}}全月租金。</p>
            <p>三、乙方租赁期间，水费、电费、取暖费、燃气费、电话费、物业费以及其它由乙方居住而产生的费用由乙方负担。租赁结束时，乙方须交清欠费。</p>
            <p>五、房屋租赁期为，从 {{startyear}}年{{startmonth}}月{{startday}}日 至 {{endday}} 。在此期间，任何一方要求终止合同，须提前三个月通知对方，并偿付对方{{htdata.yajin}}的违约金；如果甲方转让该房屋，乙方有优先购买权。</p>
            <p>六、因租用该房屋所发生的除土地费、大修费以外的其它费用，由乙方承担。</p>
            <p>七、在承租期间，未经甲方同意，乙方无权转租或转借该房屋不得改变房屋结构及其用途，由于乙方人为原因造成该房屋及其配套设施损坏的，由乙方承担赔偿责任。</p>
            <p>八、甲方保证该房屋无产权纠纷;乙方因经营需要，要求甲方提供房屋产权证明或其它有关证明材料的，甲方应予以协助。</p>
            <p>九、就本合同发生纠纷，双方协商解决，协商不成，任何一方均有权向天津开发区人民法院提起诉讼，请求司法解决。</p>
            <p>十、本合同连一式2份，甲、乙双方各执1份，自双方签字之日起生效。</p>
            <p>甲方：{{htdata.o_name}}</p>
            <p>电话：{{htdata.o_phone}}</p>
            <p>身份证：{{htdata.id_card}}</p>
            <p>乙方：<span @click.prevent="showpop" v-if="haveqm" class="qmbtn">点击签名</span></p>
            <div class="yulan" v-if="!haveqm">
                <img :src="url">
            </div>
            <p>电话：{{htdata.bdphone}}</p>
            <p>身份证：{{htdata.bdid_card}}</p>
            <button class="save" @click.prevent="sendht">保存并发送合同申请</button>
        </div>
        <release-box v-model="releaseBoxShow" type="custom" class="qm">
            <p class="cantitle">请在黑色边框内签名</p>
            <canvas id="canvas" ref="cans" width="286" height="300" style="border:1px solid black">Canvas画板</canvas>
            <div class="btnlist">
                <button id="clearCanvas" @click.prevent="clear">清除</button>
                <button id="saveCanvas" @click.prevent="saveqm">保存签名</button>
            </div>
        </release-box>
    </div>
</template>
<script>

    var draw;
    var preHandler = function(e){e.preventDefault();}
    class Draw {
        constructor(el){
            this.el = el
            this.canvas = document.getElementById(this.el)
            this.cxt = this.canvas.getContext('2d')
            this.stage_info = {}
            this.path = {
                beginX: 0,
                beginY: 0,
            }
        }
        init(btn) {
            var that = this; 
            this.canvas.addEventListener('touchstart', function(event) {
                document.addEventListener('touchstart', preHandler, false); 
                that.drawBegin(event)
            })
            this.canvas.addEventListener('touchend', function(event) { 
                document.addEventListener('touchend', preHandler, false); 
                that.drawEnd()
                
            })
            this.clear(btn)
        }
        drawBegin(e){
            e.stopPropagation();
            this.stage_info.left = e.touches[0].clientX ;
            this.stage_info.top =  e.touches[0].clientY ; 
            this.stage_info.bool = true;
            var that = this;
            canvas.addEventListener("touchmove",function(ev){
                that.path.beginX = ev.touches[0].clientX - that.canvas.getBoundingClientRect().x;
                that.path.beginY = ev.touches[0].clientY - that.canvas.getBoundingClientRect().y ;
                if(that.stage_info.bool){
                    that.cxt.strokeStyle = "#000"
                    that.cxt.beginPath()
                    that.cxt.moveTo(
                        that.stage_info.left - that.canvas.getBoundingClientRect().x,
                        that.stage_info.top - that.canvas.getBoundingClientRect().y,
                    )
                    that.stage_info.bool = false;
                }else{
                    that.drawing(event)
                }
            })
        }
        drawing(e) {
            e.stopPropagation();
            this.cxt.lineTo(this.path.beginX,this.path.beginY)
            this.cxt.stroke()
        }
        drawEnd() {
            document.removeEventListener('touchstart', preHandler, false); 
            document.removeEventListener('touchend', preHandler, false);
            document.removeEventListener('touchmove', preHandler, false);
            //canvas.ontouchmove = canvas.ontouchend = null
        }
        clear(btn) {
            this.cxt.clearRect(0, 0, 300, 300)
        }
        save(){
            return canvas.toDataURL("image/png")
        }
    }
    function bodyScroll(event){  
        event.preventDefault();  
    } 


import { ReleaseBox } from  "@/components"
import { mapActions, mapGetters } from 'vuex'
import { setTimeout } from 'timers';
export default {
    name:"ht",
    data(){
        return{
            releaseBoxShow:false,
            startyear:"",
            startmonth:"",
            startday:"",
            endday:"",
            dzcode:{},
            room_number:"",
            htdata:{},
            url:"",
            haveqm:true,
            rent_end_date:"",//XXXX-XX-XX格式的结束时间
        }
    },
    components:{
        ReleaseBox,
    },
    methods:{
        ...mapActions(['action']),
        
        showpop(){//显示弹窗
            this.releaseBoxShow=true;
            let that =this;
            // event.preventDefault();
            
            setTimeout(()=>{
                console.log("123")
                console.log(document.getElementById("canvas"))
                draw = new Draw('canvas');
                draw.init();
            },1000)
        },
        getNextMonth(date) {  //获取下一个月
            var arr = date.split('-');
            var year = arr[0]; //获取当前日期的年份  
            var month = arr[1]; //获取当前日期的月份  
            var day = arr[2]; //获取当前日期的日  
            var days = new Date(year, month, 0);  
            days = days.getDate(); //获取当前日期中的月的天数  
            var year2 = year;  
            var month2 = parseInt(month) + 1;  
            if (month2 == 13) {  
                year2 = parseInt(year2) + 1;  
                month2 = 1;  
            }  
            var day2 = day;  
            var days2 = new Date(year2, month2, 0);  
            days2 = days2.getDate();  
            if (day2 > days2) {  
                day2 = days2;  
            }  
            if (month2 < 10) {  
                month2 = '0' + month2;  
            }  
          
            var t2 = year2 + '-' + month2 + '-' + day2 + "-";  
            return t2;  
        },
        getendtime(){//获取结束时间
            if(this.startyear==""||this.startmonth==""||this.startday==""){
                this.endday=" 年 月 日"
            }else{
                let stryear=parseInt(this.startyear);
                let strmonth=parseInt(this.startmonth);
                let strday=parseInt(this.startday);
                let starttime=stryear+"-"+strmonth+"-"+strday;
                let zstime=starttime;
                for(let i=0;i<this.htdata.lease_time;i++){
                    zstime=this.getNextMonth(zstime)
                }
                let arr= zstime.split('-');  
                this.rent_end_date=zstime;
                this.endday=arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
            }
        },
        clear(){
            draw.clear();
        },
        saveqm(){
            var data=draw.save();
            if(data=="data:image/png;base64,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"){
                this.$vux.toast.text("签名不能为空");
                return false;
            }
            this.url = data;
            this.releaseBoxShow=false;
            this.haveqm=false;
        },
        mutate(word) {
            this.$emit("input", word);
        },
        sendht(){//发送合同的方法
            if(this.startyear==""||this.startmonth==""||this.startday==""){
                this.$vux.toast.text("请先输入起租日期");
                return false;
            }
            if(this.url==""){
                this.$vux.toast.text("请在下方签名");
                return false;
            }
            let senddata={
                token:this.airforce.login_post.data.token,
                rent_start_date:this.startyear+"-"+this.startmonth+"-"+this.startday,
                rent_end_date:this.rent_end_date,
                sign:this.url,
                r_id:this.$route.query.id
            }
            this.action({
                moduleName:"create_leases",
                url:"/adminapi/leases/create",
                method:"post",
                data:senddata
            }).then((res)=>{
                if(res.code==200){
                    this.$vux.toast.text(res.message)
                    this.$router.back();
                    //this.$vux.toast.text("已发送申请")
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})
        },
        stopDefault(e) {// 阻止默认浏览器动作(W3C)
            if (e&&e.preventDefault){
                e.preventDefault();
            }else{// IE中阻止函数器默认动作的方式
                window.event.returnValue=false;
            }
        }
    },
    mounted(){

    },
    computed:{
         ...mapGetters(['airforce']),
         watchreleaseBoxShow(){
             return this.releaseBoxShow;
         }
    },
    watch:{
        watchreleaseBoxShow(val){
            if(val==true){
                console.log("888")
                document.body.addEventListener('touchmove',bodyScroll,false);
                document.getElementsByClassName("ht")[0]. classList.remove("yep")
                document.getElementsByClassName("ht")[0]. classList.add("nop") 
            }else{
                console.log("999")
                document.body.removeEventListener('touchmove',bodyScroll,false); 
                document.getElementsByClassName("ht")[0]. classList.remove("nop")
                document.getElementsByClassName("ht")[0]. classList.add("yep")   
                    
            }
        }
    },
    created(){
        let cs;
        this.dzcode={
            citycode:this.$route.query.citycode,
            areacode:this.$route.query.areacode,
            district:this.$route.query.district,
            address:this.$route.query.address
        }
        this.room_number=this.$route.query.room_number;
        this.action({
            moduleName:'HousingDetails_get',
            url:'adminapi/room/index',
            method:'post',
            data:{
                token:this.airforce.login_post.data.token,
                id:this.$route.query.id,
            }
        }).then((res)=>{
            if(res.code==200){
                this.htdata=res.data;
                this.htdata.bdid_card=this.airforce.login_post.data.id_card;
                this.htdata.bdname=this.airforce.login_post.data.name;
                this.htdata.bdphone=this.airforce.login_post.data.phone;
                cs=res.data.lease_time;
            }else{
                this.$vux.toast.text(res.message)
            }
        }).catch((err)=>{})

        if(this.startyear==""||this.startmonth==""||this.startday==""){
            this.endday=" 年 月 日"
        }else{
            let stryear=parseInt(this.startyear);
            let strmonth=parseInt(this.startmonth);
            let strday=parseInt(this.startday);
            let starttime=stryear+"-"+strmonth+"-"+strday;
            let zstime=starttime;
            for(let i=0;i<cs;i++){
                zstime=this.getNextMonth(zstime)
            }
            let arr= zstime.split('-');  
            this.endday=arr[0]+'年'+arr[1]+'月'+arr[2]+'日';
        }
    }
}
</script>

<style lang="less" scoped>
.yep{
    position: initial;
    height: auto;
}
.nop{
    position: fixed;
    width: 100%;
}
.ht{
    padding: 15px 20px;
    
    p{
        text-indent:24px;
        font-size: 14px; 
        .qmbtn{
            color: red;
        }
        input{
            width: 20%;
            text-align: right;
            border: none;
            padding-right: 5%;
        }   
        .yulan{
            width: 100%;
            img{
                display: block;
                width: 100%;
                margin: 0 auto;
            }
        }
    }
    .title{
        margin-bottom: 20px;
        font-size: 20px; 
        text-align: center;
        font-weight: 600;
    }
    .save,.save:focus{
        display: block;
        width: 80%;
        border: none;
        outline: none;
        background: #1b82d2;
        color: #fff;
        font-size: 16px;
        line-height: 35px;
        border-radius: 17px;
        margin: 20px auto;
    }
    .qm{
        .cantitle{
            text-align: center;
            font-size: 18px;
        }
        #canvas{
            display: block;
            margin: 0 auto;
            margin-top: 15px;
        }
        .btnlist{
            display: flex;
            justify-content: space-around;
            padding-top: 15px;
            padding-bottom: 15px;
            button,button:focus{
                width: 25%;
                font-size: 16px;
                line-height: 30px;
                border-radius: 15px;
                background: #1b82d2;
                color: #fff;
                border: none;
                outline: none;
            }
        }
    }
    
}
</style>

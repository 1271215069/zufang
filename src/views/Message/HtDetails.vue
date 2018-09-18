<template>
    <div class="HtDetails animated fadeIn">
        <p class="title">个人租房合同</p>
        <p>出租方：（以下简称甲方）{{htdata.owner_name}}</p>
        <p>承租方：（以下简称乙方）{{htdata.name}}</p>
        <p>甲、乙双方就房屋租赁事宜，达成如下协议：</p>
        <p>一、甲方将位于 室的房屋出租给乙方居住使用，租赁期限自{{htdata.rent_start_date}}至{{htdata.rent_end_date}}，计{{htdata.lease_time}}个月。</p>
        <p>二、本房屋月租金为人民币{{htdata.monthly_rent}}元，按月结算，每月{{htdata.day}}日，乙方向甲方支付{{htdata.monthly_rent}}元全月租金。</p>
        <p>三、乙方租赁期间，水费、电费、取暖费、燃气费、电话费、物业费以及其它由乙方居住而产生的费用由乙方负担。租赁结束时，乙方须交清欠费。</p>
        <p>五、房屋租赁期为，从{{htdata.rent_start_date}}至{{htdata.rent_end_date}}。在此期间，任何一方要求终止合同，须提前三个月通知对方，并偿付对方{{htdata.price}}元的违约金；如果甲方转让该房屋，乙方有优先购买权。</p>
        <p>六、因租用该房屋所发生的除土地费、大修费以外的其它费用，由乙方承担。</p>
        <p>七、在承租期间，未经甲方同意，乙方无权转租或转借该房屋不得改变房屋结构及其用途，由于乙方人为原因造成该房屋及其配套设施损坏的，由乙方承担赔偿责任。</p>
        <p>八、甲方保证该房屋无产权纠纷;乙方因经营需要，要求甲方提供房屋产权证明或其它有关证明材料的，甲方应予以协助。</p>
        <p>九、就本合同发生纠纷，双方协商解决，协商不成，任何一方均有权向天津开发区人民法院提起诉讼，请求司法解决。</p>
        <p>十、本合同连一式2份，甲、乙双方各执1份，自双方签字之日起生效。</p>
        <p>甲方： {{htdata.owner_name}}</p>
        <p>电话： {{htdata.owner_phone}} </p>
        <p>身份证：{{htdata.l_card}} </p>
        <p>乙方： </p>
        <div>
            <img :src="htdata.sign" alt="">
        </div>
        <p>电话：{{htdata.phone}}</p>
        <p>身份证：{{htdata.id_card}}</p>
        <button v-if="htdata.flag" class="btn" @click.prevent="sureht">确认并生成订单(发送至租户支付)</button>
        <button v-else class="btn">已确认租约</button>
        <p class="sub">确认租约后生成订单等待租户支付</p>
    </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
    name:"HtDetails",
    data(){
        return{
            htdata:{},
        }
    },
    components:{

    },
    methods:{
        ...mapActions(['action']), 
        changesta(t){//改变信息是否已读状态的方法
            this.action({
                moduleName:'recodDetail',
                url:'/adminapi/member/recodDetail',
                method:"post",
                data:{
                    token:this.airforce.login_post.data.token,
                    id:t,
                }
            }).then((res)=>{
                
            }).catch((err)=>{
                this.$vux.toast.text(err)
            })
        },
        timestampToTime(timestamp) {//将时间错转换成日期格式的方法
            var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear();
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
            let D = date.getDate();
            return Y+"年"+M+"月"+D+"日";
        },
        getday(timestamp){//获取日期
            var date = new Date(timestamp * 1000);
            let D = date.getDate();
            return D;
        },
        sureht(){
            this.action({
                moduleName:'Ht_leaseConfirm',
                url:'adminapi/leases/leaseConfirm',
                method:"post",
                data:{
                    token:this.airforce.login_post.data.token,
                    id:this.htdata.l_id,
                }
            }).then((res)=>{
                if(res.code==200){
                    this.htdata.flag=false;
                    this.$vux.toast.text(res.message)
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})
        }
    },
    computed:{
        ...mapGetters(['airforce']),
    },
    created(){
        if(this.$route.query.from=="zyzl"){
             this.action({
                moduleName:'Ht_leaseDetail',
                url:'adminapi/leases/leaseDetail',
                method:"post",
                data:{
                    token:this.airforce.login_post.data.token,
                    id:this.$route.query.id,
                }
            }).then((res)=>{
                if(res.code==200){
                    console.log(res) 
                    res.data.day=this.getday(parseInt(res.data.rent_start_date));
                    res.data.rent_start_date=this.timestampToTime(parseInt(res.data.rent_start_date));
                    res.data.rent_end_date=this.timestampToTime(parseInt(res.data.rent_end_date));
                    res.data.flag=false;
                    this.htdata=res.data;
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})
        }else{
            this.changesta(this.$route.query.id);
            this.action({
                moduleName:'Ht_leaseDetail',
                url:'adminapi/leases/leaseDetail',
                method:"post",
                data:{
                    token:this.airforce.login_post.data.token,
                    record_id:this.$route.query.id,
                }
            }).then((res)=>{
                if(res.code==200){
                    res.data.day=this.getday(parseInt(res.data.rent_start_date));
                    res.data.rent_start_date=this.timestampToTime(parseInt(res.data.rent_start_date));
                    res.data.rent_end_date=this.timestampToTime(parseInt(res.data.rent_end_date));
                    switch(res.data.flag){
                        case "0"://租约未确认的情况
                            res.data.flag=true;
                            break;
                        default:
                            res.data.flag=false;
                            break;
                    };
                    this.htdata=res.data;
                }else{
                    this.$vux.toast.text(res.message)
                }
            }).catch((err)=>{})
        }
        
    }
}
</script>
<style lang="less" scoped>
.HtDetails{
    padding: 15px 20px;
    background: #fff;
    p{
        text-indent:24px;
        font-size: 14px; 
    }
    .title{
        margin-bottom: 20px;
        font-size: 20px; 
        text-align: center;
        font-weight: 600;
    }
    .btn,.btn:focus{
        border: none;
        outline:none;
        display: block;
        margin: 0 auto;
        margin-top: 20px;
        margin-bottom: 5px;
        width: 90%;
        background: #1b82d2;
        color: #fff;
        font-size: 16px;
        line-height: 28px;
        border-radius: 14px;
    }
    .sub{
        color: #a9a7ab;
        font-size: 14px;
    }
}
</style>

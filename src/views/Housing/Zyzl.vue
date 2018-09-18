<template>
    <div class="zyzl animated fadeIn">
        <cell-box class="htitem" v-for="(item,index) in listdata" :key="index" is-link :link='"/HtDetails?id="+item.id+"&citycode="+item.citycode+"&areacode="+item.areacode+"&district="+item.district+"&address="+item.address+"&room_number="+item.room_number+"&from=zyzl"'>
            <p>
                <span>租户：{{item.owner_name}}</span>
                <span>出租时长：{{item.lease_time}}个月</span>
            </p>
            <p>起租日期：{{item.rent_start_date}}</p>
            <p>结束日期：{{item.rent_end_date}}</p>
            <p>租约状态：{{item.flag}}</p>
        </cell-box>
    </div>
</template>
<script>
import {CellBox, Flexbox, FlexboxItem } from "vux"
import {mapActions, mapGetters } from 'vuex'
export default {
    name:"zyzl",
    data(){
        return{
           listdata:[], 
        }
    },
    components:{
        CellBox,
        Flexbox,
        FlexboxItem,
    },
    methods:{
        ...mapActions(['action']),
        timestampToTime(timestamp) {//将时间错转换成日期格式的方法
            var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
            let Y = date.getFullYear();
            let M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) ;
            let D = date.getDate();
            return Y+"年"+M+"月"+D+"日";
        },
    },
    computed:{
        ...mapGetters(['airforce']),
    },
    created(){
        this.action({
            moduleName:'leaseslists',
            url:'adminapi/leases/leaseslists',
            method:"post",
            data:{
                token:this.airforce.login_post.data.token,
                id:this.$route.query.id,
            }
        }).then((res)=>{
            if(res.code==200){
                for(let i=0;i<res.data.length;i++){
                    if(res.data[i].flag=='0'){
                        res.data.splice(i,1)
                    }
                    res.data[i].rent_start_date=this.timestampToTime(parseInt(res.data[i].rent_start_date));
                    res.data[i].rent_end_date=this.timestampToTime(parseInt(res.data[i].rent_end_date));
                    switch(res.data[i].flag){
                        case "1":
                            res.data[i].flag="生效中";
                            break;
                        case "2":
                            res.data[i].flag="已完成";
                            break;
                        default:
                            res.data[i].flag="未知";
                            break;
                    }
                } 
                this.listdata=res.data;
                console.log(this.listdata)
            }else{
                this.$vux.toast.text(res.message)
            }
        }).catch((err)=>{})
    }
}
</script>
<style lang="less" scoped>
.zyzl{
    .htitem{
        display: block;
        background: #fff;
        // padding: 15px;
        p{
            font-size: 14px;
            overflow: hidden;
            span{
                width: 50%;
                float: left;
            }
        }
    }
}
</style>

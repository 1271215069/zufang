<template>
  <div class="list">
      <div class="message-item">
            <p class="title">御景水岸花园</p>
            <cell-box class="message-item-con">
                <div class="left"> 
                    <img src="" alt="">
                </div>
                <div class="right">
                    <p>第1层102</p>
                    <p>租金为：<span>￥100.0</span> </p>
                </div>
            </cell-box>
        </div>
  </div>
</template>

<script>
import {CellBox} from "vux"
import { mapGetters, mapActions } from 'vuex'
export default {
  data () {
    return {
      
    }
  },
  components:{
     CellBox
  },
  methods:{
    ...mapActions(["action"]),
  },
  computed:{
    ...mapGetters(["airforce"]),
  },
  created(){
      this.action({

      })
  } 
} 
</script>
 
 <style lang="less" scoped>
 .list{
     background: #fff;
     .message-item{
         .title{
             padding: 10px 15px;
         }
         .message-item-con{
             .left{
                 width: 30%;
                 img{
                    display: block;
                    width: 54px;
                    height: 54px;
                    margin: 0 auto;
                 }
             }
             .right{

             }
         }
     }
 }
 </style>
 
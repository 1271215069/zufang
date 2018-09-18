<template>
    <div class="zjxx">

    </div>
</template>
<script>
import {mapActions, mapGetters} from "vuex"
export default {
    name:"zjxx",
    data(){
        return{

        }
    },
    components:{

    },
    methods:{
        ...mapActions(['action']),  
    },
    computed:{
        ...mapGetters(['airforce']),
    },
    created(){

    }
}
</script>
<style lang="less" scoped>
.zjxx{

}
</style>

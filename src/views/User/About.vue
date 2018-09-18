<template>
	<div class="about animated fadeIn">
		<x-img :src="logo" class="logo"></x-img>
		<div class="version">版本号 {{bbnum}}</div>
		<group gutter="0">
			<cell-box is-link @click.native="goAbout">检测更新<badge v-if="iconshow" text="new" class="aboutBadge"></badge></cell-box>
			<!-- <badge v-if="this.airforce.app_info.isNewV" text="new" class="aboutBadge"></badge> -->
		</group>
        <check-update :update="update"></check-update>
		<!-- <p>atry为{{atry}}</p> -->
		<p class="bq">版权所有：宁波力拓信息科技有限公司</p>
	</div>
</template>

<script>
	
	import { Group, Cell, CellBox, XImg, Badge } from 'vux'
	import CheckUpdate from '@/components/CheckUpdate.vue'
	import { mapActions, mapGetters } from 'vuex'
	export default {
		name: 'about',
		...mapActions,
		computed: mapGetters({
			airforce: 'airforce'
		}),
		data() {
			return {
				logo:require("@/assets/img/Login/logo.png"),
				update:false,
				atry:"",
				bbnum:"",
				iconshow:true,
			}
		},
		methods: {
			...mapActions(['action']),
            goAbout(){
                this.update = true;
                setTimeout(()=>{
                    this.update = false;
                },500)
			}
		},
		components: {
			Group,
			Cell,
			CellBox,
            XImg,
            Badge,
            CheckUpdate
		},
		mounted() {
			//this.atry=window.getWgtVer;
			try{
				if(window.plus && window.getWgtVer){
					window.getWgtVer((info) => {
						this.atry=info;
						this.action({
							moduleName:'app_info',
							goods:info,
						})
					})
				}
				if(this.airforce.app_info.version){
					this.bbnum=airforce.app_info.version
					
				}else{
					this.bbnum="0.0.1"
					
				}
				if(this.airforce.app_info.isNewV){
					this.iconshow=true;
				}else{
					this.iconshow=false;
				}
				
			}catch(e){
				this.bbnum="0.0.1"
				this.iconshow=false;
			}
			
			
		}
	}
</script>

<style scoped lang="less">
	.about{
		margin-top: 50px;
		height: 100%;
		.logo{
			width: 50px;
			margin: auto;
			display: block;
			margin-bottom: 10px;
		}
		.version{
			text-align: center;
			margin-bottom: 30px;
		}
        .aboutBadge{
            margin-left: 10px;
		}
		.bq{
			position: fixed;
			bottom:0;
			width: 100%;
			text-align: center;
			padding-bottom: 15px;
			color: rgb(169, 167, 171);
		}
	}
</style>
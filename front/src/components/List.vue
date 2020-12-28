<template>
    <div class="online bg3" style="width:7rem;">
		<div v-for="(v, k) in onlineList" :class="[v.active?'active':'', 'online-item']" @click="onClick(k, v)">
			<div class="" style="over-flow:hidden;">
				<span style="font-size:0.8rem;color:#888;" :class="v.sysIcon"></span>
				<span class="" style="font-size:0.6rem;line-height:0.8rem;">{{v.ip}}</span>
			</div>
			<div class="" style="font-size:0.5rem"><span>{{v.os}}</span></div>
		</div>
	</div>
</template>

<script>
export default {
    name: 'UserInfo',
    props: {
    },
    components:{},
    data() {
        return {
			nowSelected:'',
			onlineList:{}
        }
    },
	mounted:function(){
		var self = this;
		RUNKIT.VoimBus.subscribe('public', (topic, res)=>{
			if('showPage' == res.type){
				if(res.data.name == 'dash'){
					if(typeof(this.onlineList[this.nowSelected]) != 'undefined')
						this.onlineList[this.nowSelected].active = 0;
				}
			}
		});
		RUNKIT.VoimBus.subscribe('online', (topic, res)=>{
		//	console.log('online:', topic, res);
			this.processMsg(topic, res);
		});
		
	},
    computed: {
    },
    methods: {
		processMsg(topic, res){
		//	console.log(topic, res);
			if(typeof(this.onlineList[res.data.id]) == 'undefined'){
				let data = JSON.parse(JSON.stringify(res.data.data));
				data.active = 0;
				this.$set(this.onlineList, res.data.id, data);
			}
			
		},
		showPage(name, param){
            RUNKIT.APP.showPage(name, param); 
        },
		onClick(id, dev){
			console.log(id, dev);
			this.onlineList[id].active = 1;
			this.showPage('shell', dev);
			this.nowSelected = id;
		}
    }
}
</script>

<style lang='less'>
.active{
	background:#fff;
}
</style>

<template>
<div style="width:1.5rem;height:1.5rem;line-height:1.8rem;">
	<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 488 488" style="height:1rem;width:1rem;enable-background:new 0 0 488 488;" xml:space="preserve">

		<path :style="{fill:signal>0?'#82CC00':'BCBCBC'}" d="M40,324.8c-19.2,0-40,3.2-40,26.4v84c0,23.2,20.8,26.4,40,26.4s40-3.2,40-26.4v-84C80,328,59.2,324.8,40,324.8z"/>
		<path :style="{fill:signal>0?'#61C105':'A9AAA9'}" d="M42.4,460.8c19.2,0,37.6-3.2,37.6-26.4v-83.2c0-23.2-19.2-26.4-38.4-26.4"/>

		<path :style="{fill:signal>1?'#82CC00':'BCBCBC'}" d="M180,225.6c-19.2,0-36,3.2-36,26.4v183.2c0,23.2,16.8,26.4,36,26.4s36-3.2,36-26.4V252C216,228.8,199.2,225.6,180,225.6z"/>
		<path :style="{fill:signal>1?'#61C105':'A9AAA9'}" d="M178.4,460.8c19.2,0,37.6-3.2,37.6-26.4V252c0-23.2-19.2-26.4-38.4-26.4"/>

		<path :style="{fill:signal>2?'#82CC00':'BCBCBC'}" d="M316,126.4c-19.2,0-36,3.2-36,26.4v282.4c0,23.2,16.8,26.4,36,26.4s36-3.2,36-26.4V152.8C352,129.6,335.2,126.4,316,126.4z"/>
		<path :style="{fill:signal>2?'#61C105':'A9AAA9'}" d="M314.4,460.8c19.2,0,37.6-3.2,37.6-26.4V152.8c0-23.2-19.2-26.4-38.4-26.4"/>

		<path :style="{fill:signal>3?'#82CC00':'BCBCBC'}" d="M452,27.2c-19.2,0-36,3.2-36,26.4v381.6c0,23.2,16.8,26.4,36,26.4s36-3.2,36-26.4V52.8C488,29.6,471.2,27.2,452,27.2z"/>
		<path :style="{fill:signal>3?'#61C105':'A9AAA9'}" d="M450.4,460.8c19.2,0,37.6-3.2,37.6-26.4V52.8c0-23.2-19.2-26.4-38.4-26.4"/>
		
	</svg>
</div>
</template>

<script>
export default {
    name: '',
    props: {
    },
    components:{},
    data() {
        return {
			signal:2
        }
    },
	mounted:function(){
		var self = this;
		RUNKIT.VoimBus.subscribe('public', (topic, res)=>{

		});
		RUNKIT.VoimBus.subscribe('signal', (topic, res)=>{
	//		console.log(res.data);
			this.ping = res.data.time;
			this.signal = (res.data.code >= 0)?( (5 - Math.round(res.data.time/200)) || 1 ):0;
		});
	},
    computed: {
    },
    methods: {
    }
}
</script>

<style scoped>
</style>

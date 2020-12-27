<template>
<div style="" class="my-select">
	<div @click="isShow = !isShow" style="display:flex;height:1.6rem;background:#f9f9f9;border-radius:0.2rem;border:1px solid #ccc;" class="opt-label">
	<div style="flex:1;line-height:1.5rem;"><span style="color:#999" v-show="showText">{{showText}}</span><span v-show="!showText" style="color:#ccc">{{placeholder}}</span></div> 
	<div class="triangle"></div>
	</div>
	<div style="width:0;height:0;">
		<div v-show="isShow" style="position:relative;width:20rem;height:10rem;display:flex;" class="opt-box">
			<PageGrid  v-on:event="procGridData" style="width:100%" class="flex-col" :id="name"></PageGrid>
		</div>
	</div>
			
</div>
</template>

<script>

import PageGrid from '@/components/PageGrid.vue'
export default {
    name: 'NetSelect',
	props: ['placeholder', 'id', 'needValue', 'showValue', 'name', 'value', 'ctrConf'],
    components:{PageGrid},
    data() {
        return {
			isShow:0,
			showText:'',
			loading:0,
			pageInfo:{},
        }
    },
    computed: {
		nowSymbol:function(){
			return this.optionData[this.type][this.nowItem].symbol;
		}
    },
	mounted:function(){
		RUNKIT.VoimBus.subscribe('setConf', (topic, res)=>{
			if(this.id == res.id){
				this.$set(this, 'pageInfo', res.data);
				setTimeout(()=>{
					this.init();
				}, 1000);
			}
		});
	},
    methods: {
		init(){
			if(!this.value)return;
			let where = {};
		//	alert(JSON.stringify(this.ctrConf));
			where[this.ctrConf.whereKey] = this.value;
			this.loading1(1);
			RUNKIT.ServerApi.send(this.pageInfo.api.retrieve, {where:where}, (bl, res)=>{
				this.loading1(0);
				console.log('detail:', bl, res);
			//	alert(this.showValue + '   ' +  JSON.stringify(res));
				for(let i = 0; i < res.list.length; i++){
					this.showText = res.list[i][this.showValue];
				}
			}); 
		},
		loading1(bl){
			if(bl){
				this.showText = '加载中...';
				return;
			}
			this.showText = '';
		},
		procGridData(data){
			if('select' == data.evt.name){
				this.onSelect(data.data);
			}
		},
		onSelect(data){
			this.isShow = 0;
			this.showText = data[this.showValue];
			let resData = {};
			for(let nk in this.needValue){
				for(let k in data){
					if(this.needValue[nk] == k){
						resData[nk] = data[k];
					}
				}
			}
			this.$emit('selected', resData);
		}
    }
}
</script>

<style lang='less' scoped>

.my-select{
	width:100%;
	color:#688aa7;
	cursor:default;
}
.opt-label{
	height:1rem;line-height:0.9rem;text-align:center;
}
.opt-box{
	position: absolute;overflow-y:scroll;padding:0.2rem;margin-left:0.1rem;width:6rem;height:auto;border:1px solid #dfe6ec;background:#fcfdfd;border-radius:0.2rem;
}


.triangle{
	width:0.9rem;
	height:0.5rem;
	margin-top:0.5rem;
	margin-right:0.3rem;
	&::after{
		content: '';
            display: block;
            border-left: 0.43rem solid transparent ;
            border-right: 0.43rem solid transparent;
            border-top: 0.43rem solid #999;
	}
}

</style>

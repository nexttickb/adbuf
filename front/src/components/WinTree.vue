<template>
<div>
	<template v-for="(item, key) of getList(list)" class="box">
		<win-tree :config="config" :id="id" :style="{overflow:'scroll',flex:item.size}" v-if="item.children" :list="item.children" :class="[item.split]"></win-tree>
		<div v-if="item.type" :style="{overflow:'scroll', flex:item.size, width:'100%', height:'100%', display:'flex'}">
			<PageGrid @initPage="onInitPage" v-on:event="procEventData" class="page-box" :id="id + '_' + item.pageConfig" v-if="item.type == 'grid'"></PageGrid>
			<PageForm @initPage="onInitPage" style="overflow-y:scroll" v-on:event="procEventData" :id="id + '_' + item.pageConfig" v-if="item.type == 'form'"></PageForm>
			<PageTree @initPage="onInitPage" v-on:event="procEventData" :id="id + '_' + item.pageConfig"  v-if="item.type == 'tree'" class="page-box"></PageTree>
			<Message @initPage="onInitPage" v-on:event="procEventData" :id="id + '_' + item.pageConfig" v-if="item.type == 'message'" class="" style="display:flex;"></Message>
			<EShell @initPage="onInitPage" v-on:event="procEventData" :id="id + '_' + item.pageConfig" v-if="item.type == 'shell'" class="" style=""></EShell>
			<TreeChart :json="{name: 'root',image_url: '',class: ['rootNode'],children: []}" @initPage="onInitPage" v-on:event="procEventData" :id="id + '_' + item.pageConfig"  v-if="item.type == 'ctree'" class="page-box"></TreeChart>
			<Code @initPage="onInitPage" v-on:event="procEventData" :id="id + '_' + item.pageConfig" v-if="item.type == 'code'" class="" style=""></Code>
		</div>
	</template>
</div>
</template>
 
<script>

import PageGrid from '@/components/PageGrid'
import PageForm from '@/components/PageForm'
import PageTree from '@/components/PageTree'
import Message from '@/components/Message'
import EShell from '@/components/EShell'
import TreeChart from "@/components/TreeChart"
import Code from "@/components/Code"

export default {
  name:'WinTree',
  props:['list','config','id','pageList'],
  components: {PageGrid,PageForm,PageTree,Message,EShell,TreeChart,Code},
  data(){
    return {
		editMod:1,
		preActive:'04',
		active:{
		},
		datas_bak:{
			/*
			//一分屏
			'index':{name:'', size:1, split:'', children:['aa']},
			'aa':{name:'', size:1, active:0, type:'grid', pageConfig:'movieList'}
			
			// 二分屏
			'index':{name:'左右分割', size:1, split:'vertical', children:['03','02']},
			'02':{name:'左', size:1, active:0, type:'tree', pageConfig:'typeTree'},
			'03':{name:'右', size:3, active:0, type:'grid', pageConfig:'movieList'}
			
			// 四分屏
			'index':{name:'上下分割', size:1, split:'horizontal', children:['02','03']},
			'02':{name:'上-左右分割', size:1, split:'vertical', children:['04','05']},
			'03':{name:'下-左右分', size:1, split:'vertical', children:['06','07']},
			'04':{name:'上-左', size:1, active:0, type:'grid', pageConfig:'movieList'},
			'05':{name:'上-右', size:1, active:0, type:'form', pageConfig:'adAdd'},
			'06':{name:'下-左', size:1, active:0, type:'form', pageConfig:'adAdd'},
			'07':{name:'下-右', size:1, active:0, type:'form', pageConfig:'adAdd'}
			*/
		}
    }
  },
  mounted:function(){
  	var self = this;
	
  	RUNKIT.VoimBus.subscribe('public', (topic, res)=>{
  		if('resize' == res.type){
  		}
  	});
	
  	RUNKIT.VoimBus.subscribe('setConf', (topic, res)=>{
  		if(this.id == res.id){
  			this.setConf(res);
  		}
  	});
  },
  methods:{
	getList(data){
		data = data || ['index'];
		var res = {};
		for(var id in data){
			if(typeof(this.config[data[id]]) == 'undefined')return {};
			res[data[id]] = this.config[data[id]];
		}
		console.log("getList2", res);
		return res;
	},
	setConf(res){
		for(let i in this.config){
			if(typeof(this.config[i]['pageConfig']) != 'undefined'){
				this.initPage(this.id + '_' + this.config[i]['pageConfig'], this.config[i]['pageConfig'], res.params);
			}
		}
	},
	//组合组件之间的通讯
	procEventData(msg){
		
		if(msg.evt.name == 'message'){
			this.initPage(this.id + '_' + msg.evt.target, msg.evt.target, msg.data);
		}
	},
	onInitPage(item){
		this.initPage(item.id, item.name, item.params);
	},
	initPage(id, name, params){
		RUNKIT.VoimBus.publish('initPage', {id:id, name:name, params:params});
	}
  }
}
</script>

<style lang='less' scoped>

.box{
	box-sizing: border-box;
}

.bd{
	position:absolute;
	left:0;
	right:0;
	top:0;
	bottom:0;
}
.horizontal {
	flex:1;
	display:flex;
	flex-direction:column;
}
.vertical{
	flex:1;
	display:flex;
	flex-direction:row-reverse;
}
.item{
	border:1 solid;
	padding:0.5rem;
	border-radius:1rem;
	box-sizing: border-box;
}

.page-box{
	flex:1;display:flex;flex-direction:column;overflow:auto;
}




</style>

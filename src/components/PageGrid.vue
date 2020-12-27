<template>
<div style="display:flex;flex-direction:column;">
	<div style="width:100%;height:1.7rem;" v-show="pageInfo.toolbar.length">
		<button v-for="item in pageInfo.toolbar" @click="procToolbar(item)" style="height:1rem;margin:0.25rem">{{item.label}}</button>
	</div>
	<STable @leftClick="onLeftClick" @rightClick="onRightClick" class="flex1 scroll-y" style="" ref="maingrid" v-on:event="procGridData"></STable>
</div>

</template>

<script>

import STable from '@/components/STable.vue'

export default {
    name: 'PageGrid',
    props: ['id'],
    components:{STable},
    data() {
        return {
			nowDialog:'',
			eventParams:{},
			pageInfo:{
				toolbar:[{name:'create', label:'新增'}],
				api:{retrieve:'Admin.movieList',retrieveOne:'Admin.movieGet', update:'Admin.movieUpdate',create:'Admin.movieAdd',delete:'Admin.movieDelete'},
				mainGrid:{
				},
				/*
						form:[
							{"group": "tickettop",	"name": "sn1", 	"value":"",	"label": "普通输入框","cols": 1,"order": 0,"hidden": false,"type": "input"},
							{"group": "tickettop",	"name": "sn6", 	"value":"",	"label": "下拉","cols": 1,"order": 5,"hidden": false,"type":"select", "option":[{value:1, label:"男", active:1},{value:0, label:"女"}]},
							{"group": "tickettop",	"name": "sn16", "value":"",	"label": "单选","cols": 1,"order": 0,"hidden": false,"type": "radio", "option":[{value:1, label:"男", active:1},{value:0, label:"女"}]},
							{"group": "tickettop",	"name": "sn2", 	"value":"",	"label": "地址","cols": 3,"order": 1,"hidden": false,"type": "textarea"},
						]
				*/
			}
		}
    },
    computed: {
		
    },
	mounted:function(){
		var self = this;
		
		RUNKIT.VoimBus.subscribe('public', (topic, res)=>{
			if('resize' == res.type){
				this.init();
			}
		});
		RUNKIT.VoimBus.subscribe('setConf', (topic, res)=>{
			if(this.id == res.id){
				this.setConf(res);
			}
		});
		RUNKIT.VoimBus.subscribe(this.id, (topic, res)=>{
			if('menuSelect' == res.type){
				this.onMenuSelect(res.data);
			}
		});
		this.init();
	},
    methods: {
		init(){
			
		},
		setConf(conf){
			
			this.$set(this, 'pageInfo', conf.data);
			this.$refs.maingrid.setConf(this.pageInfo.gridConfig, this.pageInfo.api, conf.params);
			
		//	alert('pageInfo####' + JSON.stringify(this.pageInfo));
		},
		onRightClick(msg){
			this.eventParams = msg;
			RUNKIT.VoimBus.publish('rightMenu', {type:'show', data: {id:this.id, menus:this.pageInfo.menus}});
		},
		onLeftClick(msg){
		//	alert(JSON.stringify(msg));
			this.procGridData({evt:{name:'select'}, data:msg});
		},
		//右键菜单选择后处理
		onMenuSelect(evt){
		//	alert(JSON.stringify(evt));
			this.procGridData({evt:evt, data:this.eventParams});
		},
		//处理子组件的消息 拦截或重新向外传递新消息
		procGridData(data){
			console.log('pageGrid procGridData:', data);
			//需要处理的拦截，其他的继续向外传递
			if('edit' == data.evt.name){
				
				return this.newPage(data.evt.target, data.evt.openType, data.evt.openTitle, data.data);
			}
			if('delete' == data.evt.name){
				RUNKIT.APP.loading(1);
				RUNKIT.ServerApi.send(this.pageInfo.api.delete, {data:data.data}, (bl, res)=>{
					RUNKIT.APP.loading(0);
					console.log('detail:', bl, res);
					if(bl)alert('删除成功!');
					this.$refs.maingrid.reload();
				});
				return;
			}
			if('select' == data.evt.name){
				if(typeof(this.pageInfo.event['select']) != 'undefined'){
					this.$emit("event", {evt:this.pageInfo.event['select'], data:data});
				}
				return;
			}
			this.$emit("event", data);
		},
		procToolbar(evt){
			if('create' == evt.name){
				this.newPage(evt.target, evt.openType, evt.openTitle);
			}
			if('refresh' == evt.name){
				this.$refs.maingrid.reload();
			}
		},
		//this.$refs.maingrid.reload();
		newPage(target, openType, openTitle, data){
			console.log(target, openType, openTitle, data);
			RUNKIT.APP.showRichPage(target, (new Date()).valueOf(), openTitle, openType=='dialog'?2:1, data || {});
		//	initPage
		},
		showPage(name, param){
            RUNKIT.APP.showPage(name, param || {}, this.$options.name); 
        },
		clickMenu(menu){
			console.log(menu);
			this.showPage(menu.page, menu);
		},
		onChangeData:function(data){
			mylog.info("onChangeData:", data);	
			this.$emit("changeProduct", data);
		}
    }
}
</script>

<style lang='less' scoped>


</style>

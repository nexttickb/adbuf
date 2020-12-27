<template>
<div>
	<div style="width:100%;height:1.7rem;" v-show="pageInfo.toolbar.length">
		<button v-for="item in pageInfo.toolbar" @click="procToolbar(item)" style="height:1rem;margin:0.25rem">{{item.label}}</button>
	</div>
	<tree @rightClick="onRightClick" class="flex1 scroll-y page-tree" :id="id"  ref="maintree" v-on:select="onSelectTreeData"></tree>
</div>

</template>

<script>

import tree from '@/components/Tree.vue'

export default {
    name: 'PageTree',
    props: ['id'],
    components:{tree},
    data() {
        return {
			/*
				tree节点  必须的字段有  id  name , 其他的为非必须
			*/
			pageInfo:{
				toolbar:[{name:'create', label:'新增'}],
				api:{retrieve:'Admin.movieList',retrieveOne:'Admin.movieGet', update:'Admin.movieUpdate',create:'Admin.movieAdd',delete:'Admin.movieDelete'},
				treeData:{
					hide: 1,
					isOpen: 1,
					children: []
				/*
					hide: 1,
					isOpen: 1,
					children: [{
						id:'1',
						name: '影视大作',
						isOpen: 1,
						children: [{
							id:'2',
							name: '最新上映',
							isOpen: 1,
							children: [{
								id:'3',
								name: '小丑2019',
							},{
								id:'4',
								name: '小丑2019',
							},{
								id:'5',
								name: '小丑2019',
							},{
								id:'6',
								name: '小丑2019',
							},]
						}]
					}, {
						id:'7',
						name: '影视大全',
						isOpen: 1,
						children: [{
							id:'8',
							name: '科幻',
							isOpen: 0,
							children: []
						}]
					}, ]
					*/
				}
			},
			eventParams:{},
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
		//	alert(JSON.stringify(conf));
			this.pageInfo.btnCol = conf.data.treeConfig.btnCol;
			this.pageInfo.event = conf.data.event;
			this.pageInfo.menus = conf.data.menus;
			this.$set(this, 'pageInfo', conf.data);
			this.$refs.maintree.setConf(this.pageInfo.treeConfig, this.pageInfo.api, conf.params);
			this.$refs.maintree.getTreeList();
		},
		//右键事件发生后向菜单组件发起消息
		onRightClick(msg){
			this.eventParams = msg;
			RUNKIT.VoimBus.publish('rightMenu', {type:'show', data: {id:this.id, menus:this.pageInfo.menus}});
		},
		//右键菜单选择后处理
		onMenuSelect(evt){
			this.procTreeData({evt:evt, data:this.eventParams});
		},
		//节点选择事件处理
		onSelectTreeData(item){
			if(typeof(this.pageInfo.event['select']) != 'undefined'){
				this.$emit("event", {evt:this.pageInfo.event['select'], data:item});
			}
		},
		procTreeData(data){
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
			//		this.$refs.maintree.reload();
				});
				return;
			}
			this.$emit("btnClick", data);
		},
		procToolbar(evt){
			if('create' == evt.name){
				this.newPage(evt.target, evt.openType, evt.openTitle);
			}
			if('refresh' == evt.name){
				this.$refs.maintree.reload();
			}
		},
		//this.$refs.maintree.reload();
		newPage(target, openType, openTitle, data){
			console.log(target, openType, openTitle, data);
			RUNKIT.APP.showRichPage(target, (new Date()).valueOf(), openTitle, openType=='dialog'?2:1, data || {});
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

.page-tree{
	border: 5px solid #dfe6ec;
}

</style>

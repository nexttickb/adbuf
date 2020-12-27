<template>
<div class="tree">
    <li>
        <div :class="[isFolder?'fold-text':'film-text']" @click="toggle(item)" @click.right="rightEvent(item)"> 
			<template v-if="item.children">
				<div v-show="!item.hide" style="width:0.8rem;height:0.8rem;float:left;" :class="['ico-folder', item.isOpen?'folder-o':'folder-c']"></div>
			</template>
			<template v-else>
				<div v-show="!item.hide" class="folder-v" style="width:0.8rem;height:0.8rem;float:left;"></div>
			</template>
			<span v-show="item.tree_node_id" :class="['tree-label', selected == item.tree_node_id?'active':'']">{{ item.tree_node_label }}</span>
        </div>
        <ul v-show="item.isOpen" v-if="isFolder">
            <tree @rightClick="onRightClick" :ref="child.tree_node_id" @select="onSelect" class="item" v-for="(child, index) in item.children" :key="index" :item="child" @make-folder="$emit('make-folder', $event)" @add-item="$emit('add-item', $event)" ></tree>
        </ul>
		<div v-show="loading" class="tree-loading">loading...</div>
    </li>
</div>
</template>


<script>
export default {
    name: 'tree',
    props: {
        item: {
			type: Object,
			default:function(){
				return {
					hide: 1,
					isOpen: 1,
					children: []
				};
			}
		}
    },
    components:{
    },
    data() {
        return {
			treeConf:{},
			selected:-1,
			loading:0,
        }
    },
    computed: {
        isFolder: function () {
              return typeof(this.item.children) != 'undefined';
        },
		isOpen:function () {
              return 1;
        }
    },
	watch:{
	},
	mounted:function(){
		var self = this;
		RUNKIT.VoimBus.subscribe('tree', (topic, res)=>{
			if('click' == res.type){
				this.selected = res.data.tree_node_id;
			}
		});
	},
    methods: {
		setConf(conf, api, params){
			this.$set(this, 'treeConf', conf);
			this.api = api;
			this.params = params || {};
		},
		getTreeList(nodeData){
			if(!this.api.treeData)return;
			this.loading = 1;
			RUNKIT.ServerApi.send(this.api.treeData, {where:nodeData || {}}, (bl, res)=>{
				this.loading = 0;
				this.item.children = [];
				for(let i = 0; i < res.list.length; i++){
					let node = res.list[i];
					node['tree_node_id'] = RUNKIT.ServerApi.createUUID();
					node['tree_node_label'] = node[this.treeConf.label];
					if(typeof(node[this.treeConf.dirNode]) != 'undefined' || 1){
						node['children'] = [];
					}
					this.item.children.push(node);
					this.$nextTick(()=>{
						this.$refs[node['tree_node_id']][0].setConf(this.treeConf, this.api);
					});
				}
				
				
			});
		},
		rightEvent:function(item){
			this.onClick(item);
			this.$emit("rightClick", item);
		},
        toggle: function (item) {
			this.onClick(item);
            if (this.isFolder) {
				if(this.item.children){
					this.getChildData();
				}
				this.item.isOpen = !this.item.isOpen
				return;
            }
        },
		//全部通知和向外层事件传递
		onClick:function(item){
			RUNKIT.VoimBus.publish('tree', {type:'click', data: item});
			this.$emit("select", item);
		},
		//子树选择的事件继续向外传递
		onSelect:function(msg){
			this.$emit("select", msg);
		},
		onRightClick:function(msg){
			this.$emit("rightClick", msg);
		},
		getChildData:function(){
			if(this.item.isOpen){
				return this.item.children = [];
			}
			if(this.loading){
				return;
			}
			if(!this.item.isOpen){
				this.getTreeList(this.item);
			}
		}
    }
}
</script>

<style lang='less' scoped>


	*{
		outline:none;
		list-style:none;
		
	}
	.tree-label{
		padding-left:5px;
		padding-right:5px;
	}
	.active{
		font-weight: bold;
		background-color: #eef1f6;
		border: 1px solid #dfe6ec;
	}
	
	.folder-o{
		background:url('../assets/icon/folder-o.svg') no-repeat center center;
		background-size:90% 90%;
	}
	.folder-c{
		background:url('../assets/icon/folder-c.svg') no-repeat center center;
		background-size:90% 90%;
	}
	.folder-v{
		background:url('../assets/icon/app.svg') no-repeat center center;
		background-size:90% 90%;
	}
	.tree{
		color: rgb(45, 103, 152);
	///	background-color: #eef1f6;
		
		ul {
			margin:0;
			padding-left: 0.9rem;
			line-height: 1rem;
			list-style: none;
			font-size:0.6rem;
		}
		li{
			cursor:default;
		}
	}
	.tree-loading{
		background: rgba(200, 200, 200, 0.1);
		border:1px dotted #dfe6ec;
		text-align:center;
		line-height:2rem;
		margin-right:0.1rem;
	}
	
</style>

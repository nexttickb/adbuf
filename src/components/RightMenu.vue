<template>

<div class="menu" v-show="showMenu" :style="{position:'fixed', left:nowPoint.x+'px', top:nowPoint.y+'px'}">
    <ul>
        <li v-for="item in menus" name='menu' @click="onClickMenu(item)"><div class="icon"></div>{{item.label}}</li>
		<li v-for="item in defaultMenus" name='menu' @click="onClickMenu(item)"><div class="icon"></div>{{item.label}}</li>
    </ul>
</div>

</template>

<script>

export default {
    name: 'rightMenu',
    props: {
    },
    components:{},
    data() {
        return {
			showMenu:0,
			retId:'',
			nowPoint:{x:0, y:0},
			menus:[],
			defaultMenus:[
				{name:'about', openTitle:'关于', openType:'dialog', target:'about', label:'关于'}
			]
		}
    },
    computed: {
		
    },
	mounted:function(){
		var self = this;
		document.onmousedown = function(e){
		//	console.log(e.srcElement.getAttribute('name'));
			if(e.srcElement.getAttribute('name') != 'menu'){
				self.clear();
			}
		}
		document.oncontextmenu = function(e){
			self.showMenu = 1;
			self.$set(self, 'nowPoint', {x:e.clientX, y:e.clientY});
		　　return false;
		}
		RUNKIT.VoimBus.subscribe('rightMenu', (topic, res)=>{
			if('show' == res.type){
				this.newMenu(res);
			}
		});
	},
    methods: {
		init(){
		},
		newMenu(res){
			this.$set(this, 'menus', res.data.menus);
			this.retId = res.data.id;
		},
		onClickMenu(item){
			if(item.name == 'about'){
				RUNKIT.APP.showRichPage(item.target, (new Date()).valueOf(), item.openTitle, item.openType=='dialog'?2:1, {});
				this.clear();
				return;
			}
			RUNKIT.VoimBus.publish(this.retId, {type:'menuSelect', data: item});
			this.clear();
		},
		clear(){
			this.showMenu = 0;
			this.$set(this, 'menus', []);
		}
    }
}
</script>

<style lang='less' scoped>

.menu {
    width: 5.6rem;
    border: 1px solid #ddd;
    z-index: 9999;
    position: absolute;
    background: #f3f3f3;
	box-shadow: 3px 3px 2px #888888;
	padding:0.1rem;
	box-sizing:border-box;
}
.menu ul {
    margin: 0px;
    padding: 0px;
    text-align: left;
    list-style-type: none;
}
.menu ul li {
    padding: 3px;
    font-size: 0.6rem;
}
.menu ul li:hover {
    background: #8cdbf9;
}
.menu ul li a:link {
    color: #333;
    text-decoration: none;
}
li, .icon{
	height:0.9rem;
	line-height:0.6rem;
}
.icon{
	width:0.9rem;
	float:left;
}
</style>

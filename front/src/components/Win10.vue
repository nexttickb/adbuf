
<template>
<div>
	<!--
		关于windows UI
		尽可能简单些，没必要在ui细节上用太多成本
		只用一个组件方便管理
	-->
	<!--window-->
	<div v-for="(item, id) in windows" :class="[item.isMax>=2?'':'', 'ElementWind', 'dragclass']" v-show="item.isMax" :style="item.style" @mousedown="winDrag($event, id)">
		
		<div class="winHead"  @dblclick="winDblclick(item)" style="height:1.3rem;">
			<div v-show="!item.icon" class="icon-app" style="float:left;height:1.3rem;width:1.3rem;"></div>
			<div v-show="item.icon" :style="{background:'url('+item.icon+') no-repeat center center', backgroundSize:'60%', float:'left', width:'1.3rem', height:'1.3rem'}"></div>
			<div style="float:left;">{{item.title}}</div>
			<div @click="winClose(id)" class="min-btn">×</div>
			<div v-show="1 == item.isMax" @click="winMax(id)" class="min-btn">□</div>
			<div v-show="2 == item.isMax" @click="winNormal(id, 1)" class="min-btn">□</div>
			<div @click="winMin(id)" class="min-btn">-</div>
		</div>
		<div class="winBody" style="flex:1;display:flex;overflow-y:scroll">
			<WinTree style="flex:1;display:flex;overflow-y:scroll;box-sizing:border-box;" :pageList="pageList" :config="item.conf" :id="item.id"></WinTree>
		</div>
		<div style="width:0;height:0;">
			<div :style="{width:item.style.width,height:'5px',position:'absolute',display:'flex'}">
				<div class='' style="width:10px;margin-left:-5px;"></div>
				<div @mousedown="winResize($event, id, 's')" class='cursor-s' style="flex:1;"></div>
				<div @mousedown="winResize($event, id, 'se')" class='cursor-se' style="width:10px;margin-right:-5px;"></div>
			</div>
			<div :style="{height:item.style.height,marginLeft:item.style.width,marginTop:'-'+item.style.height,width:'5px',position:'absolute',display:'flex',flexDirection:'column'}">
				<div style="height:0.2rem;"></div>
				<div @mousedown="winResize($event, id, 'w')" class="cursor-w" style="flex:1;"></div>
				<div @mousedown="winResize($event, id, 'se')" class='cursor-se' style="height:0.2rem;"></div>
			</div>
		</div>
	</div>
	<!--桌面-->
	<div class="disktop" ref="disktop" style="">
		<div @dragover="allowDrop($event, index)" @click.right="rightEvent(item)" v-for="(item, index) in diskIcoBox" :index='index' class="icon-box" style="">
			<div @dragend="dragEnd($event, index)" draggable="true" v-if='item.id' @click="selectIco(item)" @dblclick="winCreate(item)" class="icon-inner" style="flex:1;display:flex;flex-direction:column;">
				<div style='flex:1;text-align:center;box-sizing:border-box;' :class="[item.icon?'':'icon-app']"><img style="margin-top:0.2rem;width:1.6rem;height:1.6rem;border-radius:0.2rem;" v-show="item.icon" :src="item.icon" /></div>
				<div style="height:1rem;font-size:0.5rem;text-align:center;text-shadow: 1px 1px 1px #333;">{{item.label}}</div>

			</div>
		</div>
	</div>
  
	<!--开始菜单-->
	<div class="start" v-show="startShow" style="position:absolute;z-index:100000;background:#333;width:18rem;top:6.6rem;left:0;bottom:1.6rem;display:flex;">
		<div style="width:1.5rem;"></div>
		<div style="width:9rem;overflow-y:scroll">
			<div @click="winCreate(item)" v-for="item in menuList" style="color:#fff;font-size:0.6rem;line-height:1.6rem;height:1.6rem;width:100%;float:left;display:flex;">
				<div style="width:1.6rem;" :class="[item.menu_ico]"></div>
				<div>{{item.menu_label}}</div>
			</div>
		</div>
		<div style="flex:1;"></div>
	</div>
	
	<!--任务栏-->
	<div class="task-panel" style="">
		<div @click="startShow = !startShow" class="start icon-start" style="width:2.6rem"></div>
		<div class="task-btns" style="flex:1;">
			<div v-for="(item, id) in windows" @click="winTop(id)" :class="[item.ico, item.id == activeWinId?'win-active':'','task-btn']" style="">
				<div :class="[item.ico,'task-ico']"></div>
			</div>
		</div>
		<div class="tray" style="width:5rem">
			<Ping style="float:left"></Ping>
			<div style='width:3rem;float:right;text-align:center;font-size:0.5rem;line-height:0.8rem;display:flex;flex-direction:column;color:#fff;'>
				<div style="flex:1;">{{datetime.time}}</div>
				<div style="flex:1;">{{datetime.date}}</div>
			</div>
		</div>
	</div>
	
	<RightMenu></RightMenu>
	<Login></Login>
	
</div>
</template>
<script>

import WinTree from '@/components/WinTree'

import RightMenu from '@/components/RightMenu'

import Ping from '@/components/Ping'
import Login from '@/components/Login'
export default {
	data(){
		return {
			pageList:{},
			disktop:{
				iconCountH:10,
				iconCountW:15,
			},
			datetime:{time:'', date:''},
			theight:0,
			twidth:0,
			count:0,
			isOpenWind :1,
			maxZindex:1000,
			defLeft:90,
			defTop:50,
			windows:{},
			startShow:0,
			diskIcoBox : [],
			activeWinId:'',
			menuList:[
			/*
				{ico:'icon-app', id:'',name:'base', 	label:'基本设置'},
				
				{ico:'icon-app', id:'id_optionsEdit',name:'optionsEdit', 	label:'应用设置'},
				{ico:'icon-app', id:'id_noticeEdit', name:'noticeEdit', 	label:'公告设置'},
				{ico:'icon-app', id:'id_codeEdit', name:'codeEdit', 	label:'文本编辑器'},
				{ico:'icon-app', id:'id_shell', 		name:'shell', 			label:'shell测试'},
				{ico:'icon-app', id:'id_passwdEdit', name:'passwdEdit', 	label:'管理密码'},
				{ico:'icon-app', id:'id_message', 	name:'message', 		label:'自定义组件测试'},
				{ico:'icon-app', id:'id_richPage1', 	name:'richPage1', 		label:'多组件shell测试'},
				{ico:'icon-app', id:'id_richPage2', 	name:'richPage2', 		label:'列表+聊天组合'},
				{ico:'icon-app', id:'id_richPage', 	name:'richPage', 		label:'树+主细表测试'},
				
				{ico:'icon-app', id:'',name:'user', 	label:'用户管理'},
				
				{ico:'icon-app', id:'id_treeChart', 	name:'treeChart', 		label:'树表'},
				{ico:'icon-app', id:'id_userList', 	name:'userList', 		label:'用户管理'},
				{ico:'icon-app', id:'id_onlineList', name:'onlineList', 	label:'在线客户'},
				
				{ico:'icon-app', id:'',name:'gather', 	label:'视频管理'},
				
				{ico:'icon-app', id:'id_gatherList', name:'gatherList', 	label:'采集接口'},
				{ico:'icon-app', id:'id_typeList', 	name:'typeList', 		label:'分类管理'},
				{ico:'icon-app', id:'id_movieList', 	name:'movieList', 		label:'视频管理'},
				
				{ico:'icon-app', id:'',name:'ad', 	label:'广告管理'},
				
				{ico:'icon-app', id:'id_adList', 	name:'adList', 		label:'广告管理'},
				
				//symbol
				{ico:'icon-app', id:'id_langList', 	name:'langList', 		label:'语言管理'},
				{ico:'icon-app', id:'id_scenesList', 	name:'scenesList', 		label:'场景分类'},
				{ico:'icon-app', id:'id_simulationList', 	name:'simulationList', 		label:'场景模拟'},
				{ico:'icon-app', id:'id_symtreeList', 	name:'symtreeList', 		label:'意图管理'},
				{ico:'icon-app', id:'id_corpusList', 	name:'corpusList', 		label:'语料管理'},
				
				
				
				//主机管理
				{ico:'icon-app', id:'id_clientList', name:'clientList', 	label:'主机列表'},
				//clientManage
				{ico:'icon-app', id:'id_clientManage', name:'clientManage', 	label:'主机列表'},
				
				*/
				
			]
		}
    },
	components: {
		WinTree, RightMenu, Ping, Login
    },
	props: [],
	mounted:function(){
	
		RUNKIT.APP = this;
		
		this.onResize();
		window.onresize = this.onResize;
		
		RUNKIT.VoimBus.subscribe('initPage', (topic, res)=>{
			this.initPage(res.id, res.name, res.params);
		});
		RUNKIT.VoimBus.subscribe('initPage', (topic, res)=>{
			this.initPage(res.id, res.name, res.params);
		});
	
		 //禁止浏览器拖动图片打开新标签页的默认事件 
		document.ondragover = function (e) { e.preventDefault(); }; 
		document.mousedown = (e)=>{
			
		};
		
		setInterval(()=>{
			let date = new Date();
			let datetime = {};
			datetime.time = date.getHours() + ':' + date.getMinutes();
			datetime.date = date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
			this.$set(this, 'datetime', datetime);
	//		console.log(datetime);
		}, 1000);
		
		RUNKIT.VoimBus.subscribe('config', (topic, res)=>{
			if(res.type == 'pageList'){
				console.log("pageList:", JSON.stringify(res.data));
			//	alert(JSON.stringify(res.data));
				this.$set(this, 'pageList', res.data);
			}
			if(res.type == 'menuList'){
			//	alert(JSON.stringify(res.data));
				this.$set(this, 'menuList', res.data);
				this.onResize();
			}
		});
	},
    methods:{
		winDrag(e, id){
			console.log(id);
			this.winTop(id);
			if(e.target.getAttribute('class') != 'winHead')return;

			let oDiv = e.path[1];
			let disX = e.clientX - oDiv.offsetLeft;
			let disY = e.clientY - oDiv.offsetTop;
			let isFirst = 1;
			
			let st = new Date().getTime();
			
			
			document.onmousemove = (e)=>{
				let et = new Date().getTime();
				if(et - st < 10)return;//降频
				st = et + 0;
				if(isFirst){//这里处理的不漂亮
					isFirst = 0;
					if(this.getAttr(id, 'isMax') == 2){
						this.winNormal(id, 0);
						disX -= this.followMouse(id, e);
					}
				}
				e.preventDefault();
				let l = e.clientX - disX;
				let t = e.clientY - disY;
				
				this.setStyle(id, 'left', l + 'px');
				this.setStyle(id, 'top', t + 'px');
			}
			document.onmouseup = ()=>{
				document.onmousemove = null;
				document.onmouseup = null;
			}
			
		},
		winResize(e, id, flag){
			console.log(id);
			this.winTop(id);
			let oDiv = e.path[1];
			let disX = e.clientX - oDiv.offsetLeft;
			let disY = e.clientY - oDiv.offsetTop;
			let isFirst = 1;
			
			let st = new Date().getTime();
			document.onmousemove = (e)=>{
				let et = new Date().getTime();
				if(et - st < 20){//其实没什么大的卵用
					st = new Date().getTime();
					return;
				}
				if(isFirst){//这里处理的不漂亮
					isFirst = 0;
					if(this.getAttr(id, 'isMax') == 2){
						this.winNormal(id, 0);
						disX -= this.followMouse(id, e);
					}
				}
				e.preventDefault();
				let l = e.clientX - disX;
				let t = e.clientY - disY;
				switch(flag){
					case 's'://上下
						this.setStyle(id, 'height', t + 'px');
					break;
					case 'w'://左右
						this.setStyle(id, 'width', l + 'px');
					break;
					case 'se'://右下角
				//		this.setStyle(id, 'width', l + 'px');
				//		this.setStyle(id, 'height', t + 'px');
					break;
				}
			}
			document.onmouseup = ()=>{
				document.onmousemove = null;
				document.onmouseup = null;
			}
		},
		winClose(id){
			this.$delete(this.windows, id);
			this.getActive();
		},
		getActive(){
			let taArr = [];
			for(let k in this.windows){
				taArr.push({isMax:this.windows[k].isMax, id:this.windows[k].id, zindex:this.windows[k].style.zIndex});
			}
			taArr = taArr.sort(function(a, b){return b.zindex - a.zindex});
			if(taArr.length)this.activeWinId = taArr[0].id;
		},
		winMax(id){
			//isMax  2最大化  1正常   0最小化
			this.syncAttr(id);
			this.setAttr(id, 'isMax', 2);
			this.setStyle(id, 'width', this.twidth + 'px');
			this.setStyle(id, 'height', this.theight + 'px');
			this.setStyle(id, 'top', '0px');
			this.setStyle(id, 'left', '0px');
		},
		syncAttr(id){
			this.windows[id].left = parseInt(this.windows[id].style.left);
			this.windows[id].top = parseInt(this.windows[id].style.top);
		},
		winMin(id){
			this.setAttr(id, 'isMax', 0);
			this.getActive();
		},
		winNormal(id, andPos){
			this.setAttr(id, 'isMax', 1);
			this.setStyle(id, 'width', this.getAttr(id, 'swidth') + 'px');
			this.setStyle(id, 'height', this.getAttr(id, 'sheight') + 'px');
			if(andPos){
				this.setStyle(id, 'top', this.getAttr(id, 'top') + 'px');
				this.setStyle(id, 'left', this.getAttr(id, 'left') + 'px');
			}
		},
		winDblclick(item){
			if(2 == item.isMax){
				return this.winNormal(item.id, 1);
			}
			this.winMax(item.id);
		},
		followMouse(id, e){
			let dx = (e.screenX - this.getAttr(id, 'swidth')/2);
			this.setStyle(id, 'left', dx + 'px');
			return dx;
		},
		winCreate(item){
			this.startShow = 0;
			if(typeof(this.windows[item.id]) != 'undefined'){
				return this.winTop(item.id);
			}
			
			let data = {
				id:item.id,
				isShow:1,
				swidth:800 || item.width,
				sheight:500 || item.height,
				top:this.defTop,
				left:this.defLeft,
				isMax:1,
				title:item.label,
				conf:this.makeRichConf(item.name),
				state:1,
				icon:item.icon,
				zIndex:++this.maxZindex
			};
			if(!data.conf)return;
			data.style = {
				height : data.sheight + 'px',
				width : data.swidth + 'px',
				left : data.left + 'px',
				top : data.top + 'px',
				zIndex: data.zIndex,
			};
			this.$set(this.windows, item.id, data);
			this.defTop += 5;
			this.defLeft += 5;
			this.activeWinId = item.id;
			this.$nextTick(()=>{
			
				this.initPage(data.id, data.name, RUNKIT.ServerApi.getValue('params_' + data.id));
			});
		},
		winTop(id){
			this.activeWinId = id;
			
			if(this.getAttr(id, 'isMax') == 0){
				this.setAttr(id, 'isMax', 1);
			}
			
			if(this.getStyle(id, 'zIndex') >= this.maxZindex){
				return;
			}
			this.setStyle(id, 'zIndex', ++this.maxZindex);
			
		},
		setAttr(id, name, value){
			this.$set(this.windows[id], name, value);
		},
		getAttr(id, name){
			return this.windows[id][name];
		},
		getStyle(id, name){
			return this.windows[id].style[name];
		},
		setStyle(id, name, value){
			let style = this.windows[id].style;
			style[name] = value;
			this.$set(this.windows[id], 'style', style);
		},
		onResize(){
			let iconSize = 80;
			this.theight = this.$refs.disktop.clientHeight;
			this.twidth = this.$refs.disktop.clientWidth;
		
			this.disktop.iconCountH = parseInt(this.theight/iconSize);
			this.disktop.iconCountW = parseInt(this.twidth/iconSize);
			
			this.diskIcoBox = [];
			
			//页面resize后 初始化网格
			for(let i = 0; i < this.disktop.iconCountH * this.disktop.iconCountW; i++){
				this.diskIcoBox.push({id:'', label:'', icon:''});
			}
			
			//把菜单塞进网格
			for(let i = 0; i < this.menuList.length; i++){
				this.$set(this.diskIcoBox, this.getFreeBox(), this.menuList[i]);
			}
			
		},
		selectIco(item){
		
		},
		//找空的格子
		getFreeBox(){
			for(let w = 0; w < this.disktop.iconCountW; w++){
				for(let h = 0; h < this.disktop.iconCountH; h++){
					let idx = h * this.disktop.iconCountW + w;
					if(this.diskIcoBox[idx].id == ''){
						return idx;
					}
				}
			}
			return -1;
		},
		initPage(id, name, params){
			RUNKIT.VoimBus.publish('setConf', {id:id, data: this.pageList[name], params:params});
		},
		makeRichConf(name){
			if(typeof(this.pageList[name]) == 'undefined'){
				alert('不存在的应用:' + name);
				return false;
			}
			let conf = this.pageList[name];
			if(typeof(this.pageList[name].type) != 'undefined'){
				conf = {
					'index':{name:'', size:1, split:'', children:['a']},
					'a':{name:'', size:1, active:0, type:this.pageList[name].type, pageConfig:name}
				};
			}
			return conf;
		},
		loading(){
		},
		rightEvent:function(item){
			RUNKIT.VoimBus.publish('rightMenu', 
				{
					type:'show', 
					data: {id:item.id, menus:[{name:'edit', openTitle:'', openType:'dialog', target:'about', label:'没用的菜单'}]}
				}
			);
		},
		//(name, id, title, showFlag, params)
		showRichPage(name, id, label, showFlag, params){
			RUNKIT.ServerApi.setValue('params_' + id, params);
			this.winCreate({ico:'icon-app', id:id,name:name, 	label:label});
		},
		//桌面图标拖拽
		allowDrop(e, index){
			RUNKIT.ServerApi.setValue('tmp_drap_index', index);
		},
		dragEnd(e, index){
			let desIndex = RUNKIT.ServerApi.getValue('tmp_drap_index');
			let tmpItem = this.diskIcoBox[index];
			this.$set(this.diskIcoBox, index, this.diskIcoBox[desIndex]);
			this.$set(this.diskIcoBox, desIndex, tmpItem);
		},
   }
   
}
</script>
 
<style lang='less' scoped>

.ElementWind {
  position: absolute;
  border: 1px solid #57a3f3;
  background: #fff;
  box-sizing:border-box;
  display:flex;flex-direction:column;
  box-shadow: 0px 0px 10px 0 rgba(0,0,0,0.36);
}
 
a {
  padding-right: 5px;
  text-decoration: none;
  color: #fff;
}
 
a:hover {
  color: #fff;
}
 
.winHead {
	background: #57a3f3;
	line-height:1.3rem;
	font-size:0.6rem;
	color: #fff;
//	cursor: move;
	user-select: none;
}

.min-btn{
		text-align:center;width:1rem;height:1rem;line-height:1rem;font-size:0.9rem;color:#fff;float:right;
  }
 
.winHead a:link,
.winHead a:visited {
  font-size: 14px;
  font-weight: bold;
  padding: 0 3px;
  
}
 
.winBody {
  width: 100%;
  height: calc(100%);
  /* margin-top: -21px; */

}

.window-max{
	top:0 !important;
	left:0 !important;
	right:0 !important;
	bottom:0 !important;
}



.task-btn{
	float:left;width:1.6rem;height:1.6rem;margin-left:0.3rem;
	border-bottom:0.1rem solid #098df9;
	display:flex;
	filter:Alpha(opacity=60);
	.task-ico{
		flex:1;
	}
}

.win-active{
	border-bottom:0.1rem solid #50acf7;
	background:#ccc;
	
}

.icon-app{
	background:url('../assets/icon/app.svg') no-repeat center center;
	background-size:60% 60%;
}
.icon-start{
	background:url('../assets/icon/start.svg') no-repeat center center;
	background-size:60% 60%;
}

.disktop{
	position:absolute;z-index:0;top:0;left:0;right:0;bottom:1.6rem;
	background:#000 url('../assets/icon/windows.svg') no-repeat center center;
	background-size:30% 30%;
	color:#fff;
	text-shadow: 2px 1px 1px #000;
	.icon-box{
		float:left;box-sizing:border-box;padding:0.2rem;display:flex;width:80px;height:80px;
	}
	.icon-inner{
		flex:1;display:flex;flex-direction:column;
		&:hover{
			background-color: rgba(222,222,222,0.3);
		}
	}
	.active{
		background-color: rgba(222,222,222,0.3);
	}
}

.task-panel{
	position:absolute;z-index:100000;height:1.6rem;background:rgba(11,11,16, 0.9);left:0;right:0;bottom:0;display:flex;
}

</style>
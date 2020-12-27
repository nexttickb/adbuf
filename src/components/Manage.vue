<template>
<div :class="['app']" id="app" style="position:absolute;top:0;left:0;right:0;bottom:0;display:flex;">
	<div class="abs bg-hd" style="top:0;left:0;right:0;height:1.8rem;display:flex;">
		<div style="width:5rem;color:#eee;padding-left:0.3rem;line-height:1.6rem">后台管理</div>
		<div style="flex:1;"></div>
		<div @click='logout' style="width:3rem;font-size:0.8rem;color:#ccc;padding-left:0.3rem;line-height:1.6rem">退出</div>
	</div>
	<!--左侧菜单-->
	<div class="abs bg-01 flex-col scroll-y" style="top:1.8rem;left:0;bottom:0;width:6rem;">
		<div class="menu flex1 scroll-y" style="cursor:default;color: #48576a;font-size:0.6rem;line-height:1.5rem;">
			<div v-for='m in menu'>
				<div style="width:100%;padding-left:0.3rem;" @click="m.open = !m.open">{{m.label}}</div>
				<ul style="margin:0;padding:0;" v-show="m.open">
					<li @click="showRichPage(s.name, s.name, s.label, s.showFlag)" :class="[menuSelected==s.name?'active':'','menu-title']" style="" v-for="s in m.subMenu">{{s.label}}</li>
				</ul>
			</div>
		</div>
	</div>
	<!--tab标签-->
	<div style="position:absolute;top:1.8rem;left:6rem;right:0;height:1.2rem;background:#ccc;overflow-x:scroll">
		<div v-for="(tab, index) in servPages" :class="['tab-item', nowTabSelect == index?'tab-active':'']" @click="onPageActive(index)" style="">
			{{tab.label}}
			<div @click="onTabClose(index)" style="width:0.5rem;height:0.5rem;color:#333;float:right;line-height:0.5rem;">×</div>
		</div>
	</div>
	
	<!--page 展示时渲染，只渲染一个 控制dom总数-->
	<div style="position:absolute;top:3rem;left:6rem;bottom:0;right:0;padding:1rem;overflow-y:scroll">
		<WinTree v-for="page in servPages" class="abs"  :pageList="pageList" :config="page.conf" style="top:0rem;left:0rem;bottom:0;right:0;padding:3px;display:flex;" :id="page.id" :name="page.name" ref="rich" v-if="nowPage == page.id"></WinTree>
	</div>
	
	<!--模态dialog 创建后渲染，直到消除, 同时渲染多个-->
	<div v-for="page in servDialogs" style="position:absolute;background:rgba(1,1,1,0.3);z-index:99999;top:0;left:0;right:0;bottom:0;display:flex;padding:3rem 6rem 3rem 6rem;">
		<div style="flex:1;background:#fff;border-radius:0.5rem;display:flex;flex-direction:column;">
			<div style="height:1.5rem;border-radius:0.5rem 0.5rem 0rem 0rem;background:#ccc;color:#fff;text-align:center;">
				<span>{{page.label}}</span>
				<div @click="onDialogClose(page.id)" style="width:1rem;height:1rem;color:#333;float:right;margin-right:0.5rem;line-height:1rem;">×</div>
			</div>
			<WinTree style="flex:1;display:flex;overflow-y:scroll;box-sizing:border-box;"  :pageList="pageList" :config="page.conf" :id="page.id" :name="page.name"></WinTree>
		</div>
	</div>
	
	
	
	<RightMenu></RightMenu>
	<Login></Login>
	<div v-show="isLoading" class="loading"><div class="loader"><div class="ball-clip-rotate-multiple"><div></div><div></div></div></div></div>
</div>
</template>

<script>


import Login from '@/components/Login'

import RightMenu from '@/components/RightMenu'


import WinTree from '@/components/WinTree'

/*
	db.option.insert({option_id:'default'});
	db.manager.insert({manager_name:'admin', manager_password:'123456'});
	db.notice.insert({notice_id:'default'});
*/

export default {
    name: 'app',
    components: {
       Login,WinTree,RightMenu
    },
	props: ['pageList'],
    data() {
        return {
			isLoading:false,
            nowPage:'dashboard',
			resizeTimer:false,
			menuSelected:'',
			servPages:[{type:'dashboard', name:'dashboard', label:'main', id:'dashboard'}],
			servDialogs:{},
			maxDialogIndex:1000,
			nowTabSelect:0,
			menu:[
				{open:1, label:'系统配置', subMenu:[
						{name:'dashboard', label:'系统看板'},
						{name:'optionsEdit', label:'应用设置'},
						{name:'noticeEdit', label:'公告设置'},
						{name:'shell', label:'shell测试', showFlag:2},
						{name:'passwdEdit', label:'管理密码', showFlag:2},
						{name:'message', label:'自定义组件测试', showFlag:2},
						{name:'richPage1', label:'多组件shell测试'},
						{name:'richPage2', label:'列表+聊天组合'},
						{name:'richPage', label:'树+主细表测试'},
					]},
				{open:1, label:'用户管理', subMenu:[
						{name:'userList', label:'用户管理'},
						{name:'onlineList', label:'在线客户'}
					]},
				{open:1, label:'视频采集', subMenu:[
						{name:'gatherList', label:'采集接口', showFlag:1}
					]},
				{open:1, label:'视频库', subMenu:[
						{name:'typeList', label:'分类管理'},
						{name:'movieList', label:'视频管理'}
					]},
				{open:1, label:'广告管理', subMenu:[
						{name:'adList', label:'广告管理'}
					]},
			]
        }
    },
    mounted:function(){

        RUNKIT.APP = this;

		
		RUNKIT.VoimBus.subscribe('public', (topic, res)=>{
			
		});
		

		this.initData();
		
		
		window.onresize = this.onResize;
		
		document.getElementById('mask').style.display = "none";
		
	//	setInterval(function () { debugger }, 100);
	

    },
    computed: {
    },
    methods: {
		onPageActive(index){
			let data = this.servPages[index];
			this.showPage(data.id);
			this.nowTabSelect = index;
			this.$nextTick(()=>{
				this.initPage(data.id, data.name, RUNKIT.ServerApi.getValue('params_' + data.id));
			});
		},
		onDialogActive(id){
			let data = this.servDialogs[id];

			this.$nextTick(()=>{
				this.initPage(data.id, data.name, RUNKIT.ServerApi.getValue('params_' + id));
			});
		},
		initPage(id, name, params){
			RUNKIT.VoimBus.publish('setConf', {id:id, data: this.pageList[name], params:params});
		},
		onTabClose(index){
			this.servPages.splice(index, 1);
			this.onPageActive(index - 1);
		},
		onDialogClose(id){
			this.$delete(this.servDialogs, id);
		},
		showRichPage(name, id, title, showFlag, params){
		
			if(typeof(this.pageList[name]) == 'undefined'){
				return alert('不存在的配置:', name);
			}
			let type =  this.pageList[name].type;
			showFlag = showFlag || 1;
			
			RUNKIT.ServerApi.setValue('params_' + id, params);

			if(1 == showFlag){
				for(let i = 0; i < this.servPages.length; i++){
					if(this.servPages[i].id == id){
						return this.onPageActive(i);
					}
				}
				this.addPage(type, name, id || (new Date()).valueOf(), title || this.pageList[name].label, params || 0);
			}
			if(2 == showFlag){
				if(typeof(this.servDialogs[id]) != 'undefined')
					return this.onDialogActive(id);
				this.addDialog(type, name, id || (new Date()).valueOf(), title || this.pageList[name].label, params || 0);
			}
		},
		makeRichConf(name){
			let conf = this.pageList[name];
			if(typeof(this.pageList[name].type) != 'undefined'){
				conf = {
					'index':{name:'', size:1, split:'', children:['a']},
					'a':{name:'', size:1, active:0, type:this.pageList[name].type, pageConfig:name}
				};
			}
			return conf;
		},
		addPage(type, name, id, title, params){
			let conf = this.makeRichConf(name);
			this.servPages.push({name:name, conf:conf, label:title, id: id, params:params});
			this.onPageActive(this.servPages.length - 1);
		},
		addDialog(type, name, id, title, params){
			let conf = this.makeRichConf(name);
			this.$set(this.servDialogs, id, {type:type, name:name, conf:conf, label:title, id: id, params:params, index:this.maxDialogIndex});
			this.onDialogActive(id);
			this.maxDialogIndex++;
		},
        showPage(name, param){
			let prePage = '';
			if(name != this.nowPage){
				prePage = this.nowPage;
				this.nowPage = name;
			}
			RUNKIT.VoimBus.publish('public', {type:'showPage', data: {name:name, prePage:prePage, param:param}});
        },
		fullScreen() {
			let ele = document.body;
			if (ele.requestFullscreen) {
				ele.requestFullscreen();
			} else if (ele.mozRequestFullScreen) {
				ele.mozRequestFullScreen();
			} else if (ele.webkitRequestFullscreen) {
				ele.webkitRequestFullscreen();
			} else if (ele.msRequestFullscreen) {
				ele.msRequestFullscreen();
			}if (ele.requestFullscreen) {
				ele.requestFullscreen();
			} else if (ele.mozRequestFullScreen) {
				ele.mozRequestFullScreen();
			} else if (ele.webkitRequestFullscreen) {
				ele.webkitRequestFullscreen();
			} else if (ele.msRequestFullscreen) {
				ele.msRequestFullscreen();
			}
		},
		onResize(){
			if(this.resizeTimer)return;
			this.resizeTimer = setTimeout(()=>{
				RUNKIT.VoimBus.publish('public', {type:'resize', data: {}});
				clearTimeout(this.resizeTimer);
				this.resizeTimer = false;
			}, 500);
		},
		loading(bl){
			this.isLoading = bl;
		},
		initData(){
		},
		logout(){
			window.RUNKIT.ServerApi.logout();
		}
    }
}
</script>

<style lang='less'>

@import '../assets/cursor.less';

body,html{
	margin:0;
	padding:0;
}
*{
	outline:none;
}

.flex{
	display:flex;
}
.flex-col{
	display:flex;
	flex-direction:column;
}
.flex1{
	flex:1;
}
.abs{
	position:absolute;
}
.bg-hd{
	background:#20a0ff;
}
.bg-01{
	background-color: #eef1f6;
}
.scroll-y{
	overflow-y:scroll;
}
.my-body{
	position:absolute;
	top:0;right:0;left:0;bottom:0;
}
.bd-left{
	width:6rem;
	background:#eee;
}
.bd-right{
	font-size:0.6rem;
}
.bd-head{
	height:1.8rem;
}
.bd-content{
	
}
.table-group{
	
}


.tab-item{
	background:#eee;float:left;margin-left:0.2rem;width:5rem;height:1rem;margin-top:0.2rem;font-size:0.6rem;text-align:center;line-height:1rem;cursor:default;
}

.tab-active{
	background:#fff;
}

.menu{
	.menu-title {
		height: 1.5rem;
		line-height: 1.5rem;
		font-size: 0.6rem;
		color: #48576a;
		padding: 0 0.2rem;
		cursor: pointer;
		position: relative;
		transition: border-color .3s,background-color .3s,color .3s;
		box-sizing: border-box;
		white-space: nowrap;
		background-color: #e4e8f1;
		padding-left:1rem;
	}
	.active {
		color: #20a0ff;
	}

	

}

::-webkit-scrollbar {
	width: 0px;
	height: 0px;
}

.loading, alert{
	z-index:910000;position:absolute;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.3);display: flex;box-sizing: border-box;
}
.loader {
	margin: auto;
}
.ball-clip-rotate-multiple {
	position: relative;
}
.ball-clip-rotate-multiple>div {
	position: absolute;
	left: -2rem;
	top: -2rem;
	border: 0.5rem solid #efefef;
	border-bottom-color: transparent;
	border-top-color: transparent;
	border-radius: 100%;
	height: 3.5rem;
	width: 3.5rem;
	-webkit-animation: rotate 1s 0s ease-in-out infinite;
	animation: rotate 1s 0s ease-in-out infinite;
}

.ball-clip-rotate-multiple>div:last-child {
	display: inline-block;
	top: -10px;
	left: -10px;
	width: 15px;
	height: 15px;
	-webkit-animation-duration: .5s;
	animation-duration: .5s;
	border-color: #fff transparent;
	-webkit-animation-direction: reverse;
	animation-direction: reverse;
}


@keyframes rotate{
	0% {
		-webkit-transform: rotate(0) scale(1);
		transform: rotate(0) scale(1);
	}
	50% {
		-webkit-transform: rotate(180deg) scale(.6);
		transform: rotate(180deg) scale(.6);
	}
	100% {
		-webkit-transform: rotate(360deg) scale(1);
		transform: rotate(360deg) scale(1);
	}
}


button {
    background-color: #4CAF50;
    border: none;
    color: white;
    text-align: center;
    text-decoration: none;
    display: inline-block;
    cursor: pointer;
    -webkit-transition-duration: 0.4s; /* Safari */
    transition-duration: 0.4s;
	box-shadow: 0 3px 6px 0 rgba(0,0,0,0.2), 0 3px 6px 0 rgba(0,0,0,0.19);
	&:active{
		transition-duration: 0.4s;
		background:#fff;
	}
}
.btn-red{
	background:#af7272;
}


</style>

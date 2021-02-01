<template>
<div>
	<Manage v-if="init && uiMode == 0"></Manage>
	<Win10 v-if="init && uiMode == 1"></Win10>
</div>
</template>

<script>
import ServerApi from '@/components/lib/ServerApi'
import VoimBus from '@/components/lib/VoimBus'
import Store from '@/components/lib/Store'
import Configs from '@/components/Config.js'
import Manage from '@/components/Manage'
import Win10 from '@/components/Win10'

/*
use media;
db.manager.insert({manager_name:'admin',manager_password:'123456'});
*/

export default {
    name: 'app',
    components: {
       Manage,Win10
    },
    data() {
        return {
			uiMode:1,
			init:0,
			Config:{},
			Menu:[
				{ico:'icon-app', id:'id_menuList', name:'menuList', 	label:'菜单管理'},
				{ico:'icon-app', id:'id_appList', name:'appManage', 	label:'应用管理'},
				{ico:'icon-app', id:'id_apiList', name:'apiManage', 	label:'接口管理'},
			],
        }
    },
    mounted:function(){
        RUNKIT.ServerApi = new ServerApi();
		RUNKIT.VoimBus = new VoimBus();
		RUNKIT.Store = new Store();

		RUNKIT.ServerApi.init();
		RUNKIT.VoimBus.subscribe('public', (topic, res)=>{
			if(res.type == 'logged'){
				this.appInit();
			}
		});
		
		window.onresize = this.onResize;
		
		document.getElementById('mask').style.display = "none";
		
	//	setInterval(function () { debugger }, 100);
		this.init = true;
    },
    computed: {
    },
    methods: {
		async appInit(){
			let res = await RUNKIT.ServerApi.appConfigGet();
			let apps = res.data.apps;
			let menus = res.data.menus;
			let pageList = Configs;//内置
		//	alert(JSON.stringify(apps));
			for(let i = 0; i < apps.length; i++){
				try{
			//		alert(apps[i].app_name);
					eval('pageList[apps[i].app_name] = {' + apps[i].app_code + '}');
				}catch(e){
					console.log('加载app:' + apps[i].app_name + ' 失败！');
					console.log('失败原因:' + JSON.stringify(e));
				}
			}
			let menuList = [//内置
				{icon:'', id:'id_menuList', name:'menuList', 	label:'菜单管理'},
				{icon:'', id:'id_appList', name:'appManage', 	label:'应用管理'},
				{icon:'', id:'id_apiList', name:'apiManage', 	label:'接口管理'},
			];
			for(let i = 0; i < menus.length; i++){
				menuList.push({icon:menus[i].menu_icon, id:menus[i].menu_id, name:menus[i].menu_app, 	label:menus[i].menu_title});
			}
			RUNKIT.VoimBus.publish('config', {type:'pageList', data: pageList});
			RUNKIT.VoimBus.publish('config', {type:'menuList', data: menuList});
		},
		loading(){
		
		}
    }
}
</script>

<style lang='less'>


</style>

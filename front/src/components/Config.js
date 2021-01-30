export default  {
	richPage:{
		'index':{name:'左右分割', size:1, split:'vertical', children:['03','02']},
		'02':{name:'左', size:1, active:0, type:'tree', pageConfig:'typeTree'},
		'03':{name:'右', size:3, active:0, type:'grid', pageConfig:'movieList'}
	},
	richPage1:{
		'index':{name:'左右分割', size:1, split:'vertical', children:['03','02']},
		'02':{name:'左', size:1, active:0, type:'grid', pageConfig:'typeSelectList'},
		'03':{name:'右', size:3, active:0, type:'shell', pageConfig:'shell'}
	},
	richPage2:{
		'index':{name:'左右分割', size:1, split:'vertical', children:['03','02']},
		'02':{name:'左', size:1, active:0, type:'grid', pageConfig:'onlineSelectList'},
		'03':{name:'右', size:3, active:0, type:'message', pageConfig:'message'}
	},
	about:{
		type:'form',
		api:{},
		formConfig : {
			form:[
				{"name": "about", 	"value":"这是一个可以通过配置生成后台UI的框架。这是一个可以通过配置生成后台UI的框架。这是一个可以通过配置生成后台UI的框架。这是一个可以通过配置生成后台UI的框架。这是一个可以通过配置生成后台UI的框架。",	"label": "关于:","cols": 3,"order": 5,"type":"text", placeholder:""},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	optionsEdit:{
		type:'form',
		api:{update:'Admin.optionUpdate', retrieveOne:'Admin.optionGet'},
		formConfig : {
			form:[
				{"name": "option_appName", 	"value":"",	"label": "应用名称","cols": 1,"order": 5,"type":"input", placeholder:"例: XX影视"},
				{type:'br'},
				{"name": "option_appLogo", 	"value":"",	"label": "logo图片","cols": 1,"order": 5,"type":"image", placeholder:"例: 图片"},
				{type:'br'},
				{"name": "option_server", 	"value":"",	"label": "服务器","cols": 1,"order": 5,"type":"input", placeholder:"例: 192.168.0.9:3000"},
				{type:'br'},
				{"name": "option_bgImg1", 	"value":"",	"label": "背景图1","cols": 2,"order": 5,"type":"image", placeholder:"背景轮播的图片"},
				{"name": "option_bgImg2", 	"value":"",	"label": "背景图2","cols": 2,"order": 5,"type":"image", placeholder:"背景轮播的图片"},
				{"name": "option_bgImg3", 	"value":"",	"label": "背景图3","cols": 2,"order": 5,"type":"image", placeholder:"背景轮播的图片"},
				{"name": "option_file4", 	"value":"",	"label": "文件上传测试","cols": 2,"order": 5,"type":"file", placeholder:"选一个文件"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	message:{
		type:'message',
		api:{},
		messageConfig : {},
		button:[]
	},
	shell:{
		type:'shell',
		api:{},
		shellConfig : {},
		button:[]
	},
	codeEdit:{
		type:'code',
		api:{},
		codeConfig : {},
		button:[]
	},
	menuList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'menuAdd', label:'新增菜单'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.menuList', update:'Admin.menuUpdate',create:'Admin.menuAdd',delete:'Admin.menuDelete'},
		gridConfig:{
			columns:[
				{label:"id", field:"menu_id", type:"text", width: 1, align:'center'},	
				{label:"类型", field:"menu_type", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"标题", field:"menu_title", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"描述", field:"menu_description", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"应用", field:"menu_app", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'菜单设置', openType:'dialog', target:'menuEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'menuAdd', label:'删除'}]},
			pagination:1
		}
	},
	menuEdit:{
		type:'form',
		api:{update:'Admin.menuUpdate',retrieveOne:'Admin.menuGet'},
		formConfig : {
			form:[
				{"name": "menu_id", 		"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "menu_type", 	"value":"",	"label": "类型","cols": 1,"order": 0,"type": "input"},
				{"name": "menu_icon", 	"value":"",	"label": "图标","cols": 1,"order": 0,"type": "icon"},
				{"name": "menu_title", 	"value":"",	"label": "标题","cols": 1,"order": 0,"type": "input"},
				{"name": "menu_description", 	"value":"",	"label": "描述","cols": 1,"order": 0,"type": "input"},
				{"name": "menu_app", 	"value":"",	"label": "应用","cols": 3,"order": 0,"type": "input"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	menuAdd:{
		type:'form',
		api:{create:'Admin.menuAdd'},
		formConfig : {
			form:[
				{"name": "menu_id", 		"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "menu_type", 	"value":"",	"label": "类型","cols": 1,"order": 0,"type": "input"},
				{"name": "menu_icon", 	"value":"",	"label": "图标","cols": 1,"order": 0,"type": "icon"},
				{"name": "menu_title", 	"value":"",	"label": "标题","cols": 1,"order": 0,"type": "input"},
				{"name": "menu_description", 	"value":"",	"label": "描述","cols": 1,"order": 0,"type": "input"},
				{"name": "menu_app", 	"value":"",	"label": "应用","cols": 3,"order": 0,"type": "input"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	appManage:{
		'index':{name:'左右分割', size:1, split:'vertical', children:['03','02']},
		'02':{name:'左', size:3, active:0, type:'grid', pageConfig:'appList'},
		'03':{name:'右', size:7, active:0, type:'code', pageConfig:'appCode'}
	},
	apiManage:{
		'index':{name:'左右分割', size:1, split:'vertical', children:['03','02']},
		'02':{name:'左', size:3, active:0, type:'grid', pageConfig:'apiList'},
		'03':{name:'右', size:7, active:0, type:'code', pageConfig:'apiCode'}
	},
	
	appList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'appAdd', label:'新增应用'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.appList', update:'Admin.appUpdate',create:'Admin.appAdd',delete:'Admin.appDelete'},
		menus:[{name:'edit', openTitle:'影视编辑', openType:'dialog', target:'appEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'appDel', label:'删除'}],
		event:{select:{name:'message', openTitle:'', openType:'', target:'appCode'}},
		gridConfig:{
			columns:[
				{label:"应用名称", field:"app_name", type:"text", width: 1.5, align:'center', searchType:'string'},
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'设置', openType:'dialog', target:'appEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'appAdd', label:'删除'}]},
			pagination:1
		}
	},
	appEdit:{
		type:'form',
		api:{update:'Admin.appUpdate',retrieveOne:'Admin.appGet'},
		formConfig : {
			form:[
				{"name": "app_id", 		"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "app_name", 	"value":"",	"label": "应用名称","cols": 2,"order": 0,"type": "input"},
				{"name": "app_description", 	"value":"",	"label": "应用描述","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	appAdd:{
		type:'form',
		api:{create:'Admin.appAdd'},
		formConfig : {
			form:[
				{"name": "app_id", 		"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "app_name", 	"value":"",	"label": "应用名称","cols": 2,"order": 0,"type": "input"},
				{"name": "app_description", 	"value":"",	"label": "应用描述","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	appCode:{
		type:'code',
		api:{update:'Admin.appCodeUpdate', retrieveOne:'Admin.appCodeGet'},
		codeConfig : {
			keyCol:'app_id',
			contentCol:'app_code'
		},
		button:[]
	},
	apiCode:{
		type:'code',
		api:{update:'Admin.apiCodeUpdate', retrieveOne:'Admin.apiCodeGet'},
		codeConfig : {
			keyCol:'api_id',
			contentCol:'api_code'
		},
		button:[]
	},
	apiList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'apiAdd', label:'新增接口'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.apiList', update:'Admin.apiUpdate',create:'Admin.apiAdd',delete:'Admin.apiDelete'},
		event:{select:{name:'message', openTitle:'', openType:'', target:'apiCode'}},
		gridConfig:{
			columns:[
				{label:"接口名称", field:"api_name", type:"text", width: 1.5, align:'center', searchType:'string'},
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'接口设置', openType:'dialog', target:'apiEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'apiAdd', label:'删除'}]},
			pagination:1
		}
	},
	apiEdit:{
		type:'form',
		api:{update:'Admin.apiUpdate',retrieveOne:'Admin.apiGet'},
		formConfig : {
			form:[
				{"name": "api_id", 		"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "api_name", 	"value":"",	"label": "接口名称","cols": 1,"order": 0,"type": "input"},
				{"name": "api_description", 	"value":"",	"label": "接口描述","cols": 1,"order": 0,"type": "input"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	apiAdd:{
		type:'form',
		api:{create:'Admin.apiAdd'},
		formConfig : {
			form:[
				{"name": "api_id", 		"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "api_name", 	"value":"",	"label": "接口名称","cols": 1,"order": 0,"type": "input"},
				{"name": "api_description", 	"value":"",	"label": "接口描述","cols": 1,"order": 0,"type": "input"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},

	
	
};
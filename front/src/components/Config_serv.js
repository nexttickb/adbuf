
/*

	针对模拟的场景处理，针对模拟场景积累一套适用范围较广的意图集合。
	
	场景分类｛
		场景列表【左侧列表】｛
			该场景语言(语言下拉)【表单开头】｛
				该场景对应语言的列表，编辑可以修改关联。
			｝
		｝
	｝
	意图分类{
		意图规则列表｛
			详细意图定义及对应的可能有的特殊情况处理代码
		｝
	}
	
	语言管理
	场景分类管理
	场景管理
	意图树管理(树中存放意图){//节点是唯一的
		意图匹配列表管理(意图匹配及槽位置、语言、情绪、态度等)
		节点特殊处理代码(意图特殊情况处理代码)
	}
	
*/

export default  {
	dashboard:{
		type:'dashboard',
		api:{update:'Admin.dashboard'},
	},
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
	//主机相关
	
	monitorList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增地址', openType:'dialog', target:'playUrlAdd', label:'新增地址'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.playUrlList'},
		gridConfig:{
			columns:[
				{label:"名称", field:"url_name", type:"text", width: 1, align:'center'},	
				{label:"地址", field:"url_src", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"类型", field:"url_type", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'地址编辑', openType:'dialog', target:'playUrlEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'', label:'删除'}]},
			pagination:1
		}
	},
	monitorEdit:{
		type:'form',
		api:{create:'Admin.playUrlEdit'},
		formConfig : {
			form:[
				{"name": "url_name", "value":"",	"label": "名称","cols": 3,"order": 0,"type": "input"},
				{"name": "url_src", "value":"",	"label": "地址","cols": 3,"order": 0,"type": "textarea"},
				{"name": "url_type", "value":"",	"label": "类型","cols": 3,"order": 0,"type": "input"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	monitorAdd:{
		type:'form',
		api:{create:'Admin.playUrlAdd'},
		formConfig : {
			form:[
				{"name": "url_name", "value":"","label": "名称","cols": 3,"order": 0,"type": "input"},
				{"name": "url_src", "value":"",	"label": "地址","cols": 3,"order": 0,"type": "textarea"},
				{"name": "url_type", "value":"","label": "类型","cols": 3,"order": 0,"type": "input"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	
	clientAdd:{
		type:'form',
		api:{create:'Symbol.langAdd'},
		formConfig : {
			form:[
				{"name": "client_id", 	"value":"",	"label": "名称","cols": 1,"order": 0,"type": "input"},
				{"name": "client_name", 	"value":"",	"label": "IP","cols": 1,"order": 0,"type": "input"},
				{"name": "client_name", 	"value":"",	"label": "启用","cols": 1,"order": 0,"type": "input"},
				{"name": "client_service", 	"value":"",	"label": "服务监控","cols": 3,"order": 5,"type":"pageGrid", target:'playUrlList', placeholder:"下拉选择", },
				{"name": "client_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	clientEdit:{
		type:'form',
		api:{update:'Symbol.langUpdate',retrieveOne:'Symbol.langGet'},
		formConfig : {
			form:[
				{"name": "client_id", 	"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "client_name", 	"value":"",	"label": "语言名称","cols": 1,"order": 0,"type": "input"},
				{"name": "client_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	clientManage:{
		type:'grid',
		toolbar:[{name:'refresh', label:'刷新列表'},{name:'refresh', label:'新增主机'}],
		api:{retrieve:'Admin.userList',retrieveOne:'Admin.userGet', update:'Admin.userUpdate',create:'Admin.userAdd',delete:'Admin.userDelete'},
		menus:[
			{name:'edit', openTitle:'编辑', openType:'dialog', target:'message', label:'编辑'},
		],
		gridConfig:{
			columns:[
				{label:"id", field:"user_id", type:"text", width: 1, align:'center', searchType:'integer'},
				{label:"主机名", field:"user_name", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"IP", field:"user_phone", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"MAC", field:"user_ip", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"状态", field:"user_loginTime", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"user_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[
				{name:'edit', openTitle:'编辑', openType:'dialog', target:'message', label:'编辑'},
			]},
			pagination:1
		},
	},
	clientList:{
		type:'grid',
		toolbar:[{name:'refresh', label:'刷新列表'},{name:'update', label:'批量更新'},{name:'command', label:'批量执行'}],
		api:{retrieve:'Admin.userList',retrieveOne:'Admin.userGet', update:'Admin.userUpdate',create:'Admin.userAdd',delete:'Admin.userDelete'},
		menus:[
			{name:'edit', openTitle:'执行命令', openType:'dialog', target:'message', label:'执行命令'},
			{name:'edit', openTitle:'服务详情', openType:'dialog', target:'message', label:'服务详情'},
			{name:'edit', openTitle:'日志', openType:'dialog', target:'message', label:'日志查看'},
			{name:'edit', openTitle:'', openType:'dialog', target:'message', label:'重启'}
		],
		gridConfig:{
			columns:[
				{label:"id", field:"user_id", type:"text", width: 1, align:'center', searchType:'integer'},
				{label:"主机名", field:"user_name", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"IP", field:"user_phone", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"服务状态", field:"user_ip", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"运行时间", field:"user_loginTime", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"user_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[
				{name:'edit', openTitle:'服务管理', openType:'dialog', target:'message', label:'服务管理'},
				{name:'edit', openTitle:'执行命令', openType:'dialog', target:'message', label:'执行命令'},
			]},
			pagination:1
		},
	},
	//语言管理
	//语言下拉选择
	langSelectList:{
		type:'grid',
		toolbar:[{name:'refresh', label:'刷新'}],
		api:{retrieve:'Symbol.langList'},
		gridConfig:{
			columns:[
				{label:"语言种类", field:"client_name", type:"text", width: 1.5, align:'center', searchType:'string'},
			],
			btnCol:{width:2, btn:[{name:'message', openTitle:'', openType:'', target:'simulationList', label:'选择'}]},
			pagination:1
		}
	},
	//语言列表
	langList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'typeAdd', label:'新增语言'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Symbol.langList', update:'Symbol.langUpdate',create:'Symbol.langAdd',delete:'Symbol.langDelete'},
		event:{select:{name:'message', openTitle:'', openType:'', target:'simulationList'}},
		gridConfig:{
			columns:[
				{label:"id", field:"client_id", type:"text", width: 1, align:'center'},	
				{label:"语言种类", field:"client_name", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"备注", field:"client_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'语言编辑', openType:'dialog', target:'typeEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'typeAdd', label:'删除'}]},
			pagination:1
		}
	},
	langEdit:{
		type:'form',
		api:{update:'Symbol.langUpdate',retrieveOne:'Symbol.langGet'},
		formConfig : {
			form:[
				{"name": "client_id", 	"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "client_name", 	"value":"",	"label": "语言名称","cols": 1,"order": 0,"type": "input"},
				{"name": "client_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	langAdd:{
		type:'form',
		api:{create:'Symbol.langAdd'},
		formConfig : {
			form:[
				{"name": "client_id", 	"value":"",	"label": "语言id","cols": 1,"order": 0,"type": "input"},
				{"name": "client_name", 	"value":"",	"label": "语言名称","cols": 1,"order": 0,"type": "input"},
				{"name": "client_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},	

	//场景模拟
	simulationList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'simulationAdd', label:'新增影片'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Symbol.simulationList', update:'Symbol.simulationUpdate',create:'Symbol.simulationAdd',delete:'Symbol.simulationDelete'},
		menus:[{name:'edit', openTitle:'语料编辑', openType:'dialog', target:'simulationEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'simulationAdd', label:'删除'}],
		event:{},
		
		gridConfig:{
			columns:[
				{label:"id", field:"simulation_id", type:"text", width: 1, align:'center'},	
				{label:"场景Id", field:"simulation_groupId", type:"text", width: 1, align:'center'},	
				{label:"场景排序", field:"simulation_groupOrder", type:"text", width: 1, align:'center'},	
				{label:"语言", field:"simulation_language", type:"text", width: 1, align:'center'},	
				{label:"内容", field:"simulation_content", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"状态", field:"simulation_state", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"备注", field:"type_remark", type:"text", width: 2, align:'center', searchType:'string'},

			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'语料编辑[{{name}}]', openType:'dialog', target:'simulationEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'simulationAdd', label:'删除'}]},
			pagination:1
		},
	},
	simulationEdit:{
		type:'form',
		api:{update:'Symbol.simulationUpdate',retrieveOne:'Symbol.simulationGet'},
		
		formConfig : {
			form:[
				{"name": "simulation_id", 	"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "simulation_groupId", 	"value":"",	"label": "场景组","cols": 2,"order": 0, "type":"netSelect",whereKey:'type_id', showValue:'type_name',needValue:{'type_pid':'type_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "simulation_groupOrder", 	"value":"",	"label": "组排序","cols": 2,"order": 0,"type": "input"},
				{"name": "simulation_language", 	"value":"",	"label": "语言","cols": 2,"order": 0,"type":"netSelect",whereKey:'type_id', showValue:'type_name',needValue:{'type_pid':'type_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "simulation_content", 	"value":"",	"label": "内容","cols": 2,"order": 0,"type": "input"},
				{"name": "simulation_state", 	"value":"",	"label": "状态","cols": 2,"order": 0,"type": "input"},
				{"name": "simulation_remark", 	"value":"",	"label": "备注","cols": 2,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	simulationAdd:{
		type:'form',
		api:{create:'Symbol.simulationAdd'},
		formConfig : {
			form:[
				{"name": "simulation_groupId", 	"value":"",	"label": "场景组","cols": 2,"order": 0, "type":"netSelect",whereKey:'type_id', showValue:'type_name',needValue:{'type_pid':'type_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "simulation_groupOrder", 	"value":"",	"label": "组排序","cols": 2,"order": 0,"type": "input"},
				{"name": "simulation_language", 	"value":"",	"label": "语言","cols": 2,"order": 0,"type":"netSelect",whereKey:'type_id', showValue:'type_name',needValue:{'type_pid':'type_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "simulation_content", 	"value":"",	"label": "内容","cols": 2,"order": 0,"type": "input"},
				{"name": "simulation_state", 	"value":"",	"label": "状态","cols": 2,"order": 0,"type": "input"},
				{"name": "simulation_remark", 	"value":"",	"label": "备注","cols": 2,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},

	//场景类型 
		//类型
	typeSelectList:{
		type:'grid',
		toolbar:[{name:'refresh', label:'刷新'}],
		api:{retrieve:'Symbol.scenesList', update:'Symbol.scenesUpdate',create:'Symbol.scenesAdd',delete:'Symbol.scenesDelete'},
		gridConfig:{
			columns:[
				{label:"场景类型", field:"scenes_name", type:"text", width: 1.5, align:'center', searchType:'string'},
			],
			btnCol:{width:2, btn:[{name:'message', openTitle:'', openType:'', target:'simulationList', label:'选择'}]},
			pagination:1
		}
	},
	scenesList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'typeAdd', label:'新增分类'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Symbol.scenesList', update:'Symbol.scenesUpdate',create:'Symbol.scenesAdd',delete:'Symbol.scenesDelete'},
		event:{select:{name:'message', openTitle:'', openType:'', target:'simulationList'}},
		gridConfig:{
			columns:[
				{label:"id", field:"scenes_id", type:"text", width: 1, align:'center'},	
				{label:"场景类型", field:"scenes_name", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"父分类id", field:"scenes_pid", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"scenes_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'分类编辑', openType:'dialog', target:'typeEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'typeAdd', label:'删除'}]},
			pagination:1
		}
	},
	scenesEdit:{
		type:'form',
		api:{update:'Symbol.scenesUpdate',retrieveOne:'Symbol.scenesGet'},
		formConfig : {
			form:[
				{"name": "scenes_id", 	"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "scenes_name", 	"value":"",	"label": "场景类型","cols": 1,"order": 0,"type": "input"},
				{"name": "scenes_pid", 	"value":"",	"label": "父分类","cols": 2,"order": 5,"type":"netSelect", whereKey:'scenes_id', showValue:'scenes_name',needValue:{'scenes_pid':'scenes_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "scenes_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	scenesAdd:{
		type:'form',
		api:{create:'Symbol.scenesAdd'},
		formConfig : {
			form:[
				{"name": "scenes_id", 	"value":"",	"label": "分类id","cols": 1,"order": 0,"type": "input"},
				{"name": "scenes_name", 	"value":"",	"label": "场景类型","cols": 1,"order": 0,"type": "input"},
				{"name": "scenes_pid", 	"value":"",	"label": "父分类id","cols": 1,"order": 0,"type": "input"},
				{"name": "scenes_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	scenesTree:{
		type:'tree',
		toolbar:[{name:'refresh', label:'刷新'}],
		api:{treeData:'Admin.scenesTree'},
		menus:[{name:'edit', openTitle:'分类编辑', openType:'dialog', target:'scenesEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'typeAdd', label:'删除'}],
		event:{select:{name:'message', openTitle:'', openType:'', target:'movieList'}},
		treeConfig:{
			label:'scenes_name',
			dirNode:'child',
		}
	},


	//意图类型树
	symtreeSelectList:{
		type:'grid',
		toolbar:[{name:'refresh', label:'刷新'}],
		api:{retrieve:'Symbol.symtreeList', update:'Symbol.symtreeUpdate',create:'Symbol.symtreeAdd',delete:'Symbol.symtreeDelete'},
		gridConfig:{
			columns:[
				{label:"意图类型", field:"symtree_name", type:"text", width: 1.5, align:'center', searchType:'string'},
			],
			btnCol:{width:2, btn:[{name:'message', openTitle:'', openType:'', target:'simulationList', label:'选择'}]},
			pagination:1
		}
	},
	symtreeList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'typeAdd', label:'新增分类'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Symbol.symtreeList', update:'Symbol.symtreeUpdate',create:'Symbol.symtreeAdd',delete:'Symbol.symtreeDelete'},
		event:{select:{name:'message', openTitle:'', openType:'', target:'simulationList'}},
		gridConfig:{
			columns:[
				{label:"id", field:"symtree_id", type:"text", width: 1, align:'center'},	
				{label:"意图类型", field:"symtree_name", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"意图语句", field:"symtree_content", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"父分类id", field:"symtree_pid", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"symtree_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'分类编辑', openType:'dialog', target:'typeEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'typeAdd', label:'删除'}]},
			pagination:1
		}
	},
	symtreeEdit:{
		type:'form',
		api:{update:'Symbol.symtreeUpdate',retrieveOne:'Symbol.symtreeGet'},
		formConfig : {
			form:[
				{"name": "symtree_id", 	"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "symtree_name", 	"value":"",	"label": "意图类型","cols": 1,"order": 0,"type": "input"},
				{"name": "symtree_content", 	"value":"",	"label": "意图语句","cols": 1,"order": 0,"type": "input"},
				{"name": "symtree_pid", 	"value":"",	"label": "父分类","cols": 2,"order": 5,"type":"netSelect", whereKey:'symtree_id', showValue:'symtree_name',needValue:{'symtree_pid':'symtree_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "symtree_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	symtreeAdd:{
		type:'form',
		api:{create:'Symbol.symtreeAdd'},
		formConfig : {
			form:[
				{"name": "symtree_id", 	"value":"",	"label": "分类id","cols": 1,"order": 0,"type": "input"},
				{"name": "symtree_name", 	"value":"",	"label": "意图类型","cols": 1,"order": 0,"type": "input"},
				{"name": "symtree_content", 	"value":"",	"label": "意图语句","cols": 1,"order": 0,"type": "input"},
				{"name": "symtree_pid", 	"value":"",	"label": "父分类id","cols": 1,"order": 0,"type": "input"},
				{"name": "symtree_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	symtreeTree:{
		type:'tree',
		toolbar:[{name:'refresh', label:'刷新'}],
		api:{treeData:'Admin.symtreeTree'},
		menus:[{name:'edit', openTitle:'分类编辑', openType:'dialog', target:'symtreeEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'typeAdd', label:'删除'}],
		event:{select:{name:'message', openTitle:'', openType:'', target:'movieList'}},
		treeConfig:{
			label:'symtree_name',
			dirNode:'child',
		}
	},
	
	//语料库
	corpusList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'corpusAdd', label:'新增影片'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Symbol.corpusList', update:'Symbol.corpusUpdate',create:'Symbol.corpusAdd',delete:'Symbol.corpusDelete'},
		menus:[{name:'edit', openTitle:'语料编辑', openType:'dialog', target:'corpusEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'corpusAdd', label:'删除'}],
		event:{},
		
		gridConfig:{
			columns:[
				{label:"id", field:"corpus_id", type:"text", width: 1, align:'center'},	
				{label:"意图Id", field:"symtree_id", type:"text", width: 1, align:'center'},	
				{label:"匹配", field:"corpus_match", type:"text", width: 1, align:'center'},	
				{label:"槽", field:"corpus_slot", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"语言", field:"client_id", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"状态", field:"corpus_state", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"备注", field:"corpus_remark", type:"text", width: 2, align:'center', searchType:'string'},

			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'语料编辑', openType:'dialog', target:'corpusEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'corpusAdd', label:'删除'}]},
			pagination:1
		},
	},
	corpusEdit:{
		type:'form',
		api:{update:'Symbol.corpusUpdate',retrieveOne:'Symbol.corpusGet'},
		
		formConfig : {
			form:[
				{"name": "corpus_id", 	"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "symtree_id", 	"value":"",	"label": "意图节点","cols": 2,"order": 0, "type":"netSelect",whereKey:'corpus_id', showValue:'corpus_name',needValue:{'corpus_pid':'corpus_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "corpus_match", 	"value":"",	"label": "匹配","cols": 2,"order": 0,"type": "input"},
				{"name": "corpus_slot", 	"value":"",	"label": "槽","cols": 2,"order": 0,"type":"netSelect",whereKey:'corpus_id', showValue:'corpus_name',needValue:{'corpus_pid':'corpus_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "client_id", 	"value":"",	"label": "语言","cols": 2,"order": 0,"type": "input"},
				{"name": "corpus_state", 	"value":"",	"label": "状态","cols": 2,"order": 0,"type": "input"},
				{"name": "corpus_remark", 	"value":"",	"label": "备注","cols": 2,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	corpusAdd:{
		type:'form',
		api:{create:'Symbol.corpusAdd'},
		formConfig : {
			form:[
				{"name": "symtree_id", 	"value":"",	"label": "意图节点","cols": 2,"order": 0, "type":"netSelect",whereKey:'corpus_id', showValue:'corpus_name',needValue:{'corpus_pid':'corpus_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "corpus_match", 	"value":"",	"label": "匹配","cols": 2,"order": 0,"type": "input"},
				{"name": "corpus_slot", 	"value":"",	"label": "槽","cols": 2,"order": 0,"type":"netSelect",whereKey:'corpus_id', showValue:'corpus_name',needValue:{'corpus_pid':'corpus_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "client_id", 	"value":"",	"label": "语言","cols": 2,"order": 0,"type": "input"},
				{"name": "corpus_state", 	"value":"",	"label": "状态","cols": 2,"order": 0,"type": "input"},
				{"name": "corpus_remark", 	"value":"",	"label": "备注","cols": 2,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	
	
};
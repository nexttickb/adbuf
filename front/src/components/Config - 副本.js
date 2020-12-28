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
	noticeEdit:{
		type:'form',
		api:{update:'Admin.noticeUpdate', retrieveOne:'Admin.noticeGet'},
		formConfig : {
			form:[
				{"name": "option_notice", 	"value":"",	"label": "影视公告","cols": 2,"order": 5, "type":"textarea", placeholder:"例: 《XXX》已有高清片源"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	passwdEdit:{
		type:'form',
		api:{update:'Admin.passwdUpdate'},
		formConfig : {
			form:[
				{"name": "manager_userName", 	"value":"",	"label": "当前密码","cols": 1,"order": 5,"type":"password"},
				{type:'br'},
				{"name": "manager_password", 	"value":"",	"label": "新密码","cols": 1,"order": 5,"type":"password"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	userList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增用户', openType:'dialog', target:'userAdd', label:'新增用户'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.userList', update:'Admin.userUpdate',create:'Admin.userAdd',delete:'Admin.userDelete'},
		gridConfig:{
			columns:[
				{label:"id", field:"user_id", type:"text", width: 1, align:'center', searchType:'integer'},
				{label:"用户名", field:"user_name", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"手机号", field:"user_phone", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"最近登录IP", field:"user_ip", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"最近登录时间", field:"user_loginTime", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"user_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'编辑用户', openType:'dialog', target:'userEdit', label:'编辑'},{name:'delete', label:'删除'}]},
			pagination:1
		}
	},
	userEdit:{
		type:'form',
		api:{update:'Admin.userUpdate', retrieveOne:'Admin.userGet'},
		formConfig : {
			form:[
				{"name": "user_id", 	"value":"",	"label": "id","cols": 1,"order": 5,"type":"hidden"},
				{"name": "user_name", 	"value":"",	"label": "用户名","cols": 1,"order": 5,"type":"input"},
				{"name": "user_phone", 	"value":"",	"label": "手机号","cols": 1,"order": 0,"type": "input"},
				{"name": "user_password", 	"value":"",	"label": "密码","cols": 1,"order": 0,"type": "input"},
				{"name": "user_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	userAdd:{
		type:'form',
		api:{create:'Admin.userAdd'},
		formConfig : {
			form:[
				{"name": "user_name", 	"value":"",	"label": "用户名","cols": 1,"order": 5,"type":"input"},
				{"name": "user_password", 	"value":"",	"label": "密码","cols": 1,"order": 5,"type":"password"},
				{"name": "user_phone", 	"value":"",	"label": "手机号","cols": 1,"order": 0,"type": "input"},
				{"name": "user_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	onlineList:{
		type:'grid',
		toolbar:[{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.userList',retrieveOne:'Admin.userGet', update:'Admin.userUpdate',create:'Admin.userAdd',delete:'Admin.userDelete'},
		menus:[{name:'edit', openTitle:'回复消息', openType:'dialog', target:'message', label:'回复消息'},{name:'edit', openTitle:'', openType:'dialog', target:'message', label:'拉黑'}],
		
		gridConfig:{
			columns:[
				{label:"id", field:"user_id", type:"text", width: 1, align:'center', searchType:'integer'},
				{label:"用户名", field:"user_name", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"手机号", field:"user_phone", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"最近登录IP", field:"user_ip", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"最近登录时间", field:"user_loginTime", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"user_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'回复', openType:'dialog', target:'message', label:'回复'}]},
			pagination:1
		},
	},
	
	onlineSelectList:{
		type:'grid',
		toolbar:[{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.userList',retrieveOne:'Admin.userGet', update:'Admin.userUpdate',create:'Admin.userAdd',delete:'Admin.userDelete'},
		menus:[{name:'edit', openTitle:'回复消息', openType:'', target:'message', label:'回复消息'},{name:'edit', openTitle:'', openType:'dialog', target:'message', label:'拉黑'}],
		gridConfig:{
			columns:[
				{label:"用户名", field:"user_name", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"user_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'回复', openType:'', target:'message', label:'回复'}]},
			pagination:1
		},
	},
	adList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'adAdd', label:'新增广告'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.adList', update:'Admin.adUpdate',create:'Admin.adAdd',delete:'Admin.adDelete'},
		gridConfig:{
			columns:[
				{label:"id", field:"ad_id", type:"text", width: 1, align:'center', searchType:'string'},	
				{label:"名称", field:"ad_name", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"类型", field:"ad_type", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"图片", field:"ad_img", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"到期时间", field:"ad_endtime", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"ad_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'编辑广告', openType:'dialog', target:'adEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'adAdd', label:'删除'}]},
			pagination:1
		}
	},
	adEdit:{
		type:'form',
		api:{update:'Admin.adUpdate', retrieveOne:'Admin.adGet'},
		formConfig : {
			form:[
				{"name": "ad_id", 	"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "ad_name", 	"value":"",	"label": "名称","cols": 1,"order": 0,"type": "input"},
				{"name": "ad_type", 	"value":"",	"label": "类型","cols": 1,"order": 5,"type":"select", "option":[{value:1, label:"视频列表", active:1},{value:0, label:"播放器缓冲"}]},
				{"name": "ad_img", 	"value":"",	"label": "图片","cols": 1,"order": 0,"type": "input"},
				{"name": "ad_url", 	"value":"",	"label": "链接","cols": 1,"order": 0,"type": "input"},
				{"name": "ad_endtime", 	"value":"",	"label": "到期时间","cols": 1,"order": 0,"type": "input"},
				{"name": "ad_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	adAdd:{
		type:'form',
		api:{create:'Admin.adAdd'},
		formConfig : {
			form:[
				{"name": "ad_name", "value":"",	"label": "名称","cols": 1,"order": 0,"type": "input"},
				{"name": "ad_type", "value":"",	"label": "类型","cols": 1,"order": 5,"type":"select", "option":[{value:1, label:"视频列表", active:1},{value:0, label:"播放器缓冲"}]},
				{"name": "ad_img", 	"value":"",	"label": "图片","cols": 1,"order": 0,"type": "input"},
				{"name": "ad_url", 	"value":"",	"label": "链接","cols": 1,"order": 0,"type": "input"},
				{"name": "ad_endtime", 	"value":"",	"label": "到期时间","cols": 1,"order": 0,"type": "input"},
				{"name": "ad_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	gatherList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'gatherAdd', label:'新增采集接口'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.gatherList', update:'Admin.gatherUpdate',create:'Admin.gatherAdd',delete:'Admin.gatherDelete'},
		gridConfig:{
			columns:[
				{label:"id", field:"gather_id", type:"text", width: 1, align:'center'},	
				{label:"类型", field:"gather_type", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"名称", field:"gather_name", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"采集时间", field:"gather_time", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"gather_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'采集设置', openType:'dialog', target:'gatherEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'gatherAdd', label:'删除'}]},
			pagination:1
		}
	},
	gatherEdit:{
		type:'form',
		api:{update:'Admin.gatherUpdate',retrieveOne:'Admin.gatherGet'},
		formConfig : {
			form:[
				{"name": "gather_id", 		"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "gather_type", 	"value":"",	"label": "类型","cols": 1,"order": 0,"type": "input"},
				{"name": "gather_name", 	"value":"",	"label": "名称","cols": 1,"order": 0,"type": "input"},
				{"name": "gather_time", 	"value":"",	"label": "采集时间","cols": 1,"order": 0,"type": "input"},
				{"name": "gather_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	gatherAdd:{
		type:'form',
		api:{create:'Admin.gatherAdd'},
		formConfig : {
			form:[
				{"name": "gather_type", 	"value":"",	"label": "类型","cols": 1,"order": 0,"type": "input"},
				{"name": "gather_name", 	"value":"",	"label": "名称","cols": 1,"order": 0,"type": "input"},
				{"name": "gather_time", 	"value":"",	"label": "采集时间","cols": 1,"order": 0,"type": "input"},
				{"name": "gather_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	typeSelectList:{
		type:'grid',
		toolbar:[{name:'refresh', label:'刷新'}],
		api:{retrieve:'Admin.typeList', update:'Admin.typeUpdate',create:'Admin.typeAdd',delete:'Admin.typeDelete'},
		gridConfig:{
			columns:[
				{label:"分类名", field:"type_name", type:"text", width: 1.5, align:'center', searchType:'string'},
			],
			btnCol:{width:2, btn:[{name:'message', openTitle:'', openType:'', target:'movieList', label:'选择'}]},
			pagination:1
		}
	},
	typeList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'typeAdd', label:'新增分类'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.typeList', update:'Admin.typeUpdate',create:'Admin.typeAdd',delete:'Admin.typeDelete'},
		event:{select:{name:'message', openTitle:'', openType:'', target:'movieList'}},
		gridConfig:{
			columns:[
				{label:"id", field:"type_id", type:"text", width: 1, align:'center'},	
				{label:"分类名", field:"type_name", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"父分类id", field:"type_pid", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"备注", field:"type_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'分类编辑', openType:'dialog', target:'typeEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'typeAdd', label:'删除'}]},
			pagination:1
		}
	},
	typeEdit:{
		type:'form',
		api:{update:'Admin.typeUpdate',retrieveOne:'Admin.typeGet'},
		formConfig : {
			form:[
				{"name": "type_id", 	"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "type_name", 	"value":"",	"label": "分类名","cols": 1,"order": 0,"type": "input"},
				
				{"name": "type_pid", 	"value":"",	"label": "父分类","cols": 2,"order": 5,"type":"netSelect", whereKey:'type_id', showValue:'type_name',needValue:{'type_pid':'type_id'}, target:'typeSelect', placeholder:"下拉选择"},
			
				{"name": "type_match", 	"value":"",	"label": "模糊匹配","cols": 3,"order": 0,"type": "textarea"},
				{"name": "vod_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	typeAdd:{
		type:'form',
		api:{create:'Admin.typeAdd'},
		formConfig : {
			form:[
				{"name": "type_id", 	"value":"",	"label": "分类id","cols": 1,"order": 0,"type": "input"},
				{"name": "type_name", 	"value":"",	"label": "分类名","cols": 1,"order": 0,"type": "input"},
				{"name": "type_pid", 	"value":"",	"label": "父分类id","cols": 1,"order": 0,"type": "input"},
				{"name": "type_match", 	"value":"",	"label": "模糊匹配","cols": 3,"order": 0,"type": "textarea"},
				{"name": "vod_remarks", 	"value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	movieList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增', openType:'dialog', target:'movieAdd', label:'新增影片'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.movieList', update:'Admin.movieUpdate',create:'Admin.movieAdd',delete:'Admin.movieDelete'},
		menus:[{name:'edit', openTitle:'影视编辑', openType:'dialog', target:'movieEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'movieAdd', label:'删除'}],
		event:{},
		
		gridConfig:{
			columns:[
				{label:"id", field:"vod_id", type:"text", width: 1, align:'center'},	
				{label:"片名", field:"vod_name", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"分类名", field:"type_name", type:"text", width: 2, align:'center', searchType:'string'},
				{label:"更新时间", field:"vod_uptime", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"备注", field:"vod_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'影视编辑[{{name}}]', openType:'dialog', target:'movieEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'movieAdd', label:'删除'}]},
			pagination:1
		},
	},
	movieEdit:{
		type:'form',
		api:{update:'Admin.movieUpdate',retrieveOne:'Admin.movieGet'},
		
		formConfig : {
			form:[
				{"name": "vod_id", 	"value":"",	"label": "id","cols": 1,"order": 0,"type": "hidden"},
				{"name": "vod_name", 	"value":"",	"label": "片名","cols": 2,"order": 0,"type": "input"},
				//whereKey 的值  为提交查询（id到字符串的单独接口查询）时的key名称，根据接口处理填写。暂定，可能做法，如：程序固定一个查询key，用whereKey指定一个字段取值提交查询。
				{"name": "type_id", 	"value":"",	"label": "分类","cols": 2,"order": 5,"type":"netSelect",whereKey:'type_id', showValue:'type_name',needValue:{'type_pid':'type_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "vod_area", 	"value":"",	"label": "地区","cols": 2,"order": 0,"type": "input"},
				{"name": "vod_actor", "value":"",	"label": "演员","cols": 2,"order": 0,"type": "textarea"},
				{"name": "vod_year", "value":"",	"label": "年份","cols": 2,"order": 0,"type": "textarea"},
				{"name": "vod_lang", 	"value":"",	"label": "语言","cols": 3,"order": 0,"type": "input"},
				{"name": "vod_pic", 	"value":"",	"label": "图片","cols": 3,"order": 0,"type": "image"},
				{"name": "vod_director", 	"value":"",	"label": "导演","cols": 3,"order": 0,"type": "input"},
			//	{"name": "vod_play_url", 	"value":"",	"label": "播放地址","cols": 3,"order": 0,"type": "textarea"},
				{"name": "vod_play_url", 	"value":"",	"label": "播放地址","cols": 3,"order": 5,"type":"pageGrid", target:'playUrlList', placeholder:"下拉选择", },
									
				{"name": "vod_content", "value":"",	"label": "简介","cols": 3,"order": 0,"type": "textarea"},
				{"name": "vod_remarks", "value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	movieAdd:{
		type:'form',
		api:{create:'Admin.movieAdd'},
		formConfig : {
			form:[
				{"name": "vod_name", 	"value":"",	"label": "片名","cols": 2,"order": 0,"type": "input"},
				{"name": "type_id", 	"value":"",	"label": "分类","cols": 2,"order": 5,"type":"netSelect",showValue:'type_name',needValue:{'type_pid':'type_id'}, target:'typeSelect', placeholder:"下拉选择"},
				{"name": "vod_area", 	"value":"",	"label": "地区","cols": 2,"order": 0,"type": "input"},
				{"name": "vod_actor", "value":"",	"label": "演员","cols": 2,"order": 0,"type": "textarea"},
				{"name": "vod_year", "value":"",	"label": "年份","cols": 2,"order": 0,"type": "textarea"},
				{"name": "vod_lang", 	"value":"",	"label": "语言","cols": 3,"order": 0,"type": "input"},
				{"name": "vod_pic", 	"value":"",	"label": "图片","cols": 3,"order": 0,"type": "input"},
				{"name": "vod_director", 	"value":"",	"label": "导演","cols": 3,"order": 0,"type": "input"},
				{"name": "vod_play_url", 	"value":"",	"label": "播放地址","cols": 3,"order": 0,"type": "textarea"},
				{"name": "vod_content", "value":"",	"label": "简介","cols": 3,"order": 0,"type": "textarea"},
				{"name": "vod_remarks", "value":"",	"label": "备注","cols": 3,"order": 0,"type": "textarea"},
			]
		},
		button:[{name:'cancel', label:'取消'},{name:'ok', label:'确认'}]
	},
	typeSelect:{
		type:'grid',
		toolbar:[],
		api:{retrieve:'Admin.typeList'},
		menus:[{name:'edit', openTitle:'影视编辑', openType:'dialog', target:'movieEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'movieAdd', label:'删除'}],
		event:{select:{name:'message', openTitle:'', openType:'', target:'movieList'}},
		gridConfig:{
			columns:[
				{label:"id", field:"type_id", type:"text", width: 1, align:'center'},	
				{label:"分类名", field:"type_name", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"备注", field:"type_remarks", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'select', openTitle:'', openType:'', target:'typeEdit', label:'选择'}]},
			pagination:1
		}
	},
	typeTree:{
		type:'tree',
		toolbar:[{name:'refresh', label:'刷新'}],
		api:{treeData:'Admin.typeTree'},
		menus:[{name:'edit', openTitle:'分类编辑', openType:'dialog', target:'typeEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'typeAdd', label:'删除'}],
		event:{select:{name:'message', openTitle:'', openType:'', target:'movieList'}},
		treeConfig:{
			label:'type_name',
			dirNode:'child',
			btnCol:{width:2, btn:[{name:'edit', openTitle:'视频地址编辑[{{name}}]', openType:'dialog', target:'playUrlEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'', label:'删除'}]},
		}
	},
	treeChart:{
		type:'ctree',
		toolbar:[{name:'refresh', label:'刷新'}],
		api:{treeData:'Admin.typeTree'},
		menus:[{name:'edit', openTitle:'分类编辑', openType:'dialog', target:'typeEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'typeAdd', label:'删除'}],
		event:{select:{name:'message', openTitle:'', openType:'', target:'movieList'}},
		treeConfig:{
			label:'type_name',
			dirNode:'child',
			btnCol:{width:2, btn:[{name:'edit', openTitle:'视频地址编辑[{{name}}]', openType:'dialog', target:'playUrlEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'', label:'删除'}]},
		}
	},
	playUrlList:{
		type:'grid',
		toolbar:[{name:'create', openTitle:'新增地址', openType:'dialog', target:'playUrlAdd', label:'新增地址'},{name:'refresh', label:'刷新列表'}],
		api:{retrieve:'Admin.playUrlList'},
		gridConfig:{
			columns:[
				{label:"名称", field:"url_name", type:"text", width: 1, align:'center'},	
				{label:"地址", field:"url_src", type:"text", width: 1.5, align:'center', searchType:'string'},
				{label:"类型", field:"url_type", type:"text", width: 2, align:'center', searchType:'string'}
			],
			btnCol:{width:2, btn:[{name:'edit', openTitle:'视频地址编辑', openType:'dialog', target:'playUrlEdit', label:'编辑'},{name:'delete', openTitle:'', openType:'dialog', target:'', label:'删除'}]},
			pagination:1
		}
	},
	playUrlEdit:{
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
	playUrlAdd:{
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

	
};
const Base = require('./Base');
const uuid = require('node-uuid');

class Admin extends Base{
	constructor(conf){
		super(conf);
		this.AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
		this.apiInit();
	}
	async checkToken(req){
		let user = {};
		console.log('checkToken:', req.token);
		let res = await this.db.find('media.manager', {token:req.token}, {});
		if(res.res.length <= 0){
			return false;
		}
		return res.res[0];
	}


	async appConfigGet(){
		let apps = await this.db.find('media.app', {}, {});
		let menus = await this.db.find('media.menu', {}, {});
		return {code:0, data:{code:0, info:'成功', data:{apps:apps.res, menus:menus.res}}};
	}
	async apiInit(){
		let res = await this.db.find('media.api', {}, {});
		let apis = res.res;
		for(let i = 0; i < apis.length; i++){
			this[apis[i].api_name] = new this.AsyncFunction('req', apis[i].api_code);
		}
		return {code:0, data:{code:0, info:'成功', data:{}}};
	}
	async general(name, req){
		if(typeof(this[name]) != 'function')
			return {code:404, data:{code:404, info:'', data:{}}};
		try{
			return this[name](req);
		}catch(e){
			return {code:500, data:{code:404, info:'', data:JSON.stringify(e)}};
		}
	}
	//option start
	async optionGet(req){
		let res = await this.db.find('media.option', {}, {});
		if(res.res.length <= 0){
			return false;
		}
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async optionUpdate(req){

		let data = {
			option_appName:req.data.option_appName || '',
			option_appLogo:req.data.option_appLogo || '',
			option_server:req.data.option_server || '',
			option_notice:req.data.option_notice || '',
			option_bgImg1:req.data.option_bgImg1 || '',
			option_bgImg2:req.data.option_bgImg2 || '',
			option_bgImg3:req.data.option_bgImg3 || ''
		};
		console.log('optionUpdate:', data);
		let res = await this.db.update('media.option', {option_id:'default'}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}
	//notice start
	async noticeGet(req){
		let res = await this.db.find('media.notice', {notice_id:'default'}, {});
		if(res.res.length <= 0){
			return false;
		}
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async noticeUpdate(req){
		let data = {
			option_notice:req.data.option_notice || '',
		};
		let res = await this.db.update('media.notice', {notice_id:'default'}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}

	//manager start
	async passwdUpdate(req){

		//TODO: 实现旧密码验证 新密码更改
		let data = {
			manager_name:req.data.manager_name || '',
			manager_password:req.data.manager_password || '',
		};
		console.log('optionUpdate:', data);
		let res = await this.db.update('media.manager', {manager_name:'admin'}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}
	//manager end
	//userManage start
	async userGet(req){
		let res = await this.db.find('media.user', {user_id:req.data.user_id}, {});
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async userList(req){
		let where = {};
		req.limit = req.limit || 20;
		let fields = {};
		let skip = parseInt(((req.page || 1) - 1) * req.limit);

		let res = await this.db.find('media.user', where, fields, skip, req.limit, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"page":req.page, 
			"list":res.res
		};
		return {code:0, data:data};
	}
	async userAdd(req){
		let data = {
			user_id:(new Date()).valueOf(),
			user_name:req.data.user_name, 
			user_phone:req.data.user_phone, 
			user_type:1, 
			user_remarks:req.data.user_remarks, 
			user_time:(new Date()).valueOf()
		};
		let res = await this.db.find('media.user', {user_name:req.data.user_name}, {});
		if(res.res.length > 0){
			return {code:0, data:{code:-1, info:'已有此用户 '}};
		}
		res = await this.db.insert('media.user', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async userUpdate(req){
		let data = {
			user_name:req.data.user_name, 
			user_phone:req.data.user_phone, 
			user_remarks:req.data.user_remarks, 
			user_password:req.data.user_password, 
			time:(new Date()).valueOf()
		};
		let res = await this.db.update('media.user', {user_id:req.data.user_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}

	async userDelete(req){
		let res = await this.db.remove('media.user', {user_id:req.data.user_id});
		return {code:0, data:{info:'ok'}};
	}
	//userManage end
	
	//gatherManage start
	async gatherGet(req){
		let res = await this.db.find('media.gather', {user_id:req.data.user_id}, {});
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async gatherList(req){
		let where = {};
		req.limit = req.limit || 20;
		let fields = {};
		let skip = parseInt(((req.page || 1) - 1) * req.limit);

		let res = await this.db.find('media.gather', where, fields, skip, req.limit, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"page":req.page, 
			"list":res.res
		};
		return {code:0, data:data};
	}
	async gatherAdd(req){
		let data = {
			gather_id:(new Date()).valueOf(),
			gather_type:req.data.gather_type, 
			gather_name:req.data.gather_name, 
			gather_time:req.data.gather_time, 
			gather_remarks:req.data.gather_remarks, 
		};
		let res = await this.db.find('media.gather', {user_name:req.data.user_name}, {});
		if(res.res.length > 0){
			return {code:0, data:{code:-1, info:'已存在'}};
		}
		res = await this.db.insert('media.gather', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async gatherUpdate(req){
		let data = {
			gather_type:req.data.gather_type, 
			gather_name:req.data.gather_name, 
			gather_time:req.data.gather_time, 
			gather_remarks:req.data.gather_remarks, 
		};
		let res = await this.db.update('media.gather', {gather_id:req.data.gather_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}

	async gatherDelete(req){
		let res = await this.db.remove('media.gather', {gather_id:req.data.gather_id});
		return {code:0, data:{info:'ok'}};
	}
	//gatherManage end
	

	//playUrl start
	async playUrlList(req){
		let where = {};
		req.limit = req.limit || 20;
		let fields = {};
		let skip = parseInt(((req.page || 1) - 1) * req.limit);

		let res = await this.db.find('media.playurl', where, fields, skip, req.limit, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"page":req.page, 
			"list":res.res
		};
		return {code:0, data:data};
	}
	async playUrlAdd(req){
		let data = {
			url_id:(new Date()).valueOf(),
			url_name:req.data.url_name, 
			url_src:req.data.url_src, 
			url_type:req.data.url_type, 
		};
		res = await this.db.insert('media.playurl', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async playUrlEdit(req){
		let data = {
			url_name:req.data.url_name, 
			url_src:req.data.url_src, 
			url_type:req.data.url_type, 
		};
		let res = await this.db.update('media.playurl', {ad_id:req.data.url_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}

	async playUrlDel(req){
		let res = await this.db.remove('media.playurl', {ad_id:req.data.url_id});
		return {code:0, data:{info:'ok'}};
	}
	//adManage end




	//adManage start
	async adGet(req){
		let res = await this.db.find('media.ad', {ad_id:req.data.ad_id}, {});
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async adList(req){
		let where = {};
		req.limit = req.limit || 20;
		let fields = {};
		let skip = parseInt(((req.page || 1) - 1) * req.limit);

		let res = await this.db.find('media.ad', where, fields, skip, req.limit, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"page":req.page, 
			"list":res.res
		};
		return {code:0, data:data};
	}
	async adAdd(req){
		let data = {
			ad_id:(new Date()).valueOf(),
			ad_name:req.data.ad_name, 
			ad_type:req.data.ad_type, 
			ad_img:req.data.ad_img, 
			ad_url:req.data.ad_url, 
			ad_endtime:req.data.ad_endtime, 
			ad_remarks:req.data.ad_remarks, 
		};
		let res = await this.db.find('media.ad', {ad_name:req.data.ad_name}, {});
		if(res.res.length > 0){
		//	return {code:0, data:{code:-1, info:'已存在'}};
		}
		console.log('ad:', data);
		res = await this.db.insert('media.ad', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async adUpdate(req){
		let data = {
			ad_name:req.data.ad_name, 
			ad_type:req.data.ad_type, 
			ad_img:req.data.ad_img, 
			ad_url:req.data.ad_url, 
			ad_endtime:req.data.ad_endtime, 
			ad_remarks:req.data.ad_remarks, 
		};
		let res = await this.db.update('media.ad', {ad_id:req.data.ad_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}

	async adDelete(req){
		let res = await this.db.remove('media.ad', {ad_id:req.data.ad_id});
		return {code:0, data:{info:'ok'}};
	}
	//adManage end


	//typeManage start

	async typeTree(req){
		let where = {};
		let fields = {};

		where.type_pid = typeof(req.where.type_id)=='undefined'?0:req.where.type_id;

		let res = await this.db.find('media.type', where, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"page":req.page, 
			"list":res.res
		};
		return {code:0, data:data};
	}

	async typeGet(req){
		let res = await this.db.find('media.type', {type_id:req.data.type_id}, {});
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async typeList(req){
		let where = {};
		req.limit = req.limit || 20;
		let fields = {};
		let skip = parseInt(((req.page || 1) - 1) * req.limit);
		if(typeof(req.where.type_id) != 'undefined'){
			if(req.where.type_id){
				where.type_id = req.where.type_id;
			}
		}

		let res = await this.db.find('media.type', where, fields, skip, req.limit, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"page":req.page, 
			"list":res.res
		};
		return {code:0, data:data};
	}
	async typeAdd(req){
		let data = {
			type_id:(new Date()).valueOf(),
			type_pid:req.data.type_pid, 
			type_name:req.data.type_name, 
			type_match:req.data.type_match, 
			type_remarks:req.data.type_remarks, 
		};
		let res = await this.db.find('media.type', {type_name:req.data.type_name}, {});
		if(res.res.length > 0){
			return {code:0, data:{code:-1, info:'已存在'}};
		}
		res = await this.db.insert('media.type', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async typeUpdate(req){
		let data = {
			type_pid:req.data.type_pid, 
			type_name:req.data.type_name, 
			type_match:req.data.type_match, 
			type_remarks:req.data.type_remarks, 
		};
		let res = await this.db.update('media.type', {type_id:req.data.type_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}

	async typeDelete(req){
		let res = await this.db.remove('media.type', {type_id:req.data.type_id});
		return {code:0, data:{info:'ok'}};
	}
	//typeManage end


	//vodManage start

	//movieManage start
	async movieGet(req){
		let res = await this.db.find('media.movie', {vod_id:req.data.vod_id}, {});
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async movieList(req){
		let where = {};
		req.limit = req.limit || 20;
		let fields = {};
		let skip = parseInt(((req.page || 1) - 1) * req.limit);

		//一些需要支持的where条件处理
		if(typeof(req.where.type_id) != 'undefined'){
			where.type_id = req.where.type_id;
		}

		let res = await this.db.find('media.movie', where, fields, skip, req.limit, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"page":req.page, 
			"list":res.res
		};
		return {code:0, data:data};
	}
	async movieAdd(req){
		let data = {
			vod_name	:req.data.vod_name	   ,
			type_id     :req.data.type_id      ,
			vod_area    :req.data.vod_area     ,
			vod_actor   :req.data.vod_actor    ,
			vod_year    :req.data.vod_year     ,
			vod_lang    :req.data.vod_lang     ,
			vod_pic	    :req.data.vod_pic	   ,
			vod_director:req.data.vod_director ,
			vod_play_url:req.data.vod_play_url ,
			vod_content :req.data.vod_content  ,
			vod_remarks :req.data.vod_remarks  ,
		};
		let res = await this.db.find('media.movie', {vod_name:req.data.vod_name}, {});
		if(res.res.length > 0){
			return {code:0, data:{code:-1, info:'已存在'}};
		}
		res = await this.db.insert('media.movie', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async movieUpdate(req){
		let data = {
			vod_id:(new Date()).valueOf(),
			vod_name	:req.data.vod_name	   ,
			type_id     :req.data.type_id      ,
			vod_area    :req.data.vod_area     ,
			vod_actor   :req.data.vod_actor    ,
			vod_year    :req.data.vod_year     ,
			vod_lang    :req.data.vod_lang     ,
			vod_pic	    :req.data.vod_pic	   ,
			vod_director:req.data.vod_director ,
			vod_play_url:req.data.vod_play_url ,
			vod_content :req.data.vod_content  ,
			vod_remarks :req.data.vod_remarks  ,
		};
		let res = await this.db.update('media.movie', {vod_id:req.data.vod_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}

	async movieDelete(req){
		let res = await this.db.remove('media.movie', {vod_id:req.data.vod_id});
		return {code:0, data:{info:'ok'}};
	}
	//movieManage end
		

	//login start
	async checkUser(req){
		if(typeof(req.userName) == 'undefined'){
			return {code:0, data:{code:-1, info:'你在干啥!'}};
		}
		let old = await this.db.find('media.manager', {manager_name:req.userName}, {});
		if(old.res.length > 0){
			return {code:0, data:{code:-1, info:'账号已经存在!'}};
		}
		return {code:0, data:{code:0, info:'账号不存在！'}};
	}
	async login(req, params){
		if(typeof(req.userName) == 'undefined'){
			return {code:0, data:{code:-1, info:'账号呢?'}};
		}
		if(typeof(req.passWd) == 'undefined'){
			return {code:0, data:{code:-2, info:'密码呢?'}};
		}
		let res = await this.db.find('media.manager', {manager_name:req.userName, manager_password:req.passWd}, {});
		let token = uuid.v1();//'11111111991';//Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
		console.log(token);
		if(res.res.length > 0){
			//todo：成功了
			console.log(token);
			let r = await this.db.update('media.manager', {manager_name:req.userName}, {token:token, sock_id:params.sockId});
			console.log('update:', r);
		}else{
			return {code:0, data:{code:-3, info:'密码错误！'}};
		}
		res = await this.db.find('media.manager', {manager_name:req.userName}, {});
		console.log(res);
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async checkLogin(req, params){
		let user = await this.checkToken(req);
		if(!user){
			return {code:-9, data:{code:-9, info:'未登录', data:[]}};
		}
		await this.db.update('media.manager', {manager_name:user.manager_name}, {sock_id:params.sockId});
		return {code:0, data:{code:0, info:'登录成功', data:[]}};
	}
	async sendMsg(req, params){
		console.log('sendMsg:', req, params.sockId);
		let res = await this.db.find('media.user', {user_id:req.to_user}, {});
		if(res.res.length <= 0){
			return {code:0, data:{code:-1, info:'没有此用户', data:{}}};
		}
		let user = res.res[0];
		let ret = this.send(user.sock_id, {req: 'message', code:0, data:{form:req.from_user, data:req.data}});
		return {code:0, data:{code:0, info:'成功', data:ret}};
	}
	ping(req){
		return {code:0, data:{info:'pong'}};
	}




	async menuGet(req){
		        let res = await this.db.find('media.menu', {menu_id:req.data.menu_id}, {});
		        return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async menuList(req){
		        let where = {};
		        req.limit = req.limit || 20;
		        let fields = {menu_icon:0};
		        let skip = parseInt(((req.page || 1) - 1) * req.limit);

		        let res = await this.db.find('media.menu', where, fields, skip, req.limit, {});
		        let data = {
				                "code": 0,
				                "info": "数据列表",
				                "pageCount": res.count?Math.ceil(res.count/req.limit):0,
				                "total": res.count,
				                "page":req.page,
				                "list":res.res
				        };
		        return {code:0, data:data};
	}
	async menuAdd(req){
		        let data = {
				                menu_id:(new Date()).valueOf(),
				                menu_type:req.data.menu_type,
								menu_icon:req.data.menu_icon,
				                menu_title:req.data.menu_title,
				                menu_description:req.data.menu_description,
				                menu_app:req.data.menu_app,
				        };
		        let res = await this.db.find('media.menu', {menu_title:req.data.menu_title}, {});
		        if(res.res.length > 0){
				                return {code:0, data:{code:-1, info:'已存在'}};
				        }
		        res = await this.db.insert('media.menu', data, {});
		        return {code:0, data:{code:0, info:'ok'}};
	}

	async menuUpdate(req){
		        let data = {
				                menu_type:req.data.menu_type,
								menu_icon:req.data.menu_icon,
				                menu_title:req.data.menu_title,
				                menu_description:req.data.menu_description,
				                menu_app:req.data.menu_app,
				        };
		        let res = await this.db.update('media.menu', {menu_id:req.data.menu_id}, data);
		        return {code:0, data:{code:0, info:'ok'}};
	}

	async menuDelete(req){
		        let res = await this.db.remove('media.menu', {menu_id:req.data.menu_id});
		        return {code:0, data:{info:'ok'}};
	}






	async appGet(req){
		let fields = {app_code:0};
		let res = await this.db.find('media.app', {app_id:req.data.app_id}, fields);
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async appCodeGet(req){
		let res = await this.db.find('media.app', {app_id:req.data.app_id}, {});
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async appList(req){
		let where = {};
		req.limit = req.limit || 20;
		let fields = {app_ui:0};
		let skip = parseInt(((req.page || 1) - 1) * req.limit);

		let res = await this.db.find('media.app', where, fields, skip, req.limit, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"page":req.page,
			"list":res.res
		};
		return {code:0, data:data};
	}
	async appAdd(req){
		let data = {
			app_id:(new Date()).valueOf(),
			app_name:req.data.app_name,
			app_description:req.data.app_description,
			app_ui:req.data.app_ui,
		};
		let res = await this.db.find('media.app', {app_name:req.data.app_name}, {});
		if(res.res.length > 0){
			return {code:0, data:{code:-1, info:'已存在'}};
		}
		res = await this.db.insert('media.app', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}

	async appUpdate(req){
		let data = {
			app_name:req.data.app_name,
			app_description:req.data.app_description,
			app_code:req.data.app_code || '',
		};
		let res = await this.db.update('media.app', {app_id:req.data.app_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}

	async appCodeUpdate(req){
		let data = {
			app_code:req.data.app_code,
		};
		let res = await this.db.updatePart('media.app', {app_id:req.data.app_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}
	async appDelete(req){
		let res = await this.db.remove('media.app', {app_id:req.data.app_id});
		return {code:0, data:{info:'ok'}};
	}

	async apiGet(req){
		let fields = {api_code:0};
		let res = await this.db.find('media.api', {api_id:req.data.api_id}, fields);
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async apiCodeGet(req){
		let res = await this.db.find('media.api', {api_id:req.data.api_id}, {});
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async apiList(req){
		let where = {};
		req.limit = req.limit || 20;
		let fields = {api_code:0};
		let skip = parseInt(((req.page || 1) - 1) * req.limit);

		let res = await this.db.find('media.api', where, fields, skip, req.limit, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"page":req.page,
			"list":res.res
		};
		return {code:0, data:data};
	}
	async apiAdd(req){
		let data = {
			api_id:(new Date()).valueOf(),
			api_name:req.data.api_name,
			api_description:req.data.api_description,
			api_code:req.data.api_code,
		};
		let res = await this.db.find('media.api', {api_name:req.data.api_name}, {});
		if(res.res.length > 0){
			return {code:0, data:{code:-1, info:'已存在'}};
		}
		res = await this.db.insert('media.api', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}

	async apiUpdate(req){
		let data = {
			api_name:req.data.api_name,
			api_description:req.data.api_description,
			api_code:req.data.api_code || '',
		};
		let res = await this.db.update('media.api', {api_id:req.data.api_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}
	async apiCodeUpdate(req){
		let data = {
			api_code:req.data.api_code,
		};
		let res = await this.db.updatePart('media.api', {api_id:req.data.api_id}, data);
		return {code:0, data:{code:0, info:'ok'}};
	}

	async apiDelete(req){
		let res = await this.db.remove('media.api', {api_id:req.data.api_id});
		return {code:0, data:{info:'ok'}};
	}








};
module.exports = Admin;

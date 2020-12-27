const Base = require('./Base');

class Home extends Base{
	constructor(conf){
		super(conf);
	}
	async checkToken(req){
		let user = {};
		let res = await this.db.find('media.user', {token:req.token}, {});
		if(res.res.length <= 0){
			return false;
		}
		return res.res[0];
	}
	async addHistory(req){
		let user = await this.checkToken(req);
		if(!user) return permissionDenied();
		if(typeof(req.id) == 'undefined'){
			return {code:0, data:{code:-1, info:'id呢?'}};
		}
		if(typeof(req.point) == 'undefined'){
			return {code:0, data:{code:-2, info:'point呢?'}};
		}
		let data = {userName:user.userName, vod_id:req.id, point:req.point, time:(new Date()).valueOf()};
		res = await this.db.insert('media.history', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async delHistory(req){
		let user = await this.checkToken(req);
		if(!user) return permissionDenied();

		let where = {userName:user.userName};
		let ids = req.ids.split('.');
		for(let i = 0; i < ids.length; i++)ids[i] = ids[i] * 1;
		if(req.ids != 'all'){
			where['vod_id'] = {$in: ids};
		}
		console.log(where);
		res = await this.db.remove('media.history', where);
		return {code:0, data:{info:'ok'}};
	}
	async detail(req){
		let where = {};
		if(typeof(req.ids) != 'undefined')where.vod_id = req.ids;
		let res = await this.db.find('media.movie', where, {});
		return {code:0, data:{code:0, info:'成功', detail:res.res}};
	}
	async getStar(req){
		let user = await this.checkToken(req);
		if(!user) return permissionDenied();
		let where = {};
		req.limit = req.limit || 20;
		req.page = req.page || 0;

		res = await this.db.find('media.star', {userName:user.userName}, {vod_id:1}, req.page * req.limit, req.limit);

		let ids = [];
		for(let i = 0; i < res.res.length; i++){
			ids.push(res.res[i].vod_id + '');
		}
		console.log(ids);

		let fields = {"vod_play_url":0,"vod_id": 1,"vod_name": 1,"type_id": 1,"type_name": 1,"vod_en": 1,"vod_uptime": 1,"vod_remarks": 1,"vod_play_from": 1};

		let skip = parseInt((req.page || 0) * req.limit);
		res = await this.db.find('media.movie', {vod_id:{$in: ids}}, fields, skip, req.limit);
		let data = {
			"code": 0,
			"info": "数据列表",
			"total": res.count,
			"list":res.res
		};
		return {code:0, data:data};

	}
	async list(req){
		let where = {};
		if(typeof(req.typeId) != 'undefined')where.type_id = req.typeId;
		if(typeof(req.area) != 'undefined')where.vod_area = req.area;
		if(typeof(req.year) != 'undefined')where.vod_year = req.year;
		req.limit = req.limit || 20;
		let fields = {"vod_play_url":0};

		let skip = parseInt((req.page || 0) * req.limit);

		if(typeof(req.search) != 'undefined'){
			console.log('搜索');
			where = {$or: [
				{vod_name : {$regex:new RegExp(req.search)}},
				{vod_actor : {$regex:new RegExp(req.search)}},
				{vod_director : {$regex:new RegExp(req.search)}},
			]};
		}
		let res = await this.db.find('media.movie', where, fields, skip, req.limit, {vod_time:1});
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
	async login(req){
		if(typeof(req.userName) == 'undefined'){
			return {code:0, data:{code:-1, info:'账号呢?'}};
		}
		if(typeof(req.passWd) == 'undefined'){
			return {code:0, data:{code:-2, info:'密码呢?'}};
		}
		let res = await this.db.find('media.user', {userName:req.userName, passWd:req.passWd}, {});
		let token = uuid.v1();//'11111111991';//Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
		console.log(token);
		if(res.res.length > 0){
			//todo：成功了
			console.log(token);
			let r = await this.db.update('media.user', {userName:req.userName}, {token:token});
			console.log('update:', r);
		}else{
			return {code:0, data:{code:-3, info:'密码错误！'}};
		}
		res = await this.db.find('media.user', {userName:req.userName}, {});
		console.log(res);
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	ping(req, cli){
		return {code:0, data:{info:'pong'}};
	}
	async addStar(req){
		let user = await this.checkToken(req);
		if(!user) return permissionDenied();
		if(typeof(req.id) == 'undefined'){
			return {code:0, data:{code:-1, info:'id呢?'}};
		}

		res = await this.db.find('media.star', {userName:user.userName, vod_id:req.id}, {});
		if(res.res.length > 0){
			return {code:0, data:{code:-1, info:'已经收藏过了'}};
		}
		let data = {userName:user.userName, vod_id:req.id, time:(new Date()).valueOf()};
		res = await this.db.insert('media.star', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async checkUser(req){
		if(typeof(req.userName) == 'undefined'){
			return {code:0, data:{code:-1, info:'你在干啥!'}};
		}
		let old = await db.find('media.user', {userName:req.userName}, {});
		if(old.res.length > 0){
			return {code:0, data:{code:-1, info:'账号已经存在!'}};
		}
		return {code:0, data:{code:0, info:'账号不存在！'}};
	}
	async delStar(req){
		let user = await this.checkToken(req);
		if(!user) return permissionDenied();

		let where = {userName:user.userName};
		let ids = req.ids.split('.');
		for(let i = 0; i < ids.length; i++)ids[i] = ids[i] * 1;
		if(req.ids != 'all'){
			where['vod_id'] = {$in: ids};
		}
		console.log(where);
		res = await this.db.remove('media.star', where);
		return {code:0, data:{info:'ok'}};
	}
	async getHistory(req){
		let user = await this.checkToken(req);
		if(!user) return permissionDenied();
		let where = {};
		req.limit = req.limit || 20;
		req.page = req.page || 0;

		res = await this.db.find('media.history', {userName:user.userName}, {vod_id:1}, req.page * req.limit, req.limit);

		let ids = [];
		for(let i = 0; i < res.res.length; i++){
			ids.push(res.res[i].vod_id + '');
		}
		console.log(ids);

		let fields = {"vod_play_url":0,"vod_id": 1,"vod_name": 1,"type_id": 1,"type_name": 1,"vod_en": 1,"vod_uptime": 1,"vod_remarks": 1,"vod_play_from": 1};

		let skip = parseInt((req.page || 0) * req.limit);
		res = await this.db.find('media.movie', {vod_id:{$in: ids}}, fields, skip, req.limit);
		let data = {
			"code": 0,
			"info": "数据列表",
			"total": res.count,
			"list":res.res
		};
		return {code:0, data:data};
	}
	async register(req){
		let data = {};
		if(typeof(req.userName) != 'undefined')data.userName = req.userName;
		if(typeof(req.passWd) != 'undefined')data.passWd = req.passWd;
		let old = await this.db.find('media.user', {userName:req.userName}, {});
		if(old.res.length > 0){
			return {code:0, data:{code:-1, info:'注册失败，账号已经存在!'}};
		}
		let res = await this.db.insert('media.user', data, {});
		return {code:0, data:{code:0, info:'注册成功，快登录吧！'}};
	}
	async type(req){
		let where = {};
		if(typeof(req.typePid) != 'undefined')where.type_pid = req.typePid;
		let res = await this.db.find('media.type', where, {}, 0, 1000);
		let data = {
			"code": 0,
			"info": "数据列表",
			"pageCount": res.count?Math.ceil(res.count/req.limit):0,
			"total": res.count,
			"list":res.res
		};
		return {code:0, data:data};	
	}

};
module.exports = Home;

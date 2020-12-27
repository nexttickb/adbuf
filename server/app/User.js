const Base = require('./Base');
const uuid = require('node-uuid');

class User extends Base{
	constructor(conf){
		super(conf);
	}
	async checkToken(req){
		let user = {};
		console.log('checkToken:', req.token);
		let res = await this.db.find('media.user', {user_token:req.token}, {});
		if(res.res.length <= 0){
			return false;
		}
		return res.res[0];
	}
	async register(req){
		let data = {
			user_id:(new Date()).valueOf(),
			user_name:req.userName, 
			user_phone:'1111', 
			user_type:1, 
			user_password: req.passWd,
			user_time:(new Date()).valueOf()
		};
		let res = await this.db.find('media.user', {user_name:req.userName}, {});
		if(res.res.length > 0){
			return {code:0, data:{code:-1, info:'已有此用户 '}};
		}
		await this.db.insert('media.sequence', {user_id:data.user_id, seq:0}, {});
		res = await this.db.insert('media.user', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async settingSet(req, params){
		let user = await this.checkToken(req);
		if(!user){
			return {code:-9, data:{code:-9, info:'未登录', data:[]}};
		}
		await this.db.update('media.settings', {user_id:user.user_id}, {data:req.data});
		return {code:0, data:{code:0, info:'更新成功', data:{}}};
	}
	async avatarSet(req, params){
		let user = await this.checkToken(req);
		if(!user){
			return {code:-9, data:{code:-9, info:'未登录', data:[]}};
		}
		await this.db.update('media.user', {user_id:user.user_id}, {avatar:req.avatar});
		return {code:0, data:{code:0, info:'更新成功', data:{}}};
	}
	async getUserInfo(user_id){
		let user = await this.db.find('media.user', {user_id:user_id}, {});
		let setting = await this.db.find('media.settings', {user_id:user_id}, {});
		return Object.assign(user.res[0], setting.res[0]);
	}
	async getFiendInfo(req){
		let user = await this.checkToken(req);
		if(!user){
			return {code:-9, data:{code:-9, info:'未登录', data:[]}};
		}
		if(typeof(req.user_id) == 'undefined' || req.user_id == ''){
			let info = await this.getUserInfo(user.user_id);	
			return {code:0, data:{code:0, info:'ok', data:info}};
		}
		//TODO: 验证是否互为好友
		let info = await this.getUserInfo(req.user_id);	
		return {code:0, data:{code:0, info:'ok', data:info}};
	}

	//login start
	async checkUser(req){
		if(typeof(req.userName) == 'undefined'){
			return {code:0, data:{code:-1, info:'你在干啥!'}};
		}
		let old = await this.db.find('media.user', {user_name:req.userName}, {});
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
		let res = await this.db.find('media.user', {user_name:req.userName, user_password:req.passWd}, {});
		let token = uuid.v1();//'11111111991';//Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
		console.log(token);
		if(res.res.length > 0){
			//todo：成功了
			console.log(token);
			let r = await this.db.update('media.user', {user_name:req.userName}, {user_token:token, sock_id:params.sockId});
			console.log('update:', r);
		}else{
			return {code:0, data:{code:-3, info:'密码错误！'}};
		}
		res = await this.db.find('media.user', {user_name:req.userName}, {});
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	async checkLogin(req, params){
		let user = await this.checkToken(req);
		if(!user){
			return {code:-9, data:{code:-9, info:'未登录', data:[]}};
		}
		await this.db.update('media.user', {user_name:user.user_name}, {sock_id:params.sockId});
		return {code:0, data:{code:0, info:'登录成功', data:{user_name:user.user_name, sock_id:params.sockId}}};
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
};
module.exports = User;

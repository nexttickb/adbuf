const Base = require('./Base');
const md5 = require('md5');
const uuid = require('node-uuid');

class Guest extends Base{
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
	
	async login(req, params){
		let termId = this.makeUid(params.sock);
		let token = uuid.v1();//'11111111991';//Number(Math.random().toString().substr(3,length) + Date.now()).toString(36);
		let userInfo = {
			user_id:termId, 
			user_name: (new Date()).valueOf(), 
			user_phone:'',
			user_type:0,
			user_remarks:'访客',
			user_time:(new Date()).valueOf(),
			user_ext:this.cinfo.getInfo(params.sock)
		};
		let res = await this.db.find('media.user', {user_id:termId}, {});
		if(res.res.length <= 0){
			res = await this.db.insert('media.user', userInfo, {});
		}
		await this.db.update('media.user', {user_id:termId}, {user_token:token, sock_id:params.sockId});
		userInfo.user_token = token;
		return {code:0, data:{code:0, info:'成功', data:userInfo}};
	}
	async matchAgent(req){
		let user = await this.checkToken(req);
		await this.db.update('media.user', {user_id:user.user_id}, {manager_name:'admin'});
		return {code:0, data:{code:0, info:'分配客服 成功', data:[]}};
	}
	async sendMsg(req, params){
		console.log('sendMsg:', req);

		let user = await this.checkToken(req);

		let res = await this.db.find('media.manager', {manager_name: user.manager_name}, {});
		if(res.res.length <= 0){
			return {code:0, data:{code:-1, info:'没有此用户', data:{}}};
		}
		let manager = res.res[0];
		let ret = this.send(manager.sock_id, {req: 'message', code:0, data:{form:user.user_id, data:req.data}});
		return {code:0, data:{code:0, info:'成功', data:ret}};
	}
	ping(req, cli){
	}

};
module.exports = Guest;

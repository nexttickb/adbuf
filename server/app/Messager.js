const Base = require('./Base');
const uuid = require('node-uuid');

class Messager extends Base{
	constructor(conf){
		super(conf);
	}
	async checkToken(req){
		let user = {};
		let res = await this.db.find('media.user', {user_token:req.token}, {});
		if(res.res.length <= 0){
			return false;
		}
		return res.res[0];
	}
	async getSequence(user_id){
		let res = await this.db.find('media.sequence', {user_id: user_id}, {});
		if(res.res.length <= 0){
			return false;
		}
		return res.res[0].seq;
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
	async findUser(req){
		let where = {};
		where.user_name = req.user_name;
		let res = await this.db.find('media.user', where, {});
		return {code:0, data:{code:0, info:'成功', detail:res.res}};
	}
	async addContacts(req){
		let user = await this.checkToken(req);
		if(!user) return this.permissionDenied();
		if(typeof(req.id) == 'undefined'){
			return {code:0, data:{code:-2, info:'id?'}};
		}
		let res = await this.db.find('media.contacts', {user_id:user.user_id, con_user_id:req.id}, {});
		if(res.res.length > 0){
			return {code:0, data:{code:-1, info:'对方已经在通讯列表'}};
		}
		let data = {user_id:user.user_id, remark_name:'', con_user_id:req.id, time:(new Date()).valueOf()};
		res = await this.db.insert('media.contacts', data, {});
		return {code:0, data:{code:0, info:'ok'}};
	}
	async delContacts(req){
		let user = await this.checkToken(req);
		if(!user) return this.permissionDenied();
		if(typeof(req.id) == 'undefined'){
			return {code:0, data:{code:-2, info:'id?'}};
		}
		let where = {user_id:user.user_id, con_user_id:req.id};
		res = await this.db.remove('media.contacts', where);
		return {code:0, data:{info:'ok'}};
	}
	
	async getContacts(req){
		let user = await this.checkToken(req);
		if(!user) return this.permissionDenied();
		let where = {};
		let res = await this.db.find('media.contacts', {user_id: user.user_id}, {});

		let ids = [];
		for(let i = 0; i < res.res.length; i++){
			ids.push(res.res[i].con_user_id);
		}
		console.log('ids:', ids);

		res = await this.db.find('media.user', {user_id:{$in: ids}}, {});
		let data = {
			"code": 0,
			"info": "数据列表",
			"detail":res.res
		};
		return {code:0, data:data};
	}
/*	
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
			let r = await this.db.update('media.user', {userName:req.userName}, {user_token:token});
			console.log('update:', r);
		}else{
			return {code:0, data:{code:-3, info:'密码错误！'}};
		}
		res = await this.db.find('media.user', {userName:req.userName}, {});
		console.log(res);
		return {code:0, data:{code:0, info:'成功', data:res.res[0]}};
	}
	*/
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
	async checkVersion(req, params){
		let user = await this.checkToken(req);
		if(!user){
			return {code:-9, data:{code:-9, info:'未登录', data:[]}};
		}
		await this.db.update('media.user', {user_name:user.user_name}, {sock_id:params.sockId});
		//重新联网后 检查有没有大于本地seq的离线消息
		let seq = await this.getSequence(user.user_id);
		if(req.seq < seq){
			console.log('有离线消息：', req.seq, seq);	
		}
		let res = await this.db.find('media.message', {to:user.user_id, seq:{'$gt':req.seq}}, {});
		for(let i = 0; i < res.res.length; i++){
			let item = res.res[i];
			await this.sendMsgTo('utu',item.from, item.to, item.seq, item.data);
		}
		return {code:0, data:{code:0, info:'登录成功', data:{user_name:user.user_name, sock_id:params.sockId}}};
	}
	ping(req, cli){
		return {code:0, data:{info:'pong'}};
	}
	async nextUserSeq(user_id){
		return this.db.db.db('media').collection('sequence').findOneAndUpdate(
			{user_id:user_id},
			{$inc : {seq:1}},
			{new:true,useFindAndModify: false},
		);
	}

	async messageAck(req){
		let user = await this.checkToken(req);
		if(!user){
			return {code:-9, data:{code:-9, info:'未登录', data:[]}};
		}
		await this.db.update('media.message', {to:user.user_id, seq:{'$lte':req.seq}, state:0}, {state:1});
		return {code:0, data:{code:0, info:'ok', data:{}}};
	}
	async messageRead(req){
		let user = await this.checkToken(req);
		if(!user){
			return {code:-9, data:{code:-9, info:'未登录', data:[]}};
		}
		await this.db.update('media.message', {to:user.user_id, from:req.fromUser, state:{'$lte':2}}, {state:2});
		await this.sendMsgTo('uack', user.user_id, req.fromUser, -1, {});
		return {code:0, data:{code:0, info:'ok', data:{}}};
	}
	async sendMsgTo(type, from_id, to_user_id, seq, data){
		let to = await this.db.find('media.user', {user_id:to_user_id}, {});
		if(to.res.length <= 0){
			return {code:0, data:{code:-1, info:'没有此用户', data:{}}};
		}
		let to_user = to.res[0];
		//TODO:判断是否有权限  是否已经互加好友
		//只负责发送  不保证送达   //message 是客户端长连接订阅通道
		await this.send(to_user.sock_id, {req: 'message', code:0, data:{type:type, user_id:from_id, seq:seq, data:data}});
	}
	async sendMsg(req, params){
		let user = await this.checkToken(req);
		if(!user) return this.permissionDenied();
		console.log('sendMsg:', req, params.sockId);
		let newSeq = await this.nextUserSeq(req.to_user);
		newSeq = newSeq.value.seq;
		req.data.time = (new Date()).valueOf();
		await this.sendMsgTo('utu', user.user_id, req.to_user, newSeq, req.data);
		console.log('newSeq:', newSeq);
		await this.db.insert('media.message',{
			from:user.user_id,
			to:req.to_user,
			data:req.data,
			state:0,
			seq: newSeq,
			timestamp:(new Date()).valueOf()
		},{});
		return {code:0, data:{code:0, info:'成功', data:{seq:newSeq}}};
	}

};
module.exports = Messager;

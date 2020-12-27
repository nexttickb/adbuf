const uuid = require('node-uuid');
const md5 = require('md5');

const ClientInfo = require('../lib/ClientInfo').ClientInfo;

class Base{
	constructor(conf){
		this.db = conf.db;
		this.bus = conf.bus;
		this.cinfo = new ClientInfo();	
	}
	permissionDenied(){
		return {code:-9, data:{info:'无权操作'}};
	}
	send(sockId, buf){
		this.bus.publish('send', {sockId:sockId, data:JSON.stringify(buf)});
	}
	makeUid(sock){
		console.log('111', sock.upgradeReq.connection.remoteAddress, '222');
		let data = JSON.parse(JSON.stringify(sock.upgradeReq.headers));
		data['sec-websocket-key'] = '';
		console.log(data);
		return md5(JSON.stringify(data));
	}
};
module.exports = Base;

var Dbio = require('./lib/Dbio').Dbio;
var Wsio = require('./lib/Wsio').Wsio;
var Bus = require('./lib/Bus').Bus;
var Home = require('./app/Home');
var Admin = require('./app/Admin');
var Guest = require('./app/Guest');
var Messager = require('./app/Messager');
var User = require('./app/User');
var Utils = require('./app/Utils');
class Server{
	constructor(conf){
		this.mod = {};
		this.bus = bus;
		this.init();
	}
	async init(){
		await this.initDb();
		let conf = {db:this.dbio, bus:bus};
		this.mod['Home'] = new Home(conf);
		this.mod['Admin'] = new Admin(conf);
		this.mod['Guest'] = new Guest(conf);
		this.mod['Messager'] = new Messager(conf);
		this.mod['User'] = new User(conf);
		this.mod['Utils'] = new Utils(conf);

		this.bus.subscribe('recv', (topic, res)=>{
			this.onRecvData(res.sock, res.data);
		});
	}
	async initDb(){
		this.dbio = new Dbio();
		await this.dbio.init({});
	}
	async onRecvData(sock, data){
		let sbuf = JSON.parse(data);
		let uri = sbuf.name.split('.');
		let cname = uri[0] || '';
		let fname = uri[1] || '';
		if(uri.length < 2){
			console.log('custom api:', uri);
			let resData = await this.mod['Admin']['general'](cname, sbuf.params, {req:sbuf.req, sock:sock, sockId:sock.upgradeReq.headers['sec-websocket-key']});
			console.log(resData);
			if(resData)sock.send(JSON.stringify({req: sbuf.req, code: resData.code, data: resData.data}));
			return;	
		}
		console.log(uri);
		if(typeof(this.mod[cname][fname]) == 'undefined'){
			console.log('not find the func:', sbuf.name);
			return sock.send(JSON.stringify({req: sbuf.req, code: -4, data: 'not find'}));
		}
		let resData = await this.mod[cname][fname](sbuf.params, {req:sbuf.req, sock:sock, sockId:sock.upgradeReq.headers['sec-websocket-key']});
		if(resData)sock.send(JSON.stringify({req: sbuf.req, code: resData.code, data: resData.data}));

	}
}
var bus = new Bus();
var serv = new Server({bus:bus});
var WsServer = new Wsio({bus:bus});

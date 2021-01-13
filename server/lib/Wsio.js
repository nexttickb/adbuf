const WebSocket = require('ws');
const comp = require('lz-string');
class Wsio{
	constructor(conf){
		this.cbfunc = conf.cbfunc;
		this.bus = conf.bus;
		this.port = conf.port || 3000;
		this.isComp = 1;
		this.ws = false;
		this.clients = {};
		this.initServer();
		this.bus.subscribe('send', (topic, res)=>{
			console.log("######################################################");
			console.log(topic, res);
			let cdata = this.compress(res.data);
			console.log('############################send data:', res.data, cdata);
			this.send(res.sockId, cdata);
		});
	}
	compress(s){
		if(!this.isComp)return s;
	//	return comp.compress(s, {encoding: 'utf8'});
		return comp.compressToUTF16(s, {encoding: 'utf8'});

	}
	unCompress(s){
		if(!this.isComp)return s;
		console.log('解压前:', s);
//		let data = comp.decompress(s);
		let data = comp.decompressFromUTF16(s);
		console.log('解压后:', data);
		return data;
	}
	initServer(){
		console.log('init server');
		this.ws = new WebSocket.Server({port: this.port});
		this.ws.on("connection", (sock, req)=>{
			sock.upgradeReq = req;
			console.log('on connection!');
			this.online(sock);
			sock.on("close", ()=>{
				console.log("client close");
				this.offline(sock);
			});
			sock.on("error", (err)=>{
				console.log("client error", err);
				this.offline(sock);
			});
			sock.on("message", (data)=>{
				console.log("client message", data, this.unCompress(data));
				this.onRecv(sock, this.unCompress(data));
			});
		});
		this.ws.on("error", this.onError);
	}
	online(sock){
		this.bus.publish('online', {sock:sock});
		this.clients[sock.upgradeReq.headers['sec-websocket-key']] = sock;
	}
	offline(sock){
		this.bus.publish('offline', {sock:sock});
		delete this.clients[sock.upgradeReq.headers['sec-websocket-key']];
	}
	send(id, data){
//		Array.from(this.ws.clients)[i].send(data);	
		if(typeof(this.clients[id]) == 'undefined'){
			console.log('sockid 不存在');
			return -1;	
		}
		return this.clients[id].send(data);
	}
	sendAll(data){
		data = this.compress(data);
		this.ws.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	}
	length(){
		return this.ws.clients.size;
	}
	onRecv(sock, data){
		let sockId = sock.upgradeReq.headers['sec-websocket-key'];
		this.bus.publish('recv', {sockId:sockId, data:data});
	}
	onError(){
	
	}
	close(){
		this.ws.close();
	}
	
}

module.exports.Wsio = Wsio;


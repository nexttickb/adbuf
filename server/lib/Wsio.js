const WebSocket = require('ws');
class Wsio{
	constructor(conf){
		this.cbfunc = conf.cbfunc;
		this.bus = conf.bus;
		this.port = conf.port || 3000;

		this.ws = false;
		this.clients = {};
		this.initServer();
		this.bus.subscribe('send', (topic, res)=>{
			console.log(topic, res);
			this.send(res.sockId, res.data);
		});
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
			//	console.log("client message", data);
				this.onRecv(sock, data);
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
			return -1;	
		}
		return this.clients[id].send(data);
	}
	sendAll(data){
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
		this.bus.publish('recv', {sock:sock, data:data});
	}
	onError(){
	
	}
	close(){
		this.ws.close();
	}
	
}

module.exports.Wsio = Wsio;


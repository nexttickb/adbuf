/*
	v1.1.2
	var io = new IoBuf();
	io.callApi('https://www.baidu.com', {a:'', b:''}, (code, data)=>{
		this.log('res:', code, data);
	});
*/

import comp from 'lz-string'

class IoBuf{
	constructor(addr) {
		this.reqNum = 0;//req 0-999999
		this.status = 0;
		this.hold = {};
		this.addr = addr || 'ws://97.64.82.95:3000/';
	//	this.connect();
		this.ws = false;
		this.isComp = 1;
	}
	getReq(){
		this.reqNum = (this.reqNum >= 999999 ? 0 : this.reqNum + 1);
		return this.reqNum;
	}
	connect(){
		console.log('connect...');
		this.ws = new WebSocket(this.addr);
		this.ws.onopen = (e)=>{this.onOpen(e)};
		this.ws.onclose = (e)=>{this.onClose(e)};
		this.ws.onerror = (e)=>{this.onError(e)};
		this.ws.onmessage = (e)=>{this.onMessage(e)};
	}
	onOpen(e){
		this.status = 1;
		this.log("connect success!", this.status);
	}
	onClose(e){
		this.status = -1;
		this.log("disconnect!");
		setTimeout(()=>{
			this.log('on close reconnect...');
			this.connect();
		}, 1000);
	}
	onError(e){
		this.status = -2;
		this.log("connect error!");
	}
	log(){
//		console.log(JSON.stringify(arguments));
	}
	onSubMessage(){
		
	}
	onMessage(e){
		let ebuf = this.unCompress(e.data);
		console.log('onMessage src:', e.data);
		console.log('onMessage data:', ebuf);
		let buf = JSON.parse(ebuf);
		this.log(buf.req, buf.data, this.hold);//{req:111, code:0, data:''}
		if(buf.req == 'message'){
			return this.onSubMessage(buf.code, buf.data);
		}
		if(typeof(this.hold[buf.req]) == 'undefine'){
			this.log('err buf...', buf);
			return;
		}
		let sub = this.hold[buf.req];
		sub = sub || {mode:2};
		if(sub.mode != 2){
			if(sub.timer)clearTimeout(sub.timer);
			sub.cbfunc.call(0, buf.code, buf.data, new Date().getTime() - sub.stime);
		}
		//mode1 只有一次回调
		if(sub.mode == 1){
			delete this.hold[buf.req];
		}
	}
	compress(s){
		if(!this.isComp)return s;
	//	return comp.compress(s, {encoding: 'utf8'});
		return comp.compressToUTF16(s, {encoding: 'utf8'});
	}
	unCompress(s){
		if(!this.isComp)return s;
	//	let data = comp.decompress(s);
		let data = comp.decompressFromUTF16(s);
		console.log('解压后:', data);
		return data;
	}
	doSend(data){
		console.log('ws:', this.ws);
		if(this.ws.readyState === this.ws.CLOSED){
			return console.log('ws error');
		}
		this.ws.send(this.compress(data));
	}
	//mode1 default  mode0 recv mode2 send 
	callApi(name, params, cbfunc, conf){
		console.log('net status:', this.status);
		if(this.status <= 0){
			return cbfunc.call(0, -1, {});
		}
		conf = conf || {mode : 1, timeout: 10000};
		
		let freeReq = conf.req || this.getReq();
		//2模式 不回调
		if(2 != conf.mode){
			this.hold[freeReq] = {
				timer : setTimeout(()=>{
					if(0 != conf.mode){cbfunc.call(0, -1, {info:'timeout'}, 'TO');}
					if(1 == conf.mode){
						delete this.hold[freeReq];
					}
				}, conf.timeout),
				mode : conf.mode,
				stime : new Date().getTime(),
				cbfunc : cbfunc
			};
		}
		let buf = JSON.stringify({
			req:freeReq,
			name:name,
			params:params
		});
		//0模式 不发送
		if(0 != conf.mode){this.doSend(buf)}
	}
}

export default IoBuf;

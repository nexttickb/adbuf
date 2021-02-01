/*
	RUNKIT.ServerApi.send("https://www.baidu.com/", {a:'1111'}, (bl, res)=>{
		console.log(bl, res);
	});
*/
import IoBuf from '@/components/lib/IoBuf'
class ServerApi extends IoBuf{
    constructor(){
		super();
		this.token = '';
        this.userInfo = {};
		this.timer = false;
		this.memData = {};
    }
	async init(){
		this.otherInit();
		await this.connect();
		
		this.userInfo = RUNKIT.Store.get('userInfo') || {};
	}
	async onOpen(){
		super.onOpen();
		
		if(typeof(this.userInfo.token) == 'undefined'){
			RUNKIT.token = '';
		//	await this.guestLogin();
			this.needLogin();
		}else{
			this.onUserInfoChange(this.userInfo);
			RUNKIT.token = this.token;
			this.logged();
		}
		this.ping();
		setInterval(()=>{
			this.ping();
		}, 3000);
		await this.checkLogin();
		RUNKIT.VoimBus.publish('network', {type:'init', data: {}});
	}
	ping(){
		this.callApi('Home.ping', {}, (code, data, time)=>{
	//		console.log('ping:', code, data, time);
			RUNKIT.VoimBus.publish('signal', {type:'signal', data: {code, time} });
		}, {mode : 1, timeout: 3900});
	}
	getValue(key){
		return this.memData[key];
	}
	setValue(key, value){
		this.memData[key] = value;
	}
	
	createUUID() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
		s[8] = s[13] = s[18] = s[23] = "";
		var uuid = s.join("");
		return uuid;
	}
	//存取一级分类下看到哪个子分类以及页数
	setTypePoint(id, data){
		RUNKIT.Store.set('typePoint_' + id, data);
	}
	getTypePoint(id){
		return RUNKIT.Store.get('typePoint_' + id);
	}
	//存取一级分类下看到哪个子分类以及页数
	setNowType(id){
		RUNKIT.Store.set('nowType', id);
	}
	getNowType(){
		return RUNKIT.Store.get('nowType');
	}
	//存取当前影片播放到多少集
	setPlayNum(id, number){
		RUNKIT.Store.set('playNum_' + id, number);
	}
	getPlayNum(id){
		if('0' == id)return 0;
		return RUNKIT.Store.get('playNum_' + id) || 0;
	}
	
	// buffer is an ArrayBuffer
	buf2hex(buffer) {
		return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
	}
	//分片传输超大buffer
	async sendFileData(path, params, cbfunc){
		let maxLen = 1024 * 512;//每片最大
		if(this.token == ''){
			return this.needLogin();
		}
		let falCount = 0;//失败次数
		let falMaxCount = 20;//最大允许失败次数
		let data = new Uint8Array(params.data);//this.buf2hex(params.data);//转换为十六进制不带0x的字符串。
		let name = params.name;
		let count = Math.ceil(data.length / maxLen);
		
		//TODO: 将blob或  buffer切片   切片后转换为hex再发送
		for(let i = 0; i < count;){
			
			return cbfunc.call(0, 1, '正在传输', (i + 1)/count * 100);
			let bufData = this.buf2hex(data.slice(i * maxLen, maxLen));//每个字节片段转换成hex字符串再送走
			let res = await this.sendSync(path, {name:name, maxCount:count, nowCount:i + 1, length:bufData.length, data:bufData});
			if(res){
				//TODO：根据返回的res内容判断是否已经接收成功
				i++;
			}else{
				falCount++;
				if(falCount > falMaxCount){
					return cbfunc.call(0, -9, '通讯异常,传输失败.', 0);
				}
				console.log('传输失败，准备重试！', falCount);
			}
		}
		return cbfunc.call(0, 0, '传输完成!', 100);
	}
	async guestLogin(){
		return new Promise((resolve, reject)=> {
			this.send('Guest.login', {}, (code, data, time)=>{
				console.log(code, data);
				if(0 == code){
					this.onUserInfoChange(data);
				}
				resolve(data);
			});
		});
	}
	async appConfigGet(params){
		return new Promise((resolve, reject)=> {
			this.send("Admin.appConfigGet", params || {}, (bl, res)=>{
				console.log(bl, res);
				resolve(res);
			});
		});
    }

	
	async checkLogin(){
		return new Promise((resolve, reject)=> {
			this.send('Admin.checkLogin', {}, (code, data, time)=>{
				console.log(code, data);
				if(code){
					resolve(false);
				}else{
					resolve(true);
					this.logged();
				}
			});
		});
	}
	needLogin(){
		if(!this.token)
			RUNKIT.VoimBus.publish('public', {type:'login', data: {}});
		return this.token != '';
	}
	logged(){
		RUNKIT.VoimBus.publish('public', {type:'logged', data: {}});
	}
	//收藏
	async addStar(id){
		if(this.token == ''){
			return this.needLogin();
		}
		return new Promise((resolve, reject)=> {
			this.send("Home.addStar", {id:id}, (bl, res)=>{
				console.log(bl, res);
				resolve(res);
			});
		});
	}
	send(path, params, cbfunc, conf){
	//	alert('send');
		params.token = this.token;
		this.callApi(path, params, (code, data, time)=>{
	//		alert('recv');
			if(-9 == code){
				this.token = '';
				this.needLogin();
			}
			cbfunc.call(0, code, data);
		}, conf);
	}
	async sendSync(path, params){
		return new Promise((resolve, reject)=> {
			this.send(path, params, (code, data, time)=>{
				if(code){
					resolve(false);
				}else{
					resolve(true);
				}
			});
		});
	}
	//{phone:'13161918102', code:'123456'}
    login(params){
		return new Promise((resolve, reject)=> {
			this.send("Admin.login", params, (bl, res)=>{
				console.log(bl, res);
				if(bl == 0 && res.code == 0){
					this.onUserInfoChange(res.data);
					this.logged();
				}
				resolve(res);
			});
		});
    }
	checkUser(params){
		return new Promise((resolve, reject)=> {
			this.send("Admin.checkUser", params, (bl, res)=>{
				console.log(bl, res);
				resolve(res);
			});
		});
    }
	logout(){
		this.token = '';
		this.userInfo.token = '';
		RUNKIT.token = '';
		RUNKIT.Store.set('userInfo', {});
		location.reload();
	}
	onUserInfoChange(userInfo){
		if(typeof(userInfo) != "undefined"){
			this.userInfo = userInfo;
			this.token = this.userInfo.token;
			console.log('upuserInfo:',userInfo);
			RUNKIT.Store.set('userInfo', this.userInfo);
		}
		RUNKIT.VoimBus.publish('public', {type:'userInfo', data: userInfo});
	}
	otherInit(){
		Date.prototype.Format = function (fmt) { // author: meizz
			var o = {
				"M+": this.getMonth() + 1, // 月份
				"d+": this.getDate(), // 日
				"h+": this.getHours(), // 小时
				"m+": this.getMinutes(), // 分
				"s+": this.getSeconds(), // 秒
				"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
				"S": this.getMilliseconds() // 毫秒
			};
			if (/(y+)/.test(fmt))
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
					return fmt;
		}
	}
    onNotLogged(params, cbfunc){
	
    }
}

export default ServerApi

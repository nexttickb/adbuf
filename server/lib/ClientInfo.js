var libqqwry = require('lib-qqwry');

class ClientInfo{
	constructor(){
		this.qqwry = libqqwry();
		this.qqwry.speed();
	}
	getInfo(sock){
		let res = {};
	//	res.sockId = sock.upgradeReq.headers['sec-websocket-key'];
		res.language = sock.upgradeReq.headers['accept-language'];
		res.origin = sock.upgradeReq.headers['origin'];
		res.ip = sock.upgradeReq.connection.remoteAddress.substr(7);
		let userAgent = sock.upgradeReq.headers['user-agent'];
		let ipInfo = this.qqwry.searchIP(res.ip);
		res.country = ipInfo.Country;
		res.area = ipInfo.Area.replace("CZ88.NET", '--');
		res.os = this.getOsInfo(userAgent);
		res.browser = this.getBrowser(userAgent);
		console.log(res);
		return res;
	}
	getOsInfo(userAgent){
		var userAgent = userAgent.toLowerCase();
		var name = '--';
		var version = '--';
		if (userAgent.indexOf('win') > -1) {
			name = 'Windows';
			if (userAgent.indexOf('windows nt 5.0') > -1) {
				version = 'Windows 2000';
			} else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
				version = 'Windows XP';
			} else if (userAgent.indexOf('windows nt 6.0') > -1) {
				version = 'Windows Vista';
			} else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
				version = 'Windows 7';
			} else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
				version = 'Windows 8';
			} else if (userAgent.indexOf('windows nt 6.3') > -1) {
				version = 'Windows 8.1';
			} else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
				version = 'Windows 10';
			} else {
				version = '--';
			}
		} else if (userAgent.indexOf('iphone') > -1) {
			name = 'iPhone';
		} else if (userAgent.indexOf('mac') > -1) {
			name = 'Mac';
		} else if (userAgent.indexOf('x11') > -1 || userAgent.indexOf('unix') > -1 || userAgent.indexOf('sunname') > -1 || userAgent.indexOf('bsd') > -1) {
			name = 'Unix';
		} else if (userAgent.indexOf('linux') > -1) {
			if (userAgent.indexOf('android') > -1) {
				name = 'Android';
			} else {
				name = 'Linux';
			}
		} else {
			name = '';
		}
		return name + version;
	}
	getBrowser(userAgent){
		var isIE11 = userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/); // IE 11中userAgent已经不包含'msie'所以用'msie'不能判断IE 11  
		var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器  
		var isIE = (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) || isIE11; //判断是否IE浏览器  
		var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器  
		var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器  
		var isSafari = userAgent.indexOf("Safari") > -1  
			&& userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器  
		var isChrome = userAgent.indexOf("Chrome") > -1  
			&& userAgent.indexOf("Safari") > -1; //判断Chrome浏览器  

		if (isIE) {  
			/*
			var reIE = new RegExp("MSIE (\\d+\\.\\d+);");  
			reIE.test(userAgent);  
			var fIEVersion = parseFloat(RegExp\["$1"\]);  
			if (fIEVersion == 7) {  
				return "IE7";  
			} else if (fIEVersion == 8) {  
				return "IE8";  
			} else if (fIEVersion == 9) {  
				return "IE9";  
			} else if (fIEVersion == 10) {  
				return "IE10";  
			} else if(isIE11){ // IE 11中userAgent已经不包含'msie'所以用'msie'不能判断IE 11  
				return "IE11";  
			}  else {  
				return "IE";  
			}//IE版本过低  
			*/
			return "垃圾IE";
		}  
		if (isOpera) {  
			return "Opera";  
		}  
		if (isEdge) {  
			return "Edge";  
		}  
		if (isFF) {  
			return "Firefox";  
		}  
		if (isSafari) {  
			return "Safari";  
		}  
		if (isChrome) {  
			return "Chrome";  
		}  
		return '--'  
	}
}
module.exports.ClientInfo = ClientInfo;


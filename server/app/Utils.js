const Base = require('./Base');
const translate = require('google-translate-cn-api');

class Utils extends Base{
	constructor(conf){
		super(conf);
	}
	async checkToken(req){
		let user = {};
		console.log('checkToken:', req.token);
		let res = await this.db.find('media.manager', {token:req.token}, {});
		if(res.res.length <= 0){
			return false;
		}
		return res.res[0];
	}
	async Translate(req, params){
		let res = await translate(req.text, { to: req.to })
		return {code:0, data:{code:0, info:'成功', data:res.text}};
	}
	ping(req){
		return {code:0, data:{info:'pong'}};
	}
};
module.exports = Utils;

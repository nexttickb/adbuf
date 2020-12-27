const Base = require('./Base');

class Host extends Base{
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
	ping(req){
		return {code:0, data:{info:'pong'}};
	}
};
module.exports = Host;

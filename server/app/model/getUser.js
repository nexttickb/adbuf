module.exports = async function(db, token) {
	console.log('getUser');
	let res = await db.find('media.user', {token:token}, {});
	if(res.res.length <= 0){
		return {code:-1, info:'没查到！'};
	}
	return {code:0, info:'成功', data:res.res[0]};
};


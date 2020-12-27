var request = require("request");
const urlib = require("url");

function send(url, params){
	return new Promise((resolve, reject)=> {
		console.log('start:', url);
		request({
			url: url,
			method: "get",
			body:params
		}, function (error, response, body) {
			resolve(urlib.parse(response.req.path,true));
		});
	});
}

async function main(){
	let res = await send('https://vt.tiktok.com/ZSPUKtqT/');
	console.log(res.query.share_app_name);
	console.log(res.query.share_item_id);
}

main();

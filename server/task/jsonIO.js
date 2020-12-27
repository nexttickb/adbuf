var Dbio = require('../lib/Dbio').Dbio;
var request = require("request");

function send(url, params){
	return new Promise((resolve, reject)=> {
		console.log('start:', url);
		request({
			url: url,
			method: "post",
			json: true,
			headers: {"content-type": "application/json",},
			body:params
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				resolve(body);
			}else{
				console.log(error);
				resolve(false);
			}
		});
	});
}

function createUUID() {
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

async function start(){
	db = new Dbio();
	await db.init({});
	let pageCount = 1215;
	let nowPage = 1;
	while(nowPage <= pageCount){
		let res = await send('https://api.okzy.tv/api.php/provide/vod/at/json/?ac=detail&pg=' + nowPage)
		if(!res){
			console.log('请求失败,页码:', nowPage);
			continue;
		}
		if(res.code != 1)return console.log('请求数据code不为1, 页码:', nowPage);
		pageCount = res.pagecount;
		let movies = [];
		for(let n = 0; n < res.list.length; n++){
			let tmovie = res.list[n];
			let movie = {};
			movie.vod_id         = tmovie.vod_id       ;
			movie.vod_name       = tmovie.vod_name     ;
			movie.type_id        = tmovie.type_id      ;
			movie.type_name      = tmovie.type_name    ;
			movie.vod_en         = tmovie.vod_en       ;
			movie.vod_addtime    = tmovie.vod_time  ;
			movie.vod_uptime     = tmovie.vod_time  ;
			movie.vod_remarks    = tmovie.vod_remarks  ;
			movie.vod_play_from  = tmovie.vod_play_from;
			movie.vod_pic        = tmovie.vod_pic      ;
			movie.vod_area       = tmovie.vod_area     ;
			movie.vod_lang       = tmovie.vod_lang     ;
			movie.vod_year       = tmovie.vod_year     ;
			movie.vod_serial     = tmovie.vod_serial   ;
			movie.vod_actor      = tmovie.vod_actor    ;
			movie.vod_director   = tmovie.vod_director ;
			movie.vod_content    = tmovie.vod_content  ;
			let turls = tmovie.vod_play_url.split('$$$');
			console.log('insert:', movie.vod_name);
			for(let u = 0; u < turls.length; u++){
				let nuarr = turls[u].split('$');
				if(nuarr.length > 1){
					let playurl = {url_id:createUUID(), vod_id:movie.vod_id, url_name:nuarr[0], url_src:nuarr[1], url_type:nuarr[1].substr(-4)=='m3u8'?'m3u8':'page'};
					await db.insert('media.playurl', playurl);
				}
			}
			await db.insert('media.movie', movie);
		}
		console.log('完成一页, 当前/全部 :', nowPage++, '   ', res.page,"/", res.pagecount);
	}

}

start();

var Dbio = require('../lib/Dbio').Dbio;
var request = require("request");
var parseString = require('xml2js').parseString;

function send(url){
	return new Promise((resolve, reject)=> {
		console.log('start:', url);
		request({
			url: url,
			method: "get",
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

async function xml2json(xml){
	return new Promise((resolve, reject)=> {
		parseString(xml, function (err, result) {
	//		console.dir(JSON.stringify(result));
			resolve(result);
		});
	});
}

async function start(api){
	db = new Dbio();
	await db.init({});
	let pageCount = 1000;
	let nowPage = 1;
	while(nowPage <= pageCount){
		let res = await send(api + '?ac=videolist&pg=' + nowPage)
		if(!res){
			console.log('请求失败,页码:', nowPage);
			continue;
		}
		res = await xml2json(res);
		let list = res.rss.list[0].video;
//		console.log('list:', list);
		let movies = [];
		for(let n = 0; n < list.length; n++){
			let tmovie = list[n];
			let movie = {};
			movie.vod_id 		= tmovie.id;
			movie.vod_name 		= tmovie.name;
			movie.vod_remarks 	= tmovie.note;
			movie.type_name 	= tmovie.type;
			movie.vod_pic 		= tmovie.pic;
			movie.vod_lang 		= tmovie.lang || '未知';
			movie.vod_area 		= tmovie.area || '未知';
			movie.vod_year 		= tmovie.year || '未知';
			movie.vod_actor 	= tmovie.actor || '未知';
			movie.vod_director	= tmovie.director || '未知';
			movie.vod_content 	= tmovie.des || tmovie.name;
			movie.vod_time		= tmovie.last;
			movie.vod_play_url   = [];
			for(let i = 0; i < tmovie.dl.length; i++){
				for(let item in tmovie.dl[i]){
					let links = tmovie.dl[i][item];
					for(let x = 0; x < links.length; x++){
						console.log(links[x]['_']);	
						let nuarr = links[x]['_'].split('$');
						movie.vod_play_url.push({name:nuarr[0], url:nuarr[1], type:'m3u8'});
					}
				}
			}
			let old = await db.find('media.movie', {vod_name:movie.vod_name}, {});
			if(old.res.length > 0){
				console.log('影片已经存在，跳过：', movie.vod_name);
				continue;
			}else{
				console.log('insert:', movie.vod_name);
				await db.insert('media.movie', movie);
			}
		}
		console.log('完成一页, 当前/全部 :', nowPage++, '   ', res.page,"/", res.pagecount);
	}

}

//start('http://api.shenmacj.com/api.php/provide/vod/from/smm3u8/at/xml/');
//start('http://mygzycj.com/sapi.php');
//start('http://cjmygzy.com/inc/sapi.php');
start('http://cjmygzy.com/inc/sapi.php');

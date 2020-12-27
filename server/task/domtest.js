var Dbio = require('../lib/Dbio').Dbio;
var request = require("request");
const jsdom = require('jsdom');
const {JSDOM} = jsdom;

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

/*
async function start(){
	db = new Dbio();
	await db.init({});
	let pageCount = 1000;
	let nowPage = 608;
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
			movie.vod_play_url   = [];
			let turls = tmovie.vod_play_url.split('$$$');
			for(let u = 0; u < turls.length; u++){
				let nuarr = turls[u].split('$');
				movie.vod_play_url.push({name:nuarr[0], url:nuarr[1], type:'m3u8'});
			}
			console.log('insert:', movie.vod_name);
			await db.insert('media.movie', movie);
		}
		console.log('完成一页, 当前/全部 :', nowPage++, '   ', res.page,"/", res.pagecount);
	}

}

start();
*/

async function get$(url){
	let res = await send(url)
	let {document} = (new JSDOM(res)).window;
	let window = document.defaultView;
	let $ = require('jquery')(window);
	return $;
}

async function getDetail(title, url){
	let $ = await get$('http://okzyw.com' + url)

	let movie = {};
	let infos = $('.vodInfo span');

	movie.vod_id       = '';
	movie.vod_name     = infos[0];
	movie.type_id      = infos[0];
	movie.type_name    = infos[0];
	movie.vod_en       = infos[1];
	movie.vod_addtime  = '';
	movie.vod_uptime   = '';
	movie.vod_remarks  = infos[0];
	movie.vod_play_from= '';
	movie.vod_pic      = '';//$('.lazy')[0].src;
	movie.vod_area     = infos[5];
	movie.vod_lang     = infos[6];
	movie.vod_year     = infos[7].text();
	movie.vod_serial   = 0;//连载
	movie.vod_actor    = infos[3].innerText;//演员
	movie.vod_director = infos[2];//导演
//	movie.vod_content  = $('.vodplayinfo')[0].innerText;
	movie.vod_play_url = [];

	let urls = $('#2 li');
	/*
	for(let i = 0; i < urls.length; i++){
			let kv = urls[i].split('$');
			movie.vod_play_url.push({name:kv[0], url:kv[1]});
	}
	*/

	console.log(movie);
	console.log($('.lazy'));

}

async function getList(page){
	let $ = await get$('http://okzyw.com/?m=vod-index-pg-' + page + '.html')
	let links = $('.xing_vb4 a');
	for(let i = 0; i < links.length; i++){
		console.log(links[i].innerHTML ,links[i].getAttribute('href'));
		await getDetail(links[i].innerHTML ,links[i].getAttribute('href'));
	}
}

getList(1);



var Dbio = require('../lib/Dbio').Dbio;
var request = require("request");
const cheerio = require('cheerio')
const types = require('./types')

var typeKv = {};
var maxId = types.length;
for(let i  = 0; i < types.length; i++){
	typeKv[types[i].type_name] = types[i].type_id;
}

function log(){
//	console.log(arguments);
}

function send(url){
	return new Promise((resolve, reject)=> {
		log('start:', url);
		request({
			url: url,
			method: "get",
		}, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				resolve(body);
			}else{
				log(error);
				resolve(false);
			}
		});
	});
}

async function sleep(time){
	return new Promise((resolve, reject)=> {
		setTimeout(()=>{
			resolve();
		}, time);
	});
}

async function get$(url){
	let res = await send(url);
	if(!res){
		console.log("请求失败，准备重试;", url);
		await sleep(1000);
		return await get$(url);
	}
	return cheerio.load(res, {decodeEntities: false});
}

function name2id(name){
	for(let k in typeKv){
		if(k.indexOf(name) >= 0){
			return typeKv[k];
		}
	}
	console.log('找不到分类:', name);
	return name2id('未分类');
}

async function getDetail(id, title, url){
	let $ = await get$(url)
	await sleep(200);
	let movie = {};

	movie.vod_id = id;
	$('.vodInfo h2').each(async (index, ele)=>{
		log(index, $(ele).text());
		if(0 == index)
			movie.vod_name     = $(ele).text().trim();
	});
	$('.vodInfo span').each(async (index, ele)=>{
		let text = $(ele).text().trim();
		log(index, text);
		if(0 == index)
			movie.vod_remarks  = text;
		if(2 == index)
			movie.vod_director = text;//导演
		if(3 == index)
			movie.vod_actor    = text;//演员
		if(4 == index){
			movie.type_name    = text.split(' ')[0];
			movie.vod_tags    = text.split(' ');
			console.log(movie.type_name);
			movie.type_id = name2id(movie.type_name);
		}
		if(5 == index)
			movie.vod_area     = text;
		if(6 == index)
			movie.vod_lang     = text;
		if(7 == index)
			movie.vod_year     = text;
		if(9 == index)
			movie.vod_time   = text;
	});
	$('.vodplayinfo').each(async (index, ele)=>{
		let text = $(ele).text().trim();
		log(index, text);
		if(index == 0)
			movie.vod_content  = text;
	});
	$('.lazy').each(async (index, ele)=>{
		let text = $(ele).attr('src').trim();
		log(index, text);
		if(index == 0)
			movie.vod_pic  = text;
	});
	

	movie.vod_play_url = [];
	$('#2 li').each(async (index, ele)=>{
		let text = $(ele).text();
		log(index, text);
		let kv = text.split('$');
		movie.vod_play_url.push({name:kv[0], type:'m3u8', url:kv[1]});
	});
	log(movie);
	return movie;
}

async function getList(page, db){
	let $ = await get$('http://okzyw.com/?m=vod-index-pg-' + page + '.html')
	if(!$)return false;
	$('.xing_vb4 a').each(async (index, ele)=>{
		let url = $(ele).attr('href');
		let name = $(ele).html();
		let id = url.substring(18).substr(0, url.substring(18).length - 5);
		let movie = await getDetail(id, name,'http://okzyw.com' + url);
		let old = await db.find('media.movie', {vod_name:movie.vod_name}, {});
		log("搜索:", old);
		if(old.res.length > 0){
			console.log('影片已经存在，跳过：', movie.vod_name);
			return;
		}
		console.log(index, page, movie.vod_name);
		await db.insert('media.movie', movie);
		return;
	});
}
async function start(){
	db = new Dbio();
	await db.init({});
	let pageCount = 1077;
	let nowPage = 1;
	while(nowPage <= pageCount){
		await getList(nowPage, db);
		console.log('完成一页, 当前/全部 :', nowPage++, "/", pageCount);
	}
}

start();
//getDetail(51413, '', '/?m=vod-detail-id-55446.html');


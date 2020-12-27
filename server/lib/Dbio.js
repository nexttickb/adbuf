var mongo = require('mongodb').MongoClient;

class Dbio{
	constructor(){
		this.db = false;
	}
	init(conf){
		this.url = conf.url ||'mongodb://localhost:27017/';
		this.user = conf.user || '';
		this.pwd = conf.pwd || '';
		this.dbname = conf.dbname || '';
		return new Promise((resolve, reject)=> {
			mongo.connect(this.url, { useNewUrlParser: true ,useUnifiedTopology:true}, (err, db)=>{
				if (err) throw err;
				this.db = db;
				resolve(err, db);
			});
		});
	}
	getDb(){
		return this.db;
	}
	insert(table, datas){
		let names = table.split('.');
		return new Promise((resolve, reject)=> {
			this.db.db(names[0]).collection(names[1]).insertMany(typeof(datas) == 'Array'?datas:[datas], (err, res)=>{
				if (err) throw err;
				resolve({err:err, res:res});
			});
		});
	}
	remove(table, where){
		let names = table.split('.');
		return new Promise((resolve, reject)=> {
			this.db.db(names[0]).collection(names[1]).deleteMany(where, (err, res)=>{
				if (err) throw err;
				resolve({err:err, res:res});
			});
		});
	}
	async updatePart(table, where, datas){
		let res = await this.find(table, where, {});
		if(res.res.length <= 0)return -1;
		let allDatas = res.res[0];
		for(let key in datas){
			allDatas[key] = datas[key];
		}
		return await this.update(table, where, allDatas);
	}
	update(table, where, datas){
		let names = table.split('.');
		let updateStr = {$set: datas};
		return new Promise((resolve, reject)=> {
			this.db.db(names[0]).collection(names[1]).updateMany(where, updateStr, (err, res)=>{
				if (err) throw err;
				console.log("文档更新", res.result, table, where, updateStr);
				resolve({err:err, res:res});
			});
		});
	}
	find(table, where, field, skip, limit, sort){
		let names = table.split('.');
		return new Promise((resolve, reject)=> {
			let db = this.db.db(names[0]).collection(names[1]);
			db.find(where).project(field).skip(skip || 0).sort(sort || {}).limit(limit || 10).toArray((err, res)=>{
				if (err) throw err;
				resolve({err:err, res:res});
			});
		});
	}
	drop(table){
		let names = table.split('.');
		return new Promise((resolve, reject)=> {
			this.db.db(names[0]).collection(names[1]).drop((err, res)=>{
				if (err) throw err;
				resolve({err:err, res:res});
			});
		});
	}
	close(){
		this.db.close();
	}
	
}

module.exports.Dbio = Dbio;


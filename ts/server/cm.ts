const { v4: uuidv4 } = require('uuid')
import { query } from "./../lib/database"

export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

export async function login(req: any,res: any,route: any)
{
	if(route.query.uuid === undefined) return null;

	let result = await query("SELECT * FROM CMUser WHERE uuid = ?;", [route.query.uuid]);
	console.log(result);
	if(!result || result.length == 0){
		await query("INSERT INTO CMUser (uuid) VALUES (?);", [route.query.uuid]);
		result = await query("SELECT * FROM CMUser WHERE uuid = ?;", [route.query.uuid]);
	}
	
	let ret = result[0];
	ret.coin = parseInt(ret.coin);
	ret.stolenCoin = parseInt(ret.stolenCoin);
	
	return {
		status: 200,
		user: ret
	};
}

export async function save(req: any,res: any,route: any)
{
	if(route.query.uuid === undefined) return null;

	let result = await query("SELECT * FROM CMUser WHERE uuid = ?;", [route.query.uuid]);
	let stolenCoin = 0;
	
	if(result){
		let queryStr:string = "";
		let qq:Array<string> = [];
		let vals:Array<any> = [];
		for(let k in route.query) {
			if(k == "uuid") continue;
			qq.push(k + " = ?");
			vals.push(route.query[k]);
		}
		queryStr = "UPDATE CMUser SET " + qq.join(',') + " WHERE uuid = ?;";
		vals.push(route.query.uuid);

		await query(queryStr, vals);
		
		stolenCoin = parseInt(result[0].stolenCoin);
	}
	
	return {
		status: 200,
		stolenCoin: stolenCoin,
		isAttackedVillage: (result[0].facility == 0)
	};
}

export async function list(req: any,res: any,route: any)
{
	if(route.query.uuid === undefined) return null;

	const result = await query("SELECT * FROM CMUser WHERE uuid != ? ORDER BY coin DESC LIMIT 0,10;", [route.query.uuid]);
	
	let ret = [];
	for(var r of result){
		let d:any = {}
		for(var k in r) {
			d[k] = r[k];
		}
		d["coin"] = parseInt(r.coin);
		delete d["stolenCoin"];
		delete d["createdAt"];
		delete d["id"];
		ret.push(d);
	}
	
	return { 
		status: 200,
		list: ret
	};
}

export async function attack(req: any,res: any,route: any)
{
	if(route.query.uuid === undefined) return null;

	const myData = await query("SELECT * FROM CMUser WHERE uuid = ?", [route.query.uuid]);
	const targetData = await query("SELECT * FROM CMUser WHERE uuid = ?", [route.query.TargetUUID]);

	//ベット額の10倍を奪う
	let stealCoin = route.query.BetCoin * 10;
	let stolenCoin = parseInt(targetData[0].stolenCoin);
	let targetCoin = parseInt(targetData[0].coin);
	if(targetCoin < stealCoin) {
		stealCoin = targetCoin;
	}
	
	//
	await query("UPDATE CMUser SET coin = ?, facility = 0, stolenCoin = ? WHERE uuid = ?;", [(targetCoin-stealCoin), (stolenCoin+stealCoin), route.query.TargetUUID]);
	
	return {
		status: 200,
		stealCoin: stealCoin
	};
}

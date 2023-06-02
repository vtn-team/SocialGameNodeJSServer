const { v4: uuidv4 } = require('uuid')
import { query } from "./../lib/database"
import { getCache, updateCache, updateData } from "./../lib/userCache"

export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

export async function login(req: any,res: any,route: any)
{
	let key = updateCache(route.query.udid);
	let session = getCache(key);
	
	//user cache
	if(!route.query.udid)
	{
	  return { status: 200, session:key, token: session.token };
	}
	
	//
	const result = await query("SELECT * FROM User WHERE udid = ?",[route.query.udid]);
	if(result.length == 0)
	{
	  return { status: 400 };
	}
	
	//userIdをキャッシュに記録する
	updateData(key, "userId", Number(result[0].id));
	
	return { 
		status: 200,
		session:key, 
		token: session.token,
		udid: result[0].udid,
		name: result[0].name,
		id: Number(result[0].id)
	};
}

export async function create(req: any,res: any,route: any)
{
	let index = 0;
	if(!route.query.name) return {};
	
	let udid:string = uuidv4();
	const result = await query("INSERT INTO User(udid, name) VALUES(?,?)",[udid, route.query.name]);
	console.log(result);
	return {
		status: 200,
		udid: udid,
		name: route.query.name
	};
}

export async function get(req: any,res: any,route: any)
{
	if(route.query.udid === undefined) return null;
	
	console.log("get here");
	const result = await query("SELECT * FROM User WHERE udid = ?",[route.query.udid]);
	return { status: 200 };
}


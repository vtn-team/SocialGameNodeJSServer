const { v4: uuidv4 } = require('uuid')
import { query } from "./../lib/database"
import { getCache, updateCache } from "./../lib/userCache"
import { getMaster, getQuest } from "./../lib/masterDataCache"


export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

export async function start(req: any,res: any,route: any)
{
	let session = getCache(route.query.session);
	if(!session)
	{
	  return { status: 200 };
	}

	//user cache
	if(!route.query.udid)
	{
	  return { status: 200 };
	}
	
	let questId = route.query.questId;
	const quest = getQuest(questId);
	
	if(!quest)
	{
	  return { status: 400, message: "invalid quest" };
	}
	
	//
	const result = await query("SELECT * FROM User WHERE udid = ?",[route.query.udid]);
	const user = result[0];
	
	if(user.movePoint < quest.MovePoint)
	{
	  return { status: 400, message: "not enough move point." };
	}
	
	let token:string = uuidv4();
	await query("UPDATE User SET questTransaction = ?, movePoint = movePoint - ?, lastPointUpdate = now() WHERE udid = ?",[token, quest.MovePoint, route.query.udid]);
	
	//サーバだけでする処理をここに書く＆Saveに記録するといい
	
	//
	
	//Questの状況をいちどQuestSaveに記録
	await query("INSERT INTO QuestSave(udid, questId, userId) VALUES(?,?,?)", [token, questId, route.query.udid]);
	
	const result2 = await query("SELECT movePoint, lastPointUpdate FROM User WHERE udid = ?",[route.query.udid]);
	const user2 = result2[0];
	
	return { 
		status: 200,
		transaction: token,
		afterMovePoint: user2.movePoint,
		lastPointUpdate: (new Date(user2.lastPointUpdate)).getTime(),
		enemies: [], //TODO: 実際は出現する敵を返す
	};
}

export async function result(req: any,res: any,route: any)
{
	let session = getCache(route.query.session);
	if(!session)
	{
	  return { status: 200 };
	}
	
	let transaction = route.query.transaction;
	
	const result = await query("SELECT * FROM QuestSave WHERE udid = ?",[transaction]);
	
	//TODO: クエスト成功報酬を渡す or ポイントを戻す
	
	const result = await query("DELETE FROM QuestSave WHERE udid = ?",[transaction]);
	
	return { 
		status: 200,
		rewards: [], //TODO: 実際は入手したアイテム等を返す
	};
}

export async function continue_act(req: any,res: any,route: any)
{
	let session = getCache(route.query.session);
	if(!session)
	{
	  return { status: 200 };
	}
	
	let transaction = route.query.transaction;
	
	const result = await query("SELECT * FROM QuestSave WHERE udid = ?",[transaction]);
	
	return { 
		status: 200,
		save: result[0]
	};
}


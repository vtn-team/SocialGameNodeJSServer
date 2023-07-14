const { v4: uuidv4 } = require('uuid')
import { query } from "./../lib/database"
import { getCache } from "./../lib/userCache"
import { getMaster, getQuest, getQuestRewards } from "./../lib/masterDataCache"
import { calcPointHeal } from "./../contents/calcPointHeal"
import { addReward } from "./../contents/addReward"


export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

export async function start(req: any,res: any,route: any)
{
	let session = await getCache(route.query.session);
	if(!session)
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
	const result = await query("SELECT * FROM User WHERE id = ?",[session.userId]);
	const user = result[0];
	
	calcPointHeal(user);
	
	if(user.movePoint < quest.MovePoint)
	{
	  return { status: 400, message: "not enough move point." };
	}
	
	let token:string = uuidv4();
	await query("UPDATE User SET questTransaction = ?, movePoint = ?, lastPointUpdate = now() WHERE id = ?",[token, (user.movePoint - quest.MovePoint), session.userId]);
	
	//サーバだけでする処理をここに書く＆Saveに記録する
	//TODO: サンプルではインゲームがないので敵やステージデータなどの情報は生成しない
	//
	
	//Questの状況をいちどQuestSaveに記録
	await query("INSERT INTO QuestSave(udid, questId, userId) VALUES(?,?,?)", [token, questId, session.userId]);
	
	const result2 = await query("SELECT movePoint, lastPointUpdate FROM User WHERE id = ?",[session.userId]);
	const user2 = result2[0];
	console.log(user2);
	
	return { 
		status: 200,
		transactionId: token,
		afterMovePoint: user2.movePoint,
		lastPointUpdate: (new Date(user2.lastPointUpdate)).getTime(),
		enemies: [], //TODO: 実際は出現する敵を返す
	};
}

export async function result(req: any,res: any,route: any)
{
	let session = await getCache(route.query.session);
	if(!session)
	{
		return { status: 200 };
	}
	
	let transactionId = route.query.transactionId;
	
	const result = await query("SELECT * FROM QuestSave WHERE udid = ?",[transactionId]);
	if(result.length == 0)
	{
		//クエストデータが見つからないエラー
		return { status: 404 };
	}
	
	//単一レコードである
	let questSave = result[0];
	
	//クエスト成功報酬を渡す
	let quest = getQuest(questSave.questId);
	let rewards = getQuestRewards(quest.QuestRewardGroupd);
	console.log(rewards);
	let rewardInfo = [];
	for(let d of rewards)
	{
		let rewardData = await addReward(questSave.userId, d.RewardGroupId)
		console.log(rewardData);
		let retVal = [];
		for(let d of rewardData.retVal)
		{
			retVal.push(String(d));
		}
		
		rewardInfo.push({
			type: rewardData.type,
			param: retVal
		});
	}
	
	await query("DELETE FROM QuestSave WHERE udid = ?",[transactionId]);
	
	return { 
		status: 200,
		rewards: rewardInfo, //TODO: 実際は入手したアイテム等を返す
	};
}

export async function continue_act(req: any,res: any,route: any)
{
	let session = await getCache(route.query.session);
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


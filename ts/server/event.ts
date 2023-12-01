const { v4: uuidv4 } = require('uuid')
import { query } from "./../lib/database"
import { getCache } from "./../lib/userCache"
import { getMaster, getEvent } from "./../lib/masterDataCache"
import { checkEventIsOpen } from "./../contents/eventStat"


export async function stat(req: any,res: any,route: any)
{
	let session = await getCache(route.query.session);
	if(!session)
	{
	  return { status: 200 };
	}
	
	let eventId = Number(route.query.eventId);
	
	//イベント開催チェック
	let stat = checkEventIsOpen(eventId);
	if(stat.isOpen == false)
	{
		return { 
			status: 200,
			eventStatus: 101,
			isOpen: stat.isOpen,
			isGameOpen: stat.isGameOpen
		};
	}
	
	const event = getEvent(eventId);
	
	//イベントテーブルを取得してくる
	let result = await query("SELECT point FROM RankingEvent WHERE userId = ?",[session.userId]);
	
	//レコードが無かったら作る
	if(result.length == 0)
	{
		await query("INSERT INTO RankingEvent(userId) VALUES (?)",[session.userId]);
		result = await query("SELECT point FROM RankingEvent WHERE userId = ?",[session.userId]);
	}
	
	const point = result[0].point;
	
	return { 
		status: 200,
		eventStatus: 0,
		isOpen: stat.isOpen,
		isGameOpen: stat.isGameOpen,
		point: point
	};
}

export async function ranking(req: any,res: any,route: any)
{
	let session = await getCache(route.query.session);
	if(!session)
	{
	  return { status: 200 };
	}
	
	let eventId = Number(route.query.eventId);
	//イベント開催チェック
	let stat = checkEventIsOpen(eventId);
	if(stat.isOpen == false)
	{
		return { 
			status: 404
		};
	}
	
	let rank = await query("SELECT COUNT(point)+1 as rank FROM RankingEvent WHERE point > (SELECT point FROM RankingEvent WHERE userId = ?) ",[session.userId]);
	rank = Number(rank[0].rank);
	
	let baseRank = 1;
	
	let ranking = [];
	switch(Number(route.query.rankingType))
	{
	case 0:
		break;
	
	case 1:
		//全部
		//要キャッシュ
		ranking = await query("SELECT userId, point, User.name FROM RankingEvent LEFT JOIN User ON User.id = RankingEvent.userId",[]);
		//ソート
		ranking.sort(function(a:any,b:any){ return b.point - a.point; })
		break;
	
	case 2:
		//トップ100
		//要キャッシュ
		ranking = await query("SELECT userId, point, User.name FROM RankingEvent LEFT JOIN User ON User.id = RankingEvent.userId ORDER BY point LIMIT 0, 100",[]);
		break;
		
	case 2:
		//トップ100
		//要キャッシュ
		let base = rank - 50;
		if(base < 1) base = 1;
		baseRank = base;
		ranking = await query("SELECT userId, point, User.name FROM RankingEvent LEFT JOIN User ON User.id = RankingEvent.userId ORDER BY point LIMIT ?, ?",[baseRank, baseRank + 100]);
		break;
	}
	
	return { 
		status: 200,
		rank: rank,
		baseRank: baseRank,
		ranking: ranking
	};
}


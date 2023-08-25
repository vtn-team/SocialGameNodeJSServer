import { query } from "./../lib/database"

export async function addEventPoint(userId: number, baeePoint: number, randomPoint: number)
{
	try
	{
		let addAmount = baeePoint + Math.floor(Math.random() * randomPoint);
		let result = await query("UPDATE RankingEvent SET point = point + ? WHERE userId = ?",[addAmount, userId]);
		
		//キャッシュの更新が必要ならそうする
		//
		
		//
		return [addAmount];
	}
	catch(ex)
	{
		console.log(ex);
	}
}

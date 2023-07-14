import { query } from "./../lib/database"

export async function addMoney(userId: number, baseMoney: number, randomMoney: number)
{
	try
	{
		let addAmount = baseMoney + Math.floor(Math.random() * randomMoney);
		let result = await query("UPDATE User SET money = money + ? WHERE id = ?",[addAmount, userId]);

		//キャッシュの更新が必要ならそうする
		//

		//
		return [addAmount];
	}
	catch(ex)
	{
		console.log(ex);
	}
	
	return [];
}

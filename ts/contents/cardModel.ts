import { query } from "./../lib/database"

export async function addCard(userId: number, cardId: number, level: number = 1)
{
	try
	{
		//レコードを追加
		let result = await query("INSERT INTO UserCards(userId, cardId, level, luck) VALUES(?,?,?,?)", [userId, cardId, level, 1]);
		console.log(result);

		//キャッシュの更新が必要ならそうする
		//

		return [cardId];
	}
	catch(ex)
	{
		console.log(ex);
	}
	
	return [];
}

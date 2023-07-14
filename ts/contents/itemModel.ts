import { query } from "./../lib/database"

export async function addItem(userId: number, itemId: number, amount: number)
{
	try
	{
		const result = await query("SELECT id, amount FROM UserItems WHERE userId = ? AND itemId = ?",[userId, itemId]);
		console.log(result);
		
		let ret = null;
		
		//アイテムを持っている場合は数を増やす
		if(result.length > 0)
		{
			ret = await query("UPDATE UserItems SET amount = amount + ? WHERE id = ?",[amount, result[0].id]);
		}
		else
		{
			//持ってない場合はレコードを追加
			ret = await query("INSERT INTO UserItems(userId, itemId, amount) VALUES(?,?,?)", [userId, itemId, amount]);
		}
		
		//キャッシュの更新が必要ならそうする
		//
		
		return [itemId, amount];
	}
	catch(ex)
	{
		console.log(ex);
	}
	
	return [];
}

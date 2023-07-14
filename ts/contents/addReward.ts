import { getMaster, getCard, getItem, getRewards } from "./../lib/masterDataCache"
import { addItem } from "./itemModel"
import { addCard } from "./cardModel"
import { addMoney } from "./userModel"

export enum ItemType {
	None = 0,
	Card = 1,
	Money = 2,
	Item = 3,
	
	EventPoint = 10,
}

export async function addReward(userId: number, rewardGroupId: number)
{
	try
	{
		let result:any = {};
		let rewards = getRewards(rewardGroupId);
		let total = 0;
		for(let d of rewards)
		{
			if(d.Probability == "") continue;
			total += d.Probability;
		}
		
		let get = null;
		let random = Math.floor(Math.random() * total);
		for(let d of rewards)
		{
			if(d.Probability == "") continue;
			random -= d.Probability;
			if(random < 0)
			{
				get = d;
				break;
			}
		}
		
		result = {
			type: get.Type,
			retVal: []
		};
		
		//タイプ別に呼び出す
		switch(get.Type)
		{
		case ItemType.None: break;
		case ItemType.Card: result.retVal = await addCard(userId, get.RewardParam1); break;
		case ItemType.Money: result.retVal = await addMoney(userId, get.RewardParam1, get.RewardParam2); break;
		case ItemType.Item: result.retVal = await addItem(userId, get.RewardParam1, get.RewardParam2); break;
		
		//TODO: イベント処理
		//case ItemType.EventPoint: result.retVal = await addEventPoint(userId, get.RewardParam1, get.RewardParam2); break;
		}
		
		return result;
	}
	catch(ex)
	{
		
	}
	
	return {};
}

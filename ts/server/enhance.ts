const { v4: uuidv4 } = require('uuid')
import { query } from "./../lib/database"
import { getCache, updateCache } from "./../lib/userCache"
const Scheme = require("./../dbScheme").Scheme;

export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

export async function action(req: any,res: any,route: any)
{
	let session = getCache(route.query.session);
	
	//user create
	if(!session)
	{
	  return { status: 200 };
	}
	
	//
	let base = route.query.baseId;
	route.query.materials;
	const result = await query("SELECT id, cardId, level FROM UserCards WHERE userId = ?",[session.userId]);
	let cards = [];
	for(var c of result)
	{
		let card = {
			id: Number(c.id),
			cardId: c.cardId,
			level: c.level,
			luck: c.luck
		}
		cards.push(card);
	}
	
	return { 
		status: 200,
		version: Scheme.UserCards.Version,
		cards: cards
	};
}

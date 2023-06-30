const { v4: uuidv4 } = require('uuid')
import { query } from "./../lib/database"
import { getCache, updateCache } from "./../lib/userCache"
const Scheme = require("./../dbScheme").Scheme;

export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

export async function cards(req: any,res: any,route: any)
{
	let session = getCache(route.query.session);
	
	//user create
	if(!session)
	{
	  return { status: 200 };
	}
	
	//
	const result = await query("SELECT * FROM UserCards WHERE userId = ?",[session.userId]);
	return { 
		status: 200,
		version: Scheme.UserCards.Version,
		cards: result
	};
}


export async function items(req: any,res: any,route: any)
{
	let session = getCache(route.query.session);
	
	//user create
	if(!session)
	{
	  return { status: 200 };
	}
	
	//
	const result = await query("SELECT * FROM UserItems WHERE userId = ?",[session.userId]);
	
	return { 
		status: 200,
		version: Scheme.UserItems.Version,
		cards: result
	};
}

export async function quests(req: any,res: any,route: any)
{
	let session = getCache(route.query.session);
	
	//user create
	if(!session)
	{
	  return { status: 200 };
	}
	
	//
	const result = await query("SELECT * FROM UserQuests WHERE userId = ?",[session.userId]);
	
	return { 
		status: 200,
		version: Scheme.UserQuests.Version,
		cards: result
	};
}


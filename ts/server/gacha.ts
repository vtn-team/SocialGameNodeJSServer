const { v4: uuidv4 } = require('uuid')
import { query } from "./../lib/database"
//import { Card } from "./../model/card"
import { getCache } from "./../lib/userCache"
import { getMaster, getCard } from "./../lib/masterDataCache"

export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}


//重みづけ確率
export function drawGacha(sheet: string)
{
	var master = getMaster(sheet);
	
	let total = 0;
	for(var d of master)
	{
		if(d.Probability == "") continue;
		total += parseInt(d.Probability);
	}
	
	let get = null;
	let random = Math.floor(Math.random() * total);
	for(var d of master)
	{
		if(d.Probability == "") continue;
		random -= parseInt(d.Probability);
		if(random < 0)
		{
			get = parseInt(d.Id);
			break;
		}
	}
	return get;
}

//重みづけ確率(確定)
export function drawGachaSpecial(sheet: string)
{
	var master = getMaster(sheet);
	
	let total = 0;
	for(var d of master)
	{
		if(d.Probability == "") continue;
		
		var c = getCard(d.Id);
		if(c.Rare <= 3) continue;
		
		total += parseInt(d.Probability);
	}
	
	let get = null;
	let random = Math.floor(Math.random() * total);
	for(var d of master)
	{
		if(d.Probability == "") continue;
		
		var c = getCard(d.Id);
		if(c.Rare <= 3) continue;
		
		random -= parseInt(d.Probability);
		if(random < 0)
		{
			get = parseInt(d.Id);
			break;
		}
	}
	return get;
}



//重みづけ確率
export async function draw(req: any,res: any,route: any)
{
	let session = getCache(route.query.session);
	if(!session)
	{
	  console.log("err");
	  return { status: 200 };
	}
	
	//リソースひいたりする
	//
	
	//gachaId見るほどガチャないので決め打ち
	let drawNum = 1;
	let drawIds = [];
	if(route.query.drawCount)
	{
		drawNum = route.query.drawCount;
	}
	//10以上は無い。この関数でテストはしない。
	if(drawNum > 10) drawNum = 10;
	
	let resultCards = [];
	for(let c=0; c<drawNum; ++c)
	{
		let id = drawGacha("Gacha");
		
		//ほんとは10個一気に送った方がいい
		const result = await query("INSERT INTO UserCards(userId, cardId, level, luck) VALUES(?,?,1,1)",[session.userId, id]);
		
		console.log(result);
		
		resultCards.push({
			id: Number(result.insertId),
			cardId: id,
			level: 1,
			luck: 1
		});
	}
	
	console.log("here");
	return {
		status: 200,
		cardIds: resultCards
	};
}

//テスト
export async function test(req: any,res: any,route: any)
{
	var master = getMaster("Gacha");
	console.log(master);
	
	let drawTests:any = {};
	let rareTest:any = {};
	for(let i=0; i<1000000; ++i)
	{
		let id = drawGacha("Gacha");
		if(id==null) continue;
		
		if(drawTests[id]) drawTests[id]++;
		else drawTests[id] = 1;
		
		var c = getCard(id);
		if(c.Rare==""){
			console.log(id);
			console.log(c);
		}
		if(rareTest[c.Rare]) rareTest[c.Rare]++;
		else rareTest[c.Rare] = 1;
	}
	
	return {
		status: 200,
		cardIds: drawTests,
		rareTable: rareTest
	};
}

//テスト
export async function test2(req: any,res: any,route: any)
{
	let drawTests:any = {};
	let rareTest:any = {};
	let rare4Over = 0;
	let drawCount = 0;
	for(let i=0; i<1000000; ++i)
	{
		let id = drawGacha("Gacha");
		if(id==null) continue;
		
		var c = getCard(id);
		
		drawCount++;
		if(drawCount >= 10 && rare4Over == 0)
		{
			id = drawGachaSpecial("GachaSpecial");
			if(id == null) continue;
			c = getCard(id);
		}
		
		if(c.Rare > 3) rare4Over = 1;
		
		if(drawCount >= 10)
		{
			drawCount = 0;
			rare4Over = 0;
		}
		
		if(drawTests[id]) drawTests[id]++;
		else drawTests[id] = 1;
		
		if(rareTest[c.Rare]) rareTest[c.Rare]++;
		else rareTest[c.Rare] = 1;
	}
	
	return {
		status: 200,
		cardIds: drawTests,
		rareTable: rareTest
	};
}

//テスト
export async function test3(req: any,res: any,route: any)
{
	let drawTests:any = {};
	let rareTest:any = {};
	let rare4Over = 0;
	let drawCount = 0;
	for(let i=0; i<1000000; ++i)
	{
		let id = drawGacha("Gacha");
		if(id==null) continue;
		
		var c = getCard(id);
		
		drawCount++;
		if(drawCount >= 10)
		{
			id = drawGachaSpecial("GachaSpecial");
			if(id == null) continue;
			c = getCard(id);
			drawCount = 0;
		}
		
		if(drawTests[id]) drawTests[id]++;
		else drawTests[id] = 1;
		
		if(rareTest[c.Rare]) rareTest[c.Rare]++;
		else rareTest[c.Rare] = 1;
	}
	
	return {
		status: 200,
		cardIds: drawTests,
		rareTable: rareTest
	};
}

//テスト4
export async function test4(req: any,res: any,route: any)
{
	let drawCountTests:any = {};
	let sales = 0;
	for(let i=0; i<10000; ++i)
	{
		let drawCount = 0;
		let limitCount = 0;
		while(true)
		{
			let id = drawGacha("Gacha");
			if(id==null) continue;
			
			var c = getCard(id);
			drawCount++;
			limitCount++;
			if(drawCount >= 10)
			{
				id = drawGachaSpecial("GachaSpecial");
				if(id == null) continue;
				c = getCard(id);
				drawCount = 0;
			}
			
			if(limitCount >= 200)
			{
				id = 20;
				c = getCard(id);
			}
			
			if(id == 20)
			{
				if(drawCountTests[limitCount]) drawCountTests[limitCount]++;
				else drawCountTests[limitCount] = 1;
				
				sales += limitCount * 300;
				break;
			}
		}
	}
	
	return {
		status: 200,
		sales: sales,
		drawCountTests: drawCountTests
	};
}

//テスト5
export async function test5(req: any,res: any,route: any)
{
	let drawCountTests:any = {};
	let sales = 0;
	let numa = 0;
	let doronuma = 0;
	for(let i=0; i<10000; ++i)
	{
		let drawCount = 0;
		let kakutei = 0;
		let limitCount = 0;
		while(true)
		{
			let id = drawGacha("Gacha");
			if(id==null) continue;
			
			var c = getCard(id);
			drawCount++;
			limitCount++;
			if(drawCount >= 10)
			{
				id = drawGachaSpecial("GachaSpecial");
				if(id == null) continue;
				c = getCard(id);
				drawCount = 0;
			}
			
			kakutei++;
			if(c.Rare == 5)
			{
				kakutei = 0;
			}
			if(kakutei >= 90)
			{
				let random = Math.floor(Math.random() * 2);
				if(random == 0)
				{
					id = 20;
				}
				c = getCard(id);
				kakutei = 0;
			}
			
			if(id == 20)
			{
				if(drawCountTests[limitCount]) drawCountTests[limitCount]++;
				else drawCountTests[limitCount] = 1;
				
				if(limitCount > 90) numa++;
				if(limitCount > 200) doronuma++;
				sales += limitCount * 300;
				break;
			}
		}
	}
	
	return {
		status: 200,
		numa: numa,
		doronuma: doronuma,
		sales: sales,
		drawCountTests: drawCountTests
	};
}
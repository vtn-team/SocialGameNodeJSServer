require('dotenv').config()

let mCache:any = {};
let mDicCache:any = {};

const sheetUri = "https://script.google.com/macros/s/AKfycbw8Qkx1_NhgIm3TkqLqS5HWyEcQ2F44UdYxxBRpxk4ZIebrXyng-Y9ZgzfJ0sz3HwTpUA/exec";

async function getSheetJson(sheet: string)
{
	const res = await fetch(`${sheetUri}?sheet=${sheet}`, {method: 'GET'});
	const text = await res.text();
	
	var json = JSON.parse(text);
	mCache[sheet] = json.Data;
	console.log("load master:" + sheet);
};

function createDicMaster(sheet: string)
{
	mDicCache[sheet] = {};
	
	var master = getMaster(sheet);
	for(let d of master)
	{
		mDicCache[sheet][parseInt(d.Id)] = d;
	}
}

export async function loadMaster()
{
	await getSheetJson("Card");
	await getSheetJson("Effect");
	
	await getSheetJson("Gacha");
	await getSheetJson("GachaSpecial");
//	await getSheetJson("Gacha2");
	
//	await getSheetJson("JP_Text");
//	await getSheetJson("EN_Text");

	createDicMaster("Card");
}


export function getMaster(sheet: string)
{
	return mCache[sheet];
}

export function getCard(id: number)
{
	return mDicCache["Card"][id];
}



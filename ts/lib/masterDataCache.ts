require('dotenv').config()
const fs = require('fs');

let mCache:any = {};
let mDicCache:any = {};
let versionInfo:any = {};

let masterFiles = ["Card", "Effect", "Gacha", "GachaSpecial", "JP_Text", "EN_Text"];
const sheetUri = "https://script.google.com/macros/s/AKfycbw8Qkx1_NhgIm3TkqLqS5HWyEcQ2F44UdYxxBRpxk4ZIebrXyng-Y9ZgzfJ0sz3HwTpUA/exec";

async function getSheetJson(sheet: string)
{
	const res = await fetch(`${sheetUri}?sheet=${sheet}`, {method: 'GET'});
	const text = await res.text();
	
	var json = JSON.parse(text);
	mCache[sheet] = json.Data;
	versionInfo[sheet] = json.Version;
	console.log("load master:" + sheet);

	fs.writeFileSync(`${sheet}.json`, text);
}

async function getSheetJsonFromCache(sheet: string)
{
	const text = fs.readFileSync(`${sheet}.json`);
        var json = JSON.parse(text);
        mCache[sheet] = json.Data;
        versionInfo[sheet] = json.Version;
        console.log("load master:" + sheet);

        fs.writeFileSync(`${sheet}.json`, text);
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
	let requests = [];
	for(let m of masterFiles)
	{
		requests.push(getSheetJson(m));
	}
	await Promise.all(requests);

	createDicMaster("Card");
}

export async function loadMasterFromCache()
{
	let requests = [];
        for(let m of masterFiles)
        {
                requests.push(getSheetJsonFromCache(m));
        }
        await Promise.all(requests);

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

export function getVersionInfo()
{
	return versionInfo;
}


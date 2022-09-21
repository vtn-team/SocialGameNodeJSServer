
let dictionary : any = {};

export function liveget(id: number, index: number)
{
	if(!dictionary[id])
	{
		dictionary[id] = [];
	}
	
	console.log(dictionary[id]);
	return [dictionary[id].length, dictionary[id].slice(index, dictionary[id].length)];
}

export function liveset(id: number, cmd: any)
{
	if(!dictionary[id])
	{
		dictionary[id] = [];
	}
	console.log(dictionary[id]);
	dictionary[id].push(cmd);
}

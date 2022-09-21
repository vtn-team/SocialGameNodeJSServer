import { liveget, liveset } from "./../contents/live"

export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

export async function get(req: any,res: any,route: any)
{
	if(route.query.id === undefined) return null;
	let index = 0;
	if(route.query.index) index = route.query.index;
	
	console.log("get here");
	return liveget(route.query.id, index);
}

export async function cmd(req: any,res: any,route: any)
{
	if(route.query.id === undefined) return null;
	if(route.query.cmd === undefined) return null;
	
	console.log("set here");
	liveset(route.query.id, route.query.cmd);
	return { status: "ok", "cmd" : route.query.cmd };
}



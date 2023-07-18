import { query } from "./../lib/database"
import { getList, getInformation } from "./../lib/InformationCache"

export async function index(req: any,res: any,route: any)
{
	console.log(route);
	return null;
}

//このAPIにセッションは不要(非ログイン時にも見れるようにする可能性があるので)
export async function list(req: any,res: any,route: any)
{
	return { 
		status: 200,
		list: getList()
	};
}

//このAPIにセッションは不要(非ログイン時にも見れるようにする可能性があるので)
export async function getInfo(req: any,res: any,route: any)
{
	//ユーザ情報はsessionの中に全部入ってる
	let content = getInformation(route.query.id);
	if(!content)
	{
		return { status: 404 };
	}
	
	return { 
		status: 200,
		title: content.title,
		contents: content.contents
	};
}




let uriDic:any = {};

function getDicIntValue(key: string) : number {
console.log(uriDic[key])
	return uriDic[key];
}

function getDicStringValue(key: string) : string {
	console.log(uriDic[key])
	return uriDic[key];
}


(()=>{
	switch(process.argv[2])
	{
	case "local":
		uriDic["MariaDB"] = "";
		uriDic["Redis"] = "redis://localhost:6379/0";
		uriDic["Server"] = "localhost";
		uriDic["ServerPort"] = "8000";
		console.log("setup uri local");
		break;
		
	default:
		uriDic["Redis"] = "redis://redis:6379/0";
		uriDic["Server"] = "0.0.0.0";
		uriDic["ServerPort"] = "80";
		console.log("setup uri container");
		break;
	}
})();

export const MARIADB_URI = getDicStringValue("MariaDB");
export const REDIS_URI = getDicStringValue("Redis");
export const SERVER_URI = getDicStringValue("Server");
export const SERVER_PORT = getDicIntValue("ServerPort");

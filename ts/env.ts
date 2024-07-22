

let uriDic:any = {};

export const MARIADB_URI = uriDic["MariaDB"];
export const REDIS_URI = uriDic["Redis"];
export const SERVER_URI = uriDic["Server"];
export const SERVER_PORT = uriDic["ServerPort"];


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
require('dotenv').config()
import { launch } from "./server"
import { launchDGS } from "./gameserver/server"
import { loadMaster, loadMasterFromCache } from "./lib/masterDataCache"
import { loadInformation, loadInformationFromCache } from "./lib/InformationCache"

(async function() {
	await loadMaster();
	//await loadInformation();
	
	//await loadMasterFromCache();
	await loadInformationFromCache();
	launch();
	
	launchDGS(3788);
})();

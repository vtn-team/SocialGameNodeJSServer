require('dotenv').config()
import { launch } from "./server"
import { loadMaster, loadMasterFromCache } from "./lib/masterDataCache"

(async function() {
	//await loadMaster();
	await loadMasterFromCache();
	launch();
})();

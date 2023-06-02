require('dotenv').config()
import { launch } from "./server"
import { loadMaster } from "./lib/masterDataCache"

(async function() {
	await loadMaster();
	launch();
})();
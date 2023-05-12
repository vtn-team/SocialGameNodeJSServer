exports.Routes = {
	GET: {
		"/"				: "index#index",
		"/favicon.ico"	: "resource#favicon",
		
	},
	POST: {
		"/login" : "user#login",
		
		"/user" : {
			"/create" : "user#create"
		}
	}
}

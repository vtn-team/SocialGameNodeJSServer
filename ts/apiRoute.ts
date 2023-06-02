exports.Routes = {
	GET: {
		"/"				: "index#index",
		"/favicon.ico"	: "resource#favicon",
		"/gacha" : {
			"/test" : "gacha#test",
			"/test2" : "gacha#test2",
			"/test3" : "gacha#test3",
			"/test4" : "gacha#test4",
			"/test5" : "gacha#test5"
		},
		"/ud" : {
			"/cards" : "userdata#cards",
		}
	},
	POST: {
		"/login" : "user#login",
		
		"/user" : {
			"/create" : "user#create"
		},
		"/gacha" : {
			"/draw" : "gacha#draw",
			"/test" : "gacha#test"
		}
	}
}

exports.Auth = {
	UseSessionAuth: true,
	PassThroughRoute: {
		GET: ["gacha"]
	}
};
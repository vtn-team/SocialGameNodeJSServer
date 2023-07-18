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
		"/stat" : {
			"/" : "stat#check"
		},
		"/ud" : {
			"/cards" : "userdata#cards",
			"/items" : "userdata#items",
			"/quests" : "userdata#quests",
		},
		"/info" : {
			"/list" : "info#list",
			"@id%s"   : "info#getInfo",
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
		},
		"/enhance" : {
			"/do" : "enhance#action"
		},
		"/quest" : {
			"/start" : "quest#start",
			"/result" : "quest#result",
			"/continue" : "quest#continue_act"
		}
	}
}

exports.Auth = {
	UseSessionAuth: true,
	PassThroughRoute: {
		GET: ["stat","gacha","info"]
	}
};

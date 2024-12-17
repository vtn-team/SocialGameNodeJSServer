exports.Routes = {
	GET: {
		"/"				: "index#index",
		"/favicon.ico"	: "resource#favicon",
		"/ranking" : {
			"/get" : {
				"@AppName%s" : "ranking#get",
			}
		},
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
		},
		"/event" : {
			"/stat" : "event#stat",
			"/ranking" : "event#ranking",
		},
		"/cm" : {
			"@uuid%s" : {
				"/login" : "cm#login",
				"/save" : "cm#save",
				"/list" : "cm#list",
				"/attack" : "cm#attack"
			}
		},
		"/vc" : {
			"/stat" : "vc#stat",
			"/getaddr" : "vc#getaddr"
		}
	},
	POST: {
		"/login" : "user#login",
		
		"/ranking" : {
			"/save" : {
				"@AppName%s" : "ranking#save",
			}
		},
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
		},
		"/cm" : {
			"@uuid%s" : {
				"/login" : "cm#login",
				"/save" : "cm#save",
				"/list" : "cm#list",
				"/attack" : "cm#attack"
			}
		}
	}
}

exports.Auth = {
	UseSessionAuth: false,
	PassThroughRoute: {
		GET: ["stat","gacha","info","ranking","cm"],
		POST: ["ranking","cm"]
	}
};

exports.Routes = {
	GET: {
		"/"				: "index#index",
		"/favicon.ico"	: "resource#favicon",
		"/get" : {
			"@id%d"	: {
				"@index%d" : "api#get"
			}
		},
		"/cmd" : {
			"@id%d" : {
				"@cmd%s" : "api#cmd"
			}
		}
	},
	POST: {
		"/cmd" : {
			"@id%d" : {
				"@cmd%s" : "api#cmd"
			}
		}
	}
}

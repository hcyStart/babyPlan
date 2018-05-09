define([ '../BaseModel' ], function(Base) {
	var model = new Base('phoneBankingtnc model');
	model.locale = {
		"en" : {
			"title":"Register for phone banking",
			"mobileBanking" : "Phonebanking Service General Terms And Conditions",
			"agree" : "I have read and understood the Phonebanking Service General Terms And Conditions",
			"btn" : "Continue"
		},
		"zh" : {
			"title":"开通电话银行",
			"mobileBanking" : "电话银行服务一般条款",
			"agree" : "我已阅读并同意《电话银行服务一般条款》",
			"btn" : "下一步"
		}

	}

	return model;
});
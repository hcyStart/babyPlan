define([ '../BaseModel' ], function(Base) {
	var model = new Base('accountAgreement model');
	model.locale = {
		"en" : {
			"accountAgreement" : "Account agreement",
			"tncTitle" : "General Terms and Conditions",
			"tariffTitle" : "Tariff of Accounts and Services for Personal Customers",
			"debitCardTitle" : "Debit Card Terms and Conditions",
			"agree" : "I have read and understood the General Terms and Conditions, Tariff of Accounts and Services for Personal Customers and Debit Card Terms and Conditions that apply to the account(s) I wish to open, and agree to be governed by them. I acknowledge HSBC China has made available to customers all the aforesaid documents at its branches and official website (www.hsbc.com.cn) download centre, and I agree to visit HSBC China’s website from time to time to read and download the most updated version thereof.",
			"btn" : "Continue"
		},
		"zh" : {
			"accountAgreement" : "开户条款与协议",
			"tncTitle" : "一般章则条款",
			"tariffTitle" : "账户和服务费率",
			"debitCardTitle" : "借记卡章程",
			"agree" : "我已阅读并理解适用于我所申请账户的《一般章则条款》、《账户和服务费率（个人客户适用）》和《借记卡章程》，并同意接受相关条款与条件之约束。我知晓汇丰中国已在分支行及官方网站（www.hsbc.com.cn）的下载中心备置、公布前述文件供客户取阅和下载，我同意时时通过其官方网站查阅、下载相关文件的最新版本。",
			"btn" : "下一步"
		}

	}

	return model;
});
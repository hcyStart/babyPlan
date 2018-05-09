define([ '../BaseModel' ], function(Base) {
	var model = new Base('identificationType model');
	model.locale = {
		'en' : {
			'tip' : 'Please Select Your Identification Document Type',
			'account': 'Account Opening',
			'preparation':'Preparation',
			'IdentityVverification':'Identity verification',
			'CollectDocuments':'Collect documents',
			'scan':'Scan ID card',
			'application':'Verify application data',
			'AccountType':'Account type',
			'AccountInformation':'Bank card information',
			'PhoneBanking':'Phone banking',
			'OpenVideo':'Open video recording device',
			'AccountAgreement':'Account agreement',
			'VerifyApplication':'Verify application data',
			'setPassword':'Set PIN',
			'setPasswordAgain':'Confirm PIN',
			'services':'Set up other banking services',
			'telephoneBanking':'Telephone banking',
			'createUserNumber':'Create user number',
			'accountCompletion':'Account completion',
			'exit':'Exit',
			'confirmationInformation':'Confirmation information',
			'fileCollection':"File collection",
			'confirmationProtocol':"Confirmation protocol",
			'cardChoice':"Selection card type",
			'downloadApps':"Mobile banking app",
			'focusWeChat':"WeChat / Mobile bank",
			'evaluationService':"Evaluation service",
			'submitDocument':"Submit document",
			'idCard':"China's 2nd Generation ID card",
			'selectIdCard':'Select',
			'passport':'Passport',
			'selectPassport':'Select',
			'taiwan':'Mainland Travel Permit for Taiwan Residents',
			'selectTaiwan':'Select',
			'gangao':'Mainland Travel Permit for Hong Kong and Macao Residents',
			'selectGangao':'Select',
			'Confirm':"Continue",
			'backtohome':'Back to home'
		},
		'zh' : {
			'tip' : '选择证件类型',
			'account': '开通新账户',
			'preparation':'开卡预准备',
			'IdentityVverification':'身份验证',
			'CollectDocuments':'收集证明文件',
			'scan':'扫描身份证',
			'application':'确认开户信息',
			'AccountType':'选择账户类型',
			'AccountInformation':'读取卡信息',
			'PhoneBanking':'开通电话银行',
			'OpenVideo':'开启录像',
			'AccountAgreement':'开户条款与协议',
			'VerifyApplication':'确认开户信息',
			'setPassword':'设置密码',
			'setPasswordAgain':'确认密码',
			'services':'开通其他服务',
			'telephoneBanking':'开通电话银行',
			'createUserNumber':'创建账号',
			'accountCompletion':'开卡完成',
			'exit':'退出',
			'confirmationInformation':'确认开户信息',
			'fileCollection':"开户文件收集",
			'confirmationProtocol':"确认相关协议",
			'cardChoice':"选择卡类型",
			'downloadApps':"下载移动应用",
			'focusWeChat':"关注微信银行公众号",
			'evaluationService':"评价服务",
			'submitDocument':"提交文件",
			'idCard':'居民身份证',
			'selectIdCard':'选择',
			'passport':'护照',
			'selectPassport':'选择',
			'taiwan':'台湾居民来往大陆通行证',
			'selectTaiwan':'选择',
			'gangao':'港澳居民来往内地通行证',
			'selectGangao':'选择',
			'Confirm':"下一步",
			'backtohome':'退出开户'
		}
	}
	return model;
});
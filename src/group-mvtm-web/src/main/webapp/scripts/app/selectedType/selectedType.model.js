define(['../BaseModel'], function (Base) {
    var model = new Base('selectedType model');
    model.locale = {
			'en': {
				'Terms': 'Personal Account General Terms and Conditions',
				'PremierTerms': 'Read Personal Account General </br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Terms and Conditions',
				'AdvanceTerms': 'Read Personal Account General </br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Terms and Conditions',
				'continue':'Continue',
				'accept':'I have read, understood and accepted the Personal Account General Terms and Conditions. I agree and accept the account type and the relevant account tariff, including but not limited to the Monthly Service Fee that will be charged if the above requirement for minimum Total Relationship Balance is not met.',
			},
			'zh': {
				'Terms': '个人账户一般条款',
				'PremierTerms': '阅读个人账户一般条款',
				'AdvanceTerms': '阅读个人账户一般条款',
				'continue':'下一步',
				'accept':'我已阅读、理解并接受《个人账户一般条款》。我同意并接受所申请账户类型和对应之费率，包括但不限于不能满足上述最低账户日均总余额要求时可能收取的服务月费。',
			}
	}   
    return model;
});
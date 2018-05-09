define(['../BaseModel'], function (Base) {
    var model = new Base('telephoneBankChoice model');
    model.locale = {
			'en': {
				'title':'Phone Banking Service',
				'eligibility':'Features',
				'eligibilityDescribe':'Bank anywhere, anytime with Phone Banking from HSBC. A single number for all your Phone Banking services.',
				'benefits':'Benefits',
				'benefits0':'Register personal internet banking',
				'benefits1':'Managing your account has never been easier',
				'benefits2':'Fast and simple',
				'benefits3':'Security assured',
				'benefits4':'24-hour Services',
				'textOnTop': 'Would you like to set up the phone banking service?',
				'fallBack':'Back',
				'continue':'Continue',
				'Yes':'Yes',
				'No':'No'
			},
			'zh': {
				'title':'开通电话银行',
				'eligibility':'功能',
				'eligibilityDescribe':'汇丰电话银行， 随时随地轻松管理您的个人账户， 一个电话号码， 囊括汇丰全套电话银行服务。',
				'benefits':'特点',
				'benefits0':'注册个人网银',
				'benefits1':'管理账户更加轻松',
				'benefits2':'操作简便更快捷',
				'benefits3':'安全有保障',
				'benefits4':'24小时服务',
				'textOnTop': '您是否需要开通电话银行？',
				'fallBack':'上一步',
				'continue':'下一步',
				'Yes':'需要',
				'No':'不需要'
			}
	}
    return model;
});

define(['../BaseModel'], function (Base) {
	var model = new Base('displayWeChat model');
	model.locale = {
		'en': {
			'Register': 'Register for WeChat Banking',
			'Take': 'Use your mobile phone and launch WeChat,scan below QR code to follow our offical account',
			'Reminder':'Bind your card to your WeChat account to check account balance and receive notifications of account movement',
			'Continue':'Continue'
		},
		'zh': {
			'Register': '注册微信银行',
			'Take': '打开您的手机微信应用，扫描二维码关注我们的公众号',
			'Reminder':'完成账户绑定，可通过微信快速查询余额，接受动账通知等',
			'Continue':'下一步'
		}
	};
	return model;
});
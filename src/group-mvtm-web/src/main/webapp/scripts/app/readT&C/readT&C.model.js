define(['../BaseModel'], function (Base) {
	var model = new Base('readT&C model');
	model.locale = {
		'en': {
			'title': 'Read banking T&C',
			'Take': 'Use your mobile phone and launch WeChat, <br/>scan below QR code to follow our official account',
			'Reminder':'',
			'Continue':'Continue'
		},
		'zh': {
			'title': '阅读T&C',
			'Take': '打开您的手机微信应用，扫描二维码关注我们的公众号',
			'Reminder':'',
			'Continue':'下一步'
		}
	};
	return model;
});
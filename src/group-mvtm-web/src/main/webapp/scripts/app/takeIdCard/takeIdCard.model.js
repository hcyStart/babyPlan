define(['../BaseModel'], function (Base) {
    var model = new Base('takeIdCard model');
    model.locale = {
			'en': {
				'next': 'Continue',
				'reminder': 'Please contact our on-site staff if you need assistance',
				'please':'Identity verification is done, please take your ID card from the scanner'
			},
			'zh': {
				'next': '下一步',
				'reminder': '如需协助请联系银行职员',
				'please':'身份验证已完成，请取走身份证'
			}
	}
    return model;
});
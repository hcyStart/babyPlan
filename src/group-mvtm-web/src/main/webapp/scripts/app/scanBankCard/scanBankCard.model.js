define(['../BaseModel'], function (Base) {
    var model = new Base('scanBankCard model');
    model.locale = {
			'en': {
				'reminder': 'Please contact our on-site staff if you need assistance',
				'please':'Please swipe your debit card on card reader.',
				'fallBack':'Back',
				'Continue': 'Continue'
			},
			'zh': {
				'reminder': '如需协助请联系银行职员',
				'please':'请在刷卡机上刷卡 ',
				'fallBack':'上一步',
				'Continue': '下一步'
			}
	}
    return model;
});
define(['../BaseModel'], function (Base) {
    var model = new Base('scanId model');
    model.locale = {
			'en': {
				'reminder': 'Please contact our on-site staff if you need assistance',
				'please':'Please put the ID card on the scanner',
				'fallBack':'Back',
				'Continue': 'Continue'
			},
			'zh': {
				'reminder': '如需协助请联系银行职员',
				'please':'请将身份证放在扫描器上 ',
				'fallBack':'上一步',
				'Continue': '下一步'
			}
	}
    return model;
});
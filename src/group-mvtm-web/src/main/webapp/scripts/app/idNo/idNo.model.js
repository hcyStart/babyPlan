define(['../BaseModel'], function (Base) {
    var model = new Base('idNo model');
    model.locale = {
			'en': {
				'tip': 'Enter Your Identification Number',
				'P':'Please enter your passport number',
				'T':'Please enter your document number of the Mainland Travel Permit for Taiwan Residents',
				'H':'Please enter your document number of the Mainland Travel Permit for Hong Kong and Macao Residents',
				'fallBack':'Back',
				'Continue':"Continue"
			},
			'zh': {
				'tip': '输入证件号码',
				'P':'请输入护照号码',
				'T':'请输入台湾居民来往大陆通行证号码',
				'H':'请输入港澳居民来往内地通行证号码',
				'fallBack':'上一步',
				'Continue':"下一步"
			}
	}
    return model;
});
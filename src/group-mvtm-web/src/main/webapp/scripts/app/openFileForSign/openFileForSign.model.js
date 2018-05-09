define(['../BaseModel'], function (Base) {
    var model = new Base('openFileForSign model');
    model.locale = {
		'en': {
			'title': 'Application Form',
			'information':'Customer Information / Sole Account Opening Form',
			"previewOfSignature" : "Signature Preview",
			"btn" : "Continue"
		},
		'zh': {
			'title': '开户申请表',
			'information':'个人客户资料/独立账户开户申请表',
			"previewOfSignature" : "签名预览",
			"btn" : "下一步"
		}
	}
    return model;
});

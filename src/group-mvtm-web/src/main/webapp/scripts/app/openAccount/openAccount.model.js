define(['../BaseModel'], function (Base) {
    var model = new Base('openAccount model');
    model.locale = {
		'en': {
			'title': 'Create user Numbers',
			"btn" : "Continue"
		},
		'zh': {
			'title': '创建用户号码',
			"btn" : "下一步"
		}
	}
    return model;
});

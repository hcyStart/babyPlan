define(['../BaseModel'], function (Base) {
    var model = new Base('reminder model');
    model.locale = {
			'en': {
				'enter': 'Set PIN',
				'reminder': 'Reminder',
				'confirm':'OK',
				'hintContent':'For your account safety, please make sure no other <br/> people are around, then click confirm button to <br/> proceed to PIN setting.'
			},
			'zh': {
				'enter': '设置密码',
				'reminder': '温馨提示',
				'confirm':'确认',
				'hintContent':'为了您安全设置密码，请确认周边无人接近您，防止密码<br/>被偷窥。确认后，请点击确认键设置密码'
			}
	}
    return model;
});
define(['../BaseModel'], function (Base) {
    var model = new Base('enterPassword model');
    model.locale = {
			'en': {
				'enter': 'Set PIN',
				'use': 'Please use password keyboard to enter your PIN, and press Enter button after completion.',
				'Reminder':"Reminder: Please do not use your ID number, phone number, mobile number, birthday or other simple numbers as your PIN",
				'continue':'Continue',
				'beCareful':'设置密码时，请注意周围环境是否安全'
			},
			'zh': {
				'enter': '设置密码',
				'use': '请使用密码键盘输入6位数字密码， 完成后请按确认键',
				'Reminder':'温馨提示：为了您的账户安全， 请不要使用您的身份证号码、电话、手机号码、生日等较简单的数字组合作为密码',
				'continue':'下一步',
				'beCareful':'设置密码时，请注意周围环境是否安全'
			}
	}
    return model;
});
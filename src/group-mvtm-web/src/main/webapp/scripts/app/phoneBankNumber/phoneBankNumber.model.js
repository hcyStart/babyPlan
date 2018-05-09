define(['../BaseModel'], function (Base) {
    var model = new Base('phoneBankNumber model');
    model.locale = {
			'en': {
				'Register': 'Set Phone Banking PIN',
				'keypad': 'Please use password keyboard to enter your PIN, and press Enter button after completion.',
				'Reminder':'Reminder: Please do not use your ID number, phone number, mobile number, birthday or other simple numbers as your PIN',
				'Continue':'Continue'
			},
			'zh': {
				'Register': '设置电话银行密码',
				'keypad': '请使用密码键盘输入6位数字密码， 完成后请按确认键',
				'Reminder':'温馨提示：为了您的账户安全， 请不要使用您的身份证号码、电话、手机号码、生日等较简单的数字组合作为密码',
				'Continue':'下一步'
			}
	}
    return model;
});
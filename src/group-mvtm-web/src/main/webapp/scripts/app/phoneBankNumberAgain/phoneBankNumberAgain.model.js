define(['../BaseModel'], function (Base) {
    var model = new Base('phoneBankNumberAgain model');
    model.locale = {
			'en': {
				'Register': 'Confirm Phone Banking PIN',
				'Please': 'Please re-enter your PIN, and press Enter button after completion.',
				'Reminder':'Reminder: The PIN needs to be the same as the PIN you entered for the first time.',
				'continue':'Continue'
			},
			'zh': {
				'Register': '确认电话银行密码',
				'Please': '请再次输入您的密码， 完成后请按确认键',
				'Reminder':'温馨提示：密码需要与首次输入的密码保持一致',
				'continue':'下一步'
			}
	}
    return model;
});
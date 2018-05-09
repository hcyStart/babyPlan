define(['../BaseModel'], function (Base) {
    var model = new Base('enterAgain model');
    model.locale = {
			'en': {
				'enter': 'Confirm PIN',
				'again': 'Please re-enter your PIN, and press Enter button after completion.',
				'Reminder':'Reminder: The PIN needs to be the same as the PIN you entered for the first time.',
				'continue':'Continue'
			},
			'zh': {
				'enter': '确认密码',
				'again': '请再次输入您的密码， 完成后请按确认键',
				'Reminder':'温馨提示：密码需要与首次输入的密码保持一致',
				'continue':'下一步'
			}
	}
    return model;
});
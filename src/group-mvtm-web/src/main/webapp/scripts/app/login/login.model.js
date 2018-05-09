define(['../BaseModel'], function (Base) {
    var model = new Base('login model');


	model.locale = {
		'en': {
			'logon':'Log On',
			'english':'English',
			'chinese':'中文',
			'title':'Enter your staff ID and password to log on',
			'noAuthority':'Sorry, you are not authorized to log on.',
			'InputError':'Logon failed. Incorrect staff ID or password, please fill in again.',
			'requestError':'Failed to logon, please try again.',
			'username':'Staff ID',
			'Password':'Password',
			'enterUsername':'Enter your staff ID',
			'enterPassword':'Enter your password',
			'denglu':'Log On'
		},
		'zh': {
			'logon':'用户登录',
			'english':'English',
			'chinese':'中文',
			'title':'输入您的用户名和密码',
			'noAuthority':'抱歉，您没有登录权限。',
			'InputError':'登录失败。 账号或密码错误，请重新填写。',
			'requestError':'登录失败，请重试。',
			'username':'员工号',
			'Password':'密码',
			'enterUsername':'请输入员工号',
			'enterPassword':'请输入密码',
			'denglu':'登录'
		}
	}

    return model;
});
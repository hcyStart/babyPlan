define(['../BaseModel'], function (Base) {
    var model = new Base('home model');

	model.locale = {
			'en': {
				'opennewacct':'Open Bank Account ',
				'title':'Please make sure you have the following documents',
				'card-icon':'Identification',
				'address-ico':'Proof of Address(e.g. ID, water,<br> electricity or gas bill)',
				'resident-ico':'Have read terms and conditions',
				'citizenship-ico':'Have done pre-registration',
				'logonout': 'Logout',
				'chinese':'切换中文',
				'english':'Switch to English',
				'Identification':'Identification Document'
			},
			'zh': {
				'opennewacct':'开户',
				'title':'请客户携带以下证明文件',
				'card-icon':'携带身份证明',
				'address-ico':'地址证明<br>（例如：身份证、水电煤缴费单）',
				'resident-ico':'已阅读开户条款',
				'citizenship-ico':'已预填信息',
				'logonout': '退出登录',
				'chinese':'切换中文',
				'english':'Switch to English',
				'Identification':'身份证明'
			}
	}
    
    return model;
});
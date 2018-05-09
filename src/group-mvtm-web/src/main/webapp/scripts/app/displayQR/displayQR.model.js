define(['../BaseModel'], function (Base) {
    var model = new Base('displayQR model');
    model.locale = {
			'en': {
				'Mobile': 'HSBC Mobile Banking App',
				'Take': 'Use your mobile phone and scan the QR code below to download',
				'Support':'HSBC Mobile Banking supports Android,iPhone and iPad devices',
				'Continue':'Continue'
			},
			'zh': {
				'Mobile': '下载汇丰银行手机客户端',
				'Take': '请使用您的手机扫描二维码进行下载',
				'Support':'汇丰手机银行支持Android，iPhone，iPad等设备',
				'Continue':'下一步'
			}
	}
    return model;
});
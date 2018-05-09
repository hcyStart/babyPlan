define(['../BaseModel'], function (Base) {
    var model = new Base('turnOnCamera model');
    model.locale = {
			'en': {
				'insert': 'The recording device is opened',
				'Continue':'Continue'
			},
			'zh': {
				'insert': '录音录像设备已开启',
				'Continue':'下一步'
			}
	}
    return model;
});
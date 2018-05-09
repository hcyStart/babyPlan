define(['../BaseModel'], function (Base) {
    var model = new Base('turnOnCameraWaiting model');
    model.locale = {
			'en': {
				'insert': 'Opening the recording device, please wait …'
			},
			'zh': {
				'insert': '正在开启录音录像设备， 请稍等…'
			}
	}
    return model;
});
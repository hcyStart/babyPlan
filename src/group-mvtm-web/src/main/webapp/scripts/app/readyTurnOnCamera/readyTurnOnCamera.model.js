define(['../BaseModel'], function (Base) {
    var model = new Base('readyTurnOnCamera model');
    model.locale = {
			'en': {
				'insert': 'Open the video recording device',
				'please':'Please note that,your signature process will be video recorded.<br>Click continue to open the recording device',
				'continue':'Continue'
			},
			'zh': {
				'insert': '开启录音录像设备',
				'please':'请注意，您的签字过程会被录像。点击下一步按钮后开始录音及录像',
				'continue':'下一步'
			}
	}
    return model;
});
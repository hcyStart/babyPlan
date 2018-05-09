define(['../BaseModel'], function (Base) {
    var model = new Base('rateExperience model');
    model.locale = {
			'en': {
				'Thank': 'Your account is now ready. Thank you for choosing HSBC.',
				'Please': 'Please rate our HSBC staff',
				'rate':'Please rate your overall experience',
				'done':'Please scan the QR Code below for the following services',
				'Confirm':'Done',
				'warning':'Please return this equipment to HSBC staff after you click "Done"'
			},
			'zh': {
				'Thank': '您的账户已成功开立',
				'Please': '请您为汇丰员工的服务评分',
				'rate':'请您为开户过程的综合体验评分',
				'done':'为了今后更好的为您服务， 请扫描下方二维码',
				'Confirm':'完成',
				'warning':'点击“完成”后请将此台设备交还汇丰员工'
			}
	}
    return model;
});
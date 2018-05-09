define(['../BaseModel'], function (Base) {
    var model = new Base('faceToface model');
    model.locale = {
			'en': {
				'teller': 'Please return this equipment to HSBC staff',
				'Reminder':'Customer Development Officer please complete the following steps: <br> Complete CDD approval, create customer account, review and confirm smart form information with customer. ',
				'Continue':'Continue'
			},
			'zh': {
				'teller': '请将此台设备交还给汇丰员工',
				'Reminder': '客户主任请注意， 在点击下一步之前请先完成以下步骤：<br>完成CDD批准， 创建客户账号并提交申请表',
				'Continue':'下一步'
			}
	}
    return model;
});

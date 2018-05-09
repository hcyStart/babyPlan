define([ '../BaseModel' ], function(Base) {
	var model = new Base('showIdCard model');
	model.locale = {
		'en' : {
			'tip' : 'Identity Verification',
			'idCardTip' : 'The ID card is on the reverse side',
			'gztTip' : 'Network verification results',
			'userName' : 'Name:',
			'userNumber' : 'ID number:',
			'refresh' : 'Retry',
			'contrastiveSuccessHide' : 'Success',
			'contrastiveSuccessContent' : 'The name and ID number are matched and the photo exists in national citizen identity information enquiry system.',
			'contrastiveFailureHide' : ' Error',
			'contrastiveFailureContent' : 'The name and ID number are NOT matched.',
			'queryEmptyHide' : 'Not Found',
			'queryEmptyContent' : 'Please check if the identification document is valid and retry.',
			'GTZSuccessErrorHide':'Error',
			'GTZSuccessErrorContent':'Please retry',
			'notApplicable':'Not Applicable',
			'Confirm' : 'Continue'
		},
		'zh' : {
			'tip' : '身份验证',
			'idCardTip' : '身份证正反面',
			'gztTip' : '联网核查结果',
			'userName' : '姓名:',
			'userNumber' : '身份证号码:',
			'refresh' : '重试',
			'contrastiveSuccessHide' : '资料搜索成功',
			'contrastiveSuccessContent' : '姓名与身份证号码相对应，并且照片存在。',
			'contrastiveFailureHide' : '资料错误',
			'contrastiveFailureContent' : '姓名与身份证号码无法对应。',
			'queryEmptyHide' : '库无此人  ',
			'queryEmptyContent' : '请检查证件是否有效， 然后重试。',
			'GTZSuccessErrorHide':'查询失败',
			'GTZSuccessErrorContent':'请重试',
			'notApplicable':'不适用',
			'Confirm' : '下一步'
		}
	}
	return model;
});
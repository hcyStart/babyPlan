define([ '../BaseModel' ], function(Base) {
	var model = new Base('capture model');
	model.locale = {
		'en' : {
			"tip":"Collect Documents",
			'capture' : 'Camera',
			'upload': 'Upload file',
			'submit':'Submit',
			"delete":"Modify",
			"exitDelete":"Done",
			"refresh":"Refresh",
			'Continue' : 'Save and continue'
		},
		'zh' : {
			"tip":"收集证明文件",
			'capture' : '拍照',
			'upload': '本地上传',
			'submit':'提交',
			"delete":"编辑",
			"exitDelete":"退出编辑",
			"refresh":"刷新",
			'Continue': '保存并继续'
		}
	}
	return model;
});
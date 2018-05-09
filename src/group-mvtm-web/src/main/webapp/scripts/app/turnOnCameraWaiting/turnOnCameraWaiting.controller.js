define(['../BaseController','app/util','app/wosa','../../codeAndTip','../../popup','app/comInterface'], function (Base,$$,wosa,codeAndTip,popup,comInterface) {
	var controller = new Base('turnOnCameraWaiting controller');
	var currentHash = location.hash;
	//打开摄像头录像
	controller.asyncStartRecord = function(id, BusinessType, StaffID){
		var ret = JSON.parse(wosa.asyncStartRecord(id, BusinessType, StaffID));
		if(codeAndTip.code.common.hardwareAvailable == ret.hResult){
			$$.debug("startRecord成功")
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){
			$$.debug("startRecord失败:"+JSON.stringify(ret));
			//popup("recordError_retry",recordFuns.language,function(){recordFuns.closeRecord();location.hash='faceToface';},null,ret.errorCode);
			popup("recordError_retry",controller.getLocale(),function(){comInterface.closeRecord();location.hash='faceToface'},null,ret.errorCode)
		}
	}
	return controller;
});

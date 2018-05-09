define(['../BaseController','app/util','app/wosa','../../codeAndTip','../../popup','app/comInterface'], function (Base,$$,wosa,codeAndTip,popup,comInterface) {
	var controller = new Base('readyTurnOnCamera controller');
	controller.openRecordError = function(idNo,code,top,left,callBacks,language){
		//没有摄像头,指定摄像头不存在,摄像头被占用的情况,只有"返回首页"按钮
		if("E231103" == code || "E231104" == code || "E231105" == code || "E231106" == code){
			popup("recordFailed",language,function(){location.hash="home"},null,code);
		}else{
			//其他情况下,进行retry
			//popup("recordError_retry",language,null,function(){controller.openRecord(idNo,language,top,left,callBacks)},code);
			popup("recordError_retry",language,function(){location.hash="faceToface"},null,code);
		}
	}
	controller.openRecord = function(canClickFun,idNo,language,top,left,callBacks){
		var ret = JSON.parse(wosa.asyncOpenRecord(top,left));
		if(codeAndTip.code.common.hardwareAvailable == ret.hResult){
			$$.debug("openRecord成功:readyTurnOnCamera");
			callBacks.success();
			//controller.openRecordError(idNo,ret.errorCode,top,left,callBacks,language);
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){
			$$.debug("openRecord失败:"+JSON.stringify(ret));
			controller.openRecordError(idNo,ret.errorCode,top,left,callBacks,language);
			canClickFun();
		}
	}
	return controller;
});

define(['../BaseController','app/util','app/wosa','../../codeAndTip'], function (Base,$$,wosa,codeAndTip) {
	var controller = new Base('identificationType controller');
	//停止录屏
	controller.asyncStopRecord = function(){
		var ret = JSON.parse(wosa.asyncStopRecord());
		if(codeAndTip.code.common.hardwareAvailable == ret.hResult){
			$$.debug("asyncStopRecord成功: home"+JSON.stringify(ret))
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){
			$$.debug("asyncStopRecord失败: home"+JSON.stringify(ret))
		}
	}
	//关闭摄像头
	controller.closeRecord = function(callBacks){
		var ret = JSON.parse(wosa.closeRecord());
		if(codeAndTip.code.common.hardwareAvailable == ret.hResult){
			$$.debug("closeRecord成功: home"+JSON.stringify(ret))
			callBacks.success();
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){
			$$.debug("closeRecord失败: home"+JSON.stringify(ret))
		}
	}
	//拍照功能中关闭摄像头
	controller.closeCamra = function(){
		var ret = JSON.parse(wosa.closeCamra());
		if(codeAndTip.code.common.hardwareAvailable == ret.hResult){
			$$.debug("closeCamra: home"+JSON.stringify(ret))
			callBacks.success();
		}else if(codeAndTip.code.common.hardwareFailure == ret.hResult){
			$$.debug("closeCamra: home"+JSON.stringify(ret))
		}
	}
	return controller;
});

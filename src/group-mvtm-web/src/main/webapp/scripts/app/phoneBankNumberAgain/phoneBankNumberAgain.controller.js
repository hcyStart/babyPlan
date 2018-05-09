define(['../BaseController', 'app/util','app/wosa'], function (Base, $$, wosa) {
	var controller = new Base('phoneBankNumberAgain controller');
	
	controller.PPInit = function () {
		setPinInit();
	}
	//先前一次取消密码键盘的调用，在开始新的一次调用，始终保持当前只调用一次
	function setPinInit(){
		$$.showLoading();
		try {
			//取消结果不做任何处理
			var setPINResult = wosa.PinAsyncCancel();
			$$.debug("phoneBankNumberAgain 取消去激活密码键盘态成功"+setPINResult);
		} catch (e) {
			$$.debug('phoneBankNumberAgain 取消去激活密码键盘失败，出现异常：'+e);
		}
		try {
			var wosaPinTimerHour = 60000; //设置一分钟超时时间
			var setPINResult = wosa.getPinpadDataAsync( 6, 0, "number|clear|enter", "enter|clear", wosaPinTimerHour);
			$$.debug("phoneBankNumberAgain 获取设置密码键盘信息状态成功"+setPINResult);
		} catch (e) {
			$$.debug('phoneBankNumberAgain 激活密码失败，出现异常：'+e);
		}
		$$.hideLoading();
	}
	return controller;
});

define(['../BaseController', 'app/util', './enterPassword.model','../../codeAndTip','app/wosa','../../popup'], function (Base, $$, model,codeAndTip,wosa,popup) {
	var controller = new Base('enterPassword controller');
	/**
	 * 密码键盘机具硬件模块相关
	 */
	controller.PPInit = function (callbacks) {
		window.PinAsyncCallBack =  function (type,handWareResult) {
			$$.debug('PinAsyncCallBack 密码键盘扫描 返回事件类行：'+type+"返回的结果是:",handWareResult);
			$$.debug("PinAsyncCallBack hResult");
			var resultAll = JSON.parse(handWareResult);
			var hResult = resultAll.hResult;
			var hData = JSON.parse(resultAll.data);
			var hCode = resultAll.Code;
			var hBuffer = hData.Buffer;
			switch(type){
            //输入键盘激活硬件代码
	          case codeAndTip.code.enterPassword.pinKeyEvent:
	           	 if(codeAndTip.code.common.hardwareAvailable == hResult && codeAndTip.code.enterPassword.pinKeyCode == hCode){ 
	           		    $$.debug('密码键盘激活，可正常输入');
		           		var _inputData = hBuffer.ulDigit;
						switch (true) {
						case /[0-9]/ig.test(_inputData):
							$$.debug('PinAsyncCallBack: _inputData');
							callbacks.digit.call(null, _inputData);
							break;
						case 'enter' === _inputData:
							$$.debug('PinAsyncCallBack: enter');
							callbacks.enter.call(null);
							break;
						case 'clear' === _inputData:
							$$.debug('PinAsyncCallBack: clear');
						    setPinInit();
							callbacks.clear.call(null);
							break;
						case 'cancel' === _inputData:
							$$.debug('PinpadExecuteEvent: cancel');
							break;
						case '00' === _inputData:
							$$.debug('PinpadExecuteEvent: "00"');
							break;
						case 'dot' === _inputData:
							$$.debug('PinpadExecuteEvent: "."');
							break;
						default:
							$$.debug('PinpadExecuteEvent other: ' + _inputData);
							break;
					}
	           	 }
	           	break;
	          case codeAndTip.code.enterPassword.getPinDataEvent:
		           	 if(codeAndTip.code.common.hardwareAvailable == hResult && codeAndTip.code.enterPassword.getPinDataCode == hCode){ 
		           		  $$.debug('密码键盘输入完成，获取输入密码信息');
                         if(hBuffer && codeAndTip.code.enterPassword.getPinDataCompEnter == hBuffer.wCompletion){
                        	var keys = hBuffer.PinKeys.replace(/\|/ig, '');
         					$$.debug('自动激活 keys...');
         					if (keys && 6 == keys.length) {
         						callbacks.success.call(null, keys);
         					} else {
         						$$.debug('密码长度不正确 ...');
         						callbacks.lengthError.call(null, keys);
         					}
                         }else if (hBuffer && hBuffer.wCompletion && codeAndTip.code.enterPassword.getPinDataCompClear == hBuffer.wCompletion) {
         					$$.debug('Clear 终止完成事件 ');
         				}
		           	 }else if(codeAndTip.code.scanid.TimeOut == hResult){
                		 $$.debug("获取的密码键盘超时"+handWareResult);
                		 callbacks.TimeOut.call(null);
                	 }else if(codeAndTip.code.enterPassword.enterPasswordHandwareError == hResult){
                		 $$.debug("获取的密码键盘模块损坏或者设备未连接："+handWareResult);
    	        		 callbacks.handWareError.call(null,resultAll);
    	        	 }		           	 
	           	  break;
			}
		}
		setPinInit(callbacks);
	}
	//先前一次取消密码键盘的调用，在开始新的一次调用，始终保持当前只调用一次
	function setPinInit(callbacks){
		$$.showLoading();
		try {
			//取消结果不做任何处理
			var setPINResult = wosa.PinAsyncCancel();
			$$.debug("enterPassword 取消去激活密码键盘态成功"+setPINResult);
		} catch (e) {
			$$.debug('enterPassword 取消去激活密码键盘失败，出现异常：'+e);
		}
		try {
			var wosaPinTimerHour = 60000; //设置一分钟超时时间
			var setPINResult = wosa.getPinpadDataAsync( 6, 0, "number|clear|enter", "enter|clear", wosaPinTimerHour);
			$$.debug("enterPassword 获取设置密码键盘信息状态成功"+setPINResult);
			callbacks.setPinSuc.call(null,setPINResult);
		} catch (e) {
			$$.debug('enterPassword 激活密码失败，出现异常：'+e);
		}
		$$.hideLoading();
	}
	
	controller.pinChangeCpbForMvtm = function(idNumber,idCardType,keys){
		if('I' != idCardType && 'P' != idCardType){
			//pinChangeCpbForMvtm接口，当选择的证件类型为通行证时，证件类型为大写的X
			idCardType = 'X';
		}
		$$.sendMessageWithoutException("service/proxy/vtcService/pinChangeForMvtm/pinChangeCpbForMvtm", JSON.stringify({
            "idNumber": idNumber,
            "idCardType": idCardType
        })).then(function(res){
        	var status = res.status;
        	$$.debug('调用pinChangeCpbForMvtm接口，status：'+status);
        	//status 0代表拥有设置phonebank的权限，1代表拥有card和phonebank的权限
        	if( status == codeAndTip.code.common.success && (res.data[0].code == '0' || res.data[0].code == '1')){
        		var customerNumber = res.data[0].customerNumber;
        		$$.debug("customerNumber获取成功");
        		$$.debug('调用 GetCardSecretKey(keys, CardNumber) 接口，加密卡密码，');
        		try{
        			var setPinRs =  wosa.getCardSecretKey(keys, model.customer.cardNumber);
            		var encryptedPIN, encryptedSessionKey;
    				if(setPinRs && setPinRs.hResult == codeAndTip.code.common.hardwareFailure){
    					var errorCode = setPinRs.errorCode;
    					popup(enterPasswordSetPinRsErr,language,null,null,errorCode)
    					$$.debug('加密失败');
    				}else{
    					$$.debug('银行卡加密成功 ');
    					encryptedPIN = setPinRs.substring(0, 16);
    					encryptedSessionKey = setPinRs.substring(16);
    					
    					controller.pinChangeCpm(customerNumber,model.customer.cardNumber, model.customer.issueNumber,encryptedPIN,encryptedSessionKey);
    				}
    			}catch(e){
        			$$.debug('软加密失败 ' + e);
        		}
    			$$.debug('银行卡加密密码长度： ' + setPinRs.length);
    			
        	}else{
        		$$.debug('调用pinChangeCpbForMvtm接口异常或用户没有设置密码的权限，status：'+status);
        		var errType='serviceError';
    			var language = controller.getLocale();
    			popup(errType,language,null,null,null);
        	}	
        },function(res){
        	$$.debug('调用pinChangeCpbForMvtm接口失败,获取customerNumber失败：'+JSON.stringify(res));
			var language = controller.getLocale();
        	if($$.retrysetPinCard < 2 &&  ("0" == res.readyState || "1" == res.readyState)){
        		var errType='setpinServerError';
    			popup(errType,language,null,null,null);
        	}else{
        		var errType='serviceError';
    			popup(errType,language,null,null,null);
        	}
        });
	}
	
	controller.pinChangeCpm = function (domesticCustomerNumber, cardNumber, cardIssueNumber, encryptedPIN, encryptedSessionKey) {
		$$.sendMessageWithoutException("service/proxy/vtcService/pinChange/pinChangeCpm", JSON.stringify({
            "domesticCustomerNumber": domesticCustomerNumber,
            "cardNumber": cardNumber,
            "cardIssueNumber": cardIssueNumber,
            "encryptedPIN": encryptedPIN,
            "encryptedSessionKey": encryptedSessionKey
        })).then(function(res){
        	var status = res.status;
        	$$.debug('调用pinChangeCpm接口，status：'+status);
        	if( status == codeAndTip.code.common.success && res.data[0].code == '0'){
        		$$.hideLoading();
    			//window.loadEnterPassword当设置密码成功，断网后不能重新LOAD页面
    			window.reloadEnterPassword = false;
    			if(0 == model.customer.customerSession.selectPhoneBanking){
    				$$.debug('未开通电话银行');
    				setPinSuc();
    			}else if(1 == model.customer.customerSession.selectPhoneBanking){
    				$$.debug('已开通电话银行');
    				setPinSucToPhoneBank();
    			}
        	}else{
        		$$.debug('调用pinChangeCpm接口异常，status：'+status);
        		var errType='serviceError';
    			var language = controller.getLocale();
    			popup(errType,language,null,null,null);
        	}
        },function(res){
        	$$.debug('调用pinChangeCpm接口失败：'+JSON.stringify(res));
			var language = controller.getLocale();
        	if($$.retrysetPinCard < 2 &&  ("0" == res.readyState || "1" == res.readyState)){
        		var errType='setpinServerError';
    			popup(errType,language,null,null,null);
        	}else{
        		var errType='serviceError';
    			popup(errType,language,null,null,null);
        	}
        });
	};
	function setPinSuc(){
		var language = controller.getLocale();
		popup("setPasswordSuc",language,function(){
			$$.beforChageHash().then(function(){
				location.hash = 'displayQR';
			},function(){
				setPinSuc();
			})},null,null);
	}
	function setPinSucToPhoneBank(){
		var language = controller.getLocale();
		popup("setPasswordSucP",language,function(){
			$$.beforChageHash().then(function(){
				location.hash = 'phoneBankNumber';
			},function(){
				setPinSucToPhoneBank();
			})},null,null);
	}
	return controller;
});

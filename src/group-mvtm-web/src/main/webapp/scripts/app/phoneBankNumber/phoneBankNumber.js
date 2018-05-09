define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./phoneBankNumber.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./phoneBankNumber.template.html'),
		controller = require('./phoneBankNumber.controller'),
		popup = require('popup');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("Enter phoneBankNumber page");
		render();
		bind();
		run();
	};

	/**
	 * 视图渲染
	 */
	function render() {
		controller.setModel(model);
		controller.setTemplate(template);
		controller.render($('#view-part-container')[0]);
	}

	/**
	 * 事件绑定
	 */
	function bind() {
	
	}

	function run() {
		$$.statusStep(2,7);
		var language = controller.getLocale();
		window.reloadPhoneBankNumber = true;
		var inputPassword = '';
		controller.PPInit({
		    setPinSuc: function(setpinResult){
		    	$$.debug('phoneBankNumber密码器模块返回结果 :'+ setpinResult);
				var _hResult = JSON.parse(setpinResult);
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
			    if(setpinResult && ("WFS_ERROR" == _hResult.hResult || "WFS_STAT_DEVOFFLINE" == _hResult.hResult)  && ('#phoneBankNumber' == hash || '#phoneBankNumberAgain' == hash || hash.indexOf('#phoneBankNumber') >-1 || hash.indexOf('#phoneBankNumberAgain') >-1)){	
					$$.debug('phoneBankNumber密码器模块错误返回结果    error code:'+ setpinResult);
					var errorcode = _hResult.errorCode;
					var errType = '';
					if('E233541' == errorcode){
						errType='setpinYHHandWareError';
					}else{
						errType='setpinPasswordHandwareError';
					}
					popup(errType,language,"","",errorcode);
			    }else{
			    	 $$.debug('phoneBankNumber密码器模块正常返回结果 .');
			    	 $$.hideLoading();
			    }
		    },
		    reset: function () {

			},
			digit: function (setpinInput) {
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if(hash === '#phoneBankNumber' || hash.indexOf('#phoneBankNumber') >-1 || 
					hash === '#phoneBankNumberAgain'  || hash.indexOf('#phoneBankNumberAgain') >-1){
					$$.debug('phoneBankNumber回调digit方法成功 ');
					$('.text:not(.point)').eq(0).addClass('point');
				}
			},
			enter: function () {
				$$.debug('phoneBankNumber回调enter方法 ');
				$('.text').removeClass("point");
			},
			clear: function () {
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if(hash === '#phoneBankNumber' || hash.indexOf('#phoneBankNumber') >-1 || 
					hash === '#phoneBankNumberAgain'  || hash.indexOf('#phoneBankNumberAgain') >-1){
					$$.debug('phoneBankNumber回调clear方法 ');
					$('.text').removeClass("point");
				}
			},
			cancel: function () {
				$$.debug('phoneBankNumber回调cansel方法 ');
				$('.text').removeClass("point");
			},
			success: function (keys) {
 				var unconnectionFlag = $("#mainMaskOfInternet").is(":visible");
 				$$.debug(location.hash+'页面,回调success方法, unconnectionFlag:'+unconnectionFlag);
 				//当检查联网状态的popup未弹出的时候才可以进行成功后的操作
 				if(!unconnectionFlag){
 					$$.debug('phoneBankNumber回调success方法 ');
 					//不能放外面，以PPint因为一次性加载当前第一次记录的页面，对于不同的页面判定跳转不起作用
 					var hash = location.hash;
 					if(hash && (hash.indexOf('_') != -1)){
 						hash = hash.split("_")[0];
 					}
 					if(hash === '#phoneBankNumberAgain' || hash.indexOf('#phoneBankNumberAgain') >-1){
 						$$.debug('phoneBankNumberAgain');
 						if(inputPassword !== keys){
 							$$.debug('phoneBankNumber两次密码输入不一致');
 							window.reloadPhoneBankNumber = false;
 							//此处需要加异常处理提示
 							var errType='phoneBankNumberNotConsistent';
 							popup(errType,language,function(){window.reloadPhoneBankNumber = true},null,null);
 							return;
 						}else{
 							$$.debug('phoneBankNumber两次密码输入一致');
 							var idNumber = model.customer.idCardNo;
 							var idCardType = model.customer.customerSession.idCardInfo.IDType;
 							$$.showLoading();
 							controller.pinChangeCpbForMvtm(idNumber,idCardType,keys);
 						}
 					}else if(hash === '#phoneBankNumber'  || hash.indexOf('#phoneBankNumber') >-1){
 						inputPassword = keys;
 						$$.debug('phoneBankNumber进入 phoneBankNumberAgain Page');
 						$$.beforChageHash().then(function(){
 							location.hash = 'phoneBankNumberAgain';
 						})
 						
 					}
 				}

			},
			TimeOut: function () {
				$$.debug('phoneBankNumber回调密码键盘超时 ');
				//此处需要加异常处理提示
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if(hash === '#phoneBankNumber'  || hash.indexOf('#phoneBankNumber') >-1 || hash === '#phoneBankNumberAgain' || hash.indexOf('#phoneBankNumberAgain') >-1){
					var errType='phoneBankNumberTimeOut';
					popup(errType,language);
				}
			},
			lengthError: function(){
				$('.text').removeClass("point");
				$$.debug('phoneBankNumber回调lengthError方法 ');
				//此处需要加异常处理提示
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if(hash === '#phoneBankNumber'  || hash.indexOf('#phoneBankNumber') >-1 ){
					var errType='phoneBankNumberLengthError';
					popup(errType,language);
				}else if( hash === '#phoneBankNumberAgain' || hash.indexOf('#phoneBankNumberAgain') >-1){
					window.reloadPhoneBankNumber = false;
					var errType='phoneBankNumberLengthError';
					popup(errType,language,function(){window.reloadPhoneBankNumber = true},null,null);
				}
			},
			handWareError: function(resultAll){
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				$$.debug("phoneBankNumber密码键盘错误类型"+JSON.stringify(resultAll));
				$$.debug("phoneBankNumber密码键盘错误类型    hash："+hash);
				if(hash === '#phoneBankNumber'  || hash.indexOf('#phoneBankNumber') >-1 || hash === '#phoneBankNumberAgain' || hash.indexOf('#phoneBankNumberAgain') >-1){
					$$.debug("phoneBankNumber密码键盘误类型"+JSON.stringify(resultAll));
					var errorcode = resultAll.errorCode;
					var errType = '';
					if('E233541' == errorcode){
						errType='setpinYHHandWareError';
					}else{
						errType='setpinPasswordHandwareError';
					}
					popup(errType,language,"","",errorcode);
				}			
			}
		});
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"phoneBankNumber"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--phoneBankNumber")
		},function(res){
			$$.debug("updateCurrentStepFail--phoneBankNumber:"+JSON.stringify(res))
		})
	}

	return {
		load: load
	};
});

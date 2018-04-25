define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./enterPassword.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./enterPassword.template.html'),
		controller = require('./enterPassword.controller'),
        popup = require('popup');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("Enter enterPassword page");
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
		window.reloadEnterPassword = true;
		var inputPassword = '';
		controller.PPInit({
		    setPinSuc: function(setpinResult){
		    	$$.debug('密码器模块返回结果 :'+ setpinResult);
				    var _hResult = JSON.parse(setpinResult);
					var hash = location.hash;
					if(hash && (hash.indexOf('_') != -1)){
						hash = hash.split("_")[0];
					}
			    if(setpinResult && ("WFS_ERROR" == _hResult.hResult || "WFS_STAT_DEVOFFLINE" == _hResult.hResult) && ('#enterAgain' == hash || '#enterPassword' == hash || hash.indexOf('#enterAgain') >-1 || hash.indexOf('#enterPassword') >-1)){	
					$$.debug('密码器模块错误返回结果   error code:'+ setpinResult);
					var errorcode = _hResult.errorCode;
					var errType = '';
					if('E233541' == errorcode){
						errType='setpinYHHandWareError';
					}else{
						errType='setpinPasswordHandwareError';
					}	
					popup(errType,language,"","",errorcode);
			    }else{
			    	 $$.debug('密码器模块正常返回结果 .');
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
				if(hash === '#enterAgain' || hash.indexOf('#enterAgain') >-1 || 
					hash === '#enterPassword'  || hash.indexOf('#enterPassword') >-1){
					$$.debug('回调digit方法成功 ');
					$('.text:not(.point)').eq(0).addClass('point');
				}
			},
			enter: function () {
				$$.debug('回调enter方法 ');
				$('.text').removeClass("point");
			},
			clear: function () {
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				if(hash === '#enterAgain' || hash.indexOf('#enterAgain') >-1 || 
					hash === '#enterPassword'  || hash.indexOf('#enterPassword') >-1){
					$$.debug('回调clear方法 ');
					$('.text').removeClass("point");
				}
			},
			cancel: function () {
				$$.debug('回调cansel方法 ');
				$('.text').removeClass("point");
			},
			success: function (keys) {
 				var unconnectionFlag = $("#mainMaskOfInternet").is(":visible");
 				$$.debug(location.hash+'页面,回调success方法, unconnectionFlag:'+unconnectionFlag);
 				//当检查联网状态的popup未弹出的时候才可以进行成功后的操作
 				if(!unconnectionFlag){
 					$$.debug('回调success方法 ');
 					//不能放外面，以PPint因为一次性加载当前第一次记录的页面，对于不同的页面判定跳转不起作用
 					var hash = location.hash;
 					if(hash && (hash.indexOf('_') != -1)){
 						hash = hash.split("_")[0];
 					}
 					if(hash === '#enterAgain' || hash.indexOf('#enterAgain') >-1){
 						$$.debug('enterAgain');
 						if(inputPassword !== keys){
 							$$.debug('两次密码输入不一致');
 							window.reloadEnterPassword = false;
 							//此处需要加异常处理提示
 							var errType='serPinNotConsistent';
 							popup(errType,language,function(){window.reloadEnterPassword = true},null,null);
 							return;
 						}else{
 							$$.debug('两次密码输入一致');
 							var idNumber = model.customer.idCardNo;
 							var idCardType = model.customer.customerSession.idCardInfo.IDType;
 							$$.showLoading();
 							controller.pinChangeCpbForMvtm(idNumber,idCardType,keys);
 						}
 					}else if(hash === '#enterPassword'  || hash.indexOf('#enterPassword') >-1){
 						inputPassword = keys;
 						$$.debug('进入 enterAgain Page');
 						$$.beforChageHash().then(function(){
 							location.hash = 'enterAgain';
 						})
 						
 					}
 				}
			},
			TimeOut: function () {
				$$.debug('回调密码键盘超时 ');
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				//此处需要加异常处理提示
				if(hash === '#enterPassword'  || hash.indexOf('#enterPassword') >-1 || hash === '#enterAgain' || hash.indexOf('#enterAgain') >-1){
					var errType='setPinTimeOut';
					popup(errType,language);
				}
			},
			lengthError: function(){
				$('.text').removeClass("point");
				$$.debug('回调lengthError方法 ');
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				//此处需要加异常处理提示
				if(hash === '#enterPassword'  || hash.indexOf('#enterPassword') >-1 ){
					var errType='setPinLengthError';
					popup(errType,language);
				}else if(hash === '#enterAgain' || hash.indexOf('#enterAgain') >-1){
					window.reloadEnterPassword = false;
					var errType='setPinLengthError';
					popup(errType,language,function(){window.reloadEnterPassword = true});
				}
			},
			handWareError: function(resultAll){
				var hash = location.hash;
				if(hash && (hash.indexOf('_') != -1)){
					hash = hash.split("_")[0];
				}
				$$.debug("密码键盘错误类型"+JSON.stringify(resultAll));
				$$.debug("密码键盘错误类型    hash："+hash);
				if(hash === '#enterPassword'  || hash.indexOf('#enterPassword') >-1 || hash === '#enterAgain' || hash.indexOf('#enterAgain') >-1){
					$$.debug("密码键盘误类型"+JSON.stringify(resultAll));
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
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"enterPassword"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--enterPassword")
		},function(res){
			$$.debug("updateCurrentStepFail--enterPassword:"+JSON.stringify(res))
		})
	}

	return {
		load: load
	};
});
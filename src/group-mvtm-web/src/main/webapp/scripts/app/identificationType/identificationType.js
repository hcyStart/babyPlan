define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./identificationType.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./identificationType.template.html'),
		controller = require('./identificationType.controller'),
		comInterface = require('app/comInterface'),
		wosa = require('app/wosa'),
		popup = require('popup');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter identificationType page");
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
		controller.render($$.getViewContainer());
	}

	/**
	 * 事件绑定
	 */
	function bind() {
		$("#identificationType-next").on("click",function(){
			var idActive = $("#identification .idType .active");
			if($("#identification .idType .selectIdentification").hasClass('active')){
				if(idActive.hasClass('resident')){
					$$.beforChageHash().then(function(){
						location.hash = "scanId";
					})
				}else{
					$("#view-part-container").data('idType',idActive.attr('data-id-type'));
					$$.beforChageHash().then(function(){
						location.hash = "idNo"
					})
				}
			}
		});
		$("#exit").off("click").on("click", function () {
			var _currentHash = location.hash;
			if(_currentHash && (_currentHash.indexOf('_') != -1)){
				_currentHash = _currentHash.split("_")[0];
			}
			$$.debug("点击退出，当前页面是："+_currentHash);
			if("#readyTurnOnCamera" == _currentHash ||"#turnOnCamera" == _currentHash||"#turnOnCameraWaiting"== _currentHash||"#understandTnc" == _currentHash||"#openFileForSign"==_currentHash){
				$$.debug("exit第一种情况");
				popup("chooseExit",controller.getLocale(),null,backHomeFun,null);
			}else if("#identificationType" == _currentHash || "#takeIdCard" == _currentHash || "#displayQR" == _currentHash || "#displayWeChat" == _currentHash || "#rateExperience" == _currentHash || "#reminder" == _currentHash || "#reminderForTelBank" == _currentHash){
				$$.debug("exit第二种情况");
				popup("chooseExit",controller.getLocale(),null,function(){location.hash = 'home'},null);
			}else if("#idNo" == _currentHash){
				$$.debug("exit第三种情况");
				$("#otherIdNo").blur();//防止光标出现在exit框内
				popup("chooseExit",controller.getLocale(),function(){$("#otherIdNo").focus();},function(){location.hash = 'home'},null);
			}else if("#capture"  == _currentHash ){
				if(window.captureNext == "accountType"){
					$$.debug("exit第四种情况");
					popup("chooseExit",controller.getLocale(),null,backToHomeFun,null);
				}else if(window.captureNext == "home"){
					$$.debug("exit第五种情况");
					popup("chooseExit",controller.getLocale(),null,function(){location.hash = 'home'},null);
				}
			}else if("#scanId" == _currentHash || "#waiting" == _currentHash){
				$$.debug("exit返回首页在扫描身份证页面，需要取消身份证扫描后，在回到首页");
				popup("chooseExit",controller.getLocale(),null,cannelScanId,null);
			}else if ("#scanBankCard" == _currentHash){
				$$.debug("exit返回首页,在扫描银行卡证页面，需要取消扫描银行卡后，在回到首页");
				popup("chooseExit",controller.getLocale(),null,cannelScanBankCard,null);
			}else if ("#enterPassword" == _currentHash || "#enterAgain" == _currentHash || "#phoneBankNumberAgain" == _currentHash || "#phoneBankNumber" == _currentHash){
				$$.debug("exit返回首页,在输入密码键盘页面，需要取消输入密码键盘后，在回到首页");
				popup("chooseExit",controller.getLocale(),null,cannelSetpin,null);
			}else{
				$$.debug("exit第六种情况");
				popup("chooseExit",controller.getLocale(),null,backToHomeFun,null);
			}
		});

		$("#backhome-cancel").off().on("click",function () {
			dialog.layerHide("#backhome-dialog");
		});
		var idType = $('#identification .idType')
		idType.on('click',function(){
			idType.find('.selectIdentification').removeClass('active');
			$(this).find('.selectIdentification').addClass('active');
			idType.removeClass('active');
			$(this).addClass('active');
			$('#identificationType-next').removeClass('disabled').attr("disabled",false);
		})
	}

	function run() {
		$$.statusStep(1,1);
		$(".view-container").addClass("home-bg");
		//跳转页面重写身份证监听事件
		window.IdCardReaderAsynCallBack = function(){}
		//回选证件类型身份证重置次数和扫描状态清空
		$$.scanNum = 0;
		$$.scanIDStatus = '';	
		//加载版本信息
		$("#vInfoInOthers").text(controller.versionInformation);
		$("#js-exit").show();
	}
	function backHomeFun(){
		if("#openFileForSign" == location.hash){
			window.CommonBridgeAsynCallBack = function(){};
		}
		var smpPath = model.customer.customerSession && model.customer.customerSession.smpPath;
		comInterface.asyncStopRecord("home",model.customer.idCardNo,"exit",null,controller.getLocale(),null,smpPath);
	}
	function backToHomeFun(){
		var smpPath = model.customer.customerSession && model.customer.customerSession.smpPath;
		comInterface.deteleAllInformation(model.customer.idCardNo,smpPath);
	}
	function cannelScanId(){
		try{
		    var  scancardResult = wosa.IdcAsyncCancel();
		    $$.debug("identificationType 返回首页跳转页面,调用停止身份证扫描结果： "+ scancardResult);
		}catch(e){
			$$.debug("identificationType 返回首页跳转页面,调用停止扫描身份证出现异常"+ e); 
		}
		location.hash = 'home';
	}
	
	function cannelScanBankCard(){
		try{
		    var  cancelbankcardResult = wosa.trackReaderAsyncCancel();
			window.TrackReaderAsyncCallBack = function (){};//防止回到首页后还出现刷卡页面超时提示的弹框
		    $$.debug("identificationType 页面,调用停止扫描银行卡节果： "+ cancelbankcardResult);
		}catch(e){
			$$.debug("identificationType 页面,调用停止扫描银行卡出现异常"+ e); 
		}
		backToHomeFun();
	}
	
	function cannelSetpin(){
		try{
		    var  cancelSetpinResult =  wosa.PinAsyncCancel();
		    window.PinAsyncCallBack = function(){};//防止回到首页后还出现输入密码页面超时提示的弹框
		    $$.debug("identificationType 页面,调用停止输入密码键盘结果： "+ cancelSetpinResult);
		} catch(e) {
			$$.debug("identificationType 页面,调用停止输入密码键盘出现异常"+ e); 
		}
		location.hash = 'home';
	}
	return {
		load: load
	};
});

define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./readyTurnOnCamera.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./readyTurnOnCamera.template.html'),
		controller = require('./readyTurnOnCamera.controller'),
		codeAndTip = require('../../codeAndTip'),
		comInterface = require('app/comInterface');
		
	var vidioPosition = null;//存储视频窗口位置信息
	var continueBtn = null;
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter readyTurnOnCamera page");
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
		controller.render($("#view-part-container")[0]);
	}
	/**
	 * 事件绑定
	 */
	function bind() {
		continueBtn = $("#readyTurnOnCamera-next")
		continueBtn.on("click",function(){
			controller.openRecord(canClickFun,model.customer.idCardNo,controller.getLocale(),vidioPosition.top,vidioPosition.left,{
				success:function(){
					//start open stop recording功能的接口的回调事件
					window.RecordAsynCallBack  = function(type,msg){
						if(codeAndTip.code.readyTurnOnCamera.openComplete == type){
							var _msg = JSON.parse(msg);
							if(codeAndTip.code.common.hardwareAvailable == _msg.hResult){
								$$.debug('enter method [RecordAsynCallBack openComplete] success');
								$$.beforChageHash().then(function(){
									location.hash ="turnOnCameraWaiting";
								})
							}else if(codeAndTip.code.common.hardwareFailure == _msg.hResult){
								//canClickFun();
								var code = _msg.errorCode;
								$$.debug("openComplete error:"+code);
								controller.openRecordError(model.customer.idCardNo,code,null,null,null,controller.getLocale());
								$$.debug('enter method [RecordAsynCallBack openComplete] failed: type:'+ type+' msg:'+ msg);
							}
						}else if(codeAndTip.code.readyTurnOnCamera.startComplete == type){
							var _msg = JSON.parse(msg);
							if(codeAndTip.code.common.hardwareAvailable == _msg.hResult){
								$$.debug('enter method [RecordAsynCallBack startComplete] success');
								$$.beforChageHash().then(function(){
									location.hash ="turnOnCamera";
								})
							}else if(codeAndTip.code.common.hardwareFailure == _msg.hResult){
								$$.debug('enter method [RecordAsynCallBack startComplete failed] : type:'+ type+' msg:'+ msg);
							}
						}else if(codeAndTip.code.readyTurnOnCamera.errorEvent == type){
							var language = controller.getLocale();
							var _msg = JSON.parse(msg);
							var _currentHash = location.hash;
							$$.debug("录像过程中收到errorEvent:"+msg+",当前页面是："+_currentHash);
							if("#readyTurnOnCamera" == _currentHash || "#turnOnCameraWaiting" == _currentHash || "#turnOnCamera" == _currentHash || "#understandTnc" == _currentHash || "#openFileForSign" == _currentHash){
								//如果在PDF签名页面出现录像错误，则将pdf和上传相关的回调函数置空，防止其调用上传方法（此时faceToface会出现不消失的loading）
								if("#openFileForSign" == _currentHash){
									window.callBackPDFControlType = function(){};
									window.CommonBridgeAsynCallBack  = function(){};
								}
								comInterface.recordErrorHandle(model.customer.idCardNo,language,_msg.errorCode,"recordError");
							}
							//comInterface.recordErrorHandle("home",model.customer.idCardNo,null,_msg.errorCode,language);
						}
					}
				}
			})
			continueBtn.addClass('disabled').attr("disabled",true);
		})
		
	}
	function run() {
		$$.statusStep(2,4);
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"readyTurnOnCamera"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--readyTurnOnCamera")
		},function(res){
			$$.debug("updateCurrentStepFail--readyTurnOnCamera:"+JSON.stringify(res))
		})
		//以下三行代码拿到视频打开的左上角位置坐标
		vidioPosition = calculatePosition($('.main-righter')[0]);
		vidioPosition.left = vidioPosition.left + 20;
		vidioPosition.top = vidioPosition.top + 20;
	}
	function canClickFun(){
		continueBtn.removeClass('disabled').attr("disabled",false);
	}
	/*
		计算某元素的左上角的相对window的绝对位置
		主要确定视频窗口的打开位置
	*/
	function calculatePosition(ele) {
	    var top = ele.offsetTop;
	    var left = ele.offsetLeft;
	    while (ele.offsetParent) {
	        ele = ele.offsetParent;
	        if (window.navigator.userAgent.indexOf('MSTE 8') > -1) {
	            top += ele.offsetTop;
	            left += ele.offsetLeft;
	        } else {
	            top += ele.offsetTop + ele.clientTop;
	            left += ele.offsetLeft + ele.clientLeft;
	        }
	    }
	    return {
	        left: left,
	        top: top
	    }
	}
	return {
		load: load
	};
});

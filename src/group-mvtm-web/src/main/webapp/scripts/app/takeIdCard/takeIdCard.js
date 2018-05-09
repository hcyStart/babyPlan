define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./takeIdCard.model'),
		template = require('text!./takeIdCard.template.html'),
		controller = require('./takeIdCard.controller'),
		dialog = require('app/dialog/dialog'),
		systemResumeMapping = require('../../systemResumeMapping');
	    codeAndTip = require('../../codeAndTip');
		popup=require('popup');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter takeIdCard page");
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
		$("#takeIdCard-next").on("click",function(){
			$(this).addClass("disabled").attr("disabled",true);
			if(window.continueOpenAccount && systemResumeMapping.stepData.captureSubmit != window.continueOpenAccount){
				if(systemResumeMapping.stepData.capture == window.continueOpenAccount||systemResumeMapping.stepData.captureSubmit == window.continueOpenAccount){
					window.captureNext = "accountType"
				}else if(systemResumeMapping.stepData.rateExperience == window.continueOpenAccount){
					window.captureNext = "home"
				}
			}else{
				window.captureNext = "accountType"
				//location.hash ="showIdCard";
			}
			//保存完身份证信息后，将身份证信息保存到
			controller.checkCustomerSession($(this));	
		})
	}

	function run() {
		$$.statusStep(1,1);
		//判读身份证扫描状态
		judgeScanIDStatus();
		$("#js-exit").show();
	}
	function judgeScanIDStatus(){
		$$.debug("身份证状态判断 "+$$.scanIDStatus);
		var errTitle = '';
		var errMsg = '';
		var language = controller.getLocale();
		var errType = '';
        switch($$.scanIDStatus){
	       case codeAndTip.code.scanid.cardinvalidAge:
				 $$.debug('年龄未满18岁');
				var errType='idcardAgeError';
				popup(errType,language);
	      	 	break;
	       case codeAndTip.code.scanid.cardinvalidCard:
		      	 $$.debug('身份证不可用');
			    errType='idcardExpiredError';
				popup(errType,language);
		       break;	      	 	
	       case codeAndTip.code.scanid.cardinvalidRetry:
		      	 $$.debug('身份证不可用开始retry'); 
				 errType='invialdIdcardRetry';
				popup(errType,language);
		      	 break;
	       case codeAndTip.code.scanid.cardRetryFail:
		      	 $$.debug('重置次数已满'); 
				errType='invialdIdcardRetryFail';
				popup(errType,language);
		       break;
	      default:   
		    break;
      }
	}
	return {
		load: load
	};
});

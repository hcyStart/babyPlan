define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./faceToface.model'),
		template = require('text!./faceToface.template.html'),
	    popup=require('popup'),
		controller = require('./faceToface.controller');
	var idNumber = null;

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("enter faceToface page");
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
		$("#faceToface-next").off().on("click", function() {
			controller.checkPDFInit({
				pdfReadySuc:function(pdfResult){
					if(pdfResult && model.customer.customerSession){
						pdfResult = JSON.parse(pdfResult);
						model.customer.customerSession.smpPath = pdfResult.data;
					}
					$$.beforChageHash().then(function(){
						location.hash = "readyTurnOnCamera";
					})
					
				},
				pdfReadyFail:function(pdfResult){
					if(pdfResult){	
						pdfResult = JSON.parse(pdfResult); 
						if(pdfResult.errorCode == "E23624" || pdfResult.errorCode == "E23625"){
							var errType='systemException';
							var language = controller.getLocale();
							popup(errType,language,"","",pdfResult.errorCode);								
						}else{							
							var errType='checkSMPPDFisReadyError';
							var language = controller.getLocale();
							popup(errType,language,"","",null);							
						}
					}
				}
			});
		})
	}

	function run() {
		$$.statusStep(2,3);
		idNumber = model.customer.idCardNo;
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"faceToface"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--faceToface")
		},function(res){
			$$.debug("updateCurrentStepFail--faceToface:"+JSON.stringify(res))
		})
		$("#js-exit").show();
		/*controller.pinChangeCpb(idNumber).then(function(res){
			$$.debug('获取customerNumber成功， res：' + JSON.stringify(res))
		},function(res){
			$$.debug('获取customerNumber失败， res：' + JSON.stringify(res))
		});*/
	}
	
	return {
		load: load
	};
});

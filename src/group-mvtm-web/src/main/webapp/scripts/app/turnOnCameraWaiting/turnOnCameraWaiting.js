define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./turnOnCameraWaiting.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./turnOnCameraWaiting.template.html'),
		controller = require('./turnOnCameraWaiting.controller');
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("enter turnOnCameraWaiting page");
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

	}

	function run() {
		$$.statusStep(2,4);
		$("#js-exit").hide();
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"turnOnCameraWaiting"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--turnOnCameraWaiting")
		},function(res){
			$$.debug('updateCurrentStepSuceess--turnOnCameraWaiting failed: type:'+ type+' msg:'+ msg)
		})
		var customerID = model.customer.idCardNo;
		var BusinessType = "openAccount";
		var StaffID = $$.staffId;
		//进入页面直接去执行开始录像功能
		controller.asyncStartRecord(customerID, BusinessType, StaffID)
	}

	return {
		load: load
	};
});

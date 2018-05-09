define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./enterAgain.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./enterAgain.template.html'),
		controller = require('./enterAgain.controller');
		//numpad = require('jquery.numpad');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("Confirm and enterPassword Again");
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
		$("#enterAgain-next").click(function(){
			location.hash = "setPasswordSuccess";
	});
	}

	function run() {
		$$.statusStep(2,8);
		controller.PPInit();
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"enterAgain"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--enterAgain")
		},function(res){
			$$.debug("updateCurrentStepFail--enterAgain:"+JSON.stringify(res))
		})
	}

	return {
		load: load
	};
});
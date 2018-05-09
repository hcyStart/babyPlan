define(function(require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./phoneBankNumberAgain.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./phoneBankNumberAgain.template.html'),
		controller = require('./phoneBankNumberAgain.controller');
	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function() {
		$$.actionLog("Confirm and enterBankNumberAgain page");
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

		$("#phoneBankNumberAgain-next").off().on("click", function () {
				location.hash = 'phoneBankNumberSuccess';
		});
	}

	function run() {
		$$.statusStep(2,8);
		controller.PPInit();
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"phoneBankNumberAgain"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--phoneBankNumberAgain")
		},function(res){
			$$.debug("updateCurrentStepFail--phoneBankNumberAgain:"+JSON.stringify(res))
		})
	}

	return {
		load: load
	};
});
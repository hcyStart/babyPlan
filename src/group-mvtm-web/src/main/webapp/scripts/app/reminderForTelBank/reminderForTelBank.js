define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./reminderForTelBank.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./reminderForTelBank.template.html'),
		controller = require('./reminderForTelBank.controller'),
        popup = require('popup');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("Enter reminderForTelBank page");
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
		$(".reminder-confirm").click(function(){
			$$.beforChageHash().then(function(){
				location.hash = "phoneBankNumber";
			})
		});

	}

	function run() {
		$$.statusStep(2,7);
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"reminderForTelBank"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--reminderForTelBank")
		},function(res){
			$$.debug("updateCurrentStepFail--reminderForTelBank:"+JSON.stringify(res))
		})
	}

	return {
		load: load
	};
});
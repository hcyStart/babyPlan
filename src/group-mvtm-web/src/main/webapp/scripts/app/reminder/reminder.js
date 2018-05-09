define(function (require) {
	var $ = require('jquery'),
		$$ = require('app/util'),
		model = require('./reminder.model'),
		dialog = require('app/dialog/dialog'),
		template = require('text!./reminder.template.html'),
		controller = require('./reminder.controller'),
        popup = require('popup');

	/**
	 * 对外暴露函数，用于视图加载
	 */
	var load = function () {
		$$.actionLog("Enter reminder page");
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
				location.hash = "enterPassword";
			})
		});

	}

	function run() {
		$$.statusStep(2,7);
		$$.updateCurrentStep({"idCardNo":model.customer.idCardNo,"stepData":"reminder"}).then(function(res){
			$$.debug("updateCurrentStepSuceess--reminder")
		},function(res){
			$$.debug("updateCurrentStepFail--reminder:"+JSON.stringify(res))
		})
	}

	return {
		load: load
	};
});